// Event List
const events = [
  {
    name: "Music Fest",
    category: "Music",
    seats: 50,
  },
  {
    name: "Baking Workshop",
    category: "Workshop",
    seats: 20,
  },
  {
    name: "Rock Concert",
    category: "Music",
    seats: 30,
  },
];

// Default Parameters
function addEvent(name = "Untitled Event", category = "General", seats = 0) {
  events.push({ name, category, seats });
}

// Add a new event
addEvent("Tech Talk", "Technology", 40);

// Destructuring
events.forEach((event) => {
  const { name, category, seats } = event;

  console.log(`Name: ${name}, Category: ${category}, Seats: ${seats}`);
});

// Spread Operator to Clone Array Before Filtering
const clonedEvents = [...events];

const musicEvents = clonedEvents.filter((event) => event.category === "Music");

console.log("Music Events:");
console.log(musicEvents);
