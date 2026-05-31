const form = document.getElementById("registrationForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const userData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
  };

  message.textContent = "Submitting...";

  setTimeout(() => {
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request Failed");
        }
        return response.json();
      })
      .then((data) => {
        message.textContent = "Registration Successful!";
        console.log(data);
        form.reset();
      })
      .catch((error) => {
        message.textContent = "Registration Failed!";
        console.error(error);
      });
  }, 2000);
});
