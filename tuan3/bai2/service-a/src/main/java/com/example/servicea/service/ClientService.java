package com.example.servicea.service;

import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpServerErrorException;

@Service
public class ClientService {

  private final RestTemplate restTemplate;
  // URL của Service B (NodeJS)
  private static final String SERVICE_B_URL = "http://localhost:3001/api";

  public ClientService(RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
  }

  // 1. Circuit Breaker
  // Calls /error to trigger failures and open the circuit
  @CircuitBreaker(name = "backendA", fallbackMethod = "fallbackCircuitBreaker")
  public String callCircuitBreaker() {
    return restTemplate.getForObject(SERVICE_B_URL + "/error", String.class);
  }

  public String fallbackCircuitBreaker(Throwable t) {
    return "Fallback response: Circuit Breaker is OPEN or Service is Down! Error: " + t.getMessage();
  }

  // 2. Retry
  // Calls /flaky which fails randomly. Retry will attempt to call it multiple
  // times.
  @Retry(name = "backendA", fallbackMethod = "fallbackRetry")
  public String callRetry() {
    return restTemplate.getForObject(SERVICE_B_URL + "/flaky", String.class);
  }

  public String fallbackRetry(Throwable t) {
    return "Fallback response: All retries failed! Error: " + t.getMessage();
  }

  // 3. Rate Limiter
  // Limits calls to /success
  @RateLimiter(name = "backendA", fallbackMethod = "fallbackRateLimiter")
  public String callRateLimiter() {
    return restTemplate.getForObject(SERVICE_B_URL + "/success", String.class);
  }

  public String fallbackRateLimiter(Throwable t) {
    return "Fallback response: Rate limit exceeded! Wait for a while. Error: " + t.getMessage();
  }

  // 4. Bulkhead
  // Calls /slow. If too many concurrent calls happen, some will be rejected.
  @Bulkhead(name = "backendA", fallbackMethod = "fallbackBulkhead")
  public String callBulkhead() {
    return restTemplate.getForObject(SERVICE_B_URL + "/slow", String.class);
  }

  public String fallbackBulkhead(Throwable t) {
    return "Fallback response: Bulkhead full! Too many concurrent requests. Error: " + t.getMessage();
  }
}
