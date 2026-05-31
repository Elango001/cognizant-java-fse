// Event Class
class Event {
  constructor(name, category, seats) {
    this.name = name;
    this.category = category;
    this.seats = seats;
  }
  //This itself adds the method to the prototype, so all instances can access it
  checkAvailability = function () {
    if (this.seats > 0) {
      return `Seats available: ${this.seats}`;
    } else {
      return "Event is full";
    }
  };
}

//this is another method
// Event.prototype.checkAvailability = function () {
//   if (this.seats > 0) {
//     return `Seats available: ${this.seats}`;
//   } else {
//     return "Event is full";
//   }
// };

const event1 = new Event("Music Fest", "Music", 50);
const event2 = new Event("Tech Talk", "Technology", 0);

console.log(event1.checkAvailability());
console.log(event2.checkAvailability());

Object.entries(event1).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});
