/**
* This function returns all names of the assigned Contacts in form of an array
* 
* @returns {Array} listOfAssignedNames - An array with all Names of the assigned Contacts
*/
function fetchAllAssignedContacts(){
    let listOfCheckedContacts = document.getElementsByClassName('checked');
    let listOfAssignedNames = [];
    for (let i = 0; i < listOfCheckedContacts.length; i++) {
        const contact = listOfCheckedContacts[i].childNodes[0].children[1].innerHTML;
        listOfAssignedNames.push(contact);
    }
    return listOfAssignedNames;
}

/**
* This eventlistener is triggered when the complete contect has loaded and executes the function addEventListenerToInput
*/
document.addEventListener('DOMContentLoaded', addEventListenerToInput);

/**
* This eventlistener is triggered when the complete content has loaded and adds the function the the subtask-inputfield, that recognizes the press of the enter-key and then executes the function addToSubtasks
*/
document.addEventListener('DOMContentLoaded', () => {
    let subtaskInputField = document.getElementById('subtask-input');
    subtaskInputField.addEventListener('keydown', function(event){
        if(event.key === 'Enter'){
            event.preventDefault();
            addToSubtasks();
        }
    })
});

/**
* This eventlistener enables clicking on the assign-contacts-field and then shows the assignable contacts. It also hides them, when the user clicks somewhere except the assign-contacts-field
* 
*/
document.addEventListener('click', function(event){
    let optionContainer = document.getElementById('optionContainer');
    if(!optionContainer.contains(event.target) && event.target != document.getElementById('contact-selector')){
        let button = document.getElementById('dropdown-btn');
        hideContactsToAssign(button);
    }else{
        renderAssignSelector();
        showContactsToAssign();
    }
})

/**
* This function is used to reset the Values of all form-elements 
*/
function clearTheForm(){
    document.getElementById('list-of-subtasks').innerHTML=``; 
    setTimeout(() => {
        document.getElementById('addTaskForm').reset();
    }, 20);
    changeToActive('medium-btn');
    let options = document.getElementsByClassName('checked');
    for (let index = 0; index < options.length;) {
        const element = options[index];
        let value = getTheValueForFunction(element);
        assignTheContact(element,value);
    }
    document.getElementById('assignedContactPics').innerHTML = ``;
}

/**
* This function is used to return the number of the given elements id, so it can be toggled by executing the assignTheContact-function.
* 
* @param {HTMLElement} element - this parameter is a html element of the html collection from elements with the class checked
* @returns {number} newValue - the number of the elements id
*/
function getTheValueForFunction(element){
    let id = element.id;
    let newValue = parseInt(id.charAt(id.length - 1), 10);
    return newValue;
}