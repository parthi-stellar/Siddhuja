package com.siddhuja.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.siddhuja")
public class SiddhujaApplication {

    public static void main(String[] args) {
        SpringApplication.run(SiddhujaApplication.class, args);
    }

}
