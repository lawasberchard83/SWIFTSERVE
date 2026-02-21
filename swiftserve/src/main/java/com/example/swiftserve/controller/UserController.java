package com.example.swiftserve.controller;

import com.example.swiftserve.entity.User;
import com.example.swiftserve.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username) {
        try {
            User user = userService.getUserProfile(username);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile/{username}")
    public ResponseEntity<?> updateProfile(@PathVariable String username, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUserProfile(username, user);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully", "user", updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/password/{username}")
    public ResponseEntity<?> updatePassword(@PathVariable String username, @RequestBody Map<String, String> passwords) {
        try {
            String newPassword = passwords.get("newPassword");
            userService.changePassword(username, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/photo/{username}")
    public ResponseEntity<?> uploadPhoto(@PathVariable String username, @RequestParam("file") MultipartFile file) {
        try {
            userService.uploadProfileImage(username, file);
            return ResponseEntity.ok(Map.of("message", "Image uploaded successfully"));
        } catch (IOException | RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to upload image: " + e.getMessage()));
        }
    }
}
