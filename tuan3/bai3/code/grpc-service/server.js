const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// 1. Load file .proto
const PROTO_PATH = path.join(__dirname, 'product.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const productProto = grpc.loadPackageDefinition(packageDefinition).ecommerce;

// 2. Mock Database
const products = [
    { id: 1, name: "Laptop Gaming", price: 1500, inStock: true },
    { id: 2, name: "Wireless Mouse", price: 50, inStock: false },
];

// 3. Implement Service function
function getProduct(call, callback) {
    console.log(`[gRPC Server] Received request for Product ID: ${call.request.id}`);
    
    // Tìm product trong DB
    const product = products.find(p => p.id === call.request.id);
    
    if (product) {
        // Trả về thành công (null error)
        callback(null, product);
    } else {
        // Trả về lỗi
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Product not found"
        });
    }
}

// 4. Start Server
function main() {
    const server = new grpc.Server();
    // Map service defined in proto to implementation function
    server.addService(productProto.ProductService.service, { GetProduct: getProduct });
    
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log('[gRPC Server] Running at 0.0.0.0:50051');
        server.start();
    });
}

main();
