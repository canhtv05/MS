package com.canhtv05.file;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {
		net.devh.boot.grpc.server.autoconfigure.GrpcServerAutoConfiguration.class,
		net.devh.boot.grpc.server.autoconfigure.GrpcServerFactoryAutoConfiguration.class,
		net.devh.boot.grpc.server.autoconfigure.GrpcMetadataEurekaConfiguration.class,
		net.devh.boot.grpc.client.autoconfigure.GrpcClientAutoConfiguration.class
})
public class FileApplication {

	public static void main(String[] args) {
		SpringApplication.run(FileApplication.class, args);
	}

}
