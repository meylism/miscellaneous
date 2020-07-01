import axios from "axios";
import {apiKey} from "../config"

export default class Search {
    constructor(query) {
        this.query = query;
    }
    
    async getResults() {
        try {
            const recipes = await axios(`https://api.spoonacular.com/recipes/search?query=${this.query}&apiKey=${apiKey}`);
            this.results = recipes.data.results;
        } catch(err) {
            alert(`Something went wrong: ${err}`);
        }
    }
}


