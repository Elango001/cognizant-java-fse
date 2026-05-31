// Array of events
const events = [
  {
    name: "Music Fest",
    category: "Music",
  },
  {
    name: "Baking Workshop",
    category: "Workshop",
  },
  {
    name: "Rock Concert",
    category: "Music",
  },
];

// Add new events using push()
events.push({
  name: "Jazz Night",
  category: "Music",
});

events.push({
  name: "Photography Workshop",
  category: "Workshop",
});

console.log("All Events:", events);

// Filter only music events
const musicEvents = events.filter((event) => event.category === "Music");

console.log("Music Events:", musicEvents);

// Format display cards using map()
const displayCards = events.map(
  (event) => `${event.category} on ${event.name}`,
);

console.log("Display Cards:");
displayCards.forEach((card) => console.log(card));
