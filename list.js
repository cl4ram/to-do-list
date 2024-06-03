//listen for input data and submit form
//keep track of the submited items and its state
//show the items

const form = document.querySelector('.form');
const list = document.querySelector('.list');

let items = []; //this holds the state of the list => if the item is completed, how many items there are, etc. The current state of the application

function handleSubmit(e) {
    e.preventDefault(); // prevents the submited event
    const name = e.currentTarget.item.value; // grabs the info inside the input
    //since the input has a NAME attribute it is accesible from the input so we can grab it using .item.value
    const item = {
        name,
        id: Date.now(),
        completed: false,
    }; // object with all the data that is going to be needed 

    items.unshift(item); //add every item to the array
    e.target.reset(); // clear the input to add a new item
    list.dispatchEvent(new CustomEvent('itemsUpdated'));// fire off custom event that will update every instance where the items display is needed
}

function displayItems() {
    const html = items.map(item => {
        return `
        <li class="item">
            <input
                type="checkbox"
                value="${item.id}"
                ${item.completed ? "checked" : ""}/>
            <span class="itemName">${item.name}</span>
            <button
                aria-label="Remove ${item.name}"
                value="${item.id}"
                >x</button>
        </li>`}).join('');
    list.innerHTML = html
    
}

function mirrorToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(items))
}

function restoreFromLocalStorage(){
    const restoredList = JSON.parse(localStorage.getItem('items'));
    if (restoredList !== null) {
        items.push(...restoredList);
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
}

function deleteItem(id) {    
    items = items.filter(item => item.id !== id);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
    const itemRef = items.find(item => item.id === id);
    itemRef.completed = !itemRef.completed;
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

form.addEventListener('submit', handleSubmit); 
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
//event delegation => listen for click on the list but delegate the real event to the button click
list.addEventListener('click', function(e) {
    const value = parseInt(e.target.value)
    if (e.target.matches('button')) {
        deleteItem(value);
    }
    if (e.target.matches('input[type="checkbox"]')){
        markAsComplete(value)
    }
})
restoreFromLocalStorage();
