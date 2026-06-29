const taskContainer =
document.getElementById("taskContainer");

const titleInput =
document.getElementById("title");

const dateInput =
document.getElementById("date");

const priorityInput =
document.getElementById("priority");

const searchInput =
document.getElementById("search");

const progressText =
document.getElementById("progressText");

const progressFill =
document.getElementById("progressFill");

let currentFilter = "All";

let tasks =
JSON.parse(
localStorage.getItem("tasks")
) || [];

function saveTasks(){
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function addTask(){

    const title =
    titleInput.value.trim();

    if(!title){
        alert("Enter a task");
        return;
    }

    tasks.push({

        id: Date.now(),

        title,

        date: dateInput.value,

        priority:
        priorityInput.value,

        completed:false

    });

    saveTasks();

    titleInput.value="";
    dateInput.value="";

    renderTasks();
}

function updateProgress(){

    const completed =
    tasks.filter(
        task => task.completed
    ).length;

    const total =
    tasks.length;

    progressText.textContent =
    `Progress: ${completed}/${total}`;

    document.getElementById(
        "taskCount"
    ).textContent =
    `${total} tasks`;

    const percentage =
    total === 0
    ? 0
    : (completed/total)*100;

    progressFill.style.width =
    percentage + "%";
}

function renderTasks(){

    taskContainer.innerHTML="";

    let filteredTasks =
    [...tasks];

    if(currentFilter==="Active"){

        filteredTasks =
        filteredTasks.filter(
            task => !task.completed
        );
    }

    if(currentFilter==="Completed"){

        filteredTasks =
        filteredTasks.filter(
            task => task.completed
        );
    }

    const search =
    searchInput.value
    .toLowerCase();

    filteredTasks =
    filteredTasks.filter(task =>
        task.title
        .toLowerCase()
        .includes(search)
    );

    if(filteredTasks.length===0){

        taskContainer.innerHTML =
        '<p class="no-task">No tasks found</p>';

        updateProgress();

        return;
    }

    filteredTasks.forEach(task=>{

        const div =
        document.createElement("div");

        div.classList.add("task-item");

        div.innerHTML = `

        <input
            type="checkbox"
            class="toggle"
            data-id="${task.id}"
            ${task.completed ? "checked" : ""}
        >

        <div class="task-content">

            <h3 class="${
                task.completed
                ? "completed"
                : ""
            }">

                ${task.title}

            </h3>

            <div class="task-meta">

                📅 ${task.date || "No date"}

                •

                ${task.priority}

            </div>

        </div>

        <div class="task-actions">

            <button
            class="edit-btn"
            data-id="${task.id}">
            ✏
            </button>

            <button
            class="delete-btn"
            data-id="${task.id}">
            🗑
            </button>

        </div>
        `;

        taskContainer.appendChild(div);
    });

    updateProgress();
}

document
.getElementById("addTaskBtn")
.addEventListener(
"click",
addTask
);

taskContainer.addEventListener(
"click",
function(e){

    const id =
    Number(
        e.target.dataset.id
    );

    const task =
    tasks.find(
        t => t.id === id
    );

    if(!task) return;

    if(
    e.target.classList
    .contains("delete-btn")
    ){

        tasks =
        tasks.filter(
            t => t.id !== id
        );
    }

    if(
    e.target.classList
    .contains("edit-btn")
    ){

        const newTitle =
        prompt(
            "Edit task",
            task.title
        );

        if(newTitle){

            task.title =
            newTitle.trim();
        }
    }

    saveTasks();
    renderTasks();
});

taskContainer.addEventListener(
"click",
function(e){

    if(
        !e.target.classList.contains("toggle")
    ) return;

    const id =
    Number(e.target.dataset.id);

    const task =
    tasks.find(
        t => t.id === id
    );

    if(!task) return;

    task.completed =
    e.target.checked;

    saveTasks();
    renderTasks();
});

document
.querySelector(".filters")
.addEventListener(
"click",
function(e){

if(
!e.target.dataset.filter
) return;

currentFilter =
e.target.dataset.filter;

renderTasks();
});

searchInput.addEventListener(
"input",
renderTasks
);

renderTasks();