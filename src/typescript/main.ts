import '../scss/main.scss';
import { initializeAuthPopup } from './auth';

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

function getSourceName(url: string): string {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.replace('www.', '').replace('.com', '');
  return hostname.charAt(0).toUpperCase() + hostname.slice(1);
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
    news.sort((a, b) => new Date(b.datetime_announced).getTime() - new Date(a.datetime_announced).getTime());
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
        <span><a href="${item.source}" target="_blank">${getSourceName(item.source)}</a> – ${date}</span>
      `;
      newsList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchNews();
  initializeAuthPopup();
});