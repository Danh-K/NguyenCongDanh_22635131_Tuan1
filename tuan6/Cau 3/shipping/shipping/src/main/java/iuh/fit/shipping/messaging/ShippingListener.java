package iuh.fit.shipping.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ShippingListener {

    @RabbitListener(queues = "shipping.queue")
    public void handleShipping(Object order) {
        System.out.println("Received order for shipping: " + order);

        // xử lý giao hàng
        // ví dụ:
        // tạo shipment
        // gọi delivery service

        System.out.println("Shipping processed successfully");
    }
}