let subtaskCount = 0;
let priorityOfTask;
let idOfNewTask;

/**
* This function is used to determine, which priority-button will be highlighted 
* 
* @param {string} id - This parameter has to be an id of one of the priority-buttons
*/
function changeToActive(id){
    let possibleId = ['urgent-btn', 'medium-btn', 'low-btn'];
    possibleId.splice(possibleId.indexOf(id), 1);
    priorityOfTask = id.split('-')[0];
    let element = document.getElementById(id)
    element.classList.toggle(`${id}-active`);
    for (let i = 0; i < possibleId.length; i++) {
        const element = possibleId[i];
        document.getElementById(element).classList.remove(`${element}-active`);
    }
}

/**
* This function is used to either make subtask buttons visible and hide the + sign or vice versa.
* 
*/
function changeButtons(){
    if (document.getElementById('subtask-buttons').classList.contains('none')){
        document.getElementById('subtask-buttons').classList.remove('none');
        document.getElementById('subtask-plus-button-div').classList.add('none');
    }
}

/**
* This function checks, if the value of the subtask-inputfield is empty. If it`s empty, the subtask buttons will be hidden and the + sign reappears.
* 
*/
function onSubtaskBlur(){
    let inputfield = document.getElementById('subtask-input');
    if(inputfield.value === ''){
        if(!document.getElementById('subtask-buttons').classList.contains('none')){
            document.getElementById('subtask-buttons').classList.add('none');
            document.getElementById('subtask-plus-button-div').classList.remove('none');
        }
    }
}

/**
* This function is used to check if the subtask-input exists. If it exists, an eventlistener(blur) will be given to it that will execute the function onSubtaskBlur every time when it looses focus
* 
*/
function addBlurListener(){
    let subtaskInput = document.getElementById('subtask-input');
    if(subtaskInput){
        subtaskInput.addEventListener("blur", onSubtaskBlur);
    }
}

/**
* This executes the function addBlurListener, when the page is completely loaded
* 
*/
document.addEventListener("DOMContentLoaded", addBlurListener);

/**
* This function increases the subtaskCount by 1 and adds the value of the subtask, that was given in the subtask-inputfield, to the subtask-list in form of a list item. Then the value of the subtask-input is reseted.
* 
*/
function addToSubtasks(){
    subtaskCount += 1;
    let inputfield = document.getElementById('subtask-input');
    let subtaskList = document.getElementById('list-of-subtasks');
    if(inputfield.value != ''){
        subtaskList.innerHTML += `<li id=subtask${subtaskCount}><div class="content-of-subtask"><div id="textOfSubtask${subtaskCount}">${inputfield.value}</div> <div class="edit-subtask-div"><button class="edit-btn" onclick="editSubtask('${subtaskCount}')"></button><div class="btn-divider"></div><button onclick="deleteElementById('subtask${subtaskCount}')" class="trash-btn"></button></div></div></li>`;
    }
    inputfield.value = ``;
    onSubtaskBlur();
}

/**
* This function is used to edit the clicked Subtask by showing the value of the subtask in an inputfield. The value of it can be overwritten and saved to the clicked subtask.
* 
* @param {string} id - this parameter is the id of the current subtask and is given by the call of the function through clicking the Add-Subtask-Button 
*/
function editSubtask(id){
    let subtaskToChange = document.getElementById(`subtask${id}`);
    let valueToInsert = document.getElementById(`textOfSubtask${id}`).innerHTML;
    if(subtaskToChange){
        let inputToEdit = document.createElement('div');
        inputToEdit.setAttribute('id', `subtask${id}`);
        inputToEdit.innerHTML = `<input type="text" value="${valueToInsert}" id="edit-${subtaskToChange.getAttribute('id')}"><div class="edit-subtask-buttons"><button onclick="deleteSubtask('subtask${id}')" class="trash-btn"></button><div class="btn-divider"></div><button onclick="confirmEditedSubtask('${inputToEdit.id}', '${id}')" class="correct-btn"></button></div>`
        inputToEdit.classList.add('renameSubtaskDiv');
        inputToEdit.focus();
        subtaskToChange.parentNode.replaceChild(inputToEdit, subtaskToChange);
    }
}

/**
* This function is used to change the past value of the subtask to the new overwritten value from the inputfield. It also changes the element from an inputfield back to a list item
* 
* @param {string} id - this is the id of the clicked subtask given by the function editSubtask
* @param {string} functionValue  - this is the number, which will be used to determine the correct subtask in the function. 
*/
function confirmEditedSubtask(id, functionValue){
    let subtask = document.getElementById(id);
    let editedText = document.getElementById(`edit-subtask${functionValue}`).value;
    if(subtask){   
        let subtaskToConfirm = document.createElement('li');
        subtaskToConfirm.setAttribute('id', id);
        subtaskToConfirm.innerHTML = `<div class="content-of-subtask"><div id="textOfSubtask${functionValue}">${editedText}</div><div class="edit-subtask-div"><button class="edit-btn" onclick="editSubtask('${functionValue}')"></button><div class="btn-divider"></div><button class="trash-btn" onclick="deleteElementById('subtask${functionValue}')"></button></div></div>`
        subtask.parentNode.replaceChild(subtaskToConfirm, subtask);
    }
}

/**
* This function is used to delete the chosen subtask by clicking the delete/bin-button
* 
* @param {string} id - this is the id of the subtask-element
*/
function deleteSubtask(id){
    let subtaskToDelete = document.getElementById(id);
    subtaskToDelete.parentNode.removeChild(subtaskToDelete);  
}

/**
* This function is used to cancel the current subtask. The value of the Inputfield will be reseted and the function onSubtaskBlur will be executed
* 
*/
function cancelSubtask(){
    let inputfield = document.getElementById('subtask-input');
    inputfield.value = '';
    onSubtaskBlur();
}

/**
* This function is used to delete a subtask
* 
* @param {string} elementId - This parameter is the id of the element which the user wants to delete. It is given on call of the function
*/
function deleteElementById(elementId){
    let element = document.getElementById(elementId);
    if (element){
        element.parentNode.removeChild(element);   
    }
}

/**
* This function is used to give the assigend-to-container every contact thats in the array contactsAsJson, so they can be displayed by clicking the assign-field
* 
*/
function renderAssignSelector(){
    if(document.getElementById('optionContainer').innerHTML == ``){
        document.getElementById('optionContainer').innerHTML = ``;
        for (let i = 0; i < contactsAsJson.length; i++) {
            const contact = contactsAsJson[i];
            document.getElementById('optionContainer').innerHTML += `<div id="contact${i}" class="option" onclick="assignTheContact(this,${i})"><div class="contactNameDiv"><svg class="profile_pic" width="42px" height="42px">
            <circle cx="21" cy="21" r="20" stroke="white" stroke-width="2" fill="${contact['color']}" />
            <text x="12" y="25" fill="white" font-size="12px">${contact['vorname'].charAt(0)}${contact['name'].charAt(0)}</text>
            </svg><div class="contactNames">${contact['vorname']} ${contact['name']}</div></div><img id="checkbox${i}" class="checkbox-icon" src="/assets/svg/rectangle.svg"></div>`;
        }
    }
}

/**
* This function is used to change the css of the clicked div, that it can be clearly seen as checked. It also changes the icon from an empty checkbox to a checked-checkbox or vice versa by clicking the contact again.
* 
* @param {HTMLDivElement} element - The <div> element which represents the clicked contact
* @param {number} checkboxID - This number will be used as the id of the checkbox in the function below
*/
function assignTheContact(element, checkboxID){
    document.getElementById(element.id).classList.toggle('checked');
    let checkbox = document.getElementById(`checkbox${checkboxID}`);
    let src = checkbox.src;
    if(document.getElementById(element.id).classList.contains('checked')){
        checkbox.src = '/assets/svg/checkboxWhite.svg';
    }else{
        checkbox.src = '/assets/svg/rectangle.svg';
    }
    assignPicturesToDiv();
}

/**
* This function is used to display the profile-pics of the assigned contacts in the assignedContactPics-<div>. It will be executed every time, when a contact is assigned
* 
*/
function assignPicturesToDiv(){
    let checkedContacts = document.getElementsByClassName('checked');
    document.getElementById('assignedContactPics').innerHTML = ``;
    for (let index = 0; index < checkedContacts.length; index++) {
        const element = checkedContacts[index];
        document.getElementById('assignedContactPics').innerHTML += `<div>${element['childNodes'][0]['firstChild'].outerHTML}</div>`;
    }
}

/**
* This function displays all contacts from the contactsAsJson-Array
* 
*/
function showContactsToAssign(){
    document.getElementById('optionContainer').classList.remove('none');
    if(!document.getElementById('dropdown-btn').classList.contains('active')){
        document.getElementById('dropdown-btn').classList.add('active');
    }
}

/**
* This function is used to filter the displayed contacts by the value of the assign-inputfield. The only displayed contacts will be the contacts that share the value of the inputfield with their names
* 
*/
function filterAssignedContacts(){
    let assignableContacts = document.getElementsByClassName('contactNames');
    let input = document.getElementById('contact-selector');
    let filter = input.value.toLowerCase();
    for (let i = 0; i < assignableContacts.length; i++) {
        const element = assignableContacts[i];
        const text = element.innerText;
        if(!text.toLowerCase().includes(filter)){
            hideThisContact(`contact${i}`);
        }else{
            showThisContact(`contact${i}`);
            if(!document.getElementById(`contact${i}`).classList.contains('checked')){
                document.getElementById(`checkbox${i}`).src = '/assets/svg/rectangle.svg';
            }   
        }
    }
}

/**
* This function is used to remove the current contact from display
* 
* @param {string} id - this parameter was given by the function filterAssignedContacts and is the id of the contact 
*/
function hideThisContact(id){
    document.getElementById(id).classList.add('none');
    document.getElementById(id).classList.remove('option');
}

/**
* This function is used to show the current contact
* 
* @param {String}  id - this parameter was given by the function filterAssignedContacts and is the id of the contact 
*/
function showThisContact(id){
    document.getElementById(id).classList.add('option');
    document.getElementById(id).classList.remove('none');
}

/**
* This function adds an eventlistener to the assing-inputfield which executes the filterAssignedContacts-function every time, some input is typed in.
* 
*/
function addEventListenerToInput(){
    document.getElementById('contact-selector').addEventListener('input',filterAssignedContacts);
}

/**
* This function is used to hide all assignable contacts and determines if the dropdown button either points up or down
* 
* @param {string} button - the id of the dropdown-button 
*/
function hideContactsToAssign(button){
    document.getElementById('optionContainer').classList.add('none');
    if(button.classList.contains('active')){
        button.classList.toggle('active');
    } 
}

/**
* This function provides the sumitted formular from being reloaded and executes the functions below in order to complete and post the task
* 
* @param {object} event - This is an event-object passed by an eventlistener from a formular
* @param {String} tasktype - the type of a task, that determines the category of the task. By default it´s 0 for the category "to-do"
*/
async function getTheDataForPostTask(event, tasktype) {
    let type = Number(tasktype);
    event.preventDefault();
    const data = await fetchTheData(type);
    await postData('tasks', data);
    await showNotification();
}

/**
* This function is used to get all the Data for the post-ready task in form of an JSON-Object which is represented by the variable data
* 
* @param {string} type - the type of a task, that determines the category of the task. By default it´s 0 for the category "to-do"
* @returns {JSON} data - the complete data-set for the current task
*/
async function fetchTheData(type){
    let data = {
        title: document.getElementById('title-input').value,
        description: document.getElementById('descriptionInput').value,
        priority: priorityOfTask,
        assignedTo: fetchAllAssignedContacts(),
        contactEmblem: getTheEmblemsOfAssignedContacts(),
        date: document.getElementById('datePicker').value,
        subtask: getTheSubtasksOfTask(),
        label: getTheCategoryOfTask(),
        subtaskSum: getTheSubtaskStatus(getTheSubtasksOfTask()),
        type: type,
        taskid: await getTheIdOfTask()
    };
    return data;
}

/**
* This functino is used to display the animated "task added to board"-notification with a little delay. after the notification showed up, the window-location will change to the board.html page
* 
*/
async function showNotification() {
    const notificationElement = document.getElementById('taskAddedNotification');
    notificationElement.classList.remove('none');
    setTimeout(() => {
        if(window.location.href.includes('board.html')){
            notificationElement.classList.remove('notificationDiv');
            notificationElement.classList.add('notificationDivShowing');
        }else{
            notificationElement.classList.add('showNotification');
        }
    }, 100);
    setTimeout(function() {
        window.location.href = "/board.html";
    }, 1000);
}

/**
* This function is used to determine the ID of the current task. It fetches the Value of the variable taskId from the database and changes the value of the variable idOfNewTask to that value +1. If there is no variable to fetch, the variable idOfNewTask becomes 0 and this value will be posted to the database with the name taskId
* 
* @returns {number} idOfNewTask - The id of the current task
*/
async function getTheIdOfTask(){
    let id = await loadData('taskId');
    if(id != null){
        idOfNewTask = id + 1;
        await putData('taskId', idOfNewTask);
    }else{
        idOfNewTask = 0;
        await putData('taskId', idOfNewTask);
    }
    return idOfNewTask;  
}

/**
* This function gets all subtasks that are given to the current task and sets the value of the subtaskStatus for each subtask to 0 (undone)
* 
* @param {Array} subtasks - an array with all the given subtasks for the current task 
* @returns {Array} subtaskStatus - an array with a status for each of the subtasks from the current task. The status can be 0 (undone) or 1 (done). Be default/creation of a task, it`s always 0
*/
function getTheSubtaskStatus(subtasks){
    let subtaskStatus = [];
    for (let index = 0; index < subtasks.length; index++) {
        const element = subtasks[index];
        subtaskStatus.push(0); 
    }
    return subtaskStatus;
}

/**
* This function is used to determine and returning the Category of the current Task, choosen by the user in taskCreation. 
* 
* @returns {number} selectedCategory - this number can be either 0(no category), 1(technical task) or 2(user story)
*/
function getTheCategoryOfTask(){
    let selection = document.getElementsByClassName('selector dropdown-img');
    let selectedCategory = selection[0].options.selectedIndex;
    return selectedCategory
}

/**
* This function is used to return all the Text of each Subtask an push them into an array, which can be used to post the task
* 
* @returns {Array} subtasksAsText - an array with the values of each subtask that were given to the task by the user in the task creation
*/
function getTheSubtasksOfTask(){
    let listOfSubtasks = document.getElementsByClassName('content-of-subtask');
    let subtasksAsText = [];
    for (let index = 0; index < listOfSubtasks.length; index++) {
        const subtask = listOfSubtasks[index].childNodes[0].innerHTML;
        subtasksAsText.push(subtask);
    }
    return subtasksAsText;
}

/**
* This function is used to return all profile pics of each contact, that is assigned to the current task
* 
* @returns {Array} listOfContactEmblems - an array with the html-code for each assigned contact´s profile picture
*/
function getTheEmblemsOfAssignedContacts(){
    let listOfCheckedContacts = document.getElementsByClassName('checked');
    let listOfContactEmblems = [];
    for (let index = 0; index < listOfCheckedContacts.length; index++) {
        const emblem = listOfCheckedContacts[index].childNodes[0].firstChild.outerHTML;
        listOfContactEmblems.push(emblem);
    }
    return listOfContactEmblems;
}

