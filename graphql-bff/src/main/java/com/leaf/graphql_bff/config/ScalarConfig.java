package com.leaf.graphql_bff.config;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsRuntimeWiring;
import graphql.scalars.ExtendedScalars;
import graphql.schema.idl.RuntimeWiring;

@DgsComponent
public class ScalarConfig {

    @DgsRuntimeWiring
    public RuntimeWiring.Builder addRuntimeWiring(RuntimeWiring.Builder builder) {
        return builder.scalar(ExtendedScalars.DateTime).scalar(ExtendedScalars.Date);
    }
}
