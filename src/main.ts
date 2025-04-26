import './scss/main.scss';

interface Data {
  symbol: string;
  closePrice: string;
  openPrice: string;
  volume: string;
}

interface News {
  news_id: number;
  title: string;
  datetime_announced: string;
  source: string;
}

// Map to store previous close prices for each symbol
const priceHistory: { [symbol: string]: number } = {};

// Connect to WebSocket server
const ws = new WebSocket('ws://localhost:8080'); // Corrected port to 8080

ws.onopen = () => {
  console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
  try {
    const data: Data = JSON.parse(event.data);
    updateTable(data);
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Function to update the table with new data
function updateTable(data: Data) {
  const tbody = document.getElementById('assets-table-body') as HTMLTableSectionElement;
  if (!tbody) {
    console.error('Table body element not found');
    return;
  }

  // Validate data
  const closePrice = parseFloat(data.closePrice);
  const openPrice = parseFloat(data.openPrice);
  const volume = parseFloat(data.volume);
  if (isNaN(closePrice) || isNaN(openPrice) || isNaN(volume)) {
    console.warn(`Invalid data for symbol ${data.symbol}:`, data);
    return;
  }

  // Calculate percentage change
  const percentageChange = ((closePrice / openPrice - 1) * 100).toFixed(2);
  const formattedVolume = volume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Check if the symbol already exists in the table
  let row = document.getElementById(`row-${data.symbol}`) as HTMLTableRowElement | null;
  if (!row) {
    // Create a new row if it doesn't exist
    row = document.createElement('tr') as HTMLTableRowElement;
    row.id = `row-${data.symbol}`;
    row.innerHTML = `
      <td>${data.symbol.toUpperCase()}</td>
      <td class="price">${closePrice.toFixed(2)}</td>
      <td class="percentage">${percentageChange}%</td>
      <td>${formattedVolume}</td>
    `;
    tbody.appendChild(row);
  } else {
    // Update existing row
    row.cells[1].textContent = closePrice.toFixed(2);
    row.cells[2].textContent = `${percentageChange}%`;
    row.cells[3].textContent = formattedVolume;
  }

  // Apply color for percentage change (cells[2])
  row.cells[2].classList.remove('positive', 'negative');
  row.cells[2].classList.add(parseFloat(percentageChange) >= 0 ? 'positive' : 'negative');

  // Apply color for close price (cells[1]) based on previous price
  const previousPrice = priceHistory[data.symbol];
  if (previousPrice !== undefined) {
    if (closePrice > previousPrice) {
      row.cells[1].classList.remove('negative');
      row.cells[1].classList.add('positive');
    } else if (closePrice < previousPrice) {
      row.cells[1].classList.remove('positive');
      row.cells[1].classList.add('negative');
    } 
  }

  priceHistory[data.symbol] = closePrice;
}

// Fetch and render news
async function fetchNews() {
  try {
    const response = await fetch('/api/news');
    const news: News[] = await response.json();
    const newsList = document.getElementById('news-list') as HTMLUListElement;
    if (!newsList) {
      console.error('News list element not found');
      return;
    }
    newsList.innerHTML = ''; // Clear existing news
    news.forEach(item => {
      const li = document.createElement('li');
      const date = new Date(item.datetime_announced).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      li.innerHTML = `
        <strong>${item.title}</strong>
        <span><a href="${item.source}" target="_blank">Source</a> – ${date}</span>
      `;
      newsList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

// Auth popup logic
function initializeAuthPopup() {
  const authPopup = document.getElementById('auth-popup') as HTMLElement;
  const loginForm = document.getElementById('login-form') as HTMLElement;
  const registerForm = document.getElementById('register-form') as HTMLElement;
  const tabs = document.querySelectorAll('.auth-tabs .tab') as NodeListOf<HTMLElement>;
  const closeBtn = document.querySelector('.auth-popup .close-btn') as HTMLElement;

  // Assume header has login/register buttons
  const loginBtn = document.querySelector('.header-login-btn') as HTMLElement;
  const registerBtn = document.querySelector('.header-register-btn') as HTMLElement;

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      authPopup.style.display = 'block';
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      tabs.forEach(tab => tab.classList.remove('active'));
      tabs[0].classList.add('active');
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      authPopup.style.display = 'block';
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      tabs.forEach(tab => tab.classList.remove('active'));
      tabs[1].classList.add('active');
    });
  }

  closeBtn.addEventListener('click', () => {
    authPopup.style.display = 'none';
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
      } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
      }
    });
  });

  loginForm.querySelector('form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = (loginForm.querySelector('input[type="text"]') as HTMLInputElement).value;
    const password = (loginForm.querySelector('input[type="password"]') as HTMLInputElement).value;
    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await response.json();
      if (response.ok) {
        alert('Login successful');
        authPopup.style.display = 'none';
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred');
    }
  });

  registerForm.querySelector('form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = (registerForm.querySelector('input[type="text"]') as HTMLInputElement).value;
    const email = (registerForm.querySelector('input[type="email"]') as HTMLInputElement).value;
    const password = (registerForm.querySelector('input[type="password"]') as HTMLInputElement).value;
    try {
      const response = await fetch('http://localhost:5000/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const result = await response.json();
      if (response.ok) {
        alert('Registration successful');
        authPopup.style.display = 'none';
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred');
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchNews();
  initializeAuthPopup();
});