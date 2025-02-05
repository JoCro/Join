/**
 * This function enables the background shadow.
 * 
 */          
function showShadow(){ 
    document.getElementById('mainContainerOverlay').classList.add('taskOverlayContainerShadow');
}

/**
 * This function removes the shadow of the background.
 * 
 */    
function removeShadow(){ 
    document.getElementById('mainContainerOverlay').classList.remove('taskOverlayContainerShadow');
}

/**
 * This function removes added effects via adding a new task.
 * 
 */
function hideOverlay(){
    document.getElementById('addTaskOverlayContainer').classList.remove('addTaskOverlayContainerShowing');
    document.getElementById('addTaskOverlayContainer').classList.add('addTaskOverlayContainer');
    document.getElementById('body').classList.remove('noScroll');
    changeToActive('medium-btn');
    clearTheForm();
}

/**
 * This function deletes the task off the Taskboard array.
 * 
 * @param {number} i - position at the Array.
 */
function deleteTask(i){
    TaskBoard.splice(i, 1);
}

/**
 * Deletes a task from the overlay based on the task ID and index.
 * 
 * @param {number} idTask - The ID of the task to delete.
 * @param {number} i - The index of the task at the BackgroundTaskBoard.
 */
function overlayDeleteTask(idTask, i){         
    let taskToDelete = BackgroundTaskBoard[i];
    if (taskToDelete.taskid == idTask){
        TaskBoard.splice(i, 1);
        closeOverlay(idTask);
    }
}

/**
 * This function cloeses the popup task if clicked beside it and removes the optical effects.
 * 
 */
async function closeOverlaySideClick(){     
    if (document.getElementById('overlayBoard')) {
        document.getElementById('overlayBoard').classList.add('transition');}
    if (document.getElementById('boardEditTask')) {
        document.getElementById('boardEditTask').classList.add('transition');}        
    await new Promise(resolve => setTimeout(resolve, 120));
    overlay.innerHTML = ``;     
    removeShadow();
    renderBoard();
    findTask();
}

/**
 * This function cloeses the popup task and starts the upload of the changes and removes effects.
 * 
 */
async function closeOverlay(){ 
    if (document.getElementById('overlayBoard')) {
        document.getElementById('overlayBoard').classList.add('transition');}
    if (document.getElementById('boardEditTask')) {
        document.getElementById('boardEditTask').classList.add('transition');}        
    await new Promise(resolve => setTimeout(resolve, 120));
    overlay.innerHTML = ``;    
    renderBoard();
    findTask();
    uploadData();
    removeShadow();
}    

/**
 * This function is for adding a task with pre-set type (status).
 * 
 * @param {string} type - The type of task to add.
 */
function switchToAddTask(type){
    if(window.innerWidth < 1250){
        window.location.href="/add_task.html";
    }else{ 
        changeToActive('medium-btn');
        document.getElementById('addTaskOverlayContainer').classList.remove('addTaskOverlayContainer');
        document.getElementById('addTaskOverlayContainer').classList.add('addTaskOverlayContainerShowing');
        document.getElementById('addTaskForm').onsubmit = function(event){
            getTheDataForPostTask(event, type);            
        }        
        document.getElementById('body').classList.add('noScroll');        
    }
}

/**
 * The function deletes a subtask from the edited task.
 * 
 * @param {number} toDeleteId - The ID of the subtask to delete.
 */
function editDeleteSub(toDeleteId){
    let number = toDeleteId
    let deleteID = number - 10; //identification which subtask (the subtaskposition)
    EditTask.subtask.splice(deleteID, 1);
    EditTask.subtaskSum.splice(deleteID, 1);
    editRenderSubtask();
}

/**
 * The function clears the subtask input field.
 * 
 */
function emptyEditSub(){
    document.getElementById('subtaskEdit').value = '';
}

/**
 * The function starts the processes of the edit task overlay for loading the specific task.
 * 
 * @param {number} idTask - The ID of the task.
 * @param {number} i - The index of the task.
 */
function editTaskOverlay(idTask, i){    
    EditTask = TaskBoard[i];
    taskboardPosition = i;
    taskIdBoard = idTask;
    choosenContactsEdit = [];
    emptyEditTask();
    testForChoosenContact ();
    renderContactListEdit();    
    renderEditTask();
    renderEditDate();
    setDateListener();
    renderChoosenContactsEmblems();
    editRenderPriority();
    editRenderSubtask();
}

/**
 * The function clears the edit task for editing.
 * 
 */
function emptyEditTask(){    
    editTask = '';
    editTask = EditTask;
    editTitle = editTask.title;
    editDescription = editTask.description;    
    overlay.innerHTML = '';    
}

/**
 * The function stores the new data for the edited task.
 * 
 * @param {number} taskboardPosition - The position of the task on the board.
 */
function storeNewData(taskboardPosition){ 
    deleteTask(taskboardPosition); //1.
    TaskBoard.push(EditTask);
    closeOverlay();   
}

/**
 * The function toggles the search button and updates the search display.
 * 
 */
function clickButtonSearch(){
    let inputElement = document.getElementById('InputSearchEdit');
    let inputButton = document.getElementById('ContactListEditButton');
    if (searchButton === 0){
        searchButton = 1;
        document.getElementById('contact-list-container').classList.remove('hiddenMenue');
        inputButton.innerHTML = `<img onclick="clickButtonSearch();" src="/assets/svg/arrow_drop_up.svg" alt="openContactList">`
    }   else if (searchButton === 1){
        searchButton = 0;
        document.getElementById('contact-list-container').classList.add('hiddenMenue');
        inputElement.value = '';
        inputButton.innerHTML = `<img onclick="clickButtonSearch();" src="/assets/svg/arrow_drop_downaa.svg" alt="openContactList">`
        filterContactsEdit();     
    }   return searchButton;
}

/**
* The function checks the input field value and triggers search filtering.
* 
*/
function checkInputFieldValue(){
    const inputElement = document.getElementById('InputSearchEdit');
    const value = inputElement.value.trim(); 
    if (value) {    
    searchButton = 0;
    clickButtonSearch();
    filterContactsEdit({ target: { value } }); 
}
}

/**
 * The function sets up the date listener for the edited task.
 * 
 */
function setDateListener(){
    document.getElementById('InputSearchEdit').addEventListener('input', filterContactsEdit);
    document.getElementById('titleEdit').addEventListener('input', getTitle);
    document.getElementById('descriptionEdit').addEventListener('input', getDescription);
}

/**
 * The function clears the input field.
 * 
 */
function clearInputField() {
    document.getElementById('InputSearchEdit').value = '';
}

/**
 * This function renders the surface for moving task while responsive mode.
 * 
 * @param {number} i - shows which task to move
 * @param {event} event - stops other onclick events from processing.
 */
async function renderMoveTask(event, i){
    event.stopPropagation();
    taskToMove = i;
    document.getElementById('taskSwitchCategory').classList.remove('hide');
    await new Promise(resolve => setTimeout(resolve, 200));
    document.getElementById('taskSwitchCategory').classList.remove('transition')
    showShadow();
}

/**
 * This function closes the move task surface.
 * 
 */
async function closeMoveTask(){
    document.getElementById('taskSwitchCategory').classList.add('transition')    
    await new Promise(resolve => setTimeout(resolve, 120));
    document.getElementById('taskSwitchCategory').classList.add('hide');    
    removeShadow();
}

/**
 * This function sets the new type (status) of the task.
 * 
 * @param {string} newType - The new category type to move the task to.
 */
function moveCategoryTask(newType){
    TaskBoard[taskToMove].type = newType
    uploadData();
    renderBoard();
    findTask();
}

/**
 * This function highlights the area on which the task will be dropped.
 * 
 * @param {number} id - this is the id of the area to be highlighted.
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * This function de-highlights the area on which the task will be dropped.
 * 
 * @param {number} id - this is the id of the area to remove the highlight.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}