const events = [
    {
        name: "Music Fest",
        category: "Music",
        seats: 50
    },
    {
        name: "Tech Talk",
        category: "Technology",
        seats: 30
    },
    {
        name: "Rock Concert",
        category: "Music",
        seats: 20
    }
];


function addEvent(name, category, seats) {
    events.push({
        name,
        category,
        seats
    });
}


function registerUser(eventName) {
    const event = events.find(e => e.name === eventName);

    if (event && event.seats > 0) {
        event.seats--;
        console.log(`Registered for ${event.name}`);
    } else {
        console.log("Registration failed");
    }
}

function filterEventsByCategory(category) {
    return events.filter(event => event.category === category);
}

function registrationTracker(category) {
    let totalRegistrations = 0;

    return function () {
        totalRegistrations++;
        console.log(
            `${category} registrations: ${totalRegistrations}`
        );
    };
}

const musicRegistrationCount = registrationTracker("Music");

musicRegistrationCount();
musicRegistrationCount();

function searchEvents(callback) {
    return events.filter(callback);
}

const musicEvents = searchEvents(
    event => event.category === "Music"
);

const availableEvents = searchEvents(
    event => event.seats > 0
);

console.log(musicEvents);
console.log(availableEvents);

addEvent("AI Workshop", "Technology", 25);


registerUser("AI Workshop");


console.log(filterEventsByCategory("Technology"));