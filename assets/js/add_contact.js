let vornameCapitalized = ""
let nachnameCapitalized = ""
let contactMail = ""
let contactPhone = ""
let contactId;
let contactColor;
const URL = "https://join-remotestorage-default-rtdb.europe-west1.firebasedatabase.app/";


/**
*  This function is used to read the Value of the name-inputfield and seperates the Value in two Variables (vorname & nachname)
* 
*/
async function createName(){
    let fullName = document.getElementById('contact-name').value;
    let words = fullName.split(" ");
    let vorname = words[0];
    let nachname = words[1];
    if(vorname && nachname){
        vornameCapitalized = vorname.charAt(0).toUpperCase() + vorname.slice(1);
        nachnameCapitalized = nachname.charAt(0).toUpperCase() + nachname.slice(1);
    }else if(vorname && !nachname){
        vornameCapitalized = vorname.charAt(0).toUpperCase() + vorname.slice(1);
        nachnameCapitalized = ""
    }  
}


/**
* This function is used to change the value of the variable contactMail to the same value as it is in the mail-inputfield
* 
*/
async function getMail(){
    contactMail = document.getElementById('contact-mail').value;
}


/**
* This function is used to change the value of the variable contactPhone to the same value as it is in the phone-inputfield
* 
*/
async function getPhoneNumber(){
    contactPhone = document.getElementById('contact-phone').value;
}


/**
* This function checks, if contactsAsJson (array with all contacts) exists. If it exists, the value of the variable contactId becomes equal to the index of the current contact, which is represented by the variable vornameCapitalized. If contactsAsJson doesn´t exist, the contactId becomes 0
* 
*/
async function getId(){
    if(contactsAsJson){
        contactId = contactsAsJson.findIndex(element => element.vorname === (vornameCapitalized));
    }else{ 
        contactId = 0;
    } 
}


/**
* This function is used to stop the formular from reloading and executes the functions below. They´re used to create a full contact and post it to the firebase database
* 
* @param {event} event - This is passed by an event listener due to the submission of the form
*/
async function getTheInformation(event){
    event.preventDefault(); 
    await createName();
    await getMail();
    await getPhoneNumber();
    await getId();
    contactColor = await getAColor();
    await getDataForPostContact('contacts/'); 
    await confirmContactCreation();
    await checkIfDesktop();
}


/**
* This function is used to check if the program is used on a mobile device or on a desktop. If the user is on the mobile version, the window locations becomes the contact_detail-view of the last added contact. If the user is on the desktop-version, the add-contact-overlay disappears and the contact will be reloaded.
* 
*/
async function checkIfDesktop(){
    if(window.innerWidth < 1250){
        await refreshContactToLoad(contactsAsJson.length, 'currentContact');   
    }else{
        hideTheFormular('overlay-container');
        loadContacts();
    } 
}


/**
* This function is used to set the variable contactWasCreated to the localStorage, and gives it the value 'true'. This happens only when the user is on the mobile version
* 
*/
async function confirmContactCreation(){
    if(window.innerWidth < 1250){
        localStorage.setItem('contactWasCreated', 'true'); 
    }
}


/**
* This function is used to prepare the data-variable, which will be a function-parameter for the postData-function
* 
* @param {String} path - This is the path of the Firebase-Database in which the contacts are uploaded. The Parameter is given by the function getTheInformation
*/
async function getDataForPostContact(path){
    let data = {
        "mail": contactMail,
        "mobile": contactPhone,
        "name": nachnameCapitalized,
        "vorname": vornameCapitalized,
        "color": contactColor
    } 
    postData(path, data);
}