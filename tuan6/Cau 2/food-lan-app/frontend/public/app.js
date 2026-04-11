const logEl = document.getElementById("log");
const form = document.getElementById("order-form");

function logStep(title, payload) {
  const line = `\n[${new Date().toLocaleTimeString()}] ${title}\n${JSON.stringify(payload, null, 2)}\n`;
  logEl.textContent += line;
  logEl.scrollTop = logEl.scrollHeight;
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${url}`);
  }

  return data;
}

async function patchJson(url, body) {
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${url}`);
  }

  return data;
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  logEl.textContent = "";

  const customerName = document.getElementById("customerName").value.trim();
  const address = document.getElementById("address").value.trim();
  const items = document
    .getElementById("items")
    .value.split(",")
    .map(v => v.trim())
    .filter(Boolean);
  const total = Number(document.getElementById("total").value || 0);

  try {
    const { ORDER_SERVICE_URL, PAYMENT_SERVICE_URL, RESTAURANT_SERVICE_URL, DELIVERY_SERVICE_URL } = window.APP_CONFIG;

    const order = await postJson(`${ORDER_SERVICE_URL}/orders`, {
      customerName,
      address,
      items,
      total
    });
    logStep("Order created", order);

    const payment = await postJson(`${PAYMENT_SERVICE_URL}/payments/charge`, {
      orderId: order.id,
      amount: total,
      method: "cash"
    });
    logStep("Payment done", payment);

    const kitchen = await postJson(`${RESTAURANT_SERVICE_URL}/kitchen/prepare`, {
      orderId: order.id,
      items
    });
    logStep("Kitchen prepared", kitchen);

    const delivery = await postJson(`${DELIVERY_SERVICE_URL}/deliveries/create`, {
      orderId: order.id,
      address
    });
    logStep("Delivery started", delivery);

    const delivered = await patchJson(`${DELIVERY_SERVICE_URL}/deliveries/${order.id}/complete`, {});
    logStep("Delivery completed", delivered);

    const completedOrder = await patchJson(`${ORDER_SERVICE_URL}/orders/${order.id}/status`, {
      status: "COMPLETED"
    });
    logStep("Order completed", completedOrder);
  } catch (error) {
    logStep("Error", { message: error.message });
  }
});
