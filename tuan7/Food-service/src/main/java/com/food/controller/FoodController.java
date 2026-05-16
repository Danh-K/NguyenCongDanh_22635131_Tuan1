package com.food.controller;


import com.food.dto.request.FoodRequest;
import com.food.dto.response.ApiResponse;
import com.food.service.FoodService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/foods")
@RequiredArgsConstructor
public class FoodController {
    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        return ResponseEntity.ok(ApiResponse.builder()
                .status(200)
                .data(foodService.getAllFoods())
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody FoodRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.builder()
                .status(201)
                .message("Thêm món thành công")
                .data(foodService.createFood(request))
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody FoodRequest request) {
        return ResponseEntity.ok(ApiResponse.builder()
                .status(200)
                .message("Cập nhật món ăn thành công")
                .data(foodService.updateFood(id, request))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .status(200)
                .message("Xóa món ăn thành công")
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.builder()
                .status(200)
                .data(foodService.getFoodById(id))
                .build());
    }
}