const usersOutput = document.getElementById("users-output");
const contentsOutput = document.getElementById("contents-output");
const settingsOutput = document.getElementById("settings-output");
const logOutput = document.getElementById("log-output");
const pluginsOutput = document.getElementById("plugins-output");

function log(message, payload) {
  const line = `[${new Date().toLocaleTimeString()}] ${message}`;
  const text = payload ? `${line}\n${JSON.stringify(payload, null, 2)}` : line;
  logOutput.textContent = `${text}\n\n${logOutput.textContent}`;
}

async function api(url, method = "GET", body) {
  const options = { method, headers: {} };
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `HTTP ${response.status}`);
  }

  return data;
}

function jsonOut(el, data) {
  el.textContent = JSON.stringify(data, null, 2);
}

async function loadUsers() {
  const data = await api("/api/mk/users");
  jsonOut(usersOutput, data);
}

async function loadContents() {
  const data = await api("/api/mk/content");
  jsonOut(contentsOutput, data);
}

async function loadSettings() {
  const data = await api("/api/mk/settings");
  jsonOut(settingsOutput, data);
}

async function loadPlugins() {
  const data = await api("/api/mk/kernel/plugins");
  jsonOut(pluginsOutput, data);
}

function userPayload() {
  return {
    id: document.getElementById("user-id").value || undefined,
    username: document.getElementById("user-username").value,
    email: document.getElementById("user-email").value,
    role: document.getElementById("user-role").value,
    active: document.getElementById("user-active").checked
  };
}

function contentPayload() {
  const tagsRaw = document.getElementById("content-tags").value.trim();
  return {
    id: document.getElementById("content-id").value || undefined,
    title: document.getElementById("content-title").value,
    body: document.getElementById("content-body").value,
    type: document.getElementById("content-type").value,
    tags: tagsRaw ? tagsRaw.split(",").map((x) => x.trim()).filter(Boolean) : []
  };
}

async function safe(action) {
  try {
    await action();
  } catch (error) {
    log("Error", { message: error.message });
  }
}

document.getElementById("load-users").addEventListener("click", () =>
  safe(async () => {
    await loadUsers();
    log("Loaded users");
  })
);

document.getElementById("create-user").addEventListener("click", () =>
  safe(async () => {
    const created = await api("/api/mk/users", "POST", userPayload());
    log("User created", created);
    await loadUsers();
  })
);

document.getElementById("update-user").addEventListener("click", () =>
  safe(async () => {
    const id = document.getElementById("user-id").value;
    if (!id) throw new Error("Nhap user id de update");
    const updated = await api(`/api/mk/users/${id}`, "PUT", userPayload());
    log("User updated", updated);
    await loadUsers();
  })
);

document.getElementById("delete-user").addEventListener("click", () =>
  safe(async () => {
    const id = document.getElementById("user-id").value;
    if (!id) throw new Error("Nhap user id de delete");
    await api(`/api/mk/users/${id}`, "DELETE");
    log("User deleted", { id });
    await loadUsers();
  })
);

document.getElementById("load-contents").addEventListener("click", () =>
  safe(async () => {
    await loadContents();
    log("Loaded contents");
  })
);

document.getElementById("create-content").addEventListener("click", () =>
  safe(async () => {
    const created = await api("/api/mk/content", "POST", contentPayload());
    log("Content created", created);
    await loadContents();
  })
);

document.getElementById("update-content").addEventListener("click", () =>
  safe(async () => {
    const id = document.getElementById("content-id").value;
    if (!id) throw new Error("Nhap content id de update");
    const updated = await api(`/api/mk/content/${id}`, "PUT", contentPayload());
    log("Content updated", updated);
    await loadContents();
  })
);

document.getElementById("publish-content").addEventListener("click", () =>
  safe(async () => {
    const id = document.getElementById("content-id").value;
    if (!id) throw new Error("Nhap content id de publish");
    const actor = document.getElementById("content-actor").value || "system";
    const published = await api(`/api/mk/content/${id}/publish?actor=${encodeURIComponent(actor)}`, "PATCH");
    log("Content published", published);
    await loadContents();
  })
);

document.getElementById("delete-content").addEventListener("click", () =>
  safe(async () => {
    const id = document.getElementById("content-id").value;
    if (!id) throw new Error("Nhap content id de delete");
    await api(`/api/mk/content/${id}`, "DELETE");
    log("Content deleted", { id });
    await loadContents();
  })
);

document.getElementById("upsert-setting").addEventListener("click", () =>
  safe(async () => {
    const key = document.getElementById("setting-key").value;
    if (!key) throw new Error("Nhap setting key");

    const body = {
      value: document.getElementById("setting-value").value,
      description: document.getElementById("setting-description").value
    };

    const result = await api(`/api/mk/settings/${encodeURIComponent(key)}`, "PUT", body);
    log("Setting upserted", result);
    await loadSettings();
  })
);

document.getElementById("load-settings").addEventListener("click", () =>
  safe(async () => {
    await loadSettings();
    log("Loaded settings");
  })
);

document.getElementById("load-plugins").addEventListener("click", () =>
  safe(async () => {
    await loadPlugins();
    log("Loaded plugins");
  })
);

document.querySelectorAll(".activate-plugin").forEach((btn) => {
  btn.addEventListener("click", () =>
    safe(async () => {
      const pluginCode = btn.dataset.plugin;
      const result = await api(`/api/mk/kernel/plugins/${encodeURIComponent(pluginCode)}/activate`, "PATCH");
      log("Plugin activated", result);
      await loadPlugins();
    })
  );
});

safe(async () => {
  await Promise.all([loadPlugins(), loadUsers(), loadContents(), loadSettings()]);
  log("Initial data loaded");
});
