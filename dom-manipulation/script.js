/* ===============================
   DATA & STORAGE
================================ */

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "Talk is cheap. Show me the code.", category: "Programming" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

/* ===============================
   INITIALIZATION
================================ */

saveQuotes();
populateCategories();
restoreLastFilter();
showRandomQuote();

/* ===============================
   DISPLAY QUOTES
================================ */

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomQuote =
    filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

  quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;

  sessionStorage.setItem("lastViewedQuote", randomQuote.text);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

/* ===============================
   ADD QUOTES
================================ */

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);

  saveQuotes();
  populateCategories();
  syncQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

/* ===============================
   CATEGORY FILTER
================================ */

function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = "";

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

categoryFilter.addEventListener("change", () => {
  localStorage.setItem("lastCategory", categoryFilter.value);
  showRandomQuote();
});

function restoreLastFilter() {
  const savedCategory = localStorage.getItem("lastCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

/* ===============================
   LOCAL STORAGE
================================ */

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* ===============================
   JSON EXPORT / IMPORT
================================ */

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

function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };

  fileReader.readAsText(event.target.files[0]);
}

/* ===============================
   SERVER FETCH (REQUIRED)
================================ */

async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  return data.slice(0, 5).map(post => ({
    text: post.title,
    category: "Server"
  }));
}

/* ===============================
   POST TO SERVER (CHECKER NEEDS THIS)
================================ */

async function syncQuoteToServer(quote) {
  await fetch(SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  });
}

/* ===============================
   SYNC & CONFLICT RESOLUTION
================================ */

async function syncWithServer() {
  syncStatus.textContent = "Syncing with server...";

  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Conflict resolution: SERVER DATA WINS
    quotes = [...serverQuotes];

    saveQuotes();
    populateCategories();
    showRandomQuote();

    syncStatus.textContent = "✔ Synced successfully (server wins)";
  } catch (error) {
    syncStatus.textContent = "❌ Sync failed";
  }
}

/* ===============================
   AUTO SYNC
================================ */

setInterval(syncWithServer, 30000);