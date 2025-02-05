function showRegisterForm() {
    document.getElementById('signupParentDiv').classList.remove('d-none');
    document.getElementById('loginParentDiv').classList.add('d-none');
} 

function showLoginForm() {
    document.getElementById('signupParentDiv').classList.add('d-none');
    document.getElementById('loginParentDiv').classList.remove('d-none');
}

/**
 * This function changes the image and the cursor depending on whether the input field is empty, 
 * contains text or wants to make the written text visible, e.g. with a password.
 * 
 * @param {object} inputField - This is the input field in which the image and cursor would be changed.
 */
function changeInputFieldImg(inputField) {
    let passwordValue = inputField.value
    let inputIconDiv = inputField.nextElementSibling;
    let inputFieldImg = inputIconDiv.querySelector("img");
    if (passwordValue !== '') {
        inputFieldImg.src = 'assets/svg/visibility_off.svg';
        inputFieldImg.classList.add('cursor-pointer');
        inputField.type = "password";
    } else {
        inputFieldImg.src = 'assets/svg/lock.svg';
        inputFieldImg.classList.remove('cursor-pointer');
    }
}

/**
 * This function shows the user the password and changes the image in the input field.
 * 
 * @param {object} inputFieldImg - This is the image which would be changed.
 */
function showPassword(inputFieldImg) {
    let inputField = inputFieldImg.parentNode.previousElementSibling;
    if (inputFieldImg.src.includes('visibility_off.svg')) {
      inputFieldImg.src = '/assets/svg/visibility.svg';   
      inputField.type = "text";                           
    } else {
        if (!inputFieldImg.src.includes('assets/svg/lock.svg')) {
            inputFieldImg.src = '/assets/svg/visibility_off.svg';
            inputField.type = "password";   
        }                       
    }
}

/**
 * This function removes the start animation after it has been run through once.
 * 
 */
function landingPageAnimation() {
        setTimeout(() => {
            document.getElementById("loadAnimation").classList.add("loader-hidden");
          }, 200);
          setTimeout(() => {
            document.getElementById("loadAnimation").classList.add("d-none");
          }, 1000);
}

/**
 * This function checks whether the passwords entered are the same and whether the user has agreed to the privacy policy regulations.
 * 
 * @param {object} event - This event is used to prevent the form from being automatically submitted.
 */
async function signUp(event) {
    event.preventDefault();
    let passwordDontMatchMsg = document.getElementById('passwordDontMatch');
    let password = document.getElementById("signUpPasswordIndexHtml").value;
    let confirmPassword = document.getElementById("signUpConfirmPasswordIndexHtml").value;
    let privacyPolicyCheck = document.getElementById('acceptPrivacyPolicy');
    if (password === confirmPassword && privacyPolicyCheck.src.includes(`/assets/svg/checkmark.svg`)) {
        successfullSignUp();
    } else if (password != confirmPassword ){
        passwordDontMatchMsg.classList.remove('d-none');
        passwordDontMatchMsg.innerHTML = `Ups! your password doesnt match`;
    } else {
        passwordDontMatchMsg.classList.remove('d-none');
        passwordDontMatchMsg.innerHTML = `Agree to our privacy policy!`;
    }
}


/**
 * This function is executed once the passwords are the same and the privacy policy rules are accepted, 
 * then the information is processed in other functions.
 * 
 */
function successfullSignUp() {
    localStorage.setItem('isSignedUp', true);
    let userName = document.getElementById('signUpNameIndexHtml').value;
    localStorage.setItem('userName', userName);
    setProfile();
    getSideMenuCharacters('signUp');
    signupSuccessfullAnimation();
}


/**
 * This function takes the created JSON and sends it to Firebase via the "postData()" function.
 * 
 */
async function setProfile() {
    let data = await getDataForProfile();
    postData('user', data);
}

/**
 * This function creates a profile from the information in the signUp input fields.
 * 
 * @returns - Returns the profile as JSON
 */
async function getDataForProfile() {
    userData = {
        mail: document.getElementById('signUpEmailIndexHtml').value,
        name: document.getElementById('signUpNameIndexHtml').value,
        password: document.getElementById('signUpPasswordIndexHtml').value,
        initialUserLetters: await getInitialLettersFromInput(),
    };
    return userData;
}

/**
 * This function loads all user profiles from the database
 * 
 * @returns - Returns all user profiles from the database as an array.
 */
async function getUsers() {
    try {
      let data = await loadData('user');
      let user = [];
      for (const key in data) { 
        if (data.hasOwnProperty(key)) { 
            user.push({ id: key, ...data[key] });
        }
      }
      return user;
    } catch (error) {
      throw error;
    }
}

/**
 * This function loads all the user profile names and stores them in an array.
 * 
 * @returns - Returns the last name from the userNames array
 */
async function getUserName() {
    let users = await getUsers();
    let userNames = [];
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        userNames.push(user.name);
    }
    return userNames[userNames.length - 1];
}

/**
 * This function checks whether the email entered is equal to the email who is stored in the Firebase. Same with the password.
 * 
 * @returns - Returns "true" if email and password are identical to email and password in Firebase. Otherwise "false".
 */
async function validateForm() {
    let incorrectMailOrPasswordMsg = document.getElementById('incorrectMailOrPassword');
    let passwordIsEqual = await comparePasswords();
    let mailIsEqual = await compareMails();
    if (passwordIsEqual != 'passwordIsEqual' || mailIsEqual != 'mailIsEqual') {
        incorrectMailOrPasswordMsg.classList.remove('d-none');
        return false;
    } else {
        localStorage.setItem('userName', await getUserName());
        localStorage.setItem('isSignedUp', true);
        await getSideMenuCharacters('login')
        window.location.href = document.getElementById("loginForm").action;
        return true;
    }
}

/**
 * This function loads all user emails from firebase into an array.
 * 
 * @returns - Returns the array with the emails.  
 */
async function getSignedUpMail() {
    let users = await getUsers();
    let userMails = [];
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        userMails.push(user.mail);
    }
    return userMails;
}

/**
 * This function loads all user passwords from firebase into an array.
 * 
 * @returns Returns the array with the passwords.
 */
async function getSignedUpPssword() {
    let users = await getUsers()
    let userPasswords = [];
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        userPasswords.push(user.password);
    }
    return userPasswords;
}

/**
 * This function checks whether the password entered matches a password from the Firebase. 
 * 
 * @returns - Returns 'passwordIsEqual' as a string if the passwords are the same.
 */
async function comparePasswords() {
    let signedUpPsswords = await getSignedUpPssword();
    let enteredPassword =  document.getElementById('loginPasswordIndexHtml').value;
    for (let i = 0; i < signedUpPsswords.length; i++) {
        const signedUpPssword = signedUpPsswords[i];
        if (signedUpPssword === enteredPassword) {
            return 'passwordIsEqual';
        }
    }
}

/**
 * This function checks whether the email entered matches a email from the Firebase.
 * 
 * @returns - Returns 'mailIsEqual' as a string if the emails are the same.
 */
async function compareMails() {
    let signedUpMails = await getSignedUpMail();
    let enteredMail =  document.getElementById('loginEmailIndexHtml').value;
    for (let i = 0; i < signedUpMails.length; i++) {
        const signedUpMail = signedUpMails[i];
        if (signedUpMail === enteredMail) {
            return 'mailIsEqual';
        }
    }
}

/**
 * This function creates a string of the user's initials, in uppercase.
 * 
 * @returns - Returns the created initials.
 */
async function getInitialLettersFromInput() {
    let inputText = document.getElementById('signUpNameIndexHtml').value.trim();
    let words = inputText.split(" ");
    if (words.length === 1) {
      return words[0].charAt(0);
    } else {
      let initialLetters = words.map(word => word.charAt(0));
      return initialLetters.join("").toUpperCase();
    }
}


/**
 * This function checks whether the user logs in with an account or as a guest. Depending on how they want to use the app, 
 * the side menu will either show G for guest or their initials.
 * 
 * @param {string} loginChoice - This is the identifying feature in which way the user decides to log in.
 */
async function getSideMenuCharacters(loginChoice) {
    localStorage.removeItem('sideMenuCharacters');
    if (loginChoice === 'guest') {
        localStorage.setItem('sideMenuCharacters', 'G');
    } else if (loginChoice === 'login' || loginChoice === 'signUp') {
        let initialLetters = await getInitialLetters();
        let lastInitialLetter = initialLetters[initialLetters.length - 1];
        localStorage.setItem('sideMenuCharacters', lastInitialLetter); 
    }
}

/**
 * This function loads all initials stored in the firebase into an array.
 * 
 * @returns - Returns the array with the initials. 
 */
async function getInitialLetters() {
    let users = await getUsers();
    let initialLetters = [];
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        initialLetters.push(user.initialUserLetters);
    }
    return initialLetters;
}

/**
 * This function starts an animation as soon as a sign-up was successful.
 * 
 */
function signupSuccessfullAnimation() {
    let signupSuccessfullContainer = document.getElementById('signupSuccessfullContainer');
    signupSuccessfullContainer.style.display = 'flex';

    setTimeout(() => {
        signupSuccessfullContainer.style.display = 'none';
        showLoginForm();
    }, 1000);
}