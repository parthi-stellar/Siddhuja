package com.siddhuja.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.siddhuja")
@EntityScan(basePackages = "com.siddhuja.userService.base")
@EnableJpaRepositories(basePackages = "com.siddhuja.userService.repository")
public class SiddhujaApplication {

    public static void main(String[] args) {
        SpringApplication.run(SiddhujaApplication.class, args);
    }

}
