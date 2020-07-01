import {elements} from "./base";
import {Fraction} from "fractional"

const renderIngredients = ing => {
        return ing.map(ing => {return `
        <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${convertFraction(ing.amount)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.ingredient}
        </div>
         </li>`}).join("")
    
}

export const convertFraction = (num) => {
    if(num) {
        const[int, dec] = num.toString().split(".");

        if(!dec || dec === "0" || num === 0) {
            return int;
        } else if(int === '0') {
            const temp = new Fraction((num - parseInt(int)).toString());
            return `${temp.numerator}/${temp.denominator}`
        } else {
            const temp = new Fraction((num - parseInt(int)).toString());
            return `${int} ${temp.numerator}/${temp.denominator}`
        }
    }

    return "?";
}

export const clearRecipe = () => elements.recipe.innerHTML = "";

export const render = (recipe, isLiked) => {
    const markup = `
            <figure class="recipe__fig">
                <img src="${recipe.imageURL}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.servingTime}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny dec">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny inc">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart${isLiked ? "" : "-outlined"}" writable="true"></use>
                    </svg>
                </button>
            </div>



            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                    ${renderIngredients(recipe.ingredients)}
                </ul>

                <button class="btn-small recipe__btn">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.publisher}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="http://thepioneerwoman.com/cooking/pasta-with-tomato-cream-sauce/" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>
    `;
    elements.recipe.insertAdjacentHTML("afterbegin", markup);
}