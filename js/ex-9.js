const eventContainer = document.getElementById("events");
const loading = document.getElementById("loading");

const API_URL = "https://jsonplaceholder.typicode.com/users";

/* Using .then() and .catch() */
function fetchEventsPromise() {
  loading.textContent = "Loading...";

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      loading.textContent = "";

      eventContainer.innerHTML = "";

      data.forEach((event) => {
        const p = document.createElement("p");
        p.textContent = event.name;
        eventContainer.appendChild(p);
      });
    })
    .catch((error) => {
      loading.textContent = "";
      console.error(error);
      alert("Error fetching data");
    });
}

/* Using async/await */
async function fetchEventsAsync() {
  try {
    loading.textContent = "Loading...";

    const response = await fetch(API_URL);
    const data = await response.json();

    loading.textContent = "";

    eventContainer.innerHTML = "";

    data.forEach((event) => {
      const p = document.createElement("p");
      p.textContent = event.name;
      eventContainer.appendChild(p);
    });
  } catch (error) {
    loading.textContent = "";
    console.error(error);
    alert("Error fetching data");
  }
}
