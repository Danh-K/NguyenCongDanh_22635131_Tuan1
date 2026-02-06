# Bài Tập Tuần 3: Fault Tolerance với Resilience4J

## 1. Mục Tiêu

Tìm hiểu và triển khai các pattern (mẫu) Fault Tolerance (Khả năng chịu lỗi) trong hệ thống phân tán để đảm bảo hệ thống vẫn hoạt động ổn định khi các dịch vụ thành phần gặp sự cố.

## 2. Các Khái Niệm Chính (Fault Tolerance Patterns)

Dưới đây là mô tả các pattern theo yêu cầu bài tập:

### a. Retry (Thử lại)

- **Mô tả**: Khi một service gọi thất bại (do lỗi mạng, lỗi tạm thời), hệ thống sẽ tự động thử lại request đó một số lần nhất định trước khi báo lỗi hẳn.
- **Tác dụng**: Giúp vượt qua các lỗi "thoáng qua" (transient failures) như nghẽn mạng tạm thời.
- **Ví dụ**: Service A gọi Service B. B lỗi 503. A chờ 1s rồi gọi lại. Nếu B sống lại -> Thành công.

### b. Circuit Breaker (Cầu dao ngắt mạch)

- **Mô tả**: Bảo vệ hệ thống khỏi việc liên tục gọi tới một service đã chết. Nó giống như cầu dao điện.
  - **Closed (Đóng)**: Cho phép request đi qua bình thường.
  - **Open (Mở)**: Ngắt mạch nếu tỉ lệ lỗi vượt quá ngưỡng (ví dụ > 50% lỗi). Request bị chặn ngay lập tức mà không cần gọi service đích.
  - **Half-Open (Nửa mở)**: Sau một khoảng thời gian, cho phép một vài request đi qua để thăm dò. Nếu thành công -> Đóng mạch (bình thường trở lại).
- **Tác dụng**: Tránh lãng phí tài nguyên và giúp service đích có thời gian phục hồi.

### c. Rate Limiter (Giới hạn tốc độ)

- **Mô tả**: Giới hạn số lượng request mà service có thể thực hiện (hoặc nhận) trong một khoảng thời gian nhất định (ví dụ: 10 request/giây).
- **Tác dụng**: Ngăn chặn việc quá tải hệ thống, bảo vệ service khỏi bị spam hoặc tấn công DDoS.

### d. Bulkhead (Vách ngăn)

- **Mô tả**: Chia tài nguyên (thread pool, connection pool) thành các phần riêng biệt cho các service khác nhau.
- **Tác dụng**: Nếu Service B bị lỗi và treo thread, nó chỉ tiêu tốn thread trong phần vách ngăn của nó. Các service khác (Service C, D) vẫn hoạt động bình thường vì không dùng chung pool với B.
- **Hình ảnh**: Giống như vách ngăn trên tàu thủy, thủng khoang nào thì đóng khoang đó, tàu không chìm.

## 3. Kiến Trúc Dự Án

Chúng ta sẽ xây dựng 2 Services:

1.  **Service A (Spring Boot)**: Đóng vai trò là **Client**. Service này sẽ gọi sang Service B và áp dụng thư viện **Resilience4J** để xử lý lỗi.
2.  **Service B (Node.js)**: Đóng vai trò là **Server** mô phỏng. Nó sẽ có các API được lập trình để cố tình bị lỗi (chậm, trả về 500) giúp chúng ta test Resilience4J.

## 4. Hướng dẫn chạy

### Bước 1: Khởi chạy Service B (Node.js) - Cổng 3001

Trong một terminal:

```bash
cd service-b
npm install
npm start
```

### Bước 2: Khởi chạy Service A (Spring Boot) - Cổng 8080

Trong một terminal khác:

```bash
cd service-a
mvn spring-boot:run
```

### Bước 3: Kiểm thử các Pattern

Truy cập trình duyệt hoặc dùng Postman:

1.  **Circuit Breaker**: `http://localhost:8080/resilience/cb`
    - Service B API `/error` luôn trả lỗi 500.
    - Refresh liên tục 5-10 lần.
    - Bạn sẽ thấy ban đầu lỗi trả về từ Service B. Sau đó Circuit Breaker mở -> trả về "Fallback response: Circuit Breaker is OPEN...".
    - Khi CB mở, nó không gọi sang Service B nữa.

2.  **Retry**: `http://localhost:8080/resilience/retry`
    - Service B API `/flaky` lỗi ngẫu nhiên.
    - Nếu gặp lỗi, Service A sẽ tự thử lại tối đa 3 lần. Nếu may mắn lần 2 hoặc 3 thành công, bạn sẽ thấy kết quả thành công mà không biết là đã có lỗi xảy ra trước đó.

3.  **Rate Limiter**: `http://localhost:8080/resilience/ratelimiter`
    - Config cho phép 1 request / 5s.
    - Refresh thật nhanh. Request đầu tiên thành công. Request thứ 2 sẽ báo lỗi "Rate limit exceeded".

4.  **Bulkhead**: `http://localhost:8080/resilience/bulkhead`
    - Service B API `/slow` tốn 3s mới trả lời.
    - Config max concurrent = 1.
    - Mở 2 tab trình duyệt, load cùng lúc URL này. Tab thứ 2 sẽ bị trả về Fallback ngay lập tức vì không còn slot trong Bulkhead.
