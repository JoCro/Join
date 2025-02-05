let editContacts = []; 
let editContactsShow = []; 
let EditTask = []; 
let contactListEdit; 
let taskboardPosition = 0;
let searchButton = 0;
let choosenContactsEdit = []; 
let newSubtasks = [];
let taskIdBoard = 0;
let newAssignedToName = [];
let newAssignedToSvg = [];
let editTitle;
let editDescription;
let editTask;

/**
 * Adds a task in the database.
 * 
 */
async function addEditTaskToFirebase() {
    const databaseURL = 'https://join-remotestorage-default-rtdb.europe-west1.firebasedatabase.app';
    try {
        const response = await fetch(`${databaseURL}/tasks.json`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json'
            }, body: JSON.stringify(EditTask)
        });
        if (!response.ok) { throw new Error('Netzwerkantwort war nicht in Ordnung');
        }
        const data = await response.json();
    } catch (error) {
        console.error('Fehler beim Hinzufügen des neuen Tasks:', error); }
}

processContacts(); 

/**
 * The function loads and processes contacts for editing a task.
 * 
 * @returns {Array} - An array of contact data.
 */
async function loadContacts() {
    const FIREFIREBASE_URL = 'https://join-remotestorage-default-rtdb.europe-west1.firebasedatabase.app/';
    const endpoint = 'contacts';
    const url = `${FIREFIREBASE_URL}${endpoint}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return Object.values(data); 
    } catch (error) {
        console.error('Fehler beim Laden der Kontakte:', error);
        throw error; }
}

/**
 * The function creates the SVG template for a contact.
 * 
 * @param {string} vorname - The first name of the contact.
 * @param {string} nachname - The last name of the contact.
 * @param {string} color - The color of the profile picture.
 * @returns {string} - The SVG template for the contact.
 */
function createContactEdit(vorname, nachname, color) {
    const vornameInitial = vorname.charAt(0).toUpperCase(); 
    const nachnameInitial = nachname ? nachname.charAt(0).toUpperCase() : ''; 
    const svgTemplate = `<svg class="profile_pic" width="42px" height="42px">
        <circle cx="21" cy="21" r="20" stroke="white" stroke-width="2" fill="${color}"></circle>
        <text x="12" y="25" fill="white" font-size="12px">${vornameInitial}${nachnameInitial}</text>
    </svg>`;
    return svgTemplate;
}

/**
 * The function prepares every contacts into a usable format for the edit task.
 * 
 */
async function processContacts() {
    editContacts = [];
    editContactsShow = [];
    let editContactId = 0;
    try {   const contacts = await loadContacts();
            contacts.forEach(contact => {
            const { vorname, name = '', color } = contact;
            const svg = createContactEdit(vorname, name, color);
            const contactData = { checked: 0, id: editContactId++, assignedTo: [vorname, name], contactEmblem: svg };
            editContacts.push(contactData);
            editContactsShow.push(contactData);
        });
    } catch (error) { console.error('Fehler bei der Verarbeitung der Kontakte:', error);
        throw error; }
}

/**
 * The function filters contacts based on the search input value or event.
 * 
 * @param {Event | string} eventOrValue - The event object or search value.
 */
function filterContactsEdit(eventOrValue) {
    let searchedContact = '';
    if (eventOrValue && eventOrValue.target) {
        searchedContact = eventOrValue.target.value.toLowerCase(); 
    } else {
        searchedContact = ''; 
    }   if (searchedContact === "") {
        editContactsShow = editContacts;
        renderContactListEdit();
        const SearchList = document.getElementById('contact-list-container');
        SearchList.innerHTML = contactListEdit;    
        return;
    } filteredContacts(searchedContact);       
}

/**
 * The function filters contacts based on the searched contact.
 * 
 * @param {string} searchedContact - The contact to search for.
 */
function filteredContacts(searchedContact){
    editContactsShow = [];
    for (let i = 0; i < editContacts.length; i++) {
        let prename = editContacts[i].assignedTo[0].toLowerCase(); 
        let name = editContacts[i].assignedTo[1].toLowerCase();    
        if (prename.includes(searchedContact) || name.includes(searchedContact)) {
            const foundContact = editContacts[i];
            editContactsShow.push(foundContact);  }
    }       renderContactListEdit();
        document.getElementById('contact-list-container').classList.remove('hiddenMenue');
        const SearchList = document.getElementById('contact-list-container');
        SearchList.innerHTML = contactListEdit;  
        searchButton = 0;
        clickButtonSearch();
}

/**
 * The function sets the priority of the edited task.
 * 
 * @param {string} priority - The priority level to set.
 */
function editSelectPriority (priority){
    EditTask.priority = priority;
    editRenderPriority();
}

/**
 * The function selects or deselects a contact for the edited task.
 * 
 * @param {number} contactId - The ID of the contact to select.
 */
function selectContact (contactId){    
    for (i=0; i<editContacts.length; i++){
        let compareId = editContacts[i].id;
        let compareCheck = editContacts[i].checked;
        if (compareId === contactId && compareCheck === 1){
            editContacts[i].checked = 0;
            selectContactIf();
            return;
        } else if (compareId === contactId && compareCheck === 0){
            editContacts[i].checked = 1;
            selectContactIf();
            return;
         }          
    }  filterContactsEdit();    
}

/**
 * The function processes contacts if selected and updates the the edited task.
 * 
 */
function selectContactIf(){
    choosenContacts();
    renderContactListEdit();
    filterContactsEdit();
    renderChoosenContactsEmblems();   
    checkInputFieldValue();
}

/**
 * The function adds a new/edited subtask to the edited task.
 * 
 */
function editAddSub(){
    const inputField = document.getElementById('subtaskEdit');
    const addSub = inputField.value;
    EditTask.subtask.push(addSub);
    EditTask.subtaskSum.push(0);
    inputField.value = '';
    editRenderSubtask();
}

/**
 * The function edits the subtask of the edited task.
 * 
 * @param {number} toEditSub - The subtask to edit.
 */
function editEditSub(toEditSub){
    let number = toEditSub;
    let addID = number - 10; 
    const inputField = document.getElementById('subtaskEdit');
    let toEdit = EditTask.subtask[addID];
    inputField.value = toEdit;
    editDeleteSub(toEditSub);
}

/**
 * The function sets the title of the current task to edit.
 * 
 */
function getTitle(){
    const inputField = document.getElementById('titleEdit'); 
    const value = inputField.value.trim();
    EditTask.title = value;
}

/**
 * The function sets the description of the task to edit.
 * 
 */
function getDescription(){
    const inputField = document.getElementById('descriptionEdit');
    const value = inputField.value.trim();
    EditTask.description = value;
}

/**
 * The function gets the date of the task to edit.
 * 
 */
function getDate(){ 
    const inputField = document.getElementById('Edit_Input');
    const value = inputField.value;
}

/**
 * The function renders the subtasks of the edited task.
 * The idCounter preserves a speific id for the rendered subtask.
 * 
 */
function editRenderSubtask(){            
        let editSubtask = document.getElementById('editRenderSubtasks');
        editSubtask.innerHTML = ``;        
        let idCounter = 9;
    for (i=0; i<EditTask.subtask.length; i++){
        let editSubAdd = EditTask.subtask[i];
        idCounter++;
        editSubtask.innerHTML += `<div class="edit-task-subtask"><div>&bull; ${editSubAdd}</div><div class="edit-subtask-buttons-2"><img class="edit-subtask-buttons-img" onclick="editEditSub(${idCounter})"src="/assets/svg/Subtasks%20icons11-4.svg" alt="edit"><div class="placeholder-div">|</div><img class="edit-subtask-buttons-img" onclick="editDeleteSub(${idCounter})" src="/assets/svg/delete.svg" alt="delete"></div></div>`
    }
}

/**
 * The function renders the priority buttons for the edited task.
 * 
 */
function editRenderPriority(){
    let editTaskPriority = EditTask.priority;  
    let editPriority = document.getElementById('editPriorityButtonsdiv');  
    if (editTaskPriority === "urgent"){editPriority.innerHTML = `<button onclick="editSelectPriority('urgent')" class="edit-priority-buttons background-color-red"><h4 style="font-weight: 400;">Urgent</h4><img src="/assets/svg/Prio alta-2.svg" alt="urgent">
        <button onclick="editSelectPriority('medium')" id="editButtonMedium"class="edit-priority-buttons"><h4 style="font-weight: 400;">Medium</h4><img src="/assets/svg/capa_1_medium_priority.svg" alt="medium"></button>
        <button onclick="editSelectPriority('low')" id="editButtonLow" class="edit-priority-buttons"><h4 style="font-weight: 400;">Low</h4><img src="/assets/svg/capa_priority_low.svg" alt="low"></button>`;
    } else if (editTaskPriority === "medium"){editPriority.innerHTML = `<button onclick="editSelectPriority('urgent')" class="edit-priority-buttons"><h4 style="font-weight: 400;">Urgent</h4><img src="/assets/svg/Capa_2_Burger menue_Arrow_up.svg" alt="urgent">
        <button onclick="editSelectPriority('medium')" id="editButtonMedium"class="edit-priority-buttons background-color-yellow"><h4 style="font-weight: 400;">Medium</h4><img src="/assets/svg/Prio media-2.svg" alt="medium"></button>
        <button onclick="editSelectPriority('low')" id="editButtonLow" class="edit-priority-buttons"><h4 style="font-weight: 400;">Low</h4><img src="/assets/svg/capa_priority_low.svg" alt="low"></button>`;
    } else if (editTaskPriority === "low"){editPriority.innerHTML =`<button onclick="editSelectPriority('urgent')" class="edit-priority-buttons"><h4 style="font-weight: 400;">Urgent</h4><img src="/assets/svg/Capa_2_Burger menue_Arrow_up.svg" alt="urgent">
        <button onclick="editSelectPriority('medium')" id="editButtonMedium"class="edit-priority-buttons"><h4 style="font-weight: 400;">Medium</h4><img src="/assets/svg/capa_1_medium_priority.svg" alt="medium"></button>
        <button onclick="editSelectPriority('low')" id="editButtonLow" class="edit-priority-buttons background-color-green"><h4 style="font-weight: 400;">Low</h4><img src="/assets/svg/Prio baja-2.svg" alt="low"></button>`;    
    } 
}

/**
 * The function checks for selected contacts of the edited task, and fills the related array.
 * 
 */
function testForChoosenContact (){
    for (i=0; i<editContactsShow.length; i++){
        editContactsShow[i].checked = 0;
    }
    for (i=0; i<EditTask.assignedTo.length; i++){
        let taskAssignedto = EditTask.assignedTo[i];
    for (c=0; c<editContacts.length; c++){
        let fullname = '';
        let vorname = editContacts[c].assignedTo[0];
        let nachname = editContacts[c].assignedTo[1];
        fullname = vorname + ' ' + nachname;
        if (fullname === taskAssignedto){
            editContacts[c].checked = 1;
        }  }  } choosenContacts();
}  

/**
 * The function checks for selected contacts of the edited task, and fills the related array.
 * Its related to the testForChoosenContact().
 * 
 */
function choosenContacts(){
    choosenContactsEdit = [];
    for (i=0; i<editContacts.length; i++){
        let checktest = editContacts[i].checked;
        let testedContact = editContacts[i];
        if (checktest === 1){            
            choosenContactsEdit.push(testedContact);
        }    }    
    EditTask.contactEmblem = []; 
    EditTask.assignedTo = [];
    for (let i = 0; i < choosenContactsEdit.length; i++) {
        let fullName = choosenContactsEdit[i].assignedTo.join(' ');
        EditTask.assignedTo.push(fullName);
        EditTask.contactEmblem.push(choosenContactsEdit[i].contactEmblem);    }
}

/**
 * The function renders the selected contact emblems for the edited task.
 * 
 */
function renderChoosenContactsEmblems(){
    let editEmblems = document.getElementById('choosenContacts');
    editEmblems.innerHTML = ``;
    for (i=0; i<choosenContactsEdit.length; i++){
        let choosenEmblem = choosenContactsEdit[i].contactEmblem;  
        editEmblems.innerHTML += `${choosenEmblem}`;         
        if (i===3){
            let amountEmblems = choosenContactsEdit.length - 4;
            if (amountEmblems === 0){break;}
            editEmblems.innerHTML+= `<div class="card-contact-emblems-others" style="font-weight: bold; font-size: 16px;">+${amountEmblems}</div>`
            break;
        }     
    }    
}

/**
 * The function renders the contact list for editing the choosen contacts.
 * 
 * @returns {string} - The HTML content of the contact list.
 */
function renderContactListEdit() { 
    contactListEdit = ''
    for (i=0; i<editContactsShow.length;i++){  
        let contactCheck = editContactsShow[i].checked;   
        let editContactId = editContactsShow[i].id;
        let prename = editContactsShow[i].assignedTo[0];
        let name = editContactsShow[i].assignedTo[1];
        let userIcon = editContactsShow[i].contactEmblem;
        if (contactCheck === 1){
            contactListEdit += '<div id="'+editContactId+'" onclick="selectContact('+editContactId+')" class="background-blue"><div class="edit-contact-name-svg"><div class="edit-user-icon">'+userIcon+'</div>'+prename+' '+name+'</div><div id="editCheckbox"><img class="edit-contact-check" src="/assets/svg/checkboxWhite.svg" alt=""></div></div>';
        } else {
        contactListEdit += '<div id="'+editContactId+'" onclick="selectContact('+editContactId+')" class="contactFieldEdit"><div class="edit-contact-name-svg"><div class="edit-user-icon">'+userIcon+'</div>'+prename+' '+name+'</div><div id="editCheckbox'+i+'"><img class="edit-contact-check" src="/assets/svg/rectangle.svg" alt=""></div></div>';
    } } 
    return contactListEdit;
}    

/**
 * The function renders the date input field for the edited task.
 * 
 */
function renderEditDate(){
    let initialDate = editTask.date; //  YYYY-MM-DD-Format (!)
    let dateInput = document.getElementById("edit_input");
    dateInput.value = initialDate;    
    dateInput.setAttribute('min', getTheCurrentDate());
    dateInput.addEventListener('change', function() {
    let selectedDate = dateInput.value; EditTask.date = selectedDate;}); 
}

/**
 * The function gets the current date in the required format.
 * 
 * @returns {string} - The current date in YYYY-MM-DD format.
 */
function getTheCurrentDate() {
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();
    return year + '-' + month + '-' + day;
}