package com.leaf.profile.service;

import com.leaf.common.constant.EventConstants;
import com.leaf.common.dto.event.UserCreatedEvent;
import com.leaf.profile.dto.UserProfileCreationReq;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaListenerService {

    private final UserProfileService userProfileService;

    @KafkaListener(
        topics = EventConstants.USER_CREATED_TOPIC,
        groupId = EventConstants.USER_CREATED_GROUP_ID,
        containerFactory = "userCreatedKafkaListenerContainerFactory"
    )
    public void handleUserCreated(UserCreatedEvent event) {
        try {
            UserProfileCreationReq req = UserProfileCreationReq.builder()
                .userId(event.getUserId())
                .fullname(event.getFullName())
                .build();
            userProfileService.createUserProfile(req);
        } catch (Exception e) {
            log.error("Failed to create user profile for userId: {}", event.getUserId(), e);
        }
    }
}
