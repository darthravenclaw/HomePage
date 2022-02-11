const edgeCardTemplate = document.querySelector("[data-edge-card-template]");
const edgeCardContainer = document.querySelector("[data-edge-cards-container]");

let edges = [];

document.querySelectorAll(".catDiv").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("selected");
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
  let allowedBooks = [];
  let allowedReq = [];
  let allowedCat = [];

  document.querySelectorAll("#bookContainer > .selected").forEach((item) => {
    allowedBooks.push(item.getAttribute("data-value"));
  });
  document
    .querySelectorAll("#categoryContainer > .selected")
    .forEach((item) => {
      allowedCat.push(item.getAttribute("data-value"));
    });
  document.querySelectorAll("#rankContainer > .selected").forEach((item) => {
    allowedRanks.push(item.getAttribute("data-value"));
  });
  document.querySelectorAll("#reqContainer > .selected").forEach((item) => {
    allowedReq.push(item.getAttribute("data-value"));
  });
  let edgesFilterBook = [];

  if (allowedBooks.length > 0) {
    edgesFilterBook = edges.filter((edge) => {
      for (let i = 0; i < allowedBooks.length; i++) {
        if (edge.book.includes(allowedBooks[i])) {
          return true;
        }
      }
      return false;
    });
  } else {
    edgesFilterBook = edges;
  }
  let edgesFilterCat = [];
  if (allowedCat.length > 0) {
    edgesFilterCat = edgesFilterBook.filter((edge) => {
      return allowedCat.includes(edge.category);
    });
  } else {
    edgesFilterCat = edgesFilterBook;
  }
  let edgesFilterRank = [];
  if (allowedRanks.length > 0) {
    edgesFilterRank = edgesFilterCat.filter((edge) => {
      return allowedRanks.includes(edge.rank);
    });
  } else {
    edgesFilterRank = edgesFilterCat;
  }

  let edgesFilterReq = [];
  if (allowedReq.length > 0) {
    edgesFilterReq = edgesFilterRank.filter((edges) => {
      for (let i = 0; i < allowedReq.length; i++) {
        if (edges.req.includes(allowedReq[i])) {
          return true;
        }
      }
      return false;
    });
  } else {
    edgesFilterReq = edgesFilterRank;
  }
  drawNewPowerList(edgesFilterReq);
}

function drawNewPowerList(list) {
  list.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  for (let i = 0; i < edges.length; i++) {
    try {
      edges.forEach((edge) => edge.card.remove());
    } catch (error) {
      console.log(error);
    }
  }

  list.forEach((edge) => {
    edgeCardContainer.append(edge.card);
  });
}

const search = document.getElementById("search");
search.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  searchResults = edges.filter((edge) => {
    if (
      edge.name.toLowerCase().includes(value) ||
      edge.desc.toLowerCase().includes(value)
    ) {
      return true;
    } else {
      return false;
    }
  });
  drawNewPowerList(searchResults);
});

fetch("./edges.json")
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      console.log("error");
    }
  })
  .then((data) => {
    edges = data;
    edges.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
    data.forEach((edge) => {
      const card = edgeCardTemplate.content.cloneNode(true).children[0];
      const nameDiv = card.querySelector("[data-edge-name]");
      nameDiv.innerHTML = "<b>Name : </b>" + edge.name;
      const bookDiv = card.querySelector("[data-edge-books]");
      bookDiv.innerHTML = "<b>Books : </b>" + edge.book;
      const reqDiv = card.querySelector("[data-edge-req]");
      reqDiv.innerHTML = "<b>Requirements : </b>" + edge.reqText;
      const catDiv = card.querySelector("[data-edge-cat]");
      catDiv.innerHTML = "<b>Category : </b>" + edge.category;
      const rankDiv = card.querySelector("[data-edge-rank]");
      rankDiv.innerHTML = "<b>Rank : </b>" + edge.rank;
      const discDiv = card.querySelector("[data-edge-disc]");
      discDiv.innerHTML = "<b>Disc : </b>" + edge.desc;
      edge.card = card;
    });
    filterPowers();
  });
