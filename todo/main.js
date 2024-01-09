// Elements
const tasksList = document.querySelector("#tasks-list")
const addTaskForm = document.querySelector("form#add-task")
const addTaskInput = document.querySelector("#add-task-input")
const clearAllTasksBtn = document.querySelector("button#clear-all-tasks")

// Total List Of Tasks
let list = JSON.parse(localStorage.getItem("tasks")) || []

/**
 * Show All Tasks From Local Storage In Page
 */

// Show tasks
function showTasksList() {

    tasksList.innerHTML = "";
  
    list.reverse().forEach(task => {
      const element = `
        <li>
          <input type="checkbox" ${task.completed ? "checked" : ""}> 
          ${task.text}
          <i class="delete icon"></i>
        </li>
      `;
  
      tasksList.insertAdjacentHTML("afterbegin", element);
    });
  }
  
  // Add task  
  function addTask(event) {
    event.preventDefault();
    
    const text = addTaskInput.value;
  
    list.push({
      id: Date.now(),
      text, 
      completed: false  
    });
  
    localStorage.setItem("tasks", JSON.stringify(list));
  
    addTaskInput.value = "";
  
    showNotification("Task added");
  
    showTasksList();
  }
  
  // Remove task
  function removeTask(id) {
    list = list.filter(t => t.id !== id);
    
    localStorage.setItem("tasks", JSON.stringify(list));
    
    showTasksList();
  }
  
  // Initial load
  document.addEventListener("DOMContentLoaded", () => {
  
    list = JSON.parse(localStorage.getItem("tasks")) || [];
    showTasksList();
    
    addTaskForm.addEventListener("submit", addTask);
  });

  clearAllTasksBtn.disabled = false
  tasksList.style.border = "1px solid rgba(34,36,38,.15)"
  list.reverse().forEach(task => {
    const element = String.raw`
				<li class="ui segment grid equal width">
					<div class="ui checkbox column">
						<input type="checkbox" ${task.completed ? "checked" : ""}>
						<label>${task.text}</label>
					</div>
					<div class="column">
						<i data-id="${task.id}" class="edit outline icon"></i>
						<i data-id="${task.id}" class="trash alternate outline remove icon"></i>
					</div>
				</li>
			`

    tasksList.insertAdjacentHTML("beforeend", element)
  })

  document.querySelectorAll(`li i.edit`).forEach(item => {
    item.addEventListener("click", e => {
      e.stopPropagation()
      showEditModal(+e.target.dataset.id)
    })
  })

  document.querySelectorAll(`li i.trash`).forEach(item => {
    item.addEventListener("click", e => {
      e.stopPropagation()
      showRemoveModal(+e.target.dataset.id)
    })
  })

/**
 * Add new task to local storage
 */

function addTask(event) {
  event.preventDefault()

  const taskText = addTaskInput.value
  if (taskText.trim().length === 0) {
    return (addTaskInput.value = "")
  }

  list.push({
    id: list.length + 1,
    text: taskText,
    completed: false,
  })
  localStorage.setItem("tasks", JSON.stringify(list))
  addTaskInput.value = ""

  showNotification("success", "Task was successfully added")
  showTasksList()
}

// Change Complete State
function completeTask(id) {
  // Get Task
  const taskIndex = list.findIndex(t => t.id == id)
  const task = list[taskIndex]

  // Change State
  task.completed = !task.completed
  list[taskIndex] = task

  // Save Changes
  localStorage.setItem("tasks", JSON.stringify(list))
  showTasksList()
}

/**
 * Remove task
 */
function removeTask(id) {
  list = list.filter(t => t.id !== id)
  localStorage.setItem("tasks", JSON.stringify(list))

  showNotification("error", "Task was successfully deleted")
  showTasksList()
}

/**
 * Edit task
 */
function editTask(id) {
  const taskText = document.querySelector("#task-text").value

  if (taskText.trim().length === 0) return
  const taskIndex = list.findIndex(t => t.id == id)

  list[taskIndex].text = taskText
  localStorage.setItem("tasks", JSON.stringify(list))

  showNotification("success", "Task was successfully updated")
  showTasksList()
}

// Clear All Tasks
function clearAllTasks() {
  if (list.length > 0) {
    list = []
    localStorage.setItem("tasks", JSON.stringify(list))
    return showTasksList()
  }

  new Noty({
    type: "error",
    text: '<i class="close icon"></i> There is no task to remove.',
    layout: "bottomRight",
    timeout: 2000,
    progressBar: true,
    closeWith: ["click"],
    theme: "metroui",
  }).show()
}

// Clear Complete Tasks
function clearCompleteTasks() {
  if (list.length > 0) {
    if (confirm("Are you sure?")) {
      const filteredTasks = list.filter(t => t.completed !== true)
      localStorage.setItem("tasks", JSON.stringify(filteredTasks))
      return showTasksList()
    }
  }

  Toastify({
    text: "There is no task to remove",
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "left",
    backgroundColor: "linear-gradient(to right, #e45757, #d44747)",
    stopOnFocus: true,
  }).showToast()
}

// Show Edit Modal And Pass Data
function showEditModal(id) {
  const taskIndex = list.findIndex(t => t.id == id)
  const { text } = list[taskIndex]

  document.querySelector("#edit-modal .content #task-id").value = id
  document.querySelector("#edit-modal .content #task-text").value = text.trim()
  document
    .querySelector("#update-button")
    .addEventListener("click", () => editTask(+id))

  $("#edit-modal.modal").modal("show")
}

// Show Remove Modal
function showRemoveModal(id) {
  document
    .querySelector("#remove-button")
    .addEventListener("click", () => removeTask(+id))

  $("#remove-modal.modal").modal("show")
}

// Show Clear All Tasks Modal
function showClearAllTasksModal() {
  if (list.length > 0) {
    return $("#clear-all-tasks-modal.modal").modal("show")
  }

  new Noty({
    type: "error",
    text: '<i class="close icon"></i> There is no task to remove.',
    layout: "bottomRight",
    timeout: 2000,
    progressBar: true,
    closeWith: ["click"],
    theme: "metroui",
  }).show()
}

function showNotification(type, text) {
  new Noty({
    type,
    text: `<i class="check icon"></i> ${text}`,
    layout: "bottomRight",
    timeout: 2000,
    progressBar: true,
    closeWith: ["click"],
    theme: "metroui",
  }).show()
}

// Event Listeners
addTaskForm.addEventListener("submit", addTask)
window.addEventListener("load", () => addTaskInput.focus())

showTasksList()