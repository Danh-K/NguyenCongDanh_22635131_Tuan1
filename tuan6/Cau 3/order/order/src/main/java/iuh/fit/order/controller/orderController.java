package iuh.fit.order.controller;

import iuh.fit.order.domain.Order;
import iuh.fit.order.dto.OrderRequest;
import iuh.fit.order.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order placeOrder(@RequestBody OrderRequest request) {

        Order order = new Order();
        order.setUserId(request.getUserId());

        order.setItems(
                request.getItems().stream().map(item -> {
                    var i = new com.example.order.domain.OrderItem();
                    i.setProductId(item.getProductId());
                    i.setQuantity(item.getQuantity());
                    i.setPrice(item.getPrice());
                    return i;
                }).collect(Collectors.toList())
        );

        double total = request.getItems().stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        order.setTotalAmount(total);

        return orderService.placeOrder(order);
    }
}