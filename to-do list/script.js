document.addEventListener('DOMContentLoaded', () => {
    // Get user and UI elements
    const currentUser = localStorage.getItem('currentUser');
    const userGreeting = document.getElementById('user-greeting');
    const logoutBtn = document.getElementById('logout-btn');
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');

    // Create a unique key for the user's todos in local storage
    const storageKey = `todos-${currentUser}`;

    // Personalize the greeting
    if (currentUser) {
        userGreeting.textContent = `${currentUser}'s To-Do List ✨`;
    }

    // Load tasks for the current user
    loadTasks();

    // Event Listeners
    addButton.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
    todoList.addEventListener('click', handleTaskClick);
    logoutBtn.addEventListener('click', logout);

    function addTask() {
        const taskText = todoInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        createTaskElement(taskText);
        saveTasks();
        todoInput.value = '';
        todoInput.focus();
    }

    function createTaskElement(taskText, isCompleted = false) {
        const li = document.createElement('li');
        if (isCompleted) {
            li.classList.add('completed');
        }

        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&#x1F5D1;'; // Trash can icon
        deleteBtn.classList.add('delete-btn');

        li.appendChild(taskSpan);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }

    function handleTaskClick(event) {
        const target = event.target;
        const item = target.closest('li');

        if (!item) return;

        if (target.classList.contains('delete-btn')) {
            item.remove();
        } else {
            item.classList.toggle('completed');
        }
        
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#todo-list li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem(storageKey, JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem(storageKey));
        if (tasks) {
            tasks.forEach(task => createTaskElement(task.text, task.completed));
        }
    }

    function logout() {
        // Remove user from local storage
        localStorage.removeItem('currentUser');
        // Redirect to login page
        window.location.href = 'login.html';
    }
});