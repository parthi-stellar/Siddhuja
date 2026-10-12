package com.siddhuja.userService.controller;

import com.siddhuja.userService.service.UserLoginService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@CrossOrigin(origins = {
        "http://localhost",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "capacitor://localhost",
        "ionic://localhost"
})
public class UserLoginController {

    private final UserLoginService userLoginService;

    public UserLoginController(UserLoginService userLoginService) {
        this.userLoginService = userLoginService;
    }

    @GetMapping(value = "/user-logins", produces = MediaType.TEXT_PLAIN_VALUE)
    public String getUserLogins() {
        return userLoginService.getAllUserLogins();
    }

    @PostMapping("/user-login-controller/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        if (userLoginService.authenticate(request.username(), request.password())) {
            return ResponseEntity.ok(Map.of("username", request.username().trim()));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Username or password is incorrect."));
    }

    public record LoginRequest(String username, String password) {}
}
