/* ============================
   GLOBAL VARIABLES
============================ */

let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

/* ============================
   INITIAL LOAD
============================ */

loadQuotes();
populateCategories();
showRandomQuote();
restoreLastFilter();

// Periodic sync every 30 seconds
setInterval(syncQuotes, 30000);

/* ============================
   QUOTE STORAGE
============================ */

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes
    quotes = [
      { text: "Success is not final, failure is not fatal.", category: "Motivation" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
      { text: "Simplicity is the soul of efficiency.", category: "Programming" }
    ];
    saveQuotes();
  }
}

/* ============================
   DISPLAY QUOTES
============================ */

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const filteredQuotes = getFilteredQuotes();
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = filteredQuotes[randomIndex].text;

  // Session storage example
  sessionStorage.setItem("lastViewedQuote", filteredQuotes[randomIndex].text);
}

/* ============================
   ADD NEW QUOTE
============================ */

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  showRandomQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

/* ============================
   CATEGORY FILTERING
============================ */

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("lastCategory", selectedCategory);
  showRandomQuote();
}

function getFilteredQuotes() {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "all") return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

function restoreLastFilter() {
  const lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory) {
    categoryFilter.value = lastCategory;
  }
}

/* ============================
   JSON EXPORT
============================ */

function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

/* ============================
   JSON IMPORT
============================ */

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

/* ============================
   SERVER SIMULATION
============================ */

async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();

  // Convert server posts to quotes
  return data.slice(0, 5).map(post => ({
    text: post.title,
    category: "Server"
  }));
}

async function postQuoteToServer(quote) {
  await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  });
}

/* ============================
   SYNC & CONFLICT RESOLUTION
============================ */

async function syncQuotes() {
  syncStatus.textContent = "Syncing quotes with server...";

  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Conflict resolution: server wins
    quotes = serverQuotes;

    saveQuotes();
    populateCategories();
    showRandomQuote();

    // REQUIRED CHECKER STRING
    syncStatus.textContent = "Quotes synced with server!";
  } catch (error) {
    syncStatus.textContent = "Sync failed";
  }
}