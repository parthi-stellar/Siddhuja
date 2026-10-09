package com.siddhuja.userService.repositoryImpl;

import com.siddhuja.userService.base.UserLogin;
import com.siddhuja.userService.repository.UserLoginRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserLoginRepositoryImpl implements UserLoginRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserLoginRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<UserLogin> findAll() {
        return jdbcTemplate.query(
                "SELECT id, username, email FROM user_login ORDER BY id",
                (resultSet, rowNumber) -> new UserLogin(
                        resultSet.getLong("id"),
                        resultSet.getString("username"),
                        resultSet.getString("email")
                )
        );
    }
}
