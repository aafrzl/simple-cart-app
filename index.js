import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';

import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js';

const dbURL = import.meta.env.VITE_DB_URL;
const projectId = import.meta.env.VITE_PROJECT_ID;

const appSettings = {
  databaseURL: dbURL,
  projectId: projectId,
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, 'shopping-list');

const inputFieldEl = document.getElementById('input-field');
const addButtonEl = document.getElementById('add-button');
const shoppingListEl = document.getElementById('shopping-list');

addButtonEl.addEventListener('click', () => {
  let inputValue = inputFieldEl.value;

  push(shoppingListInDB, inputValue);

  clearInputFieldEl();
});

onValue(shoppingListInDB, (snapshot) => {
  if (snapshot.exists()) {
    let itemArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    itemArray.forEach((item) => {
      let currentItem = item;
      appendItemToShoppingListEl(currentItem);
    });
  } else {
    clearShoppingListEl();
    shoppingListEl.innerHTML = 'No items here... yet🤯';
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = '';
}

function clearInputFieldEl() {
  inputFieldEl.value = '';
}

function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement('li');

  newEl.innerText = itemValue;

  //event listener for delete
  newEl.addEventListener('click', () => {
    let exactLocationOfItemInDB = ref(database, `shopping-list/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.appendChild(newEl);
}
