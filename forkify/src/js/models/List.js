import uniqid from "uniqid"

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(amount, unit, ingredient) {
        const newItem = {
            id: uniqid(),
            amount,
            unit,
            ingredient
        }
    this.items.push(newItem);
    }

    deleteItem(id) {
        const itemIndex = this.items.findIndex(el => el.id === id);
        this.items.splice(itemIndex, 1);
    }

    updateItem(id, amount) {
        this.items.find(el => el.id === id).amount = parseInt(amount);
    }
}