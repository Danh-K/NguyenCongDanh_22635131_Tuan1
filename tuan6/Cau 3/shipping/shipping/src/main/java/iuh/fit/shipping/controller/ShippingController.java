package com.example.shipping.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shipping")
public class ShippingController {

    @PostMapping("/ship")
    public Boolean ship(@RequestBody Object order) {

        System.out.println("Processing shipping sync: " + order);

        // giả lập thành công
        return true;
    }
}