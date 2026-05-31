const events = [
  { id: 1, name: "Music Fest", category: "Music" },
  { id: 2, name: "Baking Workshop", category: "Workshop" },
  { id: 3, name: "Football Match", category: "Sports" },
  { id: 4, name: "Rock Concert", category: "Music" },
];

const container = document.getElementById("eventContainer");
const searchBox = document.getElementById("searchBox");

// Display Events
function displayEvents(eventList) {
  container.innerHTML = "";

  eventList.forEach((event) => {
    const card = document.createElement("div");

    card.innerHTML = `
            <h3>${event.name}</h3>
            <p>Category: ${event.category}</p>
            <button onclick="register(${event.id})">
                Register
            </button>
            <hr>
        `;

    container.appendChild(card);
  });
}

// onclick for Register button
function register(id) {
  const event = events.find((event) => event.id === id);
  alert(`Registered for ${event.name}`);
}

// onchange for Category Filter
function filterEvents() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  if (selectedCategory === "All") {
    displayEvents(events);
  } else {
    const filtered = events.filter(
      (event) => event.category === selectedCategory,
    );
    displayEvents(filtered);
  }
}

// keydown for Search
searchBox.addEventListener("keydown", function () {
  const keyword = searchBox.value.toLowerCase();

  const filtered = events.filter((event) =>
    event.name.toLowerCase().includes(keyword),
  );

  displayEvents(filtered);
});

// Initial Display
displayEvents(events);
