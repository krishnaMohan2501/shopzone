package com.shopzone.service;

import com.shopzone.dto.CartItemRequest;
import com.shopzone.model.*;
import com.shopzone.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    @Transactional
    private Cart getOrCreateCart(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return cartRepo.findByUserId(user.getId())
                .orElseGet(() -> cartRepo.save(Cart.builder().user(user).build()));
    }

    @Transactional(readOnly = true)
    public Cart getCart(String email) { return getOrCreateCart(email); }

    @Transactional
    public Cart addItem(String email, CartItemRequest req) {
        Cart cart = getOrCreateCart(email);
        Product product = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        cart.getItems().stream()
            .filter(i -> i.getProduct().getId().equals(req.getProductId()))
            .findFirst()
            .ifPresentOrElse(
                item -> item.setQuantity(item.getQuantity() + req.getQuantity()),
                () -> cart.getItems().add(CartItem.builder()
                        .cart(cart).product(product).quantity(req.getQuantity()).build())
            );
        return cartRepo.save(cart);
    }

    @Transactional
    public Cart updateItem(String email, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(email);
        if (quantity == null || quantity <= 0) {
            cart.getItems().removeIf(i -> i.getId().equals(itemId));
        } else {
            cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .ifPresent(item -> item.setQuantity(quantity));
        }
        return cartRepo.save(cart);
    }

    @Transactional
    public Cart removeItem(String email, Long itemId) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return cartRepo.save(cart);
    }

    @Transactional
    public void clearCart(String email) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().clear();
        cartRepo.save(cart);
    }
}
