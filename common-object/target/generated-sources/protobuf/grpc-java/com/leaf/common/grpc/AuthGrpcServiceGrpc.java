package com.leaf.common.grpc;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 */
@io.grpc.stub.annotations.GrpcGenerated
public final class AuthGrpcServiceGrpc {

  private AuthGrpcServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "AuthGrpcService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<com.leaf.common.grpc.VerifyTokenRequest,
      com.leaf.common.grpc.VerifyTokenResponse> getVerifyTokenMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "verifyToken",
      requestType = com.leaf.common.grpc.VerifyTokenRequest.class,
      responseType = com.leaf.common.grpc.VerifyTokenResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.leaf.common.grpc.VerifyTokenRequest,
      com.leaf.common.grpc.VerifyTokenResponse> getVerifyTokenMethod() {
    io.grpc.MethodDescriptor<com.leaf.common.grpc.VerifyTokenRequest, com.leaf.common.grpc.VerifyTokenResponse> getVerifyTokenMethod;
    if ((getVerifyTokenMethod = AuthGrpcServiceGrpc.getVerifyTokenMethod) == null) {
      synchronized (AuthGrpcServiceGrpc.class) {
        if ((getVerifyTokenMethod = AuthGrpcServiceGrpc.getVerifyTokenMethod) == null) {
          AuthGrpcServiceGrpc.getVerifyTokenMethod = getVerifyTokenMethod =
              io.grpc.MethodDescriptor.<com.leaf.common.grpc.VerifyTokenRequest, com.leaf.common.grpc.VerifyTokenResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "verifyToken"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.leaf.common.grpc.VerifyTokenRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.leaf.common.grpc.VerifyTokenResponse.getDefaultInstance()))
              .setSchemaDescriptor(new AuthGrpcServiceMethodDescriptorSupplier("verifyToken"))
              .build();
        }
      }
    }
    return getVerifyTokenMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static AuthGrpcServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<AuthGrpcServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<AuthGrpcServiceStub>() {
        @java.lang.Override
        public AuthGrpcServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new AuthGrpcServiceStub(channel, callOptions);
        }
      };
    return AuthGrpcServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports all types of calls on the service
   */
  public static AuthGrpcServiceBlockingV2Stub newBlockingV2Stub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<AuthGrpcServiceBlockingV2Stub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<AuthGrpcServiceBlockingV2Stub>() {
        @java.lang.Override
        public AuthGrpcServiceBlockingV2Stub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new AuthGrpcServiceBlockingV2Stub(channel, callOptions);
        }
      };
    return AuthGrpcServiceBlockingV2Stub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static AuthGrpcServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<AuthGrpcServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<AuthGrpcServiceBlockingStub>() {
        @java.lang.Override
        public AuthGrpcServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new AuthGrpcServiceBlockingStub(channel, callOptions);
        }
      };
    return AuthGrpcServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static AuthGrpcServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<AuthGrpcServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<AuthGrpcServiceFutureStub>() {
        @java.lang.Override
        public AuthGrpcServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new AuthGrpcServiceFutureStub(channel, callOptions);
        }
      };
    return AuthGrpcServiceFutureStub.newStub(factory, channel);
  }

  /**
   */
  public interface AsyncService {

    /**
     */
    default void verifyToken(com.leaf.common.grpc.VerifyTokenRequest request,
        io.grpc.stub.StreamObserver<com.leaf.common.grpc.VerifyTokenResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getVerifyTokenMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service AuthGrpcService.
   */
  public static abstract class AuthGrpcServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return AuthGrpcServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service AuthGrpcService.
   */
  public static final class AuthGrpcServiceStub
      extends io.grpc.stub.AbstractAsyncStub<AuthGrpcServiceStub> {
    private AuthGrpcServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected AuthGrpcServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new AuthGrpcServiceStub(channel, callOptions);
    }

    /**
     */
    public void verifyToken(com.leaf.common.grpc.VerifyTokenRequest request,
        io.grpc.stub.StreamObserver<com.leaf.common.grpc.VerifyTokenResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getVerifyTokenMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service AuthGrpcService.
   */
  public static final class AuthGrpcServiceBlockingV2Stub
      extends io.grpc.stub.AbstractBlockingStub<AuthGrpcServiceBlockingV2Stub> {
    private AuthGrpcServiceBlockingV2Stub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected AuthGrpcServiceBlockingV2Stub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new AuthGrpcServiceBlockingV2Stub(channel, callOptions);
    }

    /**
     */
    public com.leaf.common.grpc.VerifyTokenResponse verifyToken(com.leaf.common.grpc.VerifyTokenRequest request) throws io.grpc.StatusException {
      return io.grpc.stub.ClientCalls.blockingV2UnaryCall(
          getChannel(), getVerifyTokenMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do limited synchronous rpc calls to service AuthGrpcService.
   */
  public static final class AuthGrpcServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<AuthGrpcServiceBlockingStub> {
    private AuthGrpcServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected AuthGrpcServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new AuthGrpcServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public com.leaf.common.grpc.VerifyTokenResponse verifyToken(com.leaf.common.grpc.VerifyTokenRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getVerifyTokenMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service AuthGrpcService.
   */
  public static final class AuthGrpcServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<AuthGrpcServiceFutureStub> {
    private AuthGrpcServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected AuthGrpcServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new AuthGrpcServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.leaf.common.grpc.VerifyTokenResponse> verifyToken(
        com.leaf.common.grpc.VerifyTokenRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getVerifyTokenMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_VERIFY_TOKEN = 0;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final AsyncService serviceImpl;
    private final int methodId;

    MethodHandlers(AsyncService serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_VERIFY_TOKEN:
          serviceImpl.verifyToken((com.leaf.common.grpc.VerifyTokenRequest) request,
              (io.grpc.stub.StreamObserver<com.leaf.common.grpc.VerifyTokenResponse>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  public static final io.grpc.ServerServiceDefinition bindService(AsyncService service) {
    return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
        .addMethod(
          getVerifyTokenMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.leaf.common.grpc.VerifyTokenRequest,
              com.leaf.common.grpc.VerifyTokenResponse>(
                service, METHODID_VERIFY_TOKEN)))
        .build();
  }

  private static abstract class AuthGrpcServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    AuthGrpcServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.leaf.common.grpc.AuthProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("AuthGrpcService");
    }
  }

  private static final class AuthGrpcServiceFileDescriptorSupplier
      extends AuthGrpcServiceBaseDescriptorSupplier {
    AuthGrpcServiceFileDescriptorSupplier() {}
  }

  private static final class AuthGrpcServiceMethodDescriptorSupplier
      extends AuthGrpcServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    AuthGrpcServiceMethodDescriptorSupplier(java.lang.String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (AuthGrpcServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new AuthGrpcServiceFileDescriptorSupplier())
              .addMethod(getVerifyTokenMethod())
              .build();
        }
      }
    }
    return result;
  }
}
