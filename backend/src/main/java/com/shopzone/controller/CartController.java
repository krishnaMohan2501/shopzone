package com.shopzone.controller;

import com.shopzone.dto.CartItemRequest;
import com.shopzone.model.Cart;
import com.shopzone.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public Cart getCart(@AuthenticationPrincipal UserDetails user) {
        return cartService.getCart(user.getUsername());
    }

    @PostMapping("/items")
    public Cart addItem(@AuthenticationPrincipal UserDetails user,
                        @Valid @RequestBody CartItemRequest req) {
        return cartService.addItem(user.getUsername(), req);
    }

    @PutMapping("/items/{itemId}")
    public Cart updateItem(@AuthenticationPrincipal UserDetails user,
                           @PathVariable Long itemId,
                           @RequestBody Map<String, Integer> body) {
        return cartService.updateItem(user.getUsername(), itemId, body.get("quantity"));
    }

    @DeleteMapping("/items/{itemId}")
    public Cart removeItem(@AuthenticationPrincipal UserDetails user, @PathVariable Long itemId) {
        return cartService.removeItem(user.getUsername(), itemId);
    }
}
