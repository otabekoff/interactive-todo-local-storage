document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const hint = document.getElementById('hint');
    const themeToggle = document.getElementById('theme-toggle');

    // Set theme based on localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('light-mode', savedTheme === 'light');
        themeToggle.textContent = savedTheme === 'light' ? '🌑' : '🌙';
    } else {
        const prefersLightScheme = window.matchMedia('(prefers-color-scheme: light)').matches;
        document.body.classList.toggle('light-mode', prefersLightScheme);
        themeToggle.textContent = prefersLightScheme ? '🌑' : '🌙';
    }

    // Load tasks from local storage
    loadTasks();

    // Add task event listener
    addTaskButton.addEventListener('click', () => {
        addTask();
    });

    // Add task with Enter key event listener
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Add task function
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText.length >= 4) {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.dataset.editing = 'false';
            taskItem.innerHTML = `
                <span class="task-text" contenteditable="false">${taskText}</span>
                <div class="actions">
                    <button class="edit">&#9998;</button>
                    <button class="delete">&#10006;</button>
                </div>
            `;
            taskItem.addEventListener('click', (e) => {
                if (taskItem.dataset.editing === 'false') {
                    taskItem.classList.toggle('done');
                    saveTasks();
                }
            });

            // Add event listeners for edit and delete buttons
            const editButton = taskItem.querySelector('.edit');
            const deleteButton = taskItem.querySelector('.delete');

            editButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click event from bubbling up
                toggleEdit(editButton);
            });

            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click event from bubbling up
                deleteTask(deleteButton);
            });

            taskList.appendChild(taskItem);
            taskInput.value = '';
            hint.textContent = 'Enter a task (min. 4 characters).';
            hint.style.color = '#007bff';
            saveTasks();
        } else {
            hint.textContent = 'Task must be at least 4 characters long.';
            hint.style.color = '#ff0000';
        }
    }

    // Toggle inline editing
    function toggleEdit(button) {
        const taskItem = button.parentElement.parentElement;
        const taskText = taskItem.querySelector('.task-text');

        if (taskText.isContentEditable) { // Save
            const newText = taskText.textContent.trim();
            if (newText.length >= 4) {
                taskText.contentEditable = 'false';
                button.textContent = '✎'; // Change back to edit icon
                taskItem.dataset.editing = 'false';
                saveTasks();
            } else {
                alert('Task must be at least 4 characters long.');
            }
        } else { // Edit
            taskText.contentEditable = 'true';
            taskText.focus();
            button.textContent = '✔️'; // Change to checkmark icon
            taskItem.dataset.editing = 'true';

            // Prevent new line in contenteditable span
            taskText.addEventListener('keypress', preventNewLine);

            // Prevent overflow
            taskText.style.overflow = 'hidden';
            taskText.style.whiteSpace = 'nowrap';
            taskText.style.textOverflow = 'clip';
        }
    }

    // Prevent new line function
    function preventNewLine(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }

    // Delete task function
    function deleteTask(button) {
        button.parentElement.parentElement.remove();
        saveTasks();
    }

    // Save tasks to local storage
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('.task-text').textContent,
                done: taskItem.classList.contains('done')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskFromLocal(task));
    }

    function addTaskFromLocal(task) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.dataset.editing = 'false';
        if (task.done) {
            taskItem.classList.add('done');
        }
        taskItem.innerHTML = `
            <span class="task-text" contenteditable="false">${task.text}</span>
            <div class="actions">
                <button class="edit">&#9998;</button>
                <button class="delete">&#10006;</button>
            </div>
        `;
        taskItem.addEventListener('click', (e) => {
            if (taskItem.dataset.editing === 'false') {
                taskItem.classList.toggle('done');
                saveTasks();
            }
        });

        // Add event listeners for edit and delete buttons
        const editButton = taskItem.querySelector('.edit');
        const deleteButton = taskItem.querySelector('.delete');

        editButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click event from bubbling up
            toggleEdit(editButton);
        });

        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click event from bubbling up
            deleteTask(deleteButton);
        });

        taskList.appendChild(taskItem);
    }

    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        const isLightMode = document.body.classList.toggle('light-mode');
        themeToggle.textContent = isLightMode ? '🌑' : '🌙';
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });

    // Task input validation
    taskInput.addEventListener('input', () => {
        if (taskInput.value.trim().length >= 4) {
            hint.textContent = 'Looks good!';
            hint.style.color = '#28a745';
        } else {
            hint.textContent = 'Enter a task (min. 4 characters).';
            hint.style.color = '#007bff';
        }
    });
});
