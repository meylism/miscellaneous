export const elements = {
    searchForm : document.querySelector(".search"),
    searchInput : document.querySelector(".search__field"),
    resultList: document.querySelector(".results__list"),
    results: document.querySelector(".results"),
    resultPages: document.querySelector(".results__pages"),
    recipe: document.querySelector(".recipe"),
    buttonBox: document.querySelector(".recipe__info-buttons"),
    list: document.querySelector(".shopping__list"),
    likesList: document.querySelector(".likes__list"),
    likeMenu: document.querySelector(".likes__field use")
}

export const classNames = {
    loader: "loader"
}

export const renderLoader = parent => {
    const html = `
        <div class="${classNames.loader}">
            <svg>
                <use xlink:href="./img/icons.svg#icon-cw">
                </use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML("afterbegin", html);
}

export const removeLoader = () => {
    const element = document.querySelector(`.${classNames.loader}`);
    element.parentNode.removeChild(element);
} 