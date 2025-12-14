package com.ramya.ecomerce.service;

import com.ramya.ecomerce.dto.LoginRequest;
import com.ramya.ecomerce.dto.LoginResponse;
import com.ramya.ecomerce.dto.CreateAccountRequest;
import com.ramya.ecomerce.entity.Account;
import com.ramya.ecomerce.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthenticationService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        Optional<Account> accountOpt = accountRepository.findByEmail(request.getEmail());

        if (accountOpt.isEmpty()) {
            return new LoginResponse(null, null, null, null, null, "Account does not exist");
        }

        Account account = accountOpt.get();

        // For demo purposes, comparing plain text. In production, use passwordEncoder
        if (!account.getPassword().equals(request.getPassword())) {
            return new LoginResponse(null, null, null, null, null, "Invalid email or password");
        }

        String token = jwtService.generateToken(account.getId(), account.getEmail());

        return new LoginResponse(
            account.getId(),
            account.getFirstName(),
            account.getLastName(),
            account.getEmail(),
            token,
            "Login successful"
        );
    }

    public LoginResponse createAccount(CreateAccountRequest request) {
        if (accountRepository.existsByEmail(request.getEmail())) {
            return new LoginResponse(null, null, null, null, null, "Account already exists with this email");
        }

        Account account = new Account();
        account.setFirstName(request.getFirstName());
        account.setLastName(request.getLastName());
        account.setEmail(request.getEmail());
        account.setPassword(request.getPassword()); // In production, use passwordEncoder

        Account savedAccount = accountRepository.save(account);

        String token = jwtService.generateToken(savedAccount.getId(), savedAccount.getEmail());

        return new LoginResponse(
            savedAccount.getId(),
            savedAccount.getFirstName(),
            savedAccount.getLastName(),
            savedAccount.getEmail(),
            token,
            "Account created successfully"
        );
    }
}

