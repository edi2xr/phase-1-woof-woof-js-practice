document.addEventListener("DOMContentLoaded", () => {
  const DOGS_URL = "http://localhost:3000/pups";
  const dogBar = document.getElementById("dog-bar");
  const dogInfo = document.getElementById("dog-info");
  const filterButton = document.getElementById("good-dog-filter");

  let allDogs = [];
  let filterOn = false;

  // Load dogs from server
  fetch(DOGS_URL)
    .then(res => res.json())
    .then(dogs => {
      allDogs = dogs;
      renderDogBar(dogs);
    });

  // Render names in dog bar
  function renderDogBar(dogs) {
    dogBar.innerHTML = "";
    dogs.forEach(dog => {
      const span = document.createElement("span");
      span.textContent = dog.name;
      span.addEventListener("click", () => showDogInfo(dog));
      dogBar.appendChild(span);
    });
  }

  // Show selected dog info
  function showDogInfo(dog) {
    dogInfo.innerHTML = `
      <img src="${dog.image}" />
      <h2>${dog.name}</h2>
      <button>${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
    `;

    const toggleButton = dogInfo.querySelector("button");
    toggleButton.addEventListener("click", () => toggleGoodness(dog, toggleButton));
  }

  // Toggle dog status
  function toggleGoodness(dog, button) {
    const newStatus = !dog.isGoodDog;

    fetch(`${DOGS_URL}/${dog.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ isGoodDog: newStatus })
    })
      .then(res => res.json())
      .then(updatedDog => {
        dog.isGoodDog = updatedDog.isGoodDog;
        button.textContent = updatedDog.isGoodDog ? "Good Dog!" : "Bad Dog!";
        if (filterOn) {
          renderDogBar(allDogs.filter(d => d.isGoodDog));
        }
      });
  }

  // Toggle good dog filter
  filterButton.addEventListener("click", () => {
    filterOn = !filterOn;
    filterButton.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`;
    const dogsToShow = filterOn
      ? allDogs.filter(d => d.isGoodDog)
      : allDogs;
    renderDogBar(dogsToShow);
  });
});
