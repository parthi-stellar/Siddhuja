package com.siddhuja.userService.base;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/** Represents a row in the user_login table. */
@Getter
@Setter
@Entity
@Table(name = "user_login")
public class UserLogin {

    @Id
    private Long id;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    protected UserLogin() {
        // Required by JPA.
    }

    public UserLogin(long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}
