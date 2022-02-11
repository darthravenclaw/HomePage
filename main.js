const powerCardTemplate = document.querySelector("[data-power-card-template]");
const modCardTemplate = document.querySelector("[data-mod-card-template]");
const powerCardContainer = document.querySelector(
  "[data-power-cards-container]"
);

let powers = [];
let spellBooks = { mySpellBook: [] };
if (window.localStorage.getItem("spellBooks") != null) {
  spellBooks = JSON.parse(window.localStorage.getItem("spellBooks"));
}

let counter = 0;
let currentBook = "all";

const rankLookup = { Novice: 1, Seasoned: 2, Veteran: 3, Heroic: 4 };
let sortType = "alphabetical";
document.querySelectorAll(".catDiv").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("selected");
    filterPowers();
  });
});
const sortDiv = document.querySelectorAll(".sortDiv");
sortDiv.forEach((div) => {
  div.addEventListener("click", () => {
    for (let i = 0; i < sortDiv.length; i++) {
      sortDiv[i].classList.remove("selected");
    }
    div.classList.add("selected");
    sortType = div.getAttribute("data-value");
    filterPowers();
  });
});
const spellDiv = document.querySelectorAll(".spellDiv");
spellDiv.forEach((div) => {
  div.addEventListener("click", () => {
    for (let i = 0; i < spellDiv.length; i++) {
      spellDiv[i].classList.remove("selected");
    }
    div.classList.add("selected");
    currentBook = div.getAttribute("data-value");
    filterPowers();
  });
});
function capCase(words) {
  let wordArr = (words = words.split(" "));
  newWord = "";
  for (let i = 0; i < wordArr.length; i++) {
    word = wordArr[i];
    if (word != undefined && word.length > 0) {
      if (i == 0) {
        newWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
      } else {
        newWord += " " + word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
    }
  }
  return newWord;
}
function filterPowers() {
  let allowedRanks = [];
  let allowedClasses = [];
  let allowedBooks = [];
  let powersFilterSpellBook = [];

  if (currentBook == "all") {
    powersFilterSpellBook = powers;
  } else {
    powersFilterSpellBook = powers.filter((power) => {
      if (spellBooks[currentBook].includes(power.name)) {
        console.log(power.name);
        return true;
      }
    });
  }
  document.querySelectorAll("#bookContainer > .selected").forEach((item) => {
    allowedBooks.push(item.getAttribute("data-value"));
  });
  document.querySelectorAll("#rankContainer > .selected").forEach((item) => {
    allowedRanks.push(item.getAttribute("data-value"));
  });
  document.querySelectorAll("#classContainer > .selected").forEach((item) => {
    allowedClasses.push(item.getAttribute("data-value"));
  });
  let powersFilterBook = [];

  if (allowedBooks.length > 0) {
    powersFilterBook = powersFilterSpellBook.filter((power) => {
      for (let i = 0; i < allowedBooks.length; i++) {
        if (power.books.includes(allowedBooks[i])) {
          return true;
        }
      }
      return false;
    });
  } else {
    powersFilterBook = powersFilterSpellBook;
  }

  let powersFilterRank = [];
  if (allowedRanks.length > 0) {
    powersFilterRank = powersFilterBook.filter((power) => {
      return allowedRanks.includes(power.rank);
    });
  } else {
    powersFilterRank = powersFilterBook;
  }

  let powersFilterClass = [];
  if (allowedClasses.length > 0) {
    powersFilterClass = powersFilterRank.filter((power) => {
      for (let i = 0; i < allowedClasses.length; i++) {
        if (power.classes.includes(allowedClasses[i])) {
          return true;
        }
      }
      return false;
    });
  } else {
    powersFilterClass = powersFilterRank;
  }
  drawNewPowerList(powersFilterClass);
}

function drawNewPowerList(list) {
  if (sortType == "alphabetical") {
    list.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  } else {
    list.sort((a, b) => {
      if (rankLookup[a.rank] < rankLookup[b.rank]) {
        return -1;
      } else if (rankLookup[a.rank] > rankLookup[b.rank]) {
        return 1;
      } else {
        if (a.name < b.name) {
          return -1;
        } else {
          return 1;
        }
      }
    });
  }

  //   list.sort((a, b) => {});
  for (let i = 0; i < powers.length; i++) {
    try {
      powers.forEach((power) => power.card.remove());
    } catch (error) {
      console.log(error);
    }
  }

  list.forEach((power) => {
    powerCardContainer.append(power.card);
  });
}

const search = document.getElementById("search");
search.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  console.log(value);
  searchResults = powers.filter((power) =>
    power.name.toLowerCase().includes(value)
  );
  drawNewPowerList(searchResults);
});

fetch("./powers.json")
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      console.log("error");
    }
  })
  .then((data) => {
    powers = data;
    powers.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
    data.forEach((power) => {
      const card = powerCardTemplate.content.cloneNode(true).children[0];
      const topDiv = card.querySelector("[data-power-top]");
      const nameDiv = card.querySelector("[data-power-name]");
      nameDiv.textContent = "Name : " + power.name;
      const spellBookBtn = card.querySelector("[data-power-mySpellBook]");
      if (spellBooks["mySpellBook"].includes(power.name)) {
        spellBookBtn.textContent = "Remove from Spellbook";
      } else {
        spellBookBtn.textContent = "Add to Spellbook";
      }
      spellBookBtn.value = power.name;
      spellBookBtn.addEventListener("click", (e) => {
        let btn = e.srcElement;
        let index = spellBooks["mySpellBook"].indexOf(btn.value);
        if (index > -1) {
          spellBooks["mySpellBook"].splice(index,1);
          btn.textContent = "Add to Spellbook";
          btn.classList.remove("inSpellbook");
          if (currentBook == "mySpellBook") filterPowers();
        } else {
          spellBooks["mySpellBook"].push(btn.value);
          btn.textContent = "Remove from Spellbook";
          btn.classList.add("inSpellbook");
        }
        window.localStorage.setItem("spellBooks", JSON.stringify(spellBooks));
      });
      const classesDiv = card.querySelector("[data-power-classes]");
      let users = [];
      for (let j = 0; j < power.classes.length; j++) {
        users.push(capCase(power.classes[j]));
      }
      classesDiv.innerHTML = "<b>Users : </b>" + users.join(", ");
      const rankDiv = card.querySelector("[data-power-rank]");
      rankDiv.innerHTML = "<b>Rank : </b>" + power.rank;
      const durationDiv = card.querySelector("[data-power-duration]");
      durationDiv.innerHTML = "<b>Duration : </b>" + power.duration;
      const costDiv = card.querySelector("[data-power-cost]");
      costDiv.innerHTML = "<b>Cost : </b>" + power.points;
      const rangeDiv = card.querySelector("[data-power-range]");
      rangeDiv.innerHTML = "<b>Range : </b>" + power.range;
      const trappingsDiv = card.querySelector("[data-power-trappings]");
      trappingsDiv.innerHTML = "<b>Trappings : </b>" + power.trappings;
      const discDiv = card.querySelector("[data-power-disc]");
      discDiv.innerHTML = "<b>Disc : </b>" + power.disc;
      if (power.mods.length > 0) {
        power.mods.forEach((mod) => {
          const modCard = modCardTemplate.content.cloneNode(true).children[0];
          const nameModDiv = modCard.querySelector("[data-mod-name]");
          nameModDiv.innerHTML = "Name : " + mod.name;
          const costModDiv = modCard.querySelector("[data-mod-cost]");
          costModDiv.innerHTML = "Cost : " + mod.cost;
          const discModDiv = modCard.querySelector("[data-mod-disc]");
          discModDiv.innerHTML = "Disc : " + mod.disc;
          card.append(modCard);
        });
      }
      power.card = card;
    });
    filterPowers();
  });
