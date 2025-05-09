let idToDelete = 0;

const renderTable = (peopleList) => {
  const table = document.querySelector("tbody");

  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  peopleList.forEach(person => {
  const tr = document.createElement("tr");
  const name = document.createElement("td");
  const email = document.createElement("td");
  const cpf = document.createElement("td");
  const height = document.createElement("td");
  const weight = document.createElement("td");
  const img = document.createElement("td");

  const imageElement = document.createElement("img");
  imageElement.src = person.imageUrl; 
  imageElement.width = 50; 
  imageElement.height = 50;
  imageElement.style.borderRadius = "50%";

  img.appendChild(imageElement);

  const deleteButton = document.createElement("button");
  const updateButton = document.createElement("button");

  deleteButton.className = "delete-button";
  updateButton.className = "update-button";

  deleteButton.dataset.idDelete = person.id;
  updateButton.dataset.idUpdate = person.id;

  deleteButton.textContent = "Delete";
  updateButton.textContent = "Update";

  name.textContent = person.name;
  email.textContent = person.email;
  cpf.textContent = person.cpf;
  height.textContent = person.height;
  weight.textContent = person.weight;

  weight.append(deleteButton, updateButton);
  tr.append(name, email, cpf, height,img, weight );
  table.append(tr);  
});

  table.addEventListener("click", handleShowModal);
  table.addEventListener("click", handleUpdate);
};

const handleShowModal = (event) => {
  const button = event.target.closest(".delete-button");
  if (!button) return;

  idToDelete = Number(button.dataset.idDelete);

  const modal = document.querySelector("dialog");
  modal.showModal();
};

const handleDeleteModal = () => {
  const modal = document.querySelector("dialog");
  const confirmButton = document.querySelector(".confirm-delete-button");
  const cancelButton = document.querySelector(".cancel-delete-button");

  confirmButton.addEventListener("click", () => {
    const request = indexedDB.open("MyTestDatabase", 1);

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["pessoas"], "readwrite");
      const store = transaction.objectStore("pessoas");
      const deleteRequest = store.delete(idToDelete);

      deleteRequest.onsuccess = function () {
        console.log(`Item with ID ${idToDelete} deleted successfully.`);
        modal.close();

        const refreshTransaction = db.transaction(["pessoas"], "readonly");
        const refreshStore = refreshTransaction.objectStore("pessoas");
        const getAllRequest = refreshStore.getAll();

        getAllRequest.onsuccess = function () {
          const updatedData = getAllRequest.result;
          renderTable(updatedData);
        };
      };

      deleteRequest.onerror = function () {
        console.error("Error");
      };
    };

    request.onerror = function () {
      console.error("Error");
    };
  });

  cancelButton.addEventListener("click", () => {
    modal.close();
  });
};

const request = indexedDB.open("MyTestDatabase", 1);

request.onsuccess = function (event) {
  const db = event.target.result;
  const transaction = db.transaction(["pessoas"], "readonly");
  const store = transaction.objectStore("pessoas");
  const getAllRequest = store.getAll();

  getAllRequest.onsuccess = function (event) {
    const allPeople = event.target.result;
    renderTable(allPeople);
    handleDeleteModal();
  };

  getAllRequest.onerror = function () {
    console.error("Error fetching data.");
  };
};

request.onerror = function () {
  console.error("Error opening database.");
};

const handleUpdate = (event) => {
  const button = event.target.closest(".update-button");
  if (!button) return;

  const id = button.dataset.idUpdate;
  window.location.href = `form.html?id=${id}`;
};
