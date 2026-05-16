package com.food.dto.request;

import lombok.Data;

@Data
public class FoodRequest {
    private String name;
    private Double price;
    private String description;
    private String category;
}