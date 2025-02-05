/**
 * This function shows the user an overview of the tasks in their various stages.
 * 
 */
async function setSummaryNumbers() {
  try {
    let counts = await Promise.all([countTasksByTypes(), countUrgentTasks(), getNextTaskDate(), countTypeZeroAndThree()]);
    document.getElementById('urgentTasksCount').innerHTML = counts[1];
    document.getElementById('upcomingDeadline').innerHTML = counts[2];
    document.getElementById('tasksInBoardCount').textContent = counts[3];
    for (let type in counts[0]) {
      document.getElementById(`type${type}Count`).textContent = counts[0][type];
    }
  } catch (error) {
    console.error("Fehler:", error); 
  }
}

/**
 * This function loads all tasks stored in the database.
 * 
 * @returns - Returns all tasks with type 1.
 */
async function countTasksByTypes() {
  let data = await loadData('tasks');
  let types = {};
  for (let id in data) {
    types[data[id].type] = (types[data[id].type] || 0) + 1;
  }
  return types;
}

/**
 * This function loads all tasks stored in the database.
 * 
 * @returns - Returns all tasks with priority urgent.
 */
async function countUrgentTasks() {
  let data = await loadData('tasks');
  let urgent = 0;
  for (let id in data) {
    if (data[id].priority === "urgent") urgent++;
  }
  return urgent;
}

/**
 * This function first loads all tasks and checks which of them needs to be completed next.
 * 
 * @returns - Returns the date of the task that needs to be completed next.
 */
async function getNextTaskDate() {
  let data = await loadData('tasks');
  let nextDate = null;
  for (let id in data) {
    let date = new Date(data[id].date);
    if (date > new Date() && (!nextDate || date < nextDate)) {
      nextDate = date;
    }
  }
  return nextDate ? nextDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'There is no';
}

/**
 * This function first loads all tasks and then adds up all tasks with different types.
 * 
 * @returns - Add the sum of the tasks counted together. 
 */
async function countTypeZeroAndThree() {
  let types = await countTasksByTypes(); 
  return (types[0] || 0) + (types[1] || 0) + (types[2] || 0) + (types[3] || 0);
}