package com.siddhuja.controller;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import com.siddhuja.project.SiddhujaApplication;

@SpringBootTest(classes = SiddhujaApplication.class)
@ActiveProfiles("test")
class SiddhujaApplicationTests {

    @Test
    void contextLoads() {
    }

}
