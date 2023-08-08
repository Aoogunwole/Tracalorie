// Storage controller
const StorageCtrl = (function () {
    return {
        storeItem: function(item) {
            let items = [];
            if(localStorage.getItem("items") === null) {
                items = [];
                items.push(item)

                localStorage.setItem("items", JSON.stringify(items))
            }
            else {
                items =JSON.parse(localStorage.getItem("items"));


                items.push(item)

                localStorage.setItem("items", JSON.stringify(items)) 
            }
        },

        getItemsFromStorage: function() {
            let items
            if(localStorage.getItem("items") === null) {
                items = [];
            }
            else {
                items = JSON.parse(localStorage.getItem("items"));
            }
            return items;
        },

        updateItemStorage: function(updatedItem) {
            items =JSON.parse(localStorage.getItem("items"));
            items.forEach((item, index) => {
                if(item.id == updatedItem.id) {
                    items.splice(index, 1, updatedItem);
                }
            })
            localStorage.setItem("items", JSON.stringify(items));
        },

        deleteFromLS: function (id) {
            items =JSON.parse(localStorage.getItem("items"));
            items.forEach((item, index) => {
                if(item.id ==id) {
                    items.splice(index, 1);
                }
            })
            localStorage.setItem("items", JSON.stringify(items));

        }
    }
})()



// Item controller
const ItemCtrl = (function () {

    const Item = function( id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0,

    }
    return {
        getItems: function() {
            return data.items
        },
        addItem: function(name, calories) {
            let id;
            if(data.items.length > 0){
                id = data.items[data.items.length - 1].id + 1;
              } else {
                id = 0;
              }
            calories = parseInt(calories);

            newItem = new Item(id, name, calories);
            data.items.push(newItem);
            return newItem;
        },
        getTotalCalories: function() {
            let total = 0;
            data.items.forEach(item => {
                total += item.calories;
            })

            data.totalCalories = total
            return data.totalCalories;
        },
        getItemById: function(id) {
            let found;
            data.items.forEach(data => {
                if(data.id == id) {
                    found = data
                }
            })
            return found;
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return  data.currentItem;
        },

        updateItem: function(name, calories) {
            let found = null;
            calories = parseInt(calories);

            data.items.forEach(item => {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found;
        },
        deleteItem: function(id) {
            ids = data.items.map(item => {
                return item.id
            })

            const index = ids.indexOf(id);
            data.items.splice(index, 1);
        },

        logData: function(){
            return data;
        }

    }

})();


// UI controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    return {
        populateItemList: function(items){
            let html = '';
      
            items.forEach(function(item){
              html += `<li class="collection-item" id="item-${item.id}">
              <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>
            </li>`;
            });
      
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        addListItem: function(item){
            document.querySelector(UISelectors.itemList).style.display = 'block';
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },

        getinput: function() {
            return{
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        getSelectors: function() {
            return UISelectors;
        }
        ,
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
  
            listItems = Array.from(listItems);
      
            listItems.forEach(function(listItem){
              const itemID = listItem.getAttribute('id');
      
              if(listItem.id == `item-${item.id}`){
                document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>`;
              }
            });
        },
        deleteListItem: function (id) {
            document.querySelector(`#item-${id}`).remove();
            UICtrl.clearInput();
        },
        deleteAllItems: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
            // const li = document.createElement('li');
            // li.className = 'collection-item';
            // li.id = `item-${item.id}`;
            // li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            // <a href="#" class="secondary-content">
            //   <i class="edit-item fa fa-pencil"></i>
            // </a>`;
            // document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

    }
})();


// App controller

const App = (function ( UICtrl, ItemCtrl) {
    const loadEventListeners = function() {
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick)

        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

        document.querySelector(UISelectors.backBtn).addEventListener("click", (e) => {
            UICtrl.clearEditState();
            e.preventDefault()
        })

        document.querySelector(UISelectors.clearBtn).addEventListener("click", deleteAll);
    }


    function itemAddSubmit (e) {
        const input = UICtrl.getinput();

        if(input.name !== "" && input.calories !== "") {
            const userInput = ItemCtrl.addItem(input.name, input.calories);

            UICtrl.addListItem(newItem);

            UICtrl.clearInput();

            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            StorageCtrl.storeItem(userInput);
        }

        e.preventDefault();
    }
    

    function itemEditClick(e) {

        if(e.target.classList.contains("edit-item")) {
            const listId = e.target.parentElement.parentElement.id
            
            const listIdArr = listId.split("-")

            const id = parseInt(listIdArr[1]);
            const itemToEdit = ItemCtrl.getItemById(id);
            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
            
        }
        e.preventDefault()

    }

    function itemUpdateSubmit() {
        const input = UICtrl.getinput();

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        StorageCtrl.updateItemStorage(updatedItem);

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);

    }


    function itemDeleteSubmit(e) {
        const currentItem = ItemCtrl.getCurrentItem();
        ItemCtrl.deleteItem(currentItem.id);

        UICtrl.deleteListItem(currentItem.id);

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.deleteFromLS(currentItem.id);
        
        e.preventDefault();
    }


    function deleteAll () {
        UICtrl.deleteAllItems();

        localStorage.clear();

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);
    }


    return {
        init: function() {
            UICtrl.clearEditState()

            const items = ItemCtrl.getItems()

            if (items.length ==0) {
                UICtrl.hideList()
            }
            else {
                UICtrl.populateItemList(items);
            }

            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            loadEventListeners();
        }
    }
})( UICtrl, ItemCtrl);
App.init();