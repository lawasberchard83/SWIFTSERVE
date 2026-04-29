package com.example.swiftserve.user;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username) {
        try {
            User user = userService.getUserProfile(username);
            // Hide sensitive passwords
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{username}")
    public ResponseEntity<?> updateProfile(@PathVariable String username, @RequestBody User updatedUser) {
        try {
            User user = userService.updateUserProfile(username, updatedUser);
            user.setPassword(null); // Hide password
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully", "user", user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{username}/password")
    public ResponseEntity<?> updatePassword(@PathVariable String username, @RequestBody Map<String, String> payload) {
        try {
            String newPassword = payload.get("newPassword");
            if (newPassword == null || newPassword.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "New password is required"));
            }
            userService.changePassword(username, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{username}/photo")
    public ResponseEntity<?> uploadPhoto(@PathVariable String username, @RequestParam("photo") MultipartFile file) {
        try {
            userService.uploadProfileImage(username, file);
            
            // Build file reference URL
            String fileReference = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/users/")
                    .path(username)
                    .path("/photo")
                    .toUriString();

            return ResponseEntity.ok(Map.of(
                    "message", "Photo uploaded successfully", 
                    "fileReference", fileReference
            ));
        } catch (RuntimeException | IOException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Could not upload photo: " + e.getMessage()));
        }
    }

    @GetMapping("/{username}/photo")
    public ResponseEntity<byte[]> getPhoto(@PathVariable String username) {
        try {
            User user = userService.getUserProfile(username);
            byte[] photo = user.getProfileImage();
            
            if (photo == null || photo.length == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG); // Or appropriate content type
            return new ResponseEntity<>(photo, headers, HttpStatus.OK);
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
