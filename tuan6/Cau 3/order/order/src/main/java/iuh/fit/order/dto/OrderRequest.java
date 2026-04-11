package iuh.fit.order.dto;

import java.util.List;

public class OrderRequest {
    private String userId;
    private List<OrderItemDto> items;

    // getters & setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<OrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }
}