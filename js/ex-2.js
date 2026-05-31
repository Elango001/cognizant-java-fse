// Test-only: syntax, data types, and operators example.
const eventName = "Community Tech Talk";
const eventDate = "2026-06-15";
let availableSeats = 50;

const eventInfo = `Event: ${eventName} | Date: ${eventDate} | Seats: ${availableSeats}`;
console.log(eventInfo);

function availSeat() {
  if (availableSeats > 0) {
    availableSeats--;
  }
  return availableSeats;
}

function cancelSeat() {
  availableSeats++;
  return availableSeats;
}

console.log(`After registration, seats left: ${availSeat()}`);
console.log(`After cancellation, seats left: ${cancelSeat()}`);
