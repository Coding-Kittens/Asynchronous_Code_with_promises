const body = document.querySelector("body");
const numForm = document.querySelector(".numForm");

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

function addFact(fact) {
  let newP = document.createElement("p");
  newP.innerText = fact;
  body.append(newP);
}

numForm.addEventListener("submit", (event) => {
  event.preventDefault();
  num = document.querySelector("input").value;
  get(`http://numbersapi.com/${num}?json`)
    .then((res) => {
      if (res.data.text) {
        addFact(res.data.text);
      } else {
        for (let fact in res.data) {
          addFact(res.data[fact]);
        }
      }
    })
    .catch((err) => console.log(err));
});

get("http://numbersapi.com/4?json")
  .then((res) => {
    console.log(res);
    return get("http://numbersapi.com/1..5?json");
  })
  .then((res) => {
    for (let fact in res.data) {
      addFact(res.data[fact]);
    }
    return get("http://numbersapi.com/4?json");
  })
  .then((res) => {
    addFact(res.data.text);
    return get("http://numbersapi.com/4?json");
  })
  .then((res) => {
    addFact(res.data.text);
    return get("http://numbersapi.com/4?json");
  })
  .then((res) => {
    addFact(res.data.text);
    return get("http://numbersapi.com/4?json");
  })
  .then((res) => {
    addFact(res.data.text);
  })
  .catch((err) => console.log(err));
