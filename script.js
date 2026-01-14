const taskList = document.getElementById("taskList");

const params = new URLSearchParams(window.location.search);
const filter = params.get("filter") || "all";

document.addEventListener("DOMContentLoaded", () => {
  const dueDate = document.getElementById("dueDate");
  if (dueDate) {
    dueDate.min = new Date().toISOString().split("T")[0];
  }
  renderTasks();
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueDate = document.getElementById("dueDate");
  const priority = document.getElementById("priority");

  if (taskInput.value.trim() === "") {
    alert("Please enter a task!");
    return;
  }

  const task = {
    text: taskInput.value,
    date: dueDate.value,
    priority: priority.value,
    completed: false
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);

  taskInput.value = "";
  dueDate.value = "";
  priority.value = "Low";

  renderTasks();
}

function renderTasks() {
  if (!taskList) return;

  taskList.innerHTML = "";
  const tasks = getTasks();

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-top">
        <span>${task.text}</span>
        <div class="actions">
          <button onclick="toggleComplete(${index})">✔</button>
          <button onclick="deleteTask(${index})">🗑</button>
        </div>
      </div>
      <small>Due: ${task.date || "No date"}</small>
      <div class="priority ${task.priority}">
        ${task.priority} Priority
      </div>
    `;

    taskList.appendChild(li);
  });
}

function toggleComplete(index) {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  renderTasks();
}

function deleteTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
