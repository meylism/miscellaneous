export default class {
    constructor() {
        this.likes = [];
    }

    addLike(id, publisher, title, photo) {
        const newLike = {id, publisher, title, photo};
        this.likes.push(newLike);
        return newLike;
    }

    removeLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        return this.likes.find(el => el.id === id) !== undefined;  
    }

    setStorage() {
        localStorage.setItem("likes", `${JSON.stringify(this.likes)}`);
    }

    getStorage() {
        const data = JSON.parse(localStorage.getItem("likes"));
        if(data) this.likes = data; 
        
    }
}