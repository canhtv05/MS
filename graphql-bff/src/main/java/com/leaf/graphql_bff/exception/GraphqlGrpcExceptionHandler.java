package com.leaf.graphql_bff.exception;

import com.leaf.common.utils.CommonUtils;
import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.graphql.execution.ErrorType;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class GraphqlGrpcExceptionHandler extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        if (ex instanceof StatusRuntimeException statusEx) {
            log.error("gRPC call failed at field {}: {}", env.getField().getName(), statusEx.getStatus(), statusEx);

            String safeMessage = statusEx.getStatus().getDescription();
            if (CommonUtils.isEmpty(safeMessage)) {
                safeMessage = "Internal server error";
            }

            return GraphqlErrorBuilder.newError(env).message(safeMessage).errorType(ErrorType.INTERNAL_ERROR).build();
        }

        return null;
    }
}
