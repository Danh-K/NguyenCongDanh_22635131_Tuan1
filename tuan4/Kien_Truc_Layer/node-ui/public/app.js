// Layer Architecture UI - CRUD Operations
const API_BASE = '/api';
const BACKEND_API = {
  users: `${API_BASE}/admin/users`,
  content: `${API_BASE}/admin/contents`,
  settings: `${API_BASE}/admin/settings`
};

let logs = [];
const MAX_LOGS = 100;

// ==================== Tab Switching ====================
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Deactivate all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(`${tabName}-tab`).classList.add('active');
  event.target.classList.add('active');
  
  // Load data when switching to a tab
  if (tabName === 'users') loadUsers();
  if (tabName === 'content') loadContent();
  if (tabName === 'settings') loadSettings();
}

// ==================== Logging System ====================
function addLog(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = `[${timestamp}] ${message}`;
  logs.unshift({ message: logEntry, type });
  
  if (logs.length > MAX_LOGS) logs.pop();
  
  const logsList = document.getElementById('logsList');
  if (logsList) {
    logsList.innerHTML = logs.map(log => 
      `<div class="log-entry ${log.type}">${log.message}</div>`
    ).join('') || '<p class="info">No logs</p>';
  }
  
  console.log(logEntry);
}

function clearLogs() {
  logs = [];
  document.getElementById('logsList').innerHTML = '<p class="info">Logs cleared</p>';
  addLog('Logs cleared', 'success');
}

// ==================== Backend Health Check ====================
async function checkBackendStatus() {
  try {
    const response = await fetch(`${BACKEND_API.users}`, { method: 'HEAD' });
    document.getElementById('backendStatus').textContent = '✅ Connected';
    document.getElementById('backendStatus').style.color = '#28a745';
    return true;
  } catch (err) {
    document.getElementById('backendStatus').textContent = '❌ Disconnected';
    document.getElementById('backendStatus').style.color = '#dc3545';
    return false;
  }
}

// ==================== Users CRUD ====================
async function loadUsers() {
  try {
    addLog('Loading users...', 'info');
    const response = await fetch(BACKEND_API.users);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const users = await response.json();
    displayUsers(users);
    addLog(`Loaded ${users.length} users`, 'success');
  } catch (error) {
    addLog(`Error loading users: ${error.message}`, 'error');
    document.getElementById('usersList').innerHTML = 
      `<p class="error">Failed to load: ${error.message}</p>`;
  }
}

function displayUsers(users) {
  const container = document.getElementById('usersList');
  if (!users || users.length === 0) {
    container.innerHTML = '<p class="info">No users found</p>';
    return;
  }
  
  container.innerHTML = users.map(user => `
    <div class="item-card">
      <div class="item-header">
        <strong>${user.username}</strong>
        <span class="status-badge ${user.status?.toLowerCase()}">${user.status || 'ACTIVE'}</span>
      </div>
      <div class="item-body">
        <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
        <p><strong>Name:</strong> ${user.fullName || 'N/A'}</p>
        <p><strong>ID:</strong> ${user.id || 'N/A'}</p>
      </div>
      <div class="item-actions">
        <button onclick="editUser('${user.id}')" class="btn btn-sm btn-info">Edit</button>
        <button onclick="deleteUser('${user.id}')" class="btn btn-sm btn-danger">Delete</button>
      </div>
    </div>
  `).join('');
}

async function handleUserCreate(event) {
  event.preventDefault();
  
  const user = {
    username: document.getElementById('userUsername').value,
    email: document.getElementById('userEmail').value,
    fullName: document.getElementById('userFullName').value,
    status: document.getElementById('userStatus').value
  };
  
  try {
    addLog(`Creating user: ${user.username}...`, 'info');
    const response = await fetch(BACKEND_API.users, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const created = await response.json();
    addLog(`User created: ${created.username} (${created.id})`, 'success');
    event.target.reset();
    loadUsers();
  } catch (error) {
    addLog(`Error creating user: ${error.message}`, 'error');
  }
}

async function deleteUser(userId) {
  if (!confirm('Delete this user?')) return;
  
  try {
    addLog(`Deleting user: ${userId}...`, 'info');
    const response = await fetch(`${BACKEND_API.users}/${userId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    addLog(`User deleted: ${userId}`, 'success');
    loadUsers();
  } catch (error) {
    addLog(`Error deleting user: ${error.message}`, 'error');
  }
}

// ==================== Content CRUD ====================
async function loadContent() {
  try {
    addLog('Loading content...', 'info');
    const response = await fetch(BACKEND_API.content);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const items = await response.json();
    displayContent(items);
    addLog(`Loaded ${items.length} content items`, 'success');
  } catch (error) {
    addLog(`Error loading content: ${error.message}`, 'error');
    document.getElementById('contentList').innerHTML = 
      `<p class="error">Failed to load: ${error.message}</p>`;
  }
}

function displayContent(items) {
  const container = document.getElementById('contentList');
  if (!items || items.length === 0) {
    container.innerHTML = '<p class="info">No content found</p>';
    return;
  }
  
  container.innerHTML = items.map(item => `
    <div class="item-card">
      <div class="item-header">
        <strong>${item.title}</strong>
        <span class="status-badge ${item.status?.toLowerCase() || 'draft'}">${item.status || 'DRAFT'}</span>
      </div>
      <div class="item-body">
        <p><strong>Category:</strong> ${item.category || 'N/A'}</p>
        <p><strong>Author:</strong> ${item.author || 'N/A'}</p>
        <p><strong>Description:</strong> ${item.description || 'N/A'}</p>
        <p><strong>ID:</strong> ${item.id || 'N/A'}</p>
      </div>
      <div class="item-actions">
        <button onclick="publishContent('${item.id}')" class="btn btn-sm btn-success">Publish</button>
        <button onclick="editContent('${item.id}')" class="btn btn-sm btn-info">Edit</button>
        <button onclick="deleteContent('${item.id}')" class="btn btn-sm btn-danger">Delete</button>
      </div>
    </div>
  `).join('');
}

async function handleContentCreate(event) {
  event.preventDefault();
  
  const contentItem = {
    title: document.getElementById('contentTitle').value,
    description: document.getElementById('contentDescription').value,
    category: document.getElementById('contentCategory').value,
    author: document.getElementById('contentAuthor').value,
    status: document.getElementById('contentStatus').value
  };
  
  try {
    addLog(`Creating content: ${contentItem.title}...`, 'info');
    const response = await fetch(BACKEND_API.content, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentItem)
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const created = await response.json();
    addLog(`Content created: ${created.title} (${created.id})`, 'success');
    event.target.reset();
    loadContent();
  } catch (error) {
    addLog(`Error creating content: ${error.message}`, 'error');
  }
}

async function publishContent(contentId) {
  try {
    addLog(`Publishing content: ${contentId}...`, 'info');
    const response = await fetch(`${BACKEND_API.content}/${contentId}/publish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const updated = await response.json();
    addLog(`Content published: ${updated.title}`, 'success');
    loadContent();
  } catch (error) {
    addLog(`Error publishing content: ${error.message}`, 'error');
  }
}

async function deleteContent(contentId) {
  if (!confirm('Delete this content?')) return;
  
  try {
    addLog(`Deleting content: ${contentId}...`, 'info');
    const response = await fetch(`${BACKEND_API.content}/${contentId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    addLog(`Content deleted: ${contentId}`, 'success');
    loadContent();
  } catch (error) {
    addLog(`Error deleting content: ${error.message}`, 'error');
  }
}

// ==================== Settings CRUD ====================
async function loadSettings() {
  try {
    addLog('Loading settings...', 'info');
    const response = await fetch(BACKEND_API.settings);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const settings = await response.json();
    displaySettings(settings);
    addLog(`Loaded ${settings.length} settings`, 'success');
  } catch (error) {
    addLog(`Error loading settings: ${error.message}`, 'error');
    document.getElementById('settingsList').innerHTML = 
      `<p class="error">Failed to load: ${error.message}</p>`;
  }
}

function displaySettings(settings) {
  const container = document.getElementById('settingsList');
  if (!settings || settings.length === 0) {
    container.innerHTML = '<p class="info">No settings found</p>';
    return;
  }
  
  container.innerHTML = settings.map(setting => `
    <div class="item-card">
      <div class="item-header">
        <strong>${setting.key || 'N/A'}</strong>
      </div>
      <div class="item-body">
        <p><strong>Value:</strong> ${setting.value || 'N/A'}</p>
        <p><strong>Description:</strong> ${setting.description || 'N/A'}</p>
      </div>
      <div class="item-actions">
        <button onclick="editSetting('${setting.key}')" class="btn btn-sm btn-info">Edit</button>
      </div>
    </div>
  `).join('');
}

async function handleSettingUpsert(event) {
  event.preventDefault();
  
  const key = document.getElementById('settingKey').value;
  const settingData = {
    value: document.getElementById('settingValue').value,
    description: document.getElementById('settingDesc').value
  };
  
  try {
    addLog(`Updating setting: ${key}...`, 'info');
    const response = await fetch(`${BACKEND_API.settings}/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingData)
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const updated = await response.json();
    addLog(`Setting updated: ${key}`, 'success');
    event.target.reset();
    loadSettings();
  } catch (error) {
    addLog(`Error updating setting: ${error.message}`, 'error');
  }
}

// ==================== Edit Functions (Placeholders) ====================
function editUser(userId) {
  addLog(`Edit user feature: ${userId} (not yet implemented)`, 'info');
}

function editContent(contentId) {
  addLog(`Edit content feature: ${contentId} (not yet implemented)`, 'info');
}

function editSetting(settingKey) {
  addLog(`Edit setting feature: ${settingKey} (not yet implemented)`, 'info');
}

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
  addLog('Layer Architecture UI loaded', 'success');
  checkBackendStatus();
  loadUsers();
  
  // Check backend status every 10 seconds
  setInterval(checkBackendStatus, 10000);
});
