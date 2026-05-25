package com.shopzone.service;

import com.shopzone.dto.OrderRequest;
import com.shopzone.model.*;
import com.shopzone.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final CartService cartService;

    @Transactional
    public Order placeOrder(String email, OrderRequest req) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Cart cart = cartService.getCart(email);

        if (cart.getItems().isEmpty())
            throw new RuntimeException("Cart is empty");

        BigDecimal total = cart.getItems().stream()
                .map(i -> i.getProduct().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .user(user).shippingAddress(req.getShippingAddress())
                .totalAmount(total).status(Order.Status.PENDING).build();

        List<OrderItem> orderItems = cart.getItems().stream()
                .map(i -> OrderItem.builder()
                        .order(order).product(i.getProduct())
                        .quantity(i.getQuantity()).price(i.getProduct().getPrice()).build())
                .collect(Collectors.toList());
        order.setItems(orderItems);

        Order saved = orderRepo.save(order);
        cartService.clearCart(email);
        return saved;
    }

    public List<Order> getUserOrders(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return orderRepo.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Order getById(Long id, String email) {
        Order order = orderRepo.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getEmail().equals(email))
            throw new RuntimeException("Access denied");
        return order;
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll(Sort.by("createdAt").descending());
    }

    public Order updateStatus(Long id, String status) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        try {
            order.setStatus(Order.Status.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
        return orderRepo.save(order);
    }
}
