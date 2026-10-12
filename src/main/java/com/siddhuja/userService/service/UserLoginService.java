package com.siddhuja.userService.service;

public interface UserLoginService {
    String getAllUserLogins();
    boolean authenticate(String username, String password);
}
