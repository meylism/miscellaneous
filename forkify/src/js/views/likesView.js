import {elements} from "./base";
import {adjustTitle} from "./searchView"

export const addLike = item => {
    const markup = `
        <li>
            <a class="likes__link" href="#${item.id}">
                <figure class="likes__fig">
                    <img src="${item.photo}" alt="${adjustTitle(item.title)}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${adjustTitle(item.title)}</h4>
                    <p class="likes__author">${item.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML("beforeend", markup);
}

export const removeLike = id => {
    const item = document.querySelector(`a[href*='${id}']`).parentNode;
    item.parentNode.removeChild(item);
}

export const toggleLike = (isLiked) => {
    /*const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    const item = document.querySelector('.recipe__love use');
    const shadow = item.shadowRoot
    shadow.mode = "open";
    console.log(shadow);
    item.parentNode.removeChild(item);

    const newEl = document.createElement("use");
    newEl.setAttribute("href", `img/icons.svg#${iconString}`);
    console.log(newEl);*/
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    const item = document.querySelector('.recipe__love use');
    item.setAttribute("href", `img/icons.svg#${iconString}`);

};

export const likeMenu = number => {
    number > 0 ? elements.likeMenu.style.visibility = "visible" : elements.likeMenu.style.visibility = "hidden";          
}

//<use href="img/icons.svg#icon-heart-outlined"></use>