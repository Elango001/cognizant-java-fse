const portalName = "Local Community Event Portal";
console.log("Welcome to the Community Portal");

const eventName = "Neighborhood Market";
const eventDate = "2026-06-12";
let availableSeats = 42;
const eventInfo = `${eventName} on ${eventDate} has ${availableSeats} seats.`;
console.log(eventInfo);

// Event model for portal entries.
class Event {
  constructor({ id, name, date, category, location, seats }) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.category = category;
    this.location = location;
    this.seats = seats;
  }
}

// Check if an event still has seats.
Event.prototype.checkAvailability = function () {
  return this.seats > 0;
};

const events = [
  new Event({
    id: 1,
    name: "Sunset Jazz Night",
    date: "2026-06-11",
    category: "music",
    location: "Central Park",
    seats: 20,
  }),
  new Event({
    id: 2,
    name: "River Run Marathon",
    date: "2026-06-05",
    category: "sports",
    location: "Riverside",
    seats: 0,
  }),
  new Event({
    id: 3,
    name: "Baking Workshop",
    date: "2026-06-20",
    category: "workshop",
    location: "Civic Hall",
    seats: 12,
  }),
  new Event({
    id: 4,
    name: "Neighborhood Clean Up",
    date: "2026-05-15",
    category: "community",
    location: "Old Town",
    seats: 18,
  }),
];

events.push(
  new Event({
    id: 5,
    name: "Community Choir",
    date: "2026-06-28",
    category: "music",
    location: "Civic Hall",
    seats: 24,
  }),
);

const [firstKey, firstValue] = Object.entries(events[0])[0];
console.log("Event sample:", firstKey, firstValue);

const musicCards = events
  .filter((eventItem) => eventItem.category === "music")
  .map((eventItem) => `Workshop on ${eventItem.name}`);
console.log("Formatted cards:", musicCards);

const registrationCounters = new Map();
// Closure factory to count registrations per category.
function createCategoryCounter(category) {
  let total = 0;
  return function incrementCounter() {
    total += 1;
    console.log(`Registrations for ${category}:`, total);
    return total;
  };
}

// Add a new event to the list.
function addEvent(eventData = {}) {
  events.push(new Event(eventData));
  return events;
}

// Register a user for an event with basic rules.
function registerUser(eventId) {
  try {
    const eventItem = events.find((item) => item.id === eventId);
    if (!eventItem) {
      throw new Error("Event not found");
    }

    const today = new Date();
    const eventDateObj = new Date(eventItem.date);
    if (eventDateObj < today) {
      throw new Error("Event is in the past");
    }

    if (!eventItem.checkAvailability()) {
      throw new Error("Event is full");
    }

    eventItem.seats--;
    availableSeats++;

    if (!registrationCounters.has(eventItem.category)) {
      registrationCounters.set(
        eventItem.category,
        createCategoryCounter(eventItem.category),
      );
    }

    registrationCounters.get(eventItem.category)();
    return { success: true, eventItem };
  } catch (error) {
    console.error("Registration error:", error.message);
    return { success: false, message: error.message };
  }
}

// Undo a registration and restore seats.
function cancelRegistration(eventId) {
  const eventItem = events.find((item) => item.id === eventId);
  if (eventItem) {
    eventItem.seats++;
  }
}

// Filter events by category.
function filterEventsByCategory(category = "all") {
  if (category === "all") {
    return [...events];
  }
  return events.filter((item) => item.category === category);
}

// Generic filter helper.
function filterEvents(list, predicate) {
  return list.filter(predicate);
}

// Show only upcoming events with seats.
function getUpcomingAvailableEvents(list) {
  const today = new Date();
  return list.filter((eventItem) => {
    const eventDateObj = new Date(eventItem.date);
    if (eventDateObj < today || eventItem.seats <= 0) {
      return false;
    }
    return true;
  });
}

const eventListEl = document.querySelector("#eventList");
const eventSummaryEl = document.querySelector("#eventSummary");
const categoryFilterEl = document.querySelector("#categoryFilter");
const locationFilterEl = document.querySelector("#locationFilter");
const searchInputEl = document.querySelector("#searchInput");
const spinnerEl = document.querySelector("#loadingSpinner");
const selectedEventEl = document.querySelector("#selectedEvent");

// Render event cards into the grid.
function renderEvents(list) {
  eventListEl.innerHTML = "";

  list.forEach((eventItem) => {
    const eventDateObj = new Date(eventItem.date);
    if (eventDateObj < new Date() || eventItem.seats <= 0) {
      return;
    } else {
      const { name, date, category, location, seats } = eventItem;

      const card = document.createElement("div");
      card.className = "event-card";

      const title = document.createElement("h4");
      title.textContent = name;

      const meta = document.createElement("div");
      meta.className = "event-meta";
      meta.innerHTML = `
        <span>Date: ${date}</span>
        <span>Category: ${category}</span>
        <span>Location: ${location}</span>
        <span>Seats left: ${seats}</span>
      `;

      const actions = document.createElement("div");
      actions.className = "event-actions";

      const registerBtn = document.createElement("button");
      registerBtn.className = "register-btn";
      registerBtn.textContent = "Register";
      // Register button click handler
      registerBtn.onclick = () => {
        const result = registerUser(eventItem.id);
        if (result.success) {
          renderEvents(applyFilters());
          updateSummary();
        } else {
          alert(result.message);
        }
      };

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "cancel-btn";
      cancelBtn.textContent = "Cancel";
      // Cancel button click handler
      cancelBtn.onclick = () => {
        cancelRegistration(eventItem.id);
        renderEvents(applyFilters());
        updateSummary();
      };

      actions.append(registerBtn, cancelBtn);
      card.append(title, meta, actions);
      eventListEl.append(card);
    }
  });

  if (window.$) {
    $(".event-card").hide().fadeIn(300);
  }
}

// Update the summary text and select options.
function updateSummary() {
  const visibleEvents = applyFilters();
  eventSummaryEl.textContent = `Showing ${visibleEvents.length} upcoming events.`;
  updateEventSelect(visibleEvents);
}

// Sync the event select options in the form.
function updateEventSelect(list) {
  if (!selectedEventEl) {
    return;
  }
  selectedEventEl.innerHTML = '<option value="">Choose an event</option>';
  list.forEach((eventItem) => {
    const option = document.createElement("option");
    option.value = String(eventItem.id);
    option.textContent = `${eventItem.name} (${eventItem.location})`;
    selectedEventEl.append(option);
  });
}

// Apply category, location, and text filters.
function applyFilters() {
  const categoryValue = categoryFilterEl.value.toLowerCase();
  const locationValue = locationFilterEl.value.toLowerCase();
  const searchValue = searchInputEl.value.trim().toLowerCase();

  let filtered = [...filterEventsByCategory(categoryValue)];
  filtered = filterEvents(filtered, (eventItem) => {
    const matchesLocation =
      locationValue === "all" ||
      eventItem.location.toLowerCase() === locationValue;
    const matchesSearch =
      searchValue === "" || eventItem.name.toLowerCase().includes(searchValue);
    return matchesLocation && matchesSearch;
  });

  return getUpcomingAvailableEvents(filtered);
}

// Respond to filter changes and animate cards.
function handleCategoryChange() {
  if (window.$) {
    $(".event-card")
      .fadeOut(150)
      .promise()
      .done(() => {
        const filtered = applyFilters();
        renderEvents(filtered);
        updateSummary();
      });
    return;
  }

  const filtered = applyFilters();
  renderEvents(filtered);
  updateSummary();
}

// Attach filter listeners for location and search.
function attachFilters() {
  locationFilterEl.addEventListener("change", handleCategoryChange);
  // Keyboard search handler
  searchInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCategoryChange();
    }
  });
}

// Initial render after data or filters change.
function renderInitialEvents() {
  const filtered = applyFilters();
  renderEvents(filtered);
  updateSummary();
}

// Validate a form field and show an inline error.
function validateFormField(inputEl, messageEl, validator, message) {
  if (!validator(inputEl.value.trim())) {
    messageEl.textContent = message;
    return false;
  }
  messageEl.textContent = "";
  return true;
}

// Handle registration form submit.
function registerCheck(event) {
  event.preventDefault();
  console.log("Form submission started");

  const form = event.currentTarget;
  const nameEl = form.elements["Name"];
  const emailEl = form.elements["Email"];
  const eventTypeEl = form.elements["event-type"];
  const selectedEvent = form.elements["selectedEvent"];
  const formMessage = document.getElementById("formMessage");

  const nameOk = validateFormField(
    nameEl,
    document.getElementById("nameError"),
    (value) => value.length >= 2,
    "Please enter your full name.",
  );

  const emailOk = validateFormField(
    emailEl,
    document.getElementById("emailError"),
    (value) => value.includes("@"),
    "Please enter a valid email address.",
  );

  const typeOk = validateFormField(
    eventTypeEl,
    document.getElementById("typeError"),
    (value) => value !== "",
    "Select an event type.",
  );

  const eventOk = validateFormField(
    selectedEvent,
    document.getElementById("eventError"),
    (value) => value !== "",
    "Select a specific event.",
  );

  if (!nameOk || !emailOk || !typeOk || !eventOk) {
    formMessage.textContent = "Please fix the highlighted fields.";
    formMessage.style.color = "#dc2626";
    return;
  }

  console.log("Form values:", {
    name: nameEl.value,
    email: emailEl.value,
    eventType: eventTypeEl.value,
    eventId: selectedEvent.value,
  });

  submitRegistration({
    name: nameEl.value,
    email: emailEl.value,
    eventType: eventTypeEl.value,
    eventId: selectedEvent.value,
  });

  let out = document.getElementById("regOutput");
  out.innerText = "Registration successful! We'll see you at the event.";
  out.style.color = "green";
  out.style.fontWeight = "bold";
  out.style.display = "block";
  out.style.marginTop = "8px";
}

// Send registration data to the mock API.
function submitRegistration(payload) {
  const formMessage = document.getElementById("formMessage");
  console.log("Submitting registration payload", payload);

  setTimeout(() => {
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Registration failed");
        }
        return response.json();
      })
      .then(() => {
        formMessage.textContent = "Registration sent successfully.";
        formMessage.style.color = "#16a34a";
      })
      .catch((error) => {
        formMessage.textContent = error.message;
        formMessage.style.color = "#dc2626";
      });
  }, 600);
}

// Validate phone input on blur.
function validatePhone(input) {
  const pattern = /^[0-9]{10}$/;
  console.log("Phone blur - value entered:", input.value);
  if (!pattern.test(input.value)) {
    alert("Please enter a valid 10-digit phone number.");
    input.value = "";
  }
}

// Show fee based on event type selection.
function showFee(select) {
  let feeEl = document.getElementById("fee");
  console.log("Event type selected:", select.value);
  const fees = {
    conference: "Fees: ₹500",
    workshop: "Fees: ₹300",
    seminar: "Fees: ₹200",
  };
  feeEl.innerText = fees[select.value] || "Please select an event type";
}

// Update live character count for feedback.
function countCharacters() {
  let feedback = document.getElementById("feedbackText").value;
  document.getElementById("charCount").innerText =
    "Characters: " + feedback.length;
}

// Handle feedback submission.
function confirmFeedback(event) {
  event.preventDefault();
  console.log("Feedback submitted");
  let reply = document.getElementById("feedbackReply");
  reply.innerText = "Feedback submitted successfully! Thank you.";
  reply.style.color = "green";
}

// Toggle the image zoom state.
function toggleEnlarge(img) {
  img.classList.toggle("enlarged");
  console.log(
    "Image double-clicked, enlarged:",
    img.classList.contains("enlarged"),
  );
}

// Report when the promo video can play.
function videoReady() {
  console.log("Video canplay event fired");
  document.getElementById("videoStatus").innerText = "Video ready to play";
  document.getElementById("videoStatus").style.color = "green";
}

let contentFilled = false;
// Track whether the user typed into a form.
function contentAvailable() {
  contentFilled = true;
}

// Warn before leaving with unsaved input.
window.onbeforeunload = function () {
  if (contentFilled) {
    return "You have unsaved changes. Are you sure you want to leave?";
  }
};

// Persist the selected event type.
function storePreferences() {
  let eventType = document.getElementById("event-type").value;
  localStorage.setItem("preferredEvent", eventType);
  sessionStorage.setItem("preferredEvent", eventType);
  console.log("Preference stored:", eventType);
}

// Restore the saved event type from storage.
function loadPreferences() {
  let saved = localStorage.getItem("preferredEvent");
  if (saved) {
    document.getElementById("event-type").value = saved;
    console.log("Preference loaded from localStorage:", saved);
  }
}

// Clear stored preferences.
function clearPreferences() {
  localStorage.clear();
  sessionStorage.clear();
  document.getElementById("event-type").value = "";
  console.log("Preferences cleared");
  alert("Preferences cleared.");
}

// Locate the user and show coordinates.
function findLocation() {
  let output = document.getElementById("locationOutput");
  output.innerText = "Locating...";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      // Success callback
      function (position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        console.log("Location found:", lat, lon);
        output.innerText =
          "Your coordinates: " + lat.toFixed(4) + ", " + lon.toFixed(4);
      },
      // Error callback
      function (error) {
        console.error("Geolocation error:", error.message);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            output.innerText = "Error: Location permission denied.";
            break;
          case error.POSITION_UNAVAILABLE:
            output.innerText = "Error: Location information unavailable.";
            break;
          case error.TIMEOUT:
            output.innerText = "Error: Location request timed out.";
            break;
          default:
            output.innerText = "Error: " + error.message;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  } else {
    output.innerText = "Geolocation is not supported by this browser.";
  }
}

// Proxy for preference storage.
function storePreference() {
  storePreferences();
}

const MOCK_URL = "https://jsonplaceholder.typicode.com/posts?_limit=5";
const MOCK_LOCATIONS = ["Central Park", "Riverside", "Civic Hall", "Old Town"];
const MOCK_CATEGORIES = ["music", "sports", "workshop", "community"];

// Normalize remote data to portal event objects.
function normalizeRemoteEvents(data) {
  return data.map((item, index) => {
    const location = MOCK_LOCATIONS[index % MOCK_LOCATIONS.length];
    const category = MOCK_CATEGORIES[index % MOCK_CATEGORIES.length];
    return new Event({
      id: item.id + 100,
      name: item.title.slice(0, 28),
      date: `2026-07-${10 + index}`,
      category,
      location,
      seats: 15 - index,
    });
  });
}

// Fetch events using Promise chaining.
function fetchEventsWithThen() {
  return fetch(MOCK_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load events");
      }
      return response.json();
    })
    .then((data) => normalizeRemoteEvents(data))
    .catch((error) => {
      console.error("Fetch error:", error.message);
      return [];
    });
}

// Fetch events with async/await and a spinner.
async function fetchEventsAsync() {
  spinnerEl.classList.remove("hidden");
  try {
    const remoteEvents = await fetchEventsWithThen();
    remoteEvents.forEach((eventItem) => addEvent(eventItem));
  } catch (error) {
    console.error("Async fetch error:", error.message);
  } finally {
    spinnerEl.classList.add("hidden");
  }
}

// Wire up jQuery-specific handlers.
function setupJqueryHandlers() {
  if (!window.$) {
    return;
  }
  // jQuery click handler for the submit button
  $("#registerBtn").click(() => {
    console.log("jQuery register button click");
  });
}

// Notify once the full page is loaded.
window.addEventListener("load", () => {
  alert("Page is fully loaded.");
  console.log(`Welcome to the ${portalName}`);
});

// Initialize the portal on DOM ready.
document.addEventListener("DOMContentLoaded", async () => {
  loadPreferences();
  attachFilters();
  setupJqueryHandlers();
  renderInitialEvents();
  await fetchEventsAsync();
  renderInitialEvents();
});
