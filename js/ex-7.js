// Sample Events
const events = [
  { id: 1, name: "Music Fest", seats: 5 },
  { id: 2, name: "Baking Workshop", seats: 3 },
  { id: 3, name: "Tech Talk", seats: 2 },
];

// Access DOM element using querySelector()
const eventContainer = document.querySelector("#eventContainer");

// Function to display events
function displayEvents() {
  eventContainer.innerHTML = "";

  events.forEach((event) => {
    const card = document.createElement("div");
    card.classList.add("event-card");

    card.innerHTML = `
            <h3>${event.name}</h3>
            <p>Available Seats: ${event.seats}</p>
            <button onclick="register(${event.id})">Register</button>
            <button onclick="cancel(${event.id})">Cancel</button>
        `;

    eventContainer.appendChild(card);
  });
}

// Register user and update UI
function register(id) {
  const event = events.find((e) => e.id === id);

  if (event && event.seats > 0) {
    event.seats--;
    displayEvents();
  } else {
    alert("No seats available!");
  }
}

// Cancel registration and update UI
function cancel(id) {
  const event = events.find((e) => e.id === id);

  if (event) {
    event.seats++;
    displayEvents();
  }
}

// Initial render
displayEvents();
