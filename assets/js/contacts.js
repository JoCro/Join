let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h','i','j','k','l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let contactsAsJson;
let contactToDisplay = 0;
let colors = ['#FF7A00', '#FF5EB3', '#6E52FF','#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E','#FC71FF','#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
let contactsWithoutToken = [];

/**
* This function is used to get a random color from the Color array and returns it.
* 
* @returns {array} - returns the array and the respective index of the element... f.e colors[2]
*/
async function getAColor(){
    let randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

/**
* This function is used to create the variable contactsAsJson which stores every contact from the firebase database. It also executes the createDivs-function
* 
*/
async function loadContacts(){
    contactsAsJson = await getContacts();
    createDivs();
}


/**
* This function reads every contact from the contactsAsJson-array, then pushes every contact without its token to the contactsWithoutToken-array
* 
*/
async function readTheTokens(){
    for(const key in contactsAsJson){
        if(contactsAsJson.hasOwnProperty(key)){
            const array = contactsAsJson[key];
            const token = {token: key};
            array.forEach(element => {
                contact = {...element, ...token};
                contactsWithoutToken.push(contact);
            });
        }
    }
}


/** 
* The function checks each letter of the alphabet to see if the first letter of a first name in the contactsAsJson array matches the current letter. If a match is found, it creates a separate container for this letter, containing all contacts whose first names start with the current letter.
* 
*/
function createDivs(){
    if(document.getElementById('contact-div')){
        document.getElementById('contact-div').innerHTML = ``;
        for (let i = 0; i < alphabet.length; i++) {
            const element = alphabet[i];
            document.getElementById('contact-div').innerHTML += `<div class="contact-section" id="${element}"><div class="headline-Div"><p id="headline${element}">${element.toUpperCase(element)}</p></div><div id="contactsOf${element}"></div></div>`;
            for (let j = 0; j < contactsAsJson.length; j++) {
                const contact = contactsAsJson[j];
                if(contact['vorname'].charAt(0).toUpperCase() === element.toUpperCase()){
                    document.getElementById(`contactsOf${element}`).innerHTML += generateHTMLcodeForContacts(contact, j);
                }
            }
            if(document.getElementById(`contactsOf${element}`).innerHTML === ''){
                document.getElementById(`${element}`).classList.add('none');   
            }
        }
    }  
}


/**
* This function is used to create and return HTML-Code for the current contact.
* 
* @param {array} contact - this contains the array and its index for the current contact 
* @param {number} j - this is the index of the contact in the array 
* @returns {String} - HTML Code as a String
*/
function generateHTMLcodeForContacts(contact, j){
    return `<a  onclick="refreshContactToLoad(${j}, 'currentContact'), changeToClicked('singleContact${j}')"  id="singleContact${j}" class="singleContact"><svg class="profile_pic" width="42px" height="42px">
    <circle cx="21" cy="21" r="20" stroke="white" stroke-width="2" fill="${contact['color']}" />
    <text x="12" y="25" fill="white" font-size="12px">${contact['vorname'].charAt(0)}${contact['name'].charAt(0)}</text>
    </svg>
    <div><p class="names">${contact['vorname']} ${contact['name']}</p><p class="mail">${contact['mail']}</p></div></a>`
}


/**
* This function adds the clicked-class to the current contact and removes the same class from all the other contacts
* 
* @param {string} element - the id of the HTML-element 
*/
function changeToClicked(element){
    let singleContacts = document.getElementsByClassName('singleContact');
    for (let index = 0; index < singleContacts.length; index++) {
        const singleContact = singleContacts[index];
        singleContact.classList.remove('clicked');
    }
    document.getElementById(element).classList.add('clicked');
}


/**
* This function is used to determine which contacts details should be loaded, and then executes the respective function either for mobile or for desktop
* 
* @param {number} id - the index of the current contact as an integer 
* @param {string} path - the path of the firebase database in which the currentContact should be stored 
*/
async function refreshContactToLoad(id, path) {
    contactToDisplay = id;
    await putData(path,id)
    if (window.innerWidth >= 1250){
        loadCurrentContactId('desktop');
        await hideContactDetails();
        setTimeout(() => {
            showContactDetails();
        }, 50);
        
    }else{
        window.location.href = "/assets/templates/contact_details.html";
    }
}


/**
* This function is used to hide the contact's information and executes the addTranlate-function
* 
*/
async function hideContactDetails(){
    let contactContainer = document.getElementById('middle-container-desktop');
    contactContainer.classList.add('none');
    await addTranslate(contactContainer);
    
}


/**
* This function is used to displays the contact's information, which is still translated. Then it executes the removeTranslate-function
* 
*/
async function showContactDetails(){
    let contactContainer = document.getElementById('middle-container-desktop');
    contactContainer.classList.remove('none');
    await removeTranslate(contactContainer);
}


/**
* This function is used to remove the show-class from the element, which's result is, that the element gets translateX so it can't be seen on the screen
* 
* @param {string} element - the ID of the HTML-element 
*/
async function addTranslate(element){
    element.classList.remove('show');
}


/**
* This function is used to add the show-class to the element with a delay, which's result is, that the element gets translateX(0) so it can be seen on the screen again
* 
* @param {string} element - the ID of the HTML-element 
*/
async function removeTranslate(element){
    setTimeout(() => {
        element.classList.add('show');
    }, 50); 
}


/**
* This function is used to show the user the formular which can be used to add a new contact
* 
*/
function showAddContact(){
    document.getElementById('overlay-container').classList.add('show');
    document.getElementById('overlayVeilAddContact').classList.remove('none');
}


document.addEventListener('DOMContentLoaded', checkIfLoadContactIsNeeded);


/**
* This function is used to determine, if the current window-location includes either contact or board. If one of these conditions is true, the loadContacts-function is executed
* 
*/
function checkIfLoadContactIsNeeded(){
    if(window.location.href.includes('contact') || window.location.href.includes('board')){
        loadContacts('contacts');
    }
}


/**
* This function is used to reset the values of the inputfields below and makes the element, which is represented by the function-parameter, invisible for the user
* 
* @param {string} elementToHide - the id of the HTML-element 
*/
function hideTheFormular(elementToHide){
    document.getElementById('contact-name').value = ``;
    document.getElementById('contact-mail').value = ``;
    document.getElementById('contact-phone').value = ``;
    document.getElementById(elementToHide).classList.remove('show');
    document.getElementById('overlayVeilAddContact').classList.add('none');
}


/**
* This function is used to fill the inputfields of the editContact-formular's desktop-version with the correct data and shows the formular afterwards
* 
* @param {number} id - it represents the index of the current contact, which is about to be edited by the user 
*/
async function fillEditContactFormDesktop(id){
    idToFind = id;
    currentContact = contactsAsJson[idToFind];
    document.getElementById('contact-name-desktop').value = `${currentContact['vorname']} ${currentContact['name']}`;
    document.getElementById('contact-mail-desktop').value = `${currentContact['mail']}`;
    document.getElementById('contact-phone-desktop').value = `${currentContact['mobile']}`;
    document.getElementById('closeEditContactButton-desktop').outerHTML = `<button id="closeEditContactButton" class="close-btn" onclick="hideEditOverlay()"></button>`
    document.getElementById('save-edits-btn-desktop').setAttribute('onclick',`saveEditsToContact('${currentContact['id']}')`);
    document.getElementById('delete-contact-btn-desktop').setAttribute('onclick',`deleteContact(${id})`);
    showEditOverlay();
    document.getElementById('editContactPic-desktop').outerHTML = await drawContactEditPic(currentContact);
}


/**
* This function is used to determine which version of join the user is up to and adjusts the text of the addContact-button
* 
*/
function rewriteButton(){
    if(document.getElementsByClassName('add-contact-btn')[0]){
        if(window.innerWidth >= 1250){
            document.getElementsByClassName('add-contact-btn')[0].innerHTML = `Add new contact`;
        }else{
            document.getElementsByClassName('add-contact-btn')[0].innerHTML = ``;
        }
    }
}


document.addEventListener('DOMContentLoaded', rewriteButton);
window.addEventListener('resize', rewriteButton);