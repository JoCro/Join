let newSurname;
let newLastName;
const moreButton = document.getElementById('more-button');
const moreBtnMenu = document.getElementById('edit-menu');

/**
* This is used to either show or hide the side menu. It is triggered by clicking the moreButton and by clicking anywhere except itself
* 
*/
if (moreButton && moreBtnMenu) {
    function toggleMenu() {
        moreBtnMenu.classList.toggle('hide');
    }
    function closeMenuOnClickOutside(event) {
        if (!moreBtnMenu.contains(event.target) && !moreButton.contains(event.target)) {
            moreBtnMenu.classList.add('hide');
        }
    }
    moreButton.addEventListener('click', toggleMenu);
    document.addEventListener('click', closeMenuOnClickOutside);
} 

/**
* This function is used to load the ID of the clicked contact. The function determines whether the user is on the desktop or mobile version and executes the respective function of the version
* 
*/
async function loadCurrentContactId(){
    let userId = await loadData('currentContact');
    if(window.innerWidth >= 1250){
        await loadSingleContactDesktop(userId);
    }else{
        await loadSingleContact(userId);
    }
}

/**
* This function is used to render the contact-information of the contact the user wants to display. It fetches the data of the contact from the contact-array contactsAsJson <Mobile Version>
* 
* @param {string} id - the id of the current contact, which is stored in the firebase database. It´s passed by the function loadCurrentContactId 
*/
async function loadSingleContact(id){
    let user;
    for (let i = 0; i < contactsAsJson.length; i++) {
        const element = contactsAsJson[i];
        if (i == id){
            user = element;
        }
    }
    document.getElementsByClassName('name-headline')[0].innerHTML = `${user['vorname']} ${user['name']}`;
    document.getElementsByClassName('email')[0].innerHTML = `<a href="mailto:${user['mail']}">${user['mail']}</a>`;
    document.getElementsByClassName('phone')[0].innerHTML = `${user['mobile']}`;
    document.getElementsByClassName('name-pic')[0].outerHTML = drawContactDetailPic(user);
    document.getElementsByClassName('del-btn')[0].outerHTML = `<button class="del-btn" onclick="deleteContact(${id})"></button>`
    document.getElementsByClassName('edit-btn')[0].outerHTML = `<button class="edit-btn" onclick="fillEditContactForm(${id})"></button>`
}

/**
* This function is used to render the contact-information of the contact the user wants to display. It fetches the data of the contact from the contact-array contactsAsJson <Desktop Version>
* 
* @param {string} id - the id of the current contact, which is stored in the firebase database. It´s passed by the function loadCurrentContactId 
*/
async function loadSingleContactDesktop(id){
    let user;
    for (let i = 0; i < contactsAsJson.length; i++) {
        const element = contactsAsJson[i];
        if (i == id){
            user = element;
        }
    }
    document.getElementsByClassName('name-headline')[0].innerHTML = `${user['vorname']} ${user['name']}`;
    document.getElementsByClassName('email')[0].innerHTML = `<a href="mailto:${user['mail']}">${user['mail']}</a>`;
    document.getElementsByClassName('phone')[0].innerHTML = `${user['mobile']}`;
    document.getElementsByClassName('name-pic')[0].outerHTML = drawContactDetailPic(user);
    document.getElementsByClassName('del-btn')[0].outerHTML = `<button class="del-btn" onclick="deleteContact(${id})"></button>`
    document.getElementsByClassName('edit-btn')[0].outerHTML = `<button class="edit-btn" onclick="fillEditContactFormDesktop(${id})"></button>`
}

/**
* This function is used to determine the token of the contact the user wants to delete. Then the contact is deleted from the firebase database 
* 
* @param {string} id - the id of the contact to delete. Given by the function loadSingleContact. It represents the index of the contact in the contactsAsJson-array 
*/
async function deleteContact(id){
    tokenToDelete = contactsAsJson[id]['id'];
    await deleteData(`contacts/${tokenToDelete}`);
    window.location.href = "/contacts.html";
}

/**
* This function is used to create a profile pic for the contact the user wants to display in its required size 
* 
* @param {Array} user - this is the position of the contact to load in the contactsAsJson-Array ... f.e. contactsAsJson[2]
* @returns {string} - HTML Code as a String
*/
function drawContactDetailPic(user){
    return `<svg class="name-pic" width="42px" height="42px"><circle cx="40" cy="40" r="40" stroke="white" stroke-width="2" fill="${user['color']}" />
    <text x="20" y="48" fill="white" font-size="27px">${user['vorname'].charAt(0)}${user['name'].charAt(0)}</text></svg>`;
}

/**
* This function is used to create profile pic for the contact the user wants to edit in its required size for the mobile-version
* 
* @param {Array} user - this is the position of the contact to load in the contactsAsJson-Array ... f.e. contactsAsJson[2] 
* @returns {string} - HTML Code as a String
*/
async function drawContactEditPic(user){
    return `<svg class="contact-pic-edit" width="62px" height="62px"><circle class="circle" cx="60" cy="60" r="58" stroke="white" stroke-width="2" fill="${user['color']}" />
    <text class="circle-text" x="50%" y="55%" fill="white" font-size="47px">${user['vorname'].charAt(0)}${user['name'].charAt(0)}</text></svg>`;
}

/**
* This function is used to create a profile pic for the contact the user wants to edit in its required size for the desktop-version
* 
* @param {*} user - this is the position of the contact to load in the contactsAsJson-Array ... f.e. contactsAsJson[2]
* @returns {string} - HTML Code as a String
*/
async function drawContactEditPicDesktop(user){
    return `<svg id="editContactPic-desktop" class="contact-pic" width="62px" height="62px"><circle class="circle" cx="60" cy="60" r="58" stroke="white" stroke-width="2" fill="${user['color']}" />
    <text class="circle-text" x="20%" y="60%" fill="white" font-size="47px">${user['vorname'].charAt(0)}${user['name'].charAt(0)}</text></svg>`;
}

/**
* This function is used to load the contacts data in the inputfields of the Edit-formular (mobile), which shows up when the user clicks the edit-button
* 
* @param {string} id - the index of the contact to edit in the array contactsAsJson 
*/
async function fillEditContactForm(id){
    idToFind = id;
    currentContact = contactsAsJson[idToFind];
    document.getElementById('contact-name').value = `${currentContact['vorname']} ${currentContact['name']}`;
    document.getElementById('contact-mail').value = `${currentContact['mail']}`;
    document.getElementById('contact-phone').value = `${currentContact['mobile']}`;
    document.getElementById('closeEditContactButton').outerHTML = `<button id="closeEditContactButton" class="close-btn" onclick="hideEditOverlay()"></button>`
    document.getElementById('edit-contact-form').onsubmit = function(event) {
        event.preventDefault(); 
        saveEditsToContact(`${currentContact['id']}`);
    };
    document.getElementById('delete-contact-btn').setAttribute('onclick',`deleteContact(${id})`);
    showEditOverlay();
    document.getElementById('editContactPic').outerHTML = await drawContactEditPic(currentContact);
}

/**
* This function is used to load the contact's data in the inputfields of the Edit-formular (desktop), which shows up when the user clicks the edit-button
* 
* @param {string} id - the index of the contact to edit in the array contactsAsJson 
*/
async function fillEditContactFormDesktop(id){
    idToFind = id;
    currentContact = contactsAsJson[idToFind];
    document.getElementById('contact-name-desktop').value = `${currentContact['vorname']} ${currentContact['name']}`;
    document.getElementById('contact-mail-desktop').value = `${currentContact['mail']}`;
    document.getElementById('contact-phone-desktop').value = `${currentContact['mobile']}`;
    document.getElementById('closeEditContactButton').outerHTML = `<button id="closeEditContactButton" class="close-btn" onclick="hideEditOverlayDesktop()"></button>`
    document.getElementById('edit-contact-form-desktop').onsubmit = function(event) {
        event.preventDefault(); 
        saveEditsToContact(`${currentContact['id']}`);
    };
    document.getElementById('delete-contact-btn-desktop').setAttribute('onclick',`deleteContact(${id})`);
    showEditOverlayDesktop();
    document.getElementById('editContactPic-desktop').outerHTML = await drawContactEditPicDesktop(currentContact);
}

/**
* This function is used to display the overlay-element in which the editOverlay is displayed. It decreases the brightness of the background
* 
*/
function showEditOverlay(){
    document.getElementById('overlayVeil').classList.remove('displayNone');
    document.getElementById('overlay-editContact').classList.add('showEditContact');
}

/**
* This function is used to hide the overlay-element in which the editOverlay is displayed. 
*/
function hideEditOverlay(){
    document.getElementById('overlayVeil').classList.add('displayNone');
    document.getElementById('overlay-editContact').classList.remove('showEditContact');
}

function showEditOverlayDesktop(){
    document.getElementById('edit-contact-container').classList.add('show');
    document.getElementById('overlayVeilAddContact').classList.remove('none');
}

function hideEditOverlayDesktop(){
    document.getElementById('edit-contact-container').classList.remove('show');
    document.getElementById('overlayVeilAddContact').classList.add('none');
}

/**
* This function is used to fetch the value of the element, which is represented by the function-parameter. It also returns the Value. It´s executed by the saveEditsToContact-function
* 
* @param {string} element - The ID of an HTML-element
* @returns {string} value - The value of the HTML-element
*/
async function getTheEditedData(element){
    if(window.innerWidth >= 1250){
        return document.getElementById(`${element}-desktop`).value;
    }else{
        return document.getElementById(element).value;
    }
}

/**
* This function is used to fetch all the edited data of the current contact and stores them in variables. Then the function puts the new information to the firebase
* 
* @param {string} token - the token of the contact to edit, which is used to address the correct contact in the firebase database. In the contactsAsJson-Array it's represented by the id-key 
*/
async function saveEditsToContact(token){
    let editedName = await getTheEditedData('contact-name');
    let editedMail = await getTheEditedData('contact-mail');
    let editedPhone = await getTheEditedData('contact-phone');
    let words = editedName.split(" ");
    let surname = words[0];
    let lastName = words[1];
    await getTheNewName(surname, lastName);
    let indexOfCurrentContact = contactsAsJson.findIndex(element => element.id === token);
    let contactToUpdate = contactsAsJson[indexOfCurrentContact];
    let data = await getTheReadyData(editedMail,editedPhone,newLastName,newSurname,contactToUpdate);
    await putData(`contacts/${token}/`, data);
    await submitForm(indexOfCurrentContact);
}

/**
* This function is used to create the edited name of the current contact
* 
* @param {string} surname - a string which is represented by the variable surname (passed by the saveEditsToContact-function)
* @param {string} lastName - a string which is represented by the variable lastName (passed by the saveEditsToContact-function)
*/
async function getTheNewName(surname, lastName){
    if(surname && lastName){
        newSurname = surname.charAt(0).toUpperCase() + surname.slice(1);
        newLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    }else if(surname && !lastName){
        newSurname = surname.charAt(0).toUpperCase() + surname.slice(1);
        newLastName = ""
    }
}

/**
* this function is used to create and return the variable data, which contains every final information about the edited contact, in the JSON-format
* 
* @param {string} editedMail - a variable, passed by the saveEditsToContact-function
* @param {string} editedPhone - a variable, passed by the saveEditsToContact-function
* @param {string} newLastName - a variable, passed by the saveEditsToContact-function
* @param {string} newSurname - a variable, passed by the saveEditsToContact-function
* @param {string} contactToUpdate - a variable, passed by the saveEditsToContact-function
* @returns {JSON} data - the JSON-Object, which contains every information about the edited contact
*/
async function getTheReadyData(editedMail,editedPhone,newLastName,newSurname,contactToUpdate){
    let data = { 
        "mail": editedMail,
        "mobile": editedPhone,
        "name": newLastName,
        "vorname": newSurname,
        "id": contactToUpdate['id'],
        "color": contactToUpdate['color']}
        return data;
    }
    
    /**
    * This function is used to either submit the formular (mobile-version) or hide the edit-formular and refresh all the contacts 
    * 
    */    
    async function submitForm(){
        if(window.innerWidth < 1250){
            document.getElementById('edit-contact-form').submit();
        }else{
            await blendItOut(); 
            loadContacts();
            await loadCurrentContactId();  
        }   
    }
    
    /**
    * This function adds and removes css-classes from the elements of the edit-contact-process. In the end, the edit formular and all its co-elemnts won´t be displayed anymore
    * 
    */
    async function blendItOut(){
        document.getElementById('edit-contact-container').classList.add('fade');
        document.getElementById('overlayVeilAddContact').classList.add('none');
        document.getElementById('edit-contact-container').classList.remove('show');
        document.getElementById('edit-contact-container').classList.remove('fade');
    }
    
    /**
    * This function gets the value of the variable boolean contactWasCreated from the local Storage and executes the showTheNotification-function, if it´s true
    * 
    */
    async function checkIfContactWasCreated(){
        let wasContactCreated = localStorage.getItem('contactWasCreated');
        if(wasContactCreated == "true"){
            await showTheNotificaiton();
        }
    }
    
    /**
    * This function displays the contact-added-notification and hides it again after a short delay. The function also clears the local storage.
    * 
    */
    async function showTheNotificaiton(){
        document.getElementById('notificationAddContact').classList.add('showContactAdded');
        setTimeout(() => {
            document.getElementById('notificationAddContact').classList.remove('showContactAdded');
        }, 1000);
        localStorage.clear();
    }
    
    /**
    * This eventlistener executes the checkIfContactWasCreated-function everytime the complete DOMContent has loaded
    */
    document.addEventListener('DOMContentLoaded', checkIfContactWasCreated);