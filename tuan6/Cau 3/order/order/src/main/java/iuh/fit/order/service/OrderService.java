package iuh.fit.order.service;

import iuh.fit.order.domain.Order;
import iuh.fit.order.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
        this.restTemplate = new RestTemplate();
    }

    public Order placeOrder(Order order) {

        order.setStatus("CREATED");
        order.setCreatedAt(LocalDateTime.now());

        String paymentUrl = "http://payment-service/pay";

        Boolean paymentSuccess = restTemplate.postForObject(
                paymentUrl,
                order,
                Boolean.class
        );

        if (paymentSuccess == null || !paymentSuccess) {
            order.setStatus("FAILED");
            return orderRepository.save(order);
        }

        order.setStatus("PAID");

        String shippingUrl = "http://shipping-service/ship";

        Boolean shippingSuccess = restTemplate.postForObject(
                shippingUrl,
                order,
                Boolean.class
        );

        if (shippingSuccess == null || !shippingSuccess) {
            order.setStatus("FAILED");
            return orderRepository.save(order);
        }

        order.setStatus("COMPLETED");

        return orderRepository.save(order);
    }
}