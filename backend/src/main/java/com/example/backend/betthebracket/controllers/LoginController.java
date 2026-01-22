package com.example.backend.betthebracket.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.betthebracket.models.User;
import com.example.backend.betthebracket.repository.UserRepository;


// TODO: hashing
// TODO: also create a signup controller

/**
* Controller for handling authentication on the backend
* Takes http requests from frontend and returns JSON response as OK if valid login
*/
@CrossOrigin(origins = "*") // allows for requests coming from a different port
@RestController // indicates this is taking requests
@RequestMapping("/api/authentication") // api for all authentication requests
public class LoginController {

    // need this userRepository object here for reference in dependency injection
    private final UserRepository userRepository; 

    // constructor with dependency injection, part of the springboot framework.
    // for reference: https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html
    public LoginController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Handle the Post requests from the frontend. Uses ResponseEntity from the springboot framework
    // for reference: https://www.baeldung.com/spring-response-entity
    @PostMapping("/login") // endpoint for login POST requests (http://localhost:8080/api/authentication/login)
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        
        // Basically we recieved some JSON from frontend formatted like { "username": "actualUsername", "password": "actualPassword" }
        // Now we want to parse those fields so that we can look for them in the database:
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        // using findByUsername from UserRepository class
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("cant find user");
        }

        User user = userOptional.get();
        // check for null user object returned 
        // TODO: possible case-sensitivity issue
        if (user != null) {
            // if it isnt null, we want to see if the username matches the password
            // uses the password encoder framework function matches() to check hashed password
                // If the username and password match, we need to create an authentication token,
                // so that we don't need to repeatedly check user authentication on requests
                String authToken = UUID.randomUUID().toString();
                user.setAuthToken(authToken);
                userRepository.save(user);

                Map<String, String> response = new HashMap<>(); 
                response.put("token", authToken); // TODO: token generation 
                response.put("userId", user.getId().toString());
                // returns ok response with the authentication token
                return ResponseEntity.ok(response);
        }

        
        // if a null User object was returned
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login.");
        }
    
    
    }


}