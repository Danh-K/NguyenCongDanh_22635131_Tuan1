const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// 1. Load file .proto để biết cấu trúc
const PROTO_PATH = path.join(__dirname, 'product.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const productProto = grpc.loadPackageDefinition(packageDefinition).ecommerce;

// 2. Tạo Client kết nối đến Server
const client = new productProto.ProductService('localhost:50051', grpc.credentials.createInsecure());

// 3. Gọi hàm RPC
const requestId = 1; // Thử đổi thành 2 hoặc 99 để test
console.log(`[Client] Calling GetProduct with ID: ${requestId}`);

client.GetProduct({ id: requestId }, (err, response) => {
    if (err) {
        console.error('[Client] Error:', err.message);
    } else {
        console.log('[Client] Response:', response);
        // Kết quả sẽ là object JSON, nhưng thực tế truyền qua mạng là binary
    }
});
