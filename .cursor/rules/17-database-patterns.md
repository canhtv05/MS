# Database-Specific Patterns

## JPA Specifications (for complex queries)

```java
private Specification<Xxx> createSpecification(SearchRequest criteria) {
  return (root, query, cb) -> {
    List<Predicate> predicates = new ArrayList<>();
    if (StringUtils.isNotBlank(criteria.searchText())) {
      predicates.add(
        cb.like(cb.lower(root.get("field")), "%" + criteria.searchText().toLowerCase() + "%")
      );
    }
    return cb.and(predicates.toArray(new Predicate[0]));
  };
}
```

## Neo4j Cypher Queries

- Use multi-line strings with `"""` for readability
- Use `@Param` for parameters
- Return DTOs directly from queries when possible

## MongoDB Aggregation

- Use `MongoTemplate` for complex aggregations
- Use `Aggregation` pipeline builder
