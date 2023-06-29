document.addEventListener("DOMContentLoaded", function () {
  const contents = document.querySelectorAll(".content");

  contents.forEach(content => {
    const range = content.querySelector(".range");
    const characterInfo = content.querySelector(".character-info");

    content.addEventListener("mouseenter", function () {
      const rangeText = range.textContent;

      fetchCharacters(rangeText)
        .then(characters => {
          characterInfo.innerHTML = "";
          characters.forEach(character => {
            if (character) {
              const characterBlock = document.createElement("div");
              characterBlock.classList.add("character-block");

              const characterTitle = document.createElement("h2");
              characterTitle.innerText = character.name;

              const characterDetails = document.createElement("div");
              characterDetails.classList.add("character-details");

              const characterHeight = document.createElement("p");
              characterHeight.innerText = `Estatura: ${character.height} cm`;

              const characterWeight = document.createElement("p");
              characterWeight.innerText = `Peso: ${character.mass} kg`;

              characterDetails.appendChild(characterHeight);
              characterDetails.appendChild(characterWeight);

              characterBlock.appendChild(characterTitle);
              characterBlock.appendChild(characterDetails);

              characterBlock.addEventListener("click", function (event) {
                event.stopPropagation();
                characterBlock.classList.toggle("expanded");
              });

              characterInfo.appendChild(characterBlock);
            }
          });
        })
        .catch(error => {
          console.log("Error:", error);
        });
    });

    content.addEventListener("mouseover", function () {
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");


      content.appendChild(tooltip);
    });

    content.addEventListener("mouseout", function () {
      const tooltip = content.querySelector(".tooltip");
      tooltip.remove();
    });
  });

  function fetchCharacters(range) {
    const [start, end] = range.split(" - ");
    const urls = [];

    for (let i = parseInt(start); i <= parseInt(end); i++) {
      urls.push(`https://swapi.dev/api/people/${i}`);
    }

    const requests = urls.map(url =>
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.name) {
            return data;
          } else {
            throw new Error("Personaje no encontrado");
          }
        })
        .catch(error => {
          console.log("Error:", error);
          return null;
        })
    );

    return Promise.all(requests);
  }
});