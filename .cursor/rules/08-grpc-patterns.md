# gRPC Service Patterns

## gRPC Service Implementation

```java
@GrpcService
@RequiredArgsConstructor
public class XxxGrpcServiceImpl extends XxxGrpcServiceGrpc.XxxGrpcServiceImplBase {

  private final XxxService service;
  private final XxxGrpcMapper mapper = XxxGrpcMapper.getInstance();

  @Override
  public void getXxx(XxxRequest request, StreamObserver<XxxResponse> responseObserver) {
    var dto = service.getXxx(request.getId());
    var response = mapper.toGrpcResponse(dto);
    responseObserver.onNext(response);
    responseObserver.onCompleted();
  }
}
```

## gRPC Mapper Pattern

- Use singleton pattern with `getInstance()` - single instance only
- Methods: `toGrpcXxx()`, `toXxx()` for bidirectional conversion
- Can use manual mapping, BeanUtils.copyProperties, or Lombok Builder
- **DO NOT use MapStruct**
