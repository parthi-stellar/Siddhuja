package com.siddhuja.userService.serviceImpl;

import com.siddhuja.userService.repository.UserLoginRepository;
import com.siddhuja.userService.service.UserLoginService;
import org.springframework.stereotype.Service;
import com.siddhuja.userService.base.UserLogin;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserLoginServiceImpl implements UserLoginService {

    private final UserLoginRepository userLoginRepository;
    private final PasswordEncoder passwordEncoder;

    public UserLoginServiceImpl(UserLoginRepository userLoginRepository, PasswordEncoder passwordEncoder) {
        this.userLoginRepository = userLoginRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String getAllUserLogins() {
        return userLoginRepository.findAll().stream()
                .map(user -> "ID: " + user.getId() + " | Username: " + user.getUsername()
                        + " | Email: " + user.getEmail())
                .reduce("User login records:", (result, row) -> result + "\n" + row);
    }

    @Override
    public boolean authenticate(String username, String password) {
        if (username == null || password == null || username.isBlank()) return false;
        return userLoginRepository.findByUsernameIgnoreCase(username.trim())
                .filter(user -> user.isEnabled() && user.getPasswordHash() != null)
                .map(user -> passwordEncoder.matches(password, user.getPasswordHash()))
                .orElse(false);
    }
}
