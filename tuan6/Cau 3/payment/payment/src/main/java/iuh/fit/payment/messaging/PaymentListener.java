package com.example.payment.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class PaymentListener {

    @RabbitListener(queues = "payment.queue")
    public void handlePayment(Object order) {
        System.out.println("Received order for payment: " + order);

        // xử lý logic thanh toán
        // ví dụ:
        // check balance
        // trừ tiền

        System.out.println("Payment processed successfully");
    }
}