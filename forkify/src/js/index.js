import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView"
import * as recipeView from "./views/recipeView"
import * as listView from "./views/listView"
import * as likesView from "./views/likesView"
import {elements, renderLoader, removeLoader, removeButton} from "./views/base"

const state = {};

const controlSearch = async () => {

    //1. Get query from the user
    const query = searchView.getInput();
    searchView.clearResultList();
    searchView.removeButton();
    //2. Create search object
    if(query){
        renderLoader(elements.results);
        state.search = new Search(query);
        //3. Prepare UI for the loading
        //4. Get results
        await state.search.getResults();
        //5. Render to the page
        removeLoader();
        searchView.render(state.search.results);
        searchView.clearInput();
    }
}

const controlRecipe = async () => {
    //1. get the hash
    const hash = document.location.hash;
    if(hash) {
        recipeView.clearRecipe();
        //2. create Recipe object
        state.recipe = new Recipe(hash);
        //3. get results
        await state.recipe.getRecipe();
        //4. update UI
        recipeView.render(state.recipe, state.like.isLiked(state.recipe.id));
    }
}

const controlList = () => {
    if(!state.list) {
        state.list = new List();
        //Add to the state
        state.recipe.ingredients.forEach(val => {
            state.list.addItem(val.amount, val.unit, val.ingredient);
        })
        //Render to the DOM
        listView.renderItems(state.list.items);
    }
}    
    const controlLike = () => {
        // Check whether already liked or not
        if(state.like.isLiked(state.recipe.id)){
            //Remove Item
            state.like.removeLike(state.recipe.id);
            //Remove from the Dom
            likesView.toggleLike(false);
            likesView.removeLike(state.recipe.id);
        } else {
            //Add item
            const recipe = state.recipe
            const addedItem = state.like.addLike(recipe.id, recipe.publisher, recipe.title, recipe.imageURL);
            //Render to the Dom
            likesView.toggleLike(false);
            likesView.addLike(addedItem);
        }
        state.like.setStorage();
        likesView.likeMenu(state.like.likes.length);
        //recipeView.render(state.recipe, state.like.isLiked(state.recipe.id));
}

window.addEventListener("load", () => {
    state.like = new Likes();
    state.like.getStorage();
    likesView.likeMenu(state.like.likes.length);
    state.like.likes.forEach(el => likesView.addLike(el));
})

elements.searchForm.addEventListener("submit", e => {
    e.preventDefault();
    controlSearch();
});

elements.resultPages.addEventListener("click", e => {
    const goto = e.target.closest(".btn-inline").dataset.goto;
    searchView.clearResultList();
    searchView.removeButton();
    searchView.render(state.search.results, parseInt(goto));
});

["hashchange", "load"].forEach(val => {window.addEventListener(val, () => {
    controlRecipe();
    }
)});

elements.recipe.addEventListener("click", e => { 
    if(e.target.matches(".dec, .dec *")) state.recipe.servingAdjust("dec");
    if(e.target.matches(".inc, .inc *")) state.recipe.servingAdjust("inc");
    if(e.target.matches(".recipe__btn, .recipe__btn *")) controlList();
    if(e.target.matches(".recipe__love, .recipe__love *")) controlLike();
    recipeView.clearRecipe();
    recipeView.render(state.recipe);
 })

 elements.list.addEventListener("click", e => {
     if(e.target.matches(".shopping__delete, .shopping__delete *")) {
         const item = e.target.closest(".shopping__item").id;
         listView.deleteItem(item);
     }

     if(e.target.matches(".btn-update")) {
        const item = e.target;
        state.list.updateItem(item.id, item.value);
    }
 })
 
