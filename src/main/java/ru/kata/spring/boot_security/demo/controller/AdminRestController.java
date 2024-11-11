package ru.kata.spring.boot_security.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.domain.model.User;
import ru.kata.spring.boot_security.demo.domain.service.RoleService;
import ru.kata.spring.boot_security.demo.domain.service.UserService;

import java.util.List;

@RestController
@RequestMapping(value = "/api/", produces = "application/json")
public class AdminRestController {

    private UserService userService;
    private RoleService roleService;

    public AdminRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping(path = "list", produces = "application/json")
    public List<User> getUserList() {
        return userService.getUserList();
    }
}
