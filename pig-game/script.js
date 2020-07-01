var winner = false;
var score = [0,0];
var scorer = [0,0];
var active = 0;

function activate(a) {
    if(a===0) return 1;
    if(a===1) return 0;
}

function init(){
    score = [0,0];
    scorer = [0,0];
    active = 0;
    winner = false;

    document.querySelector("#name-0").classList.add("active");
    document.querySelector("#bg-0").classList.add("active-bg");
    document.querySelector("#name-1").classList.remove("active");
    document.querySelector("#bg-1").classList.remove("active-bg");
    document.querySelector("#dice").style.display = "none";
    document.querySelector("#score-0").innerText="0";
    document.querySelector("#score-1").innerText="0";
    document.querySelector("#round-score-0").innerText="0";
    document.querySelector("#round-score-1").innerText="0";
    document.querySelector("#name-0").textContent = "Player 1";
    document.querySelector("#name-1").textContent = "Player 2";
}

function toggle() {
    document.querySelector("#round-score-"+active).innerText = "0";
    scorer[active] = 0;
    active = activate(active);
    document.querySelector("#bg-0").classList.toggle("active-bg");
    document.querySelector("#bg-1").classList.toggle("active-bg");
    document.querySelector("#name-0").classList.toggle("active");
    document.querySelector("#name-1").classList.toggle("active");
}

init();

document.querySelector(".button__roll-dice").addEventListener("click", function() {
    if(winner) return 0;
    var random = Math.floor(Math.random()*6)+1;
    if(random === 1) {
        toggle();
    } else {
        document.getElementById("dice").style.display = "block";
        document.getElementById("dice").src = 'img/dice-'+random+'.png';
        scorer[active]+=random;
        document.querySelector("#round-score-"+active).innerText = scorer[active];
}});

document.querySelector(".button__hold").addEventListener("click", function() {
    if ((score[active] += scorer[active]) >= Number(document.getElementById("input-limit").value)) {
        winner = true;
        document.querySelector("#name-"+active).innerHTML = "Winner";
        document.querySelector("#name-"+active).style.color = "#EB4D4D";
        document.querySelector("#name-"+active).classList.remove("active");
    } else {
    document.querySelector("#score-"+active).innerText = score[active];
    toggle();
    }    
});

document.querySelector(".button__new-game").addEventListener("click", function() {
    init();
});
