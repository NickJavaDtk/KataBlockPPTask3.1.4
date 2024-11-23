package ru.kata.spring.boot_security.demo.controller;



import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.domain.model.Role;
import ru.kata.spring.boot_security.demo.domain.model.User;
import ru.kata.spring.boot_security.demo.domain.service.RoleService;
import ru.kata.spring.boot_security.demo.domain.service.UserService;


import java.security.Principal;
import java.util.List;
import java.util.NoSuchElementException;


@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    private UserService userService;
    private RoleService roleService;


    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }


    @GetMapping("/users")
    public ResponseEntity<List<User>> getUserList() {
        List<User> users = userService.getUserList();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/userget/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable("userId") String id) {
        User user = userService.getUser(id).get();
        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<User> getAuthenticationUser(Principal principal) {
        String username = principal.getName();
        User user = userService.getUserByUsername(username).get();
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/userput/{userId}")
    public ResponseEntity<User> editUser(@PathVariable String userId, @RequestBody User user) {
        String s = "";
        User userTmp = userService.getUser(userId).get();
        if (userTmp == null) {
            throw new NoSuchElementException("Пользователь с ID " + userId + " не найден");
        }
        User userUpdate = userService.updateUser(userId, user);
        return new ResponseEntity<>(userUpdate, HttpStatus.OK);
    }

    @PostMapping("/user/add")
    public ResponseEntity<HttpStatus> addUser(@RequestBody User user) {
        userService.addUser(user);
        return  ResponseEntity.ok(HttpStatus.CREATED);
    }

    @DeleteMapping("/userdel/{userId}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable ("userId") String id) {
        String s = "";
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


//    @GetMapping()
//    public String getStartPage(Model model, Principal principal) {
//        List<User> userList = userService.getUserList();
//        List<Role> roleList = roleService.getRoleList();
//        String userName = principal.getName();
//        User user = userService.getUserByUsername(userName).get();
//        model.addAttribute("newuser", new User());
//        model.addAttribute("aboutuser", user);
//        model.addAttribute("role", roleList);
//        model.addAttribute("list", userList);
//        return "admin";
//    }
//
//
//    @PostMapping("/user/add")
//    public String addUser(User users) {
//            userService.addUser(users);
//            return "redirect:/admin";
//    }
//
//    @PostMapping("/user/edit")
//    public String editUser(@ModelAttribute("newuser") User users, @RequestParam("userId") String id) {
//        userService.updateUser(id, users);
//        return "redirect:/admin";
//    }
//
//    @GetMapping("user/delete")
//    public String deleteUser(@RequestParam("userId") String id) {
//        userService.deleteUser(id);
//        return "redirect:/admin";
//    }
}
