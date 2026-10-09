package com.siddhuja.userService.repository;

import com.siddhuja.userService.base.UserLogin;

import java.util.List;

public interface UserLoginRepository {
    List<UserLogin> findAll();
}
