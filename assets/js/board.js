let TaskBoard = []
let BackgroundTaskBoard = [] 
let toDoCard = [];
let OverlayTask = []; 
let overlayContacts;
let overlayPriority;
let overlayLabel;
let overlayTaskBoardPosition;
let overlaySubtaskStorage;
let check = "/assets/svg/checkmark.svg";
let nocheck = "/assets/svg/rectangle.svg";

const databaseURL = 'https://join-remotestorage-default-rtdb.europe-west1.firebasedatabase.app';

let currentDraggedTask;
const technicalTaskLabel = '<img src="/assets/svg/Labels_Board_card_label_tourquise_Technical_Task.svg" alt="">'
const userStoryLabel = '<img src="/assets/svg/Labels_Board_card_label_blue_User_Story.svg" alt="">'

const searchfield = document.getElementById('boardInput').addEventListener('input', findTask);
let toDo = document.getElementById('toDoContainer');
let inProgress = document.getElementById('inProgressContainer');
let awaitFeedback = document.getElementById('awaitFeedbackContainer');
let done = document.getElementById('doneContainer');
let overlay = document.getElementById('overlayContainer');
let overlaySub = document.getElementById('overlaySubCheckbox');

/**
 * This function emptys the download and the working array.
 * 
 */
function cleanArrays(){
    TaskBoard = [];
    BackgroundTaskBoard = [];
}

/**
 * This function starts the downloading and processing of the tasks stored at the firebase.
 * 
 */
async function downloadData() {
    cleanArrays();
    try {
        const data = await fetchData();
        formatTasks(data);
    } catch (error) {
        handleError(error);
    }
    renderBoard();
}

/**
 * Fetches data from the database URL.
 * 
 * @returns {Promise} - A promise that resolves to the JSON data fetched.
 */
async function fetchData() {
    const response = await fetch(`${databaseURL}/tasks.json`);
    if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht in Ordnung');
    }
    return await response.json();
}

/**
 * This function restructures the downloaded data to fit into the usable format.
 * 
 * @param {object} data - the downloaded data.
 */
function formatTasks(data) {
    const formattedTasks = Object.values(data).map(formatTask);
    updateTaskBoard(formattedTasks);
}

/**
 * This "sub" function  of formatTasks(); restructures the downloaded data to fit into the usable format.
 * 
 * @param   {object} task the downloaded data.
 * @returns {Array} - the array is repeatedly retured to formatTask();     
 */
function formatTask(task) {
    return {
        label: task.label,
        title: task.title,
        description: task.description,
        date: task.date,
        subtask: Array.isArray(task.subtask) ? task.subtask : [],
        subtaskSum: Array.isArray(task.subtaskSum) ? task.subtaskSum : [],
        priority: task.priority || "", 
        assignedTo: Array.isArray(task.assignedTo) ? task.assignedTo : [],
        contactEmblem: Array.isArray(task.contactEmblem) ? task.contactEmblem : [],
        type: task.type,
        taskid: task.taskid
    };
}

/**
 * This function updates the task board with the formatted tasks.
 * 
 * @param {Array} formattedTasks - The formatted tasks to update the board with.
 */
function updateTaskBoard(formattedTasks) {
    BackgroundTaskBoard.push(...formattedTasks);
    TaskBoard = BackgroundTaskBoard;
}

/**
 * This function shows a console log information if the downloading & restructurin process failed.
 * 
 * @param {error} error - if the download failed.   
 */
function handleError(error) {
 console.error('Fehler beim Abrufen und Formatieren der Daten:', error);
}

/**
 * This function starts the render process of the board.
 * 
 */
function renderBoard(){ 
    taskContainer();                          
}

/**
 * This function starts the process of rendering the surface of the clicked on task.
 * 
 * @param {number} id - the id of the task clicked on.
 */
function overlayTask(id){    
    task = TaskBoard.findIndex(t => t.taskid === id);
    OverlayTaskPopup(task);
}

/**
 * This function updates the firebase storage with the lates changes at the task board.
 * 
 */
async function uploadData() {
    const databaseURL = 'https://join-remotestorage-default-rtdb.europe-west1.firebasedatabase.app';
    try {   const response = await fetch(`${databaseURL}/tasks.json`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TaskBoard) 
        });
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht in Ordnung');
        } 
        const data = await response.json();
    } catch (error) {
        console.error('Fehler beim Hochladen der Daten:', error);
    }     
}

/**
 * This function checks if the search field is empty, otherwise it starts the result showing function.
 * 
 */
function findTask(){
    const inputfield = document.getElementById('boardInput');
    const SearchedTask = inputfield.value;
    if (SearchedTask == ""){
        toDo.innerHTML = '';
        inProgress.innerHTML = '';
        awaitFeedback.innerHTML = '';
        TaskBoard = BackgroundTaskBoard;
        renderBoard();                
        return;  }                   
    
    showSearchResults(SearchedTask);    
}

/**
 * This function compares the title and description of existing tasks with the serch input.
 * It also hides the one not matching, with adding a class for it to do so.
 * 
 * @param {string} s searched text to compare with the existing tasks.
 */
function showSearchResults(s){
    for (let i = 0; i < BackgroundTaskBoard.length; i++) {
        const task = BackgroundTaskBoard[i];   
        let taskShowId = "Task" + task.taskid;
        document.getElementById(taskShowId).classList.add('hidden');     
        if (task.title.toLowerCase().includes(s.toLowerCase()) || task.description.toLowerCase().includes(s.toLowerCase())) {
            let taskShowId = "Task" + task.taskid;
            document.getElementById(taskShowId).classList.remove('hidden');    
        } 
    }
    if (TaskBoard.length === 0){
        alert("No matching Task found!");
    }    
}

/**
 * This function starts the highlightning.
 * 
 * @param {number} id - the id of the area to be higlightened.
 */
function startDragging(id){
    currentDraggedTask = id;
    highlight(id);
}

/**
 * This function establishes the ability to drop a task.
 * 
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * This function sets the type (status) of the dropped area to the dropped task.
 * 
 * @param {number} newType - the new type (status) of the task.
 * @param {number} id - the id of the dropped task.
 */
function dropAt(newType, id){
    for (i=0; i<TaskBoard.length; i++){
        taskToMove = TaskBoard[i].taskid;
        if (taskToMove == currentDraggedTask){
            TaskBoard[i].type = newType;                     
            uploadData();
            renderBoard();       
            removeHighlight(id);
            return;
        }
    }
}

/**
 * This function starts the rendering of the task popup.
 * 
 * @param {number} i - the id of the choosen/clicked task.
 */
function OverlayTaskPopup(i) {
    OverlayTask = TaskBoard[i];
    overlayTaskBoardPosition = i;
    overlayContactsRead(i);
    overlayPrio();
    overlayLabelCheck();
    overlaySubtaskCheck();  
    overlayRender();
    ifOverlay();
    removeTranslate();
    showShadow();
}

/**
 * This function sets the emblems of the popup task.
 * 
 * @param {number} i - the id of the choosen/clicked task.
 */
function overlayContactsRead(i){    
    overlayContacts = '';
    let emblem = '';
    if(TaskBoard[i].contactEmblem.length > 0){
     
        for (let c = 0; c < OverlayTask.contactEmblem.length; c++) {
            const contactName = OverlayTask.assignedTo[c];
            const src = OverlayTask.contactEmblem[c];
            emblem = src;
            overlayContacts += '<div class="overlay-assigned-to-contacts">' + emblem + '<div class="overlay-contact-name">' + contactName + '</div></div>';
        }
    }else{
    }    
}

/**
 * This function sets the priority emblems of the popup task.
 * 
 */
function overlayPrio(){
    overlayPriority = '';
    if (OverlayTask.priority === "low") {
        overlayPriority = "/assets/svg/capa_priority_low.svg";
    } else if (OverlayTask.priority === "medium") {
        overlayPriority = "/assets/svg/capa_1_medium_priority.svg";
    } else if (OverlayTask.priority === "urgent") {
        overlayPriority = "/assets/svg/Capa_2_Burger menue_Arrow_up.svg"
    }
}

/**
 * This function sets a timeout for removing a the class (slide - in - effect).
 * 
 */
async function removeTranslate(){
    await new Promise(resolve => setTimeout(resolve, 120));
    document.getElementById('overlayBoard').classList.remove('transition');
}

/**
 * This function sets a timeout for adding a the class (slide - in - effect).
 * 
 */
async function addTranslate(){
    await new Promise(resolve => setTimeout(resolve, 120));
    document.getElementById('overlayBoard').classList.add('transition');
}

/**
 * This function renders the subtasks for the poupup task.
 * 
 */
function overlaySubtaskCheck(){
    overlaySubtaskStorage = '';
    if (OverlayTask.subtask.length > 0){
        for(i = 0; i < OverlayTask.subtaskSum.length; i++){
            let checkmark = OverlayTask.subtaskSum[i];        
            if (checkmark == 1){
                overlaySubtaskStorage += `<div id="overlaySubtask4" class="overlay-subtask"><img class="overlay-checkbox-img" onclick="toggleCheckboxValue(${OverlayTask.taskid}, ${i})"  src=${check}> ${OverlayTask.subtask[i]}</div>
                `;}
                if (checkmark == 0){
                    overlaySubtaskStorage += `<div id="overlaySubtask4" class="overlay-subtask"><img class="overlay-checkbox-img" onclick="toggleCheckboxValue(${OverlayTask.taskid}, ${i})"  src=${nocheck}> ${OverlayTask.subtask[i]}</div>
                    `;}
                }
            }
}
     
/**
 * This function checks and sets the label for the popup task.
 * 
 */
function overlayLabelCheck(){
    if (OverlayTask.label == 1) {
        overlayLabel = technicalTaskLabel;
    } else {
        overlayLabel = userStoryLabel;
    }
}

/**
 * This function checks which kind of label is existing, and it sets the different text properties.
 * 
 */
function ifOverlay(){
    if (OverlayTask.subtask === undefined || OverlayTask.subtask === null) {
        document.getElementById('overlaySubtaskContainer').classList.add('hide'); }
        if (OverlayTask.label === 1) {
            document.getElementById('overlayDueDate').style.cssText = 'font-weight: 700; color: #42526E;';
            document.getElementById('overlayAssignedToText').style.cssText = 'font-weight: 700; color: #42526E;';
            document.getElementById('overlayPriorityText').style.cssText = 'font-weight: 700; color: #42526E;';
            document.getElementById('overlaySubstasksText').style.cssText = 'font-weight: 700; color: #42526E;';
        }
}

/**
 * This function sets sets the changed value of the subtask when clicked on the checkmark.
 * 
 * @param {number} position - position of the task at the taskboard array.
 * @param {number} taskid - id of the task.
 */           
function toggleCheckboxValue(taskid, position) {
    for (let i = 0; i < TaskBoard.length; i++) {
        const findTask = TaskBoard[i].taskid;
        let subtaskValue = TaskBoard[i].subtaskSum[position];
        if (findTask == taskid) {
            if (subtaskValue === 0) {
                TaskBoard[i].subtaskSum[position] = 1;
            } else {
                TaskBoard[i].subtaskSum[position] = 0;
            }
        }
    }
    overlaySubtaskCheck()
    toggleSubstaskRender()
}

/**
 * This function renders the subtask into the popup task.
 * 
 */          
function toggleSubstaskRender(){            
    let toggledSubtasks = document.getElementById('overlaySubtaskContainer');
    toggledSubtasks.innerHTML = `${overlaySubtaskStorage}`;
    renderBoard();
}