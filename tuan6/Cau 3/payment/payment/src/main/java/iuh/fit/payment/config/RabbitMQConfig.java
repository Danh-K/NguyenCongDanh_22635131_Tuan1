package iuh.fit.payment.config; 

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "order.exchange";

    public static final String PAYMENT_QUEUE = "payment.queue";
    public static final String SHIPPING_QUEUE = "shipping.queue";

    public static final String PAYMENT_ROUTING_KEY = "payment.process";
    public static final String SHIPPING_ROUTING_KEY = "shipping.process";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue paymentQueue() {
        return new Queue(PAYMENT_QUEUE);
    }

    @Bean
    public Binding paymentBinding() {
        return BindingBuilder
                .bind(paymentQueue())
                .to(exchange())
                .with(PAYMENT_ROUTING_KEY);
    }

    @Bean
    public Queue shippingQueue() {
        return new Queue(SHIPPING_QUEUE);
    }

    @Bean
    public Binding shippingBinding() {
        return BindingBuilder
                .bind(shippingQueue())
                .to(exchange())
                .with(SHIPPING_ROUTING_KEY);
    }
}