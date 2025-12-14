/* -------------------------
   DATA & STORAGE
-------------------------- */

// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* -------------------------
   DISPLAY QUOTES
-------------------------- */

function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Load last viewed quote (sessionStorage)
function loadLastQuote() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").textContent =
      `"${quote.text}" — ${quote.category}`;
  }
}

/* -------------------------
   ADD NEW QUOTE
-------------------------- */

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

/* -------------------------
   EXPORT QUOTES (JSON)
-------------------------- */

function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

/* -------------------------
   IMPORT QUOTES (JSON)
-------------------------- */

function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format.");
        return;
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error reading JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

/* -------------------------
   EVENT LISTENERS
-------------------------- */

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize app
loadLastQuote();