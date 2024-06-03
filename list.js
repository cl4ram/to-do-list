const form = document.querySelector('.form');
const list = document.querySelector('.list');

let items = [];

function handleSubmit(e) {
    e.preventDefault();
    const name = e.currentTarget.item.value;
    const item = {
        name,
        id: Date.now(),
        completed: false,
    };

    items.unshift(item);
    e.target.reset();
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
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
