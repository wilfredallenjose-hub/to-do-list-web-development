const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const taskCount = document.querySelector("#taskCount");
const errorMessage = document.querySelector("#errorMessage");
const clearCompletedButton = document.querySelector("#clearCompleted");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCount() {
  const remainingTasks = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${remainingTasks} ${
    remainingTasks === 1 ? "task" : "tasks"
  } remaining`;
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <li class="empty-message">No tasks yet. Add one above!</li>
    `;
    updateTaskCount();
    return;
  }

  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.className = `task-item ${
      task.completed ? "completed" : ""
    }`;

    listItem.dataset.id = task.id;

    listItem.innerHTML = `
      <input
        class="task-checkbox"
        type="checkbox"
        ${task.completed ? "checked" : ""}
        aria-label="Mark task complete"
      >

      <span class="task-text"></span>

      <button class="delete-button" type="button">
        Delete
      </button>
    `;

    listItem.querySelector(".task-text").textContent = task.text;
    taskList.appendChild(listItem);
  });

  updateTaskCount();
}

function addTask(text) {
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    errorMessage.textContent = "Please enter a task.";
    taskInput.focus();
    return;
  }

  errorMessage.textContent = "";
  addTask(taskText);

  taskInput.value = "";
  taskInput.focus();
});

taskList.addEventListener("click", (event) => {
  const listItem = event.target.closest(".task-item");

  if (!listItem) {
    return;
  }

  const taskId = Number(listItem.dataset.id);
  const task = tasks.find((item) => item.id === taskId);

  if (event.target.classList.contains("delete-button")) {
    tasks = tasks.filter((item) => item.id !== taskId);
  }

  if (event.target.classList.contains("task-checkbox")) {
    task.completed = event.target.checked;
  }

  saveTasks();
  renderTasks();
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();