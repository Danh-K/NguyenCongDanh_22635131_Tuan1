const express = require("express");
const cors = require("cors");
const Redis = require("ioredis");

const app = express();
const PORT = process.env.PORT || 8084;
const redis = new Redis({ host: "127.0.0.1", port: 6379 });

app.use(cors());
app.use(express.json());

// ─── Seed tồn kho vào Data Grid ──────────────────────────────────────────────
const INITIAL_STOCK = {
  p1: 50,
  p2: 30,
  p3: 20,
  p4: 100,
  p5: 25,
  p6: 40,
};

async function seedStock() {
  for (const [productId, qty] of Object.entries(INITIAL_STOCK)) {
    const existing = await redis.get(`stock:${productId}`);
    if (!existing) {
      await redis.set(`stock:${productId}`, qty);
      console.log(`✅ [PU4] Seed stock: ${productId} = ${qty}`);
    }
  }
}

// ─── API Routes ──────────────────────────────────────────────────────────────

// GET /stock/:productId – Xem tồn kho từ Data Grid (KHÔNG đọc DB)
app.get("/stock/:productId", async (req, res) => {
  try {
    const stock = await redis.get(`stock:${req.params.productId}`);
    const qty = stock ? parseInt(stock) : 0;

    res.json({
      success: true,
      source: "DataGrid",
      data: {
        productId: req.params.productId,
        stock: qty,
        available: qty > 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /stock/reduce – Giảm tồn kho trực tiếp trên Data Grid (khi checkout)
app.post("/stock/reduce", async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Thiếu productId" });
    }

    const stockKey = `stock:${productId}`;
    const current = await redis.get(stockKey);
    const currentStock = current ? parseInt(current) : 0;

    if (currentStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Hết hàng! Còn lại ${currentStock}, cần ${quantity}`,
      });
    }

    // Giảm tồn kho trực tiếp trong Data Grid (atomic DECRBY)
    const newStock = await redis.decrby(stockKey, quantity);

    res.json({
      success: true,
      source: "DataGrid",
      message: "Giảm tồn kho thành công (KHÔNG gọi DB)",
      data: { productId, reduced: quantity, remaining: newStock },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /stock/reset – Reset tồn kho (dùng cho demo)
app.post("/stock/reset", async (req, res) => {
  try {
    for (const [productId, qty] of Object.entries(INITIAL_STOCK)) {
      await redis.set(`stock:${productId}`, qty);
    }
    res.json({ success: true, message: "Đã reset tồn kho về giá trị ban đầu" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /stock/all – Tất cả tồn kho
app.get("/stock/all/list", async (req, res) => {
  try {
    const stocks = {};
    for (const productId of Object.keys(INITIAL_STOCK)) {
      const s = await redis.get(`stock:${productId}`);
      stocks[productId] = s ? parseInt(s) : 0;
    }
    res.json({ success: true, source: "DataGrid", data: stocks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Health check
app.get("/health", (_, res) => res.json({ status: "ok", service: "PU4-Inventory", port: PORT }));

// ─── Start Server ─────────────────────────────────────────────────────────
redis.on("connect", async () => {
  console.log("✅ [PU4] Kết nối Data Grid (Redis) thành công");
  await seedStock();
});
redis.on("error", (err) => console.error("❌ [PU4] Lỗi kết nối Redis:", err.message));

app.listen(PORT, () => {
  console.log(`🚀 [PU4] Inventory Processing Unit đang chạy: http://localhost:${PORT}`);
});
