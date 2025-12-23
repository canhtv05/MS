package com.leaf.auth.service;

import com.leaf.auth.domain.Role;
import com.leaf.auth.domain.User;
import com.leaf.auth.domain.UserPermission;
import com.leaf.auth.dto.ImportUserDTO;
import com.leaf.auth.dto.UserDTO;
import com.leaf.auth.dto.UserPermissionDTO;
import com.leaf.auth.dto.UserProfileDTO;
import com.leaf.auth.dto.excel.ExcelTemplateConfig;
import com.leaf.auth.dto.excel.ImportExcelResult;
import com.leaf.auth.dto.excel.ReadExcelResult;
import com.leaf.auth.dto.excel.RowData;
import com.leaf.auth.dto.excel.RowHeader;
import com.leaf.auth.dto.req.ChangePasswordReq;
import com.leaf.auth.dto.req.ForgotPasswordReq;
import com.leaf.auth.dto.req.ResetPasswordReq;
import com.leaf.auth.dto.req.VerifyOTPReq;
import com.leaf.auth.dto.search.SearchRequest;
import com.leaf.auth.dto.search.SearchResponse;
import com.leaf.auth.enums.PermissionAction;
import com.leaf.auth.repository.RoleRepository;
import com.leaf.auth.repository.UserPermissionRepository;
import com.leaf.auth.repository.UserRepository;
import com.leaf.auth.util.ExcelBuilder;
import com.leaf.common.constant.EventConstants;
import com.leaf.common.dto.event.ForgotPasswordEvent;
import com.leaf.common.dto.event.UserCreatedEvent;
import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.VerifyEmailTokenDTO;
import com.leaf.common.utils.CommonUtils;
import com.leaf.common.utils.DateUtils;
import com.leaf.framework.security.AuthoritiesConstants;
import com.leaf.framework.security.SecurityUtils;
import com.leaf.framework.service.RedisService;
import jakarta.persistence.criteria.Predicate;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.ValidatorFactory;
import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(rollbackFor = Exception.class)
public class UserService {

    private final ValidatorFactory validator = Validation.buildDefaultValidatorFactory();
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final UserPermissionRepository userPermissionRepository;
    private final AuthService authService;
    private final KafkaProducerService kafkaProducerService;
    private final RedisService redisService;

    public UserDTO findById(Long id) {
        return userRepository
            .findById(id)
            .map(UserDTO::fromEntity)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
    }

    public UserDTO createUser(UserDTO request, boolean isAdmin) {
        if (userRepository.existsUserByUsername(request.getUsername())) {
            throw new ApiException(ErrorMessage.USERNAME_ALREADY_EXITS);
        }

        if (request.getEmail().contains("+")) {
            throw new ApiException(ErrorMessage.EMAIL_INVALID);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException(ErrorMessage.EMAIL_ALREADY_EXITS);
        }

        User user = User.builder()
            .username(request.getUsername())
            .activated(isAdmin && request.isActivated())
            .isGlobal(isAdmin ? request.getIsGlobal() : false)
            .isLocked(false)
            .email(request.getEmail())
            .build();

        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedPassword);
        if (ObjectUtils.isNotEmpty(request.getRoles()) && isAdmin) {
            user.setRoles(new HashSet<>(roleRepository.findAllByCodeIn(request.getRoles())));
        } else {
            user.setRoles(new HashSet<>(roleRepository.findAllByCodeIn(List.of("ROLE_USER"))));
        }

        User res = userRepository.save(user);
        try {
            if (!isAdmin || !request.isActivated()) {
                kafkaProducerService.send(
                    EventConstants.VERIFICATION_EMAIL_TOPIC,
                    VerificationEmailEvent.builder()
                        .to(request.getEmail())
                        .username(request.getUsername())
                        .fullName(request.getFullname())
                        .build()
                );
            } else {
                kafkaProducerService.send(
                    EventConstants.USER_CREATED_TOPIC,
                    UserCreatedEvent.builder().userId(user.getUsername()).fullName(request.getFullname()).build()
                );
            }
        } catch (Exception e) {
            throw new ApiException(ErrorMessage.UNHANDLED_ERROR);
        }
        return UserDTO.fromEntity(res);
    }

    public UserDTO updateUser(UserDTO request) {
        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());
        if (optionalUser.isEmpty()) {
            throw new ApiException(ErrorMessage.USER_NOT_FOUND);
        }
        User user = optionalUser.get();
        user.setActivated(request.isActivated());
        if (SecurityUtils.isGlobalUser()) {
            user.setIsGlobal(request.getIsGlobal());
        }
        user.setRoles(new HashSet<>());
        if (ObjectUtils.isNotEmpty(request.getRoles())) {
            user.setRoles(new HashSet<>(roleRepository.findAllByCodeIn(request.getRoles())));
        }
        userRepository.save(user);
        return UserDTO.fromEntity(user);
    }

    public void changeLockUser(Long id, boolean isLocked) {
        User user = userRepository.findById(id).orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
        user.setLocked(isLocked);
        userRepository.save(user);
    }

    public VerifyEmailTokenDTO activeUserByUserName(VerifyEmailTokenDTO request) {
        if (request.getEmail().contains("+")) {
            throw new ApiException(ErrorMessage.EMAIL_INVALID);
        }

        User user = userRepository
            .findByUsername(request.getUsername())
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
        user.setActivated(true);
        userRepository.save(user);

        // Send Kafka event to create user profile with fullname from verification token
        kafkaProducerService.send(
            EventConstants.USER_CREATED_TOPIC,
            UserCreatedEvent.builder().userId(user.getUsername()).fullName(request.getFullname()).build()
        );

        return VerifyEmailTokenDTO.newBuilder().setUsername(user.getUsername()).setEmail(request.getEmail()).build();
    }

    public void forgotPasswordRequest(ForgotPasswordReq request) {
        if (request.getEmail().contains("+")) {
            throw new ApiException(ErrorMessage.EMAIL_INVALID);
        }

        User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() -> new ApiException(ErrorMessage.EMAIL_NOT_FOUND));

        boolean hasOTP = hasOTP(user.getUsername());
        if (hasOTP) {
            throw new ApiException(ErrorMessage.FORGET_PASSWORD_OTP_ALREADY_SENT);
        }

        kafkaProducerService.send(
            EventConstants.FORGOT_PASSWORD_TOPIC,
            ForgotPasswordEvent.builder().to(request.getEmail()).username(user.getUsername()).build()
        );
    }

    public void resetPassword(ResetPasswordReq request) {
        if (CommonUtils.isEmpty(request.getEmail(), request.getNewPassword(), request.getOTP())) {
            throw new ApiException(ErrorMessage.VALIDATION_ERROR);
        }

        if (request.getEmail().contains("+")) {
            throw new ApiException(ErrorMessage.EMAIL_INVALID);
        }

        User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() -> new ApiException(ErrorMessage.EMAIL_NOT_FOUND));

        boolean hasOTP = hasOTP(user.getUsername());
        if (!hasOTP) {
            throw new ApiException(ErrorMessage.FORGET_PASSWORD_OTP_NOT_SENT_OR_EXPIRED);
        }
        String keyForgotPassword = redisService.getKeyForgotPassword(user.getUsername());
        if (!request.getOTP().equals(redisService.get(keyForgotPassword, String.class))) {
            throw new ApiException(ErrorMessage.FORGET_PASSWORD_OTP_INVALID);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        redisService.evict(keyForgotPassword);
    }

    public void verifyForgotPasswordOTP(VerifyOTPReq request) {
        if (CommonUtils.isEmpty(request.getEmail(), request.getOTP())) {
            throw new ApiException(ErrorMessage.VALIDATION_ERROR);
        }

        if (request.getEmail().contains("+")) {
            throw new ApiException(ErrorMessage.EMAIL_INVALID);
        }

        User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() -> new ApiException(ErrorMessage.EMAIL_NOT_FOUND));

        String keyForgotPassword = redisService.getKeyForgotPassword(user.getUsername());
        String otp = redisService.get(keyForgotPassword, String.class);
        if (CommonUtils.isEmpty(otp)) {
            throw new ApiException(ErrorMessage.FORGET_PASSWORD_OTP_NOT_SENT_OR_EXPIRED);
        }

        if (!otp.equals(request.getOTP())) {
            throw new ApiException(ErrorMessage.FORGET_PASSWORD_OTP_INVALID);
        }
    }

    public void changePassword(String cookieValue, ChangePasswordReq req, HttpServletResponse response) {
        if (CommonUtils.isEmpty(req.getCurrentPassword(), req.getNewPassword())) {
            throw new ApiException(ErrorMessage.VALIDATION_ERROR);
        }
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );
        Optional<User> optionalUser = userRepository.findByUsername(userLogin);
        if (optionalUser.isEmpty()) {
            throw new ApiException(ErrorMessage.USER_NOT_FOUND);
        }
        User user = optionalUser.get();
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new ApiException(ErrorMessage.CURRENT_PASSWORD_INVALID);
        }
        if (passwordEncoder.matches(req.getNewPassword(), user.getPassword())) {
            throw new ApiException(ErrorMessage.PASSWORD_NEW_CANNOT_BE_SAME_AS_OLD);
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        authService.logout(cookieValue, req.getChannel(), response);
    }

    public void updateUserProfile(UserProfileDTO request) {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );
        Optional<User> optionalUser = userRepository.findByUsername(userLogin);
        if (optionalUser.isEmpty()) {
            throw new ApiException(ErrorMessage.USER_NOT_FOUND);
        }
        userRepository.save(optionalUser.get());
    }

    @Transactional(readOnly = true)
    public SearchResponse<UserDTO> searchDatatable(SearchRequest request) {
        Specification<User> spec = createSpecification(request);
        Page<User> tenants = userRepository.findAll(spec, request.toPageable());
        return new SearchResponse<>(
            tenants.getContent().stream().map(UserDTO::fromEntity).collect(Collectors.toList()),
            tenants.getTotalElements()
        );
    }

    private Specification<User> createSpecification(SearchRequest criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (StringUtils.isNotBlank(criteria.searchText())) {
                predicates.add(
                    cb.or(
                        cb.like(cb.lower(root.get("username")), "%" + criteria.searchText().toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("username")), "%" + criteria.searchText().toLowerCase() + "%")
                    )
                );
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Transactional(readOnly = true)
    public byte[] exportUser(SearchRequest request) {
        Specification<User> spec = createSpecification(request);
        List<User> data = userRepository.findAll(spec, Sort.by(Sort.Direction.ASC, "id"));
        List<String> headers = List.of("#", "Tên đăng nhập", "Email", "Trạng thái", "Ngày tạo");
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Data");
            CellStyle headerStyle = ExcelBuilder.createHeaderStyle(wb);
            ExcelBuilder.createHeaderRow(sheet, headerStyle, headers);
            int r = 1;
            for (User item : data) {
                Row row = sheet.createRow(r);
                Cell stt = row.createCell(0);
                stt.setCellValue(r);
                stt.setCellStyle(headerStyle);

                row.createCell(1).setCellValue(item.getUsername());
                row.createCell(2).setCellValue(item.isActivated() ? "Hoạt động" : "Không hoạt động");
                row.createCell(3).setCellValue(DateUtils.dateToString(item.getCreatedDate()));
                r++;
            }
            IntStream.range(1, headers.size()).forEach(sheet::autoSizeColumn);
            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new ApiException(ErrorMessage.UNHANDLED_ERROR, e.getMessage());
        }
    }

    public byte[] downloadTemplate() {
        List<String> roleCodes = roleRepository
            .findAll()
            .stream()
            .map(Role::getCode)
            .filter(t -> !AuthoritiesConstants.SUPER_ADMIN.equalsIgnoreCase(t))
            .collect(Collectors.toList());
        ExcelTemplateConfig config = ExcelTemplateConfig.builder()
            .headers(List.of("Tên đăng nhập", "Email", "Vai trò"))
            .fieldRequired(List.of(1, 2, 3))
            .autoNumber(true)
            .listValidations(new ArrayList<>())
            .build();
        config
            .getListValidations()
            .add(ExcelTemplateConfig.ExcelValidation.builder().rangeName("_ROLE").rowIndex(3).data(roleCodes).build());
        return ExcelBuilder.buildFileTemplate(config);
    }

    public ImportExcelResult<ImportUserDTO> importUser(MultipartFile file) {
        ImportExcelResult<ImportUserDTO> result = new ImportExcelResult<>();
        List<RowHeader> rowHeaders = List.of(
            new RowHeader("Tên đăng nhập", "username", 1),
            new RowHeader("Vai trò", "role", 2)
        );
        ReadExcelResult mapData = ExcelBuilder.readFileExcel(file, rowHeaders);
        List<ImportUserDTO> fileData = mapData.getData().stream().map(ImportUserDTO::fromExcelData).toList();
        result.getHeaders().addAll(rowHeaders);
        List<String> usernames = fileData
            .stream()
            .map(ImportUserDTO::getUsername)
            .filter(StringUtils::isNotBlank)
            .toList();
        List<String> existingData = userRepository.findUserExitsUsername(usernames);
        IntStream.range(0, fileData.size()).forEach(i -> {
            ImportUserDTO dto = fileData.get(i);
            RowData<ImportUserDTO> rowError = new RowData<>(dto);
            Set<ConstraintViolation<ImportUserDTO>> violations = validator.getValidator().validate(dto);
            for (var v : violations) {
                rowError.addFieldError(v.getPropertyPath().toString(), v.getMessage());
            }
            if (StringUtils.isNotBlank(dto.getUsername()) && existingData.contains(dto.getUsername())) {
                rowError.addFieldError("username", "Tên đăng nhập đã tồn tại.");
            }
            if (rowError.hasErrors()) {
                result.getRows().add(rowError);
            }
        });
        if (!result.isHasErrors()) {
            List<String> roleCodes = fileData.stream().map(ImportUserDTO::getRole).toList();
            List<Role> roleList = roleRepository.findAllByCodeIn(roleCodes);
            List<User> users = fileData
                .stream()
                .map(dto ->
                    dto.toEntity(
                        passwordEncoder.encode(dto.getPassword()),
                        roleList
                            .stream()
                            .filter(r -> r.getCode().equals(dto.getRole()))
                            .collect(Collectors.toSet())
                    )
                )
                .toList();
            userRepository.saveAll(users);
        }
        return result;
    }

    public Map<String, PermissionAction> getUserPermissions(Long userId) {
        List<UserPermission> data = userPermissionRepository.findAllByUserId(userId);
        return data.stream().collect(Collectors.toMap(UserPermission::getPermissionCode, UserPermission::getAction));
    }

    @Transactional
    public void updateUserPermission(Long userId, List<UserPermissionDTO> request) {
        userPermissionRepository.deleteAllByUserId(userId);
        userPermissionRepository.saveAll(
            request
                .stream()
                .map(item -> item.toEntity(userId))
                .collect(Collectors.toSet())
        );
    }

    private boolean hasOTP(String username) {
        String keyForgotPassword = redisService.getKeyForgotPassword(username);
        return StringUtils.isNotEmpty(redisService.get(keyForgotPassword, String.class));
    }
}
