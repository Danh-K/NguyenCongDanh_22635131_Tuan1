package iuh.fit.payment.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @PostMapping("/pay")
    public Boolean pay(@RequestBody Object order) {

        System.out.println("Processing payment sync: " + order);

        // giả lập thành công
        return true;
    }
}