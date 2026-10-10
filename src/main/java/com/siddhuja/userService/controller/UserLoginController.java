package com.siddhuja.userService.controller;

import com.siddhuja.userService.service.UserLoginService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost")
public class UserLoginController {

    private final UserLoginService userLoginService;

    public UserLoginController(UserLoginService userLoginService) {
        this.userLoginService = userLoginService;
    }

    @GetMapping(value = "/user-logins", produces = MediaType.TEXT_PLAIN_VALUE)
    public String getUserLogins() {
        return userLoginService.getAllUserLogins();
    }
}
