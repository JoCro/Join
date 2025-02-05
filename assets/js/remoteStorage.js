const BASE_URL = 'https://join-remotestorage-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * This function loads data from the Firebase.
 * 
 * @param {string} path - This is the path from which the data is loaded.
 * @returns - Returns the loaded data as JSON.
 */
async function loadData(path="") {
    let response = await fetch(BASE_URL + path +'.json');
    return responseToJson = await response.json();
}

/**
 * This function uploads data to the firebase.
 * 
 * @param {string} path - This is the path in which the data is uploaded.
 * @param {string} data - This is the data that will be uploaded.
 * @returns - Returns the uploaded data as JSON
 */
async function postData(path="", data={}) {
    let response = await fetch(BASE_URL + path +'.json',{
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

/**
 * This function deletes data in the Firebase
 * 
 * @param {string} path - This is the path under which the data will be deleted. 
 * @returns - Returns the deleted data as JSON.
 */
async function deleteData(path="") {
    let response = await fetch(BASE_URL + path +'.json',{
        method: 'DELETE',
    });
    return responseToJson = await response.json();
}

/**
 * This function replaces data in the Firebase.
 * 
 * @param {string} path - This is the path under which the data is replaced.
 * @returns - Returns the initial data as JSON.
 */
async function putData(path='', data={}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    
    return await response.json();
}

/**
 * This function loads all contacts from the Firebase.
 * 
 * @returns - Returns the contacts in an array.
 */
async function getContacts() {
    try {
      const data = await loadData('contacts');
      const contacts = [];
      for (const key in data) { 
        if (data.hasOwnProperty(key)) { 
          contacts.push({ id: key, ...data[key] });
        }
      }
      
      
      return contacts;
  
    } catch (error) {
      console.error('Fehler beim Laden der Kontakte:', error);
      throw error;
    }
}