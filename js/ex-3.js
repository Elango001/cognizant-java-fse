const events = [
  {
    name: "Music Concert",
    date: "2026-06-15",
    seats: 50,
  },
  {
    name: "Tech Workshop",
    date: "2025-01-10",
    seats: 20,
  },
  {
    name: "Art Exhibition",
    date: "2026-07-01",
    seats: 0,
  },
];

const eventContainer = document.getElementById("events");

const today = new Date();

events.forEach((event) => {
  const eventDate = new Date(event.date);

  if (eventDate >= today && event.seats > 0) {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${event.name}</h3>
      <p>Date: ${event.date}</p>
      <p>Seats Available: ${event.seats}</p>
      <button onclick="registerEvent('${event.name}')">
        Register
      </button>
    `;
    eventContainer.appendChild(div);
  } else {
    console.log(`${event.name} is not available`);
  }
});

function registerEvent(eventName) {
  try {
    const event = events.find((e) => e.name === eventName);

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.seats <= 0) {
      throw new Error("No seats available");
    }

    event.seats--;

    alert(`Successfully registered for ${event.name}`);
  } catch (error) {
    alert(`Registration failed: ${error.message}`);
  }
}
