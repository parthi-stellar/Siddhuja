package com.siddhuja.controller;

import com.siddhuja.userService.base.UserLogin;
import com.siddhuja.project.SiddhujaApplication;
import com.siddhuja.userService.repository.UserLoginRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = SiddhujaApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserLoginAuthenticationTests {
    private static final String PASSWORD = "Test-Only-Password-42!";

    @Autowired MockMvc mockMvc;
    @Autowired UserLoginRepository users;
    @Autowired PasswordEncoder passwordEncoder;

    private UserLogin account;

    @BeforeEach
    void createAccount() {
        users.deleteAll();
        account = new UserLogin();
        account.setUsername("login-test");
        account.setEmail("login-test@example.test");
        account.setPasswordHash(passwordEncoder.encode(PASSWORD));
        account.setEnabled(true);
        users.saveAndFlush(account);
    }

    @Test
    void validPasswordAuthenticates() throws Exception {
        postLogin("login-test", PASSWORD).andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("login-test"));
    }

    @Test
    void incorrectPasswordIsRejected() throws Exception {
        postLogin("login-test", "wrong-password").andExpect(status().isUnauthorized());
    }

    @Test
    void unknownUsernameIsRejected() throws Exception {
        postLogin("missing-user", PASSWORD).andExpect(status().isUnauthorized());
    }

    @Test
    void disabledAccountIsRejected() throws Exception {
        account.setEnabled(false);
        users.saveAndFlush(account);
        postLogin("login-test", PASSWORD).andExpect(status().isUnauthorized());
    }

    private org.springframework.test.web.servlet.ResultActions postLogin(String username, String password) throws Exception {
        return mockMvc.perform(post("/user-login-controller/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}"));
    }
}
