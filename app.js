var budgetController = (function () {
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
         totals: {
             exp: 0,
             inc: 0
         },
         budget: 0,
        percentage: 0

    };
    

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //create new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }


            //create new item based on "inc" or "exp" type
            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            }
            else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }

            //push it into our data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;

        },

        deleteItem: function (type,id) {
            var ids, index;

            data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }

        },


        calculateBudget: function () {
            //calculate total income and expenses 
            calculateTotal('exp');
            calculateTotal('inc');

            //calcualte the budget income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calcuatle the percentae of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
           


        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function () {
            console.log(data);
        }

    };

})();



var UIController = (function () {
    
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add_description",
        inputValue: ".add__value",
        inputButtom: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: '.container'

        
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type){
            
            var html, newHTML, element;

            //create HTML string with placeholder text 
            if(type === "inc"){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
            }else if(type === "exp"){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
            }
            
            // replae the placeholder text with someactual data 
            
            newHTML = html.replace('%id%',obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            
            //insert the html
            document.querySelector(element).insertAdjacentHTML('beforeend'.newHTML);
        },
        
        deleteItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearField: function(){
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
        },

        displayBudget: function (obj) {

            docuement.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            docuement.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            docuement.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
           

            if(obj.percentage > 0){
                 docuement.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                 docuement.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    }
})();

//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
    
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function () {

        //1 calculate the budget
        budgetCtrl.calculateBudget();

        //2 return the budget
        var budget = budgetCtrl.getBudget();

        //3. display the budget on the UI
        UICtrl.displayBudget(budget);
    };
    
     var ctrlAddItem = function(){
         var input, newItem;
         
        //1. get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. add the item to the budget controller 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4 clear the fields
            UICtrl.clearFields();

            updateBudget();

        }
        
     };

     var ctrlDeleteItem = function (event) {

         var itemID, splitID, type, ID;

         itemID = console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);

         if (itemID) {
             splitID = itemID.split('-');
             type = splitID[0];
             ID = parseInt(splitID[1]);

             //1. delete the item from the data strcture
             budgetCtrl.deleteItem(type, ID);

             //2. delete the item from the UI
             UICtrl.deleteItem(itemID);

             //3. Update and show the new budget
             updateBudget();
         }
     };
    
    return{
        init: function(){
            console.log("Application has started.");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };



})(budgetController, UIController);

controller.init();