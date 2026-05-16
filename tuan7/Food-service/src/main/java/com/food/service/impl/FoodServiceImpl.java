package com.food.service.impl;

import com.food.dto.request.FoodRequest;
import com.food.dto.response.FoodResponse;
import com.food.entity.Food;
import com.food.repository.FoodRepository;
import com.food.service.FoodService;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {
    private final FoodRepository foodRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<FoodResponse> getAllFoods() {
        return foodRepository.findAll().stream()
                .map(food -> modelMapper.map(food, FoodResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public FoodResponse createFood(FoodRequest request) {
        Food food = modelMapper.map(request, Food.class);
        return modelMapper.map(foodRepository.save(food), FoodResponse.class);
    }

    @Override
    @Transactional
    public FoodResponse updateFood(Long id, FoodRequest request) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Món ăn không tồn tại với ID: " + id));
        food.setName(request.getName());
        food.setPrice(request.getPrice());
        food.setDescription(request.getDescription());
        food.setCategory(request.getCategory());

        return modelMapper.map(foodRepository.save(food), FoodResponse.class);
    }

    @Override
    @Transactional
    public void deleteFood(Long id) {
        if (!foodRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy món ăn để xóa");
        }
        foodRepository.deleteById(id);
    }

    @Override
    public FoodResponse getFoodById(Long id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Món ăn không tồn tại"));
        return modelMapper.map(food, FoodResponse.class);
    }
}