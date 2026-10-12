package com.siddhuja.userService.security;

import com.siddhuja.userService.base.UserLogin;
import com.siddhuja.userService.repository.UserLoginRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.test-user.enabled", havingValue = "true")
public class TestUserCreator implements ApplicationRunner {
    private final UserLoginRepository users;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment;

    public TestUserCreator(UserLoginRepository users, PasswordEncoder passwordEncoder, Environment environment) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) {
        String username = required("TEST_USER_USERNAME");
        String password = required("TEST_USER_PASSWORD");
        if (users.findByUsernameIgnoreCase(username).isPresent()) {
            throw new IllegalStateException("Test username already exists; choose a new TEST_USER_USERNAME.");
        }
        UserLogin user = new UserLogin();
        user.setUsername(username);
        user.setEmail(environment.getProperty("TEST_USER_EMAIL", username + "@example.test"));
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setEnabled(true);
        users.save(user);
        System.out.println("Created enabled test user: " + username);
    }

    private String required(String name) {
        String value = environment.getProperty(name);
        if (value == null || value.isBlank()) throw new IllegalStateException(name + " must be set.");
        return value;
    }
}
