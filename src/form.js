const peopleWithId = [];
let db;

const request = indexedDB.open("MyTestDatabase", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains("pessoas")) {
    db.createObjectStore("pessoas", { keyPath: "id", autoIncrement: true });
  }
};

request.onsuccess = function (event) {
  db = event.target.result;

  fillFormIfEditing();
  handleFormSubmit();
};

request.onerror = function (event) {
  console.error("Error opening database:", event.target.errorCode);
};

function fillFormIfEditing() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  if (!id) return;

  const transaction = db.transaction(["pessoas"], "readonly");
  const store = transaction.objectStore("pessoas");
  const getRequest = store.get(id);

  getRequest.onsuccess = function () {
    const person = getRequest.result;
    if (person) {
      document.getElementById("name").value = person.name;
      document.getElementById("email").value = person.email;
      document.getElementById("cpf").value = person.cpf;
      document.getElementById("height").value = person.height;
      document.getElementById("weight").value = person.weight;
      document.getElementById("img").value = person.imageUrl;
    }
  };

  getRequest.onerror = function () {
    console.error("Error fetching person for editing");
  };
}

function handleFormSubmit() {
  const form = document.querySelector("form");
  const params = new URLSearchParams(window.location.search);
  const idParam = Number(params.get("id"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const cpf = document.getElementById("cpf").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const imageUrl = document.getElementById("img").value

    const person = { name, email, cpf, height, weight,imageUrl };

    if (idParam) {
      person.id = idParam;
    }

    const transaction = db.transaction(["pessoas"], "readwrite");
    const store = transaction.objectStore("pessoas");
    const request = store.put(person); 
    request.onsuccess = function (event) {
      if (idParam) {
        
      } else {
        const id = event.target.result;
        peopleWithId.push({ id, ...person });
        
      }

      form.reset();
      window.location.href = "./table.html";
    };

    request.onerror = function () {
      alert("Error saving to the database.");
    };
  });
}
