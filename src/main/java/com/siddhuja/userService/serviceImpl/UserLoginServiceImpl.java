package com.siddhuja.userService.serviceImpl;

import com.siddhuja.userService.repository.UserLoginRepository;
import com.siddhuja.userService.service.UserLoginService;
import org.springframework.stereotype.Service;

@Service
public class UserLoginServiceImpl implements UserLoginService {

    private final UserLoginRepository userLoginRepository;

    public UserLoginServiceImpl(UserLoginRepository userLoginRepository) {
        this.userLoginRepository = userLoginRepository;
    }

    @Override
    public String getAllUserLogins() {
        return userLoginRepository.findAll().stream()
                .map(user -> "ID: " + user.getId() + " | Username: " + user.getUsername()
                        + " | Email: " + user.getEmail())
                .reduce("User login records:", (result, row) -> result + "\n" + row);
    }
}
