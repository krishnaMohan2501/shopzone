package com.shopzone.controller;

import com.shopzone.dto.OrderRequest;
import com.shopzone.model.Order;
import com.shopzone.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> place(@AuthenticationPrincipal UserDetails user,
                                       @Valid @RequestBody OrderRequest req) {
        return ResponseEntity.ok(orderService.placeOrder(user.getUsername(), req));
    }

    @GetMapping
    public List<Order> myOrders(@AuthenticationPrincipal UserDetails user) {
        return orderService.getUserOrders(user.getUsername());
    }

    @GetMapping("/{id}")
    public Order getById(@PathVariable Long id, @AuthenticationPrincipal UserDetails user) {
        return orderService.getById(id, user.getUsername());
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> allOrders() { return orderService.getAllOrders(); }

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Order updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return orderService.updateStatus(id, body.get("status"));
    }
}
