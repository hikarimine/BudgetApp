var budgetController = (function () {



})();

var UIController = (function () {
    
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add_description",
        inputValue: ".add__value",
        inputButtom: ".add__btn"
    }
    
    return {
        getInput: function(){
            return{
                type:  document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
            
        },
        
        getDOMstrings: function(){
            return DOMstrings;
        }
    }


})();

var controller = (function (budgetCtrl, UICtrl) {
    
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputButtom).addEventListener("click", ctrlAddItem);
    
        document.addEventListener("keypress", function(event){
        
            if(event.keyCode === 13){
                ctrlAddItem();
            }   
        
        })
    };
        
    
     var ctrlAddItem = function(){
        //1. get the field input data
        var input = UICtrl.getInput();
         
        //2. add the item to the budget controller 
        
        //3. add the item to the UI
        
        //4. calculate the budget
        
        //5. display the budget on the UI
        
     };
    
    return{
        init: function(){
            console.log("Application has started.");
            setupEventListeners();
        }
    };



})(budgetController, UIController);

controller.init();