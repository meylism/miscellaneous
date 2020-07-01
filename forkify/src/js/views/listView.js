import {elements} from "./base";

export const renderItems = list => {
    list.forEach(el => renderItem(el));
}

const renderItem = item => {
    const markup = `
        <li class="shopping__item" id = "${item.id}">
        <div class="shopping__count">
            <input type="number" class="btn-update" id="${item.id}" value="${item.amount}" step="${item.amount}">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
        </li>
    `;
    elements.list.insertAdjacentHTML("beforeend", markup);
}
export const deleteItem = id => {
    const item = document.getElementById(id);
    item.parentNode.removeChild(item);
}