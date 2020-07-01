import axios from "axios"
import {apiKey} from "../config"

export default class Recipe {
    constructor(id) {
        this.id = purifyID(id);
    }

    async getRecipe() {
        try {
            const recipe = await axios(`https://api.spoonacular.com/recipes/${this.id}/information?includeNutrition=false&apiKey=${apiKey}`)
            this.title = recipe.data.title;
            this.imageURL = recipe.data.image;
            this.servingTime = recipe.data.readyInMinutes;
            this.servings = recipe.data.servings;
            this.ingredients = recipe.data.extendedIngredients.map(value => {
                return {
                    ingredient: value.aisle,
                    amount: value.amount,
                    unit: value.unit
                }
            });
            this.publisher = recipe.data.sourceName;
            this.directions = recipe.data.winePairing.pairingText;
        } catch(e) {
            alert(`Something went wrong: ${e}`);
        }
    }

    servingAdjust(type){
        const newServing = (type === "dec") ? this.servings - 1 : this.servings + 1;
        if(newServing > 0) {
            this.ingredients.forEach(val => {
                const amountPerUnit = val.amount / this.servings;
                (type) === "dec" ? val.amount = parseFloat((val.amount - amountPerUnit).toFixed(1)) : val.amount = parseFloat((val.amount + amountPerUnit).toFixed(1));
            });
            this.servings = newServing;
        }
    }

}

const purifyID = id => id.replace("#", "");
