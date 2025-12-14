// -------------------------------
// DATA: Quotes Array
// -------------------------------
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Experience is the name everyone gives to their mistakes.", category: "Life" }
];

// -------------------------------
// DOM REFERENCES
// -------------------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");

// -------------------------------
// FUNCTION: Show Random Quote
// -------------------------------
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>— Category: ${quote.category}</small>
  `;
}

// -------------------------------
// FUNCTION: Create Add Quote Form
// -------------------------------
function createAddQuoteForm() {
  const formDiv = document.createElement("div");
  formDiv.className = "form-group";

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";

  addButton.addEventListener("click", addQuote);

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  formContainer.appendChild(formDiv);
}

// -------------------------------
// FUNCTION: Add Quote Dynamically
// -------------------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// -------------------------------
// EVENT LISTENERS
// -------------------------------
newQuoteBtn.addEventListener("click", showRandomQuote);

// -------------------------------
// INIT
// -------------------------------
createAddQuoteForm();