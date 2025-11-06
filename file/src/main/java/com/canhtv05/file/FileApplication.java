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
		io.github.cdimascio.dotenv.Dotenv dotenv = io.github.cdimascio.dotenv.Dotenv.configure()
				.filename(".env.dev")
				.ignoreIfMissing()
				.load();

		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));

		SpringApplication.run(FileApplication.class, args);
	}

}
