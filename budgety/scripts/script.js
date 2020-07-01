var dataController = (function(){

    function Income(id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount;
    }

    function Expense(id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.percentage = -1;
    }

    Expense.prototype.calculatePercentage = function(totalIncome) {
        if(totalIncome > 0){
            this.percentage = Math.round((this.amount / totalIncome) * 100) + "%";
        } else {
            this.percentage = "---";
        }

        
    }

    function calculateTotal(type) {
        var sum = 0;
        data.items[type].forEach(function(value){
            sum += value.amount;
        });
        data.totals[type] = sum;
    }

    var data = {
        items: {
            income: [],
            expense: []
        },
        totals: {
            income: 0,
            expense: 0
        },
        total: 0,
        percentage: -1
    };

    return {
        addItem: function (type, desc, amount) {
            var ID, newItem;

            if(data.items[type].length > 0) {
                ID = data.items[type].length +1;
            } else {
                ID = 1;
            }

            if(type === "income") {
                newItem = new Income(ID, desc, amount); 
                data.items.income.push(newItem);
            } else if(type === "expense") {
                newItem = new Expense(ID, desc, amount); 
                data.items.expense.push(newItem);
            }
            return newItem;
        },

        deleteItem : function (type, ID){
            var indexList, itemIndex;
            indexList = data.items[type].map(function(value){
                return value.id;
            })
            itemIndex = indexList.indexOf(ID);
            
            data.items[type].splice(itemIndex, 1);
        },

        calculateBudget: function () { 
            calculateTotal("income");
            calculateTotal("expense");
            data.total = data.totals.income - data.totals.expense;
            data.percentage = Math.round(data.totals.expense / data.totals.income * 100);

            return {
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                total: data.total,
                percentage: data.percentage
            }
        },

        calculatePercentage: function () { 
            data.items.expense.forEach(function(value){
                value.calculatePercentage(data.totals.income);
            });
        },

        getPercentage: function () { 
            return data.items.expense.map(function(value){
                return value.percentage;
            });
        },

        /*For testing purposes*/
        testing: function () { 
            return data;
        } 
    }
})();

var UIController = (function(){
    var DOMstrings = {
        inputType : "#form-type",
        inputDesc : "#form-description",
        inputAmount : "#form-amount",
        button: "#form-button",
        totalIncome: "#added-value-income",
        totalExpense: "#added-value-expense",
        total: "#money-remaining",
        percentage: "#total-percentage-expense",
        container: ".container",
        percentageElements: ".item__percentage",
        date: "#date-now",
        form: ".form"
    };

    var formatNumber =  function(number, type){
        var numberItems, integer, decimal, i, j=0, newNumber;
        type = (type === "income") ? "+" : "-";
        number = Math.abs(number);
        number = number.toFixed(2);
        numberItems = number.split(".");
        integer = numberItems[0];
        decimal = numberItems[1];
        newNumber = [];
        for(var i = integer.length-1; i>=0; i--) {
            if(j%3 === 0 && j!==0) {
                newNumber.unshift(",");
            }
            newNumber.unshift(integer[i]);
            j++;
            
        } 
        return type + " " + newNumber.join("") + "." + decimal;
    };

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDesc).value,
                amount: parseFloat(document.querySelector(DOMstrings.inputAmount).value)
            };
        },

        getDOMStrings: function() {
            return DOMstrings; 
        },

        addList: function(type, object) {
            var html, newHtml;
        /*
        1. get item
        2. replace placeholder
        3. insert into DOM according to type
        */
            if(type === 'income') {
                html = '<div class="item item--income" id="income-%id%"><span class="item__description">%description%</span><span class="item__amount">%amount%</span><i class="item__delete icon ion-ios-close-circle-outline" id="delete"></i></div>';
            } else if (type === 'expense') {
                html = '<div class="item item--expense" id="expense-%id%"><span class="item__description">%description%</span><span class="item__amount">%amount%</span><span class="item__percentage">--</span><i class="item__delete icon ion-ios-close-circle-outline id="delete"></i></div>';
            }

            newHtml = html.replace("%id%", object.id);
            newHtml = newHtml.replace("%description%", object.description);
            newHtml = newHtml.replace("%amount%", formatNumber(object.amount, type));

            document.querySelector(".container__"+type).insertAdjacentHTML("beforeend", newHtml);

        },

        removeList: function(item) {
            itemItself = document.getElementById(item);
            itemItself.parentNode.removeChild(itemItself);
            
        },

        clearInput: function () { 
            var inputs = document.querySelectorAll(DOMstrings.inputDesc + ", " + DOMstrings.inputAmount);
            inputs.forEach(function(value, index, list){
                value.value = "";
            });
            inputs[0].focus();
        },

        updateUI: function(object){
            var type = (object.total > 0) ? "income" : "expense";

            document.querySelector(DOMstrings.totalIncome).innerHTML = formatNumber(object.totalIncome,"income");
            document.querySelector(DOMstrings.totalExpense).innerHTML = formatNumber(object.totalExpense, "expense");
            document.querySelector(DOMstrings.total).innerHTML = formatNumber(object.total, type);
            if(object.total > 0) {
                document.querySelector(DOMstrings.percentage).innerHTML = object.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentage).innerHTML = "--";
            }
        },

        updatePercList: function(percentages){
            var listPercentages;
            listPercentages = document.querySelectorAll(DOMstrings.percentageElements);
            listPercentages.forEach(function(value, index){
                value.innerText = percentages[index];
            })
        },

        displayDate: function() {
            var date, month, year, months;
            months = ["January", "February", "March", "April", "May", "June", "Jule", "August", "September", "October", "November", "December"];
            var date = new Date();
            month = months[date.getMonth()];
            year = date.getFullYear();
            
            document.querySelector(DOMstrings.date).textContent = 'Available budget in ' + month + ", " + year; 
        },
        
        changedEvent() {
            document.querySelector(DOMstrings.form).classList.toggle("red");
        }
    }   
})();

var controller = (function(dataCtr, UICtrl){
    var DOMstrings = UICtrl.getDOMStrings();

    function update() {
        //5. Calculate budget
        var budget = dataCtr.calculateBudget();
        //6. Update UI
        UICtrl.updateUI(budget);
    }

    function updatePercentage() {
        //6. calculate percentage
        dataCtr.calculatePercentage();
        percentages = dataCtr.getPercentage();
        //7. display percentage
        UICtrl.updatePercList(percentages);
    }
   
    var deleteItem = function (event) {
        var item, itemInfo, itemID, itemType;
        if(event.target.id === 'delete'){
            item = event.target.parentNode.id;
            itemInfo = item.split('-');
            itemType = itemInfo[0];
            itemID = parseInt(itemInfo[1]);
            //1. Delete from the data structure
            dataCtr.deleteItem(itemType, itemID);        
            //2. Delete from the UI
            UICtrl.removeList(item);
            //3. Update budget
            update();
            //4. update percentage
            updatePercentage();
        }

    }

    var addItem = function(){
        //1. Add event listener +
        //2. Get input*/
        var data = UICtrl.getInput();
        if(data.description !== "" && data.amount > 0 && !(data.amount == NaN)){
            //3. Add data to the container
            var addedData = dataCtr.addItem(data.type, data.description, data.amount);
            //4. Add data to the UI
            UICtrl.addList(data.type, addedData);
            UICtrl.clearInput();
            //5. update budget
            update();
            //6. calculate percentage
            updatePercentage();

        }
    }
    return {
        init: function() {
            UICtrl.displayDate(); 
            document.querySelector(DOMstrings.button).addEventListener("click", function(){
                addItem();
            });
    
            document.addEventListener("keypress", function(e){
                if(e.charCode === 13 || e.which === 13) { 
                    addItem();} 
                });

            document.querySelector(DOMstrings.container).addEventListener("click", deleteItem);
            document.querySelector(DOMstrings.inputType).addEventListener("change", UICtrl.changedEvent);
            update();    
        }
    }
})(dataController, UIController);

controller.init();