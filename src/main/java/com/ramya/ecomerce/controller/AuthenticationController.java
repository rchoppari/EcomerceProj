package com.ramya.ecomerce.controller;

import com.ramya.ecomerce.dto.LoginRequest;
import com.ramya.ecomerce.dto.LoginResponse;
import com.ramya.ecomerce.dto.CreateAccountRequest;
import com.ramya.ecomerce.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/authentication")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(
                new LoginResponse(null, null, null, null, null, "Validation failed")
            );
        }

        LoginResponse response = authenticationService.login(request);

        if (response.getMessage().contains("successful")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/create-account")
    public ResponseEntity<LoginResponse> createAccount(@Valid @RequestBody CreateAccountRequest request, BindingResult bindingResult) {
        System.out.println("Received create account request for email: " + request.getEmail());
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(
                new LoginResponse(null, null, null, null, null, "Validation failed")
            );
        }

        LoginResponse response = authenticationService.createAccount(request);

        if (response.getMessage().contains("successfully")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }
}

