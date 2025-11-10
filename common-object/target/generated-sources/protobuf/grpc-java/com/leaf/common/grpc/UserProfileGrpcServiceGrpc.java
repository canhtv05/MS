package com.leaf.common.grpc;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 */
@io.grpc.stub.annotations.GrpcGenerated
public final class UserProfileGrpcServiceGrpc {

  private UserProfileGrpcServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "UserProfileGrpcService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<com.leaf.common.grpc.UserProfileDTO,
      com.leaf.common.grpc.UserProfileDTO> getCreateUserProfileMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "createUserProfile",
      requestType = com.leaf.common.grpc.UserProfileDTO.class,
      responseType = com.leaf.common.grpc.UserProfileDTO.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.leaf.common.grpc.UserProfileDTO,
      com.leaf.common.grpc.UserProfileDTO> getCreateUserProfileMethod() {
    io.grpc.MethodDescriptor<com.leaf.common.grpc.UserProfileDTO, com.leaf.common.grpc.UserProfileDTO> getCreateUserProfileMethod;
    if ((getCreateUserProfileMethod = UserProfileGrpcServiceGrpc.getCreateUserProfileMethod) == null) {
      synchronized (UserProfileGrpcServiceGrpc.class) {
        if ((getCreateUserProfileMethod = UserProfileGrpcServiceGrpc.getCreateUserProfileMethod) == null) {
          UserProfileGrpcServiceGrpc.getCreateUserProfileMethod = getCreateUserProfileMethod =
              io.grpc.MethodDescriptor.<com.leaf.common.grpc.UserProfileDTO, com.leaf.common.grpc.UserProfileDTO>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "createUserProfile"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.leaf.common.grpc.UserProfileDTO.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.leaf.common.grpc.UserProfileDTO.getDefaultInstance()))
              .setSchemaDescriptor(new UserProfileGrpcServiceMethodDescriptorSupplier("createUserProfile"))
              .build();
        }
      }
    }
    return getCreateUserProfileMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static UserProfileGrpcServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<UserProfileGrpcServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<UserProfileGrpcServiceStub>() {
        @java.lang.Override
        public UserProfileGrpcServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new UserProfileGrpcServiceStub(channel, callOptions);
        }
      };
    return UserProfileGrpcServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports all types of calls on the service
   */
  public static UserProfileGrpcServiceBlockingV2Stub newBlockingV2Stub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<UserProfileGrpcServiceBlockingV2Stub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<UserProfileGrpcServiceBlockingV2Stub>() {
        @java.lang.Override
        public UserProfileGrpcServiceBlockingV2Stub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new UserProfileGrpcServiceBlockingV2Stub(channel, callOptions);
        }
      };
    return UserProfileGrpcServiceBlockingV2Stub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static UserProfileGrpcServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<UserProfileGrpcServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<UserProfileGrpcServiceBlockingStub>() {
        @java.lang.Override
        public UserProfileGrpcServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new UserProfileGrpcServiceBlockingStub(channel, callOptions);
        }
      };
    return UserProfileGrpcServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static UserProfileGrpcServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<UserProfileGrpcServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<UserProfileGrpcServiceFutureStub>() {
        @java.lang.Override
        public UserProfileGrpcServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new UserProfileGrpcServiceFutureStub(channel, callOptions);
        }
      };
    return UserProfileGrpcServiceFutureStub.newStub(factory, channel);
  }

  /**
   */
  public interface AsyncService {

    /**
     */
    default void createUserProfile(com.leaf.common.grpc.UserProfileDTO request,
        io.grpc.stub.StreamObserver<com.leaf.common.grpc.UserProfileDTO> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateUserProfileMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service UserProfileGrpcService.
   */
  public static abstract class UserProfileGrpcServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return UserProfileGrpcServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service UserProfileGrpcService.
   */
  public static final class UserProfileGrpcServiceStub
      extends io.grpc.stub.AbstractAsyncStub<UserProfileGrpcServiceStub> {
    private UserProfileGrpcServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected UserProfileGrpcServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new UserProfileGrpcServiceStub(channel, callOptions);
    }

    /**
     */
    public void createUserProfile(com.leaf.common.grpc.UserProfileDTO request,
        io.grpc.stub.StreamObserver<com.leaf.common.grpc.UserProfileDTO> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateUserProfileMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service UserProfileGrpcService.
   */
  public static final class UserProfileGrpcServiceBlockingV2Stub
      extends io.grpc.stub.AbstractBlockingStub<UserProfileGrpcServiceBlockingV2Stub> {
    private UserProfileGrpcServiceBlockingV2Stub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected UserProfileGrpcServiceBlockingV2Stub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new UserProfileGrpcServiceBlockingV2Stub(channel, callOptions);
    }

    /**
     */
    public com.leaf.common.grpc.UserProfileDTO createUserProfile(com.leaf.common.grpc.UserProfileDTO request) throws io.grpc.StatusException {
      return io.grpc.stub.ClientCalls.blockingV2UnaryCall(
          getChannel(), getCreateUserProfileMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do limited synchronous rpc calls to service UserProfileGrpcService.
   */
  public static final class UserProfileGrpcServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<UserProfileGrpcServiceBlockingStub> {
    private UserProfileGrpcServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected UserProfileGrpcServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new UserProfileGrpcServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public com.leaf.common.grpc.UserProfileDTO createUserProfile(com.leaf.common.grpc.UserProfileDTO request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateUserProfileMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service UserProfileGrpcService.
   */
  public static final class UserProfileGrpcServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<UserProfileGrpcServiceFutureStub> {
    private UserProfileGrpcServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected UserProfileGrpcServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new UserProfileGrpcServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.leaf.common.grpc.UserProfileDTO> createUserProfile(
        com.leaf.common.grpc.UserProfileDTO request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateUserProfileMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_CREATE_USER_PROFILE = 0;

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
        case METHODID_CREATE_USER_PROFILE:
          serviceImpl.createUserProfile((com.leaf.common.grpc.UserProfileDTO) request,
              (io.grpc.stub.StreamObserver<com.leaf.common.grpc.UserProfileDTO>) responseObserver);
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
          getCreateUserProfileMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.leaf.common.grpc.UserProfileDTO,
              com.leaf.common.grpc.UserProfileDTO>(
                service, METHODID_CREATE_USER_PROFILE)))
        .build();
  }

  private static abstract class UserProfileGrpcServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    UserProfileGrpcServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.leaf.common.grpc.UserProfile.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("UserProfileGrpcService");
    }
  }

  private static final class UserProfileGrpcServiceFileDescriptorSupplier
      extends UserProfileGrpcServiceBaseDescriptorSupplier {
    UserProfileGrpcServiceFileDescriptorSupplier() {}
  }

  private static final class UserProfileGrpcServiceMethodDescriptorSupplier
      extends UserProfileGrpcServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    UserProfileGrpcServiceMethodDescriptorSupplier(java.lang.String methodName) {
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
      synchronized (UserProfileGrpcServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new UserProfileGrpcServiceFileDescriptorSupplier())
              .addMethod(getCreateUserProfileMethod())
              .build();
        }
      }
    }
    return result;
  }
}
