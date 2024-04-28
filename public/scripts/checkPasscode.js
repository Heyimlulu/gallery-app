document
  .getElementById("passcodeForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    const response = await fetch("/check-passcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ day, month, year }),
    });
    const data = await response.json();

    if (data.success) {
      window.location.replace(data.redirect);
    } else {
      alert(data.message);
    }
  });
