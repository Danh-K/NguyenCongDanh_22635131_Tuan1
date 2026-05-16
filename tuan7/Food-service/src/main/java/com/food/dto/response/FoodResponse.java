package com.food.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FoodResponse {
    private Long id;
    private String name;
    private Double price;
    private String description;
    private String category;
    private Boolean available;
}