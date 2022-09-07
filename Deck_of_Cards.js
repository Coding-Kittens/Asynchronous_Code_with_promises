const body = document.querySelector("body");
const cardForm = document.querySelector(".cardForm");
const cardsArea = document.querySelector("#cardsArea");
const btn = document.querySelector("button");
let currentDeck = null;
let remainingCards = 0;

function get(url) {
  const request = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    request.onload = function () {
      if (request.readyState !== 4) return;

      if (request.status >= 200 && request.status < 300) {
        resolve({
          data: JSON.parse(request.response),
          status: request.status,
          request: request,
        });
      } else {
        reject({
          msg: `Server error ${request.statusText}`,
          status: request.status,
          request: request,
        });
      }
    };

    request.onerror = function handleError() {
      reject({
        msg: "Network error",
      });
    };

    request.open("GET", url);
    request.send();
  });
}

function randomRange(min, max) {
  let isrand = false;
  let num = 0;
  while (!isrand) {
    num = Math.floor(Math.random() * max);
    isrand = num >= min;
  }
  return num;
}

function addCard(img) {
  let newdiv = document.createElement("div");
  let newImg = document.createElement("img");
  newImg.setAttribute("src", img);
  newdiv.style.transform = `rotate(${randomRange(-90, 90)}deg)`;
  newdiv.style.top = `${randomRange(-10, 15)}px`;
  newdiv.style.left = `${randomRange(38, 48)}%`;
  newdiv.append(newImg);
  cardsArea.append(newdiv);
}

cardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(remainingCards);
  if (remainingCards <= 0) {
    cardsArea.innerHTML = "";
    SetDeck()
      .then((res) => {
        return get(
          `http://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`
        );
      })
      .then((res) => {
        addCard(res.data.cards[0].image);
      })
      .catch((err) => console.log(err));
    btn.innerText = "Gimme A Card!";
  } else {
    get(`http://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
      .then((res) => {
        addCard(res.data.cards[0].image);
        remainingCards = res.data.remaining;
        if (remainingCards === 0){
          btn.innerText = "New Deck";
        }
      })
      .catch((err) => console.log(err));
  }
});

get("http://deckofcardsapi.com/api/deck/new/shuffle/")
  .then((res) => {
    currentDeck = res.data.deck_id;
    return get(
      `http://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`
    );
  })
  .then((res) => {
    console.log(`${res.data.cards[0].value} of ${res.data.cards[0].suit}`);
  })
  .catch((err) => console.log(err));

get("http://deckofcardsapi.com/api/deck/new/shuffle/")
  .then((res) => {
    currentDeck = res.data.deck_id;
    let cards = [];
    for (let i = 0; i < 2; i++) {
      cards.push(
        get(`http://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
      );
    }

    Promise.all(cards)
      .then((res) => {
        res.forEach((card) => {
          console.log(
            `${card.data.cards[0].value} of ${card.data.cards[0].suit}`
          );
        });
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));

function SetDeck() {
  return get("http://deckofcardsapi.com/api/deck/new/shuffle/").then((res) => {
    currentDeck = res.data.deck_id;
    remainingCards = res.data.remaining;
  });
}
