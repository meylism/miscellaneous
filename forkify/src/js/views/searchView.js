import {elements} from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {elements.searchInput.value = ""};

export const clearResultList = () => {elements.resultList.innerHTML = ""}

export const adjustTitle = (title, limit = 17) => {
    if(title.length > 17) {
        const finalTitle = [];
        title.split(" ").reduce((len, item) => {
            if(len + item.length <= limit) {
                finalTitle.push(item);
                return len + item.length;
            }
        },0);
        return `${finalTitle.join(" ")} ...`;
    }
    return title;
}

const renderItem = item => {
    const html = `
        <li>
            <a class="results__link" href="#${item.id}">
                <figure class="results__fig">
                    <img src="https://spoonacular.com/recipeImages/${item.id}-636x393.jpg" alt="${item.image}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${adjustTitle(item.title)}</h4>
                    <p class="results__author">Dana Cafe</p>
                </div>
            </a>
        </li>
    `;
    elements.resultList.insertAdjacentHTML("beforeend", html);
}

const showButton = (page, type) => {
    const html = `
    <button class="btn-inline results__btn--${(type === "prev" ? "prev" : "next")}" data-goto="${(type === "prev" ? page - 1 : page + 1)}">
    <span>Page ${(type === "prev" ? page - 1 : page + 1)}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${(type === "prev" ? "left" : "right")}"></use>
        </svg>
    </button>
    `;

    elements.resultPages.insertAdjacentHTML("afterbegin", html);
}

export const removeButton = () => {elements.resultPages.innerHTML = "";}

const renderButton = (page, resultPerPage, pageN ) => {
    const pages = Math.ceil(pageN / resultPerPage);
    if(page === 1 && pages > 1) {
        //Show next
        showButton(page, "next");
    } else if(page > 1 && page < pages) {
        //show both
        showButton(page, "next");
        showButton(page, "prev");
    } else if(page === pages && pages > 1) {
        //show prev
        showButton(page, "prev");
    }
}

export const render = (results, page = 1, resultPerPage = 3) => {
    const start = (page - 1) * resultPerPage;
    const end = page * resultPerPage;
    results.slice(start, end).forEach(renderItem);
    renderButton(page, resultPerPage, results.length);
};

export const servingAdjust = type => {
    
}