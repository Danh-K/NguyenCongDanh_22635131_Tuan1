const express = require('express');
const app = express();
const PORT = 3000;

// Data giả lập
const products = [
    { id: 1, name: "Laptop Gaming", price: 1500, category: "Electronics" },
    { id: 2, name: "Wireless Mouse", price: 50, category: "Accessories" },
    { id: 3, name: "Mechanical Keyboard", price: 100, category: "Accessories" }
];

// 1. GET all products
app.get('/products', (req, res) => {
    // REST thường trả về toàn bộ resource
    res.json(products);
});

// 2. GET product by ID
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Resource-based REST API running on http://localhost:${PORT}`);
    console.log(`Try GET http://localhost:${PORT}/products`);
});
