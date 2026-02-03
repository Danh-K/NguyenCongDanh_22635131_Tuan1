workspace "Shopping Service" "Hệ thống quản lý đơn hàng trực tuyến với các tính năng thanh toán, vận chuyển và thông báo" {

    !identifiers hierarchical

    model {
        # People/Actors
        customer = person "Customer" "Khách hàng mua hàng online" "Person"

        # Software Systems
        shoppingService = softwareSystem "Shopping Service" "Hệ thống quản lý đơn hàng" "Shopping System" {
            description "Xử lý tạo đơn hàng, thanh toán, vận chuyển và thông báo"
            
            # Containers - Level 2
            webApi = container "Web API" "REST API xử lý requests từ clients" "Node.js, Express" "Web API"
            
            businessLogic = container "Business Logic" "Xử lý logic nghiệp vụ chính" "Node.js" "Application" {
                # Components - Level 3
                orderController = component "Order Controller" "Xử lý HTTP requests liên quan đến đơn hàng" "Express Controller"
                orderService = component "Order Service" "Xử lý logic chính của đơn hàng" "Node.js Service"
                orderModel = component "Order Model" "Định nghĩa cấu trúc dữ liệu Order" "Mongoose Schema"
                shippingStrategy = component "Shipping Strategy" "Xử lý các loại vận chuyển khác nhau (Strategy Pattern)" "Strategy Pattern"
                paymentFactory = component "Payment Factory" "Tạo payment objects dựa trên loại thanh toán (Factory Pattern)" "Factory Pattern"
                orderSubject = component "Order Subject" "Quản lý observers để gửi thông báo (Observer Pattern)" "Observer Pattern"
                emailObserver = component "Email Observer" "Gửi email thông báo khi có sự kiện" "Observer"
                smsObserver = component "SMS Observer" "Gửi SMS thông báo khi có sự kiện" "Observer"
            }
            
            dataAccess = container "Data Access Layer" "Tương tác với cơ sở dữ liệu" "Mongoose ODM" "Data Access"
            
            database = container "Database" "Lưu trữ thông tin đơn hàng" "MongoDB" "Database"
        }
        
        # External Systems
        paymentGateway = softwareSystem "Payment Gateway" "Dịch vụ xử lý thanh toán (Momo, Credit Card)" "External System"
        emailService = softwareSystem "Email Service" "Dịch vụ gửi email thông báo" "External System"
        smsService = softwareSystem "SMS Service" "Dịch vụ gửi SMS thông báo" "External System"

        # ============ RELATIONSHIPS - LEVEL 1 (System Context) ============
        customer -> shoppingService "Tạo đơn hàng và thanh toán" "REST API"
        shoppingService -> paymentGateway "Xử lý thanh toán"
        shoppingService -> emailService "Gửi email xác nhận"
        shoppingService -> smsService "Gửi SMS cập nhật"

        # ============ RELATIONSHIPS - LEVEL 2 (Container) ============
        customer -> shoppingService.webApi "Gửi HTTP requests"
        shoppingService.webApi -> shoppingService.businessLogic "Gọi service methods"
        shoppingService.businessLogic -> shoppingService.dataAccess "Truy cập dữ liệu"
        shoppingService.dataAccess -> shoppingService.database "Persist/Query data (Mongoose)"
        shoppingService.businessLogic -> paymentGateway "Xử lý thanh toán"
        shoppingService.businessLogic -> emailService "Gửi email notifications"
        shoppingService.businessLogic -> smsService "Gửi SMS notifications"

        # ============ RELATIONSHIPS - LEVEL 3 (Component) ============
        customer -> shoppingService.businessLogic.orderController "Gửi requests" "HTTP/REST"
        shoppingService.businessLogic.orderController -> shoppingService.businessLogic.orderService "Gọi createOrder() và payOrder()"
        shoppingService.businessLogic.orderService -> shoppingService.businessLogic.orderModel "Truy cập Order model"
        shoppingService.businessLogic.orderService -> shoppingService.businessLogic.shippingStrategy "Sử dụng Strategy Pattern để tính phí"
        shoppingService.businessLogic.orderService -> shoppingService.businessLogic.paymentFactory "Tạo payment objects"
        shoppingService.businessLogic.orderService -> shoppingService.businessLogic.orderSubject "Gửi notifications"
        shoppingService.businessLogic.orderSubject -> shoppingService.businessLogic.emailObserver "Notify"
        shoppingService.businessLogic.orderSubject -> shoppingService.businessLogic.smsObserver "Notify"
        shoppingService.businessLogic.orderModel -> shoppingService.dataAccess "Liên kết"
        shoppingService.businessLogic.paymentFactory -> paymentGateway "Xử lý thanh toán"
        shoppingService.businessLogic.emailObserver -> emailService "Gửi email"
        shoppingService.businessLogic.smsObserver -> smsService "Gửi SMS"
    }

    views {
        # ============ LEVEL 1: SYSTEM CONTEXT DIAGRAM ============
        systemContext shoppingService "SystemContext" "Sơ đồ System Context - Hiển thị Shopping Service và các hệ thống bên ngoài" {
            include *
            autoLayout tb
        }

        # ============ LEVEL 2: CONTAINER DIAGRAM ============
        container shoppingService "Containers" "Sơ đồ Container - Các container chính bên trong Shopping Service" {
            include *
            autoLayout tb
        }

        # ============ LEVEL 3: COMPONENT DIAGRAM ============
        component shoppingService.businessLogic "Components" "Sơ đồ Component - Chi tiết các components trong Business Logic Layer" {
            include *
            autoLayout tb
        }

        # ============ STYLING ============
        styles {
            # Element Styles
            element "Person" {
                shape person
                icon "https://cdn-icons-png.flaticon.com/512/747/747376.png"
                background "#08427B"
                color "#FFFFFF"
                fontSize 22
                width 200
                height 200
            }
            
            element "Shopping System" {
                shape box
                background "#1168BD"
                color "#FFFFFF"
                fontSize 22
                width 400
                height 225
            }
            
            element "External System" {
                shape box
                background "#999999"
                color "#FFFFFF"
                fontSize 16
                width 300
                height 150
            }
            
            element "Web API" {
                shape box
                background "#438DD5"
                color "#FFFFFF"
                fontSize 14
            }
            
            element "Application" {
                shape box
                background "#3C7FC0"
                color "#FFFFFF"
                fontSize 14
            }
            
            element "Data Access" {
                shape box
                background "#3C7FC0"
                color "#FFFFFF"
                fontSize 14
            }
            
            element "Database" {
                shape cylinder
                background "#438DD5"
                color "#FFFFFF"
                fontSize 14
            }
            
            element "Express Controller" {
                shape box
                background "#85BBF0"
                color "#000000"
                fontSize 12
            }
            
            element "Node.js Service" {
                shape box
                background "#85BBF0"
                color "#000000"
                fontSize 12
            }
            
            element "Mongoose Schema" {
                shape box
                background "#85BBF0"
                color "#000000"
                fontSize 12
            }
            
            element "Strategy Pattern" {
                shape box
                background "#FDB462"
                color "#000000"
                fontSize 12
            }
            
            element "Factory Pattern" {
                shape box
                background "#80B1D3"
                color "#000000"
                fontSize 12
            }
            
            element "Observer Pattern" {
                shape box
                background "#FB8072"
                color "#000000"
                fontSize 12
            }
            
            element "Observer" {
                shape box
                background "#FDB462"
                color "#000000"
                fontSize 12
            }
            
            relationship "Relationship" {
                thickness 2
                color "#707070"
                dashed false
                routing Direct
                fontSize 12
                width 200
            }
        }
    }
}
