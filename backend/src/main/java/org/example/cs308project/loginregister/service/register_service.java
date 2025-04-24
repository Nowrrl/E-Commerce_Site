package org.example.cs308project.loginregister.service;

import org.example.cs308project.loginregister.model.login_model;
import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.loginregister.repository.login_repository;
import org.example.cs308project.loginregister.repository.register_repository;
import org.example.cs308project.order.order_history.order_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class register_service {

    @Autowired
    private register_repository registerRepository;

    @Autowired
    private login_repository loginRepository;

    @Autowired
    private order_repository orderRepository;

    public register_model registerUser(String email, String username, String password) {
        register_model newUser = new register_model();
        newUser.setEmail(email);
        newUser.setUsername(username);
        newUser.setPassword(password);

        registerRepository.save(newUser);

        login_model loginUser = new login_model();
        loginUser.setUsername(username);
        loginUser.setPassword(password);

        loginRepository.save(loginUser);

        return newUser;
    }

    public boolean userNameExists(String username) {
        return registerRepository.findByUsername(username) != null;
    }

    public boolean userMailExists(String email) {
        return registerRepository.findByEmail(email) != null;
    }

    public Long getUserIdByEmail(String email) {
        register_model user = registerRepository.findByEmail(email);
        return (user != null) ? user.getId() : null;
    }

    public Long getUserIdByUsername(String username) {
        register_model user = registerRepository.findByUsername(username);
        return (user != null) ? user.getId() : null;
    }

    public register_model findByUsername(String username) {
        return registerRepository.findByUsername(username);
    }

    public void saveUser(register_model user) {
        registerRepository.save(user);
    }

    public void updateDeliveryAddress(Long userId, String address) {
        register_model user = registerRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setDeliveryAddress(address);
            registerRepository.save(user);
        }
    }

    // ✅ SINGLE AND FINAL findById METHOD (dynamic loyalty + orders)
    public register_model findById(Long id) {
        register_model user = registerRepository.findById(id).orElse(null);
        if (user != null) {
            int totalOrders = orderRepository.countByUser(user);
            Double totalSpent = orderRepository.sumTotalPriceByUser(user);
            if (totalSpent == null) totalSpent = 0.0;

            user.setTotalOrders(totalOrders);
            user.setLoyaltyPoints((int) (totalSpent / 10)); // 1 point per $10 spent
        }
        return user;
    }
}
