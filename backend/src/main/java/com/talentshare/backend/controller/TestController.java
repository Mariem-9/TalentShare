package com.talentshare.backend.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        UserDetails user = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println(user.getUsername());

        return "Hello Talan!";
    }
    @GetMapping("/admin")
    public String admin() {
        return "Hello Admin!";
    }

    @GetMapping("/user")
    public String user() {
        return "Hello User!";
    }
}
