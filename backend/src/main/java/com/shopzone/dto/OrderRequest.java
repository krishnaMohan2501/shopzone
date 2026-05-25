package com.shopzone.dto;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OrderRequest {
    @NotBlank private String shippingAddress;
}
