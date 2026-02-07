# GraphQL Patterns (graphql-bff module)

## GraphQL Resolver Structure

```java
@DgsComponent
@RequiredArgsConstructor
public class XxxQueryResolver {

  private final XxxGrpcClient grpcClient;
  private final XxxMapper mapper = XxxMapper.getInstance();

  @DgsQuery(field = "xxx")
  public Mono<XxxDTO> xxx(String id) {
    return Mono.fromCallable(() -> grpcClient.getXxx(id))
      .subscribeOn(Schedulers.boundedElastic())
      .flatMap(response -> Mono.justOrEmpty(mapper.toXxxDTO(response)));
  }

  @DgsData(parentType = "XxxDTO", field = "nested")
  public Mono<NestedDTO> nested(DgsDataFetchingEnvironment dfe) {
    XxxDTO parent = dfe.getSource();
    return Mono.fromCallable(() -> grpcClient.getNested(parent.getId()))
      .subscribeOn(Schedulers.boundedElastic())
      .map(mapper::toNestedDTO);
  }
}
```

**Note**: Mapper must use singleton pattern with `getInstance()`. Use manual mapping, BeanUtils.copyProperties, or Lombok Builder. **DO NOT use MapStruct**.
