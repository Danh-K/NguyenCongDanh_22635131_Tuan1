package com.example.servicea.controller;

import com.example.servicea.service.ClientService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/resilience")
public class ResilienceController {

  private final ClientService clientService;

  public ResilienceController(ClientService clientService) {
    this.clientService = clientService;
  }

  @GetMapping("/cb")
  public String circuitBreaker() {
    return clientService.callCircuitBreaker();
  }

  @GetMapping("/retry")
  public String retry() {
    return clientService.callRetry();
  }

  @GetMapping("/ratelimiter")
  public String rateLimiter() {
    return clientService.callRateLimiter();
  }

  @GetMapping("/bulkhead")
  public String bulkhead() {
    return clientService.callBulkhead();
  }
}
