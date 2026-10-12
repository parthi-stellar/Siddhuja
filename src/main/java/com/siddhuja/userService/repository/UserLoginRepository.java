package com.siddhuja.userService.repository;

import com.siddhuja.userService.base.UserLogin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserLoginRepository extends JpaRepository<UserLogin, Long> {
    Optional<UserLogin> findByUsernameIgnoreCase(String username);
}
