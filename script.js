document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage on page load
    loadTasks();

    addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            saveTasks(); // Save tasks to local storage
            taskInput.value = '';
        }
    });

    function addTask(taskText) {
        const li = document.createElement('li');
        li.className = 'd-flex justify-content-between align-items-center task-item'; // Use flexbox to position items

        const iconContainer = document.createElement('div'); // Container for icons
        iconContainer.className = 'd-flex';

        const icon = document.createElement('i');
        icon.className = 'bi bi-check-circle-fill text-success mr-2';
        icon.style.display = 'none'; // Initially hide the icon

        const label = document.createElement('span');
        label.className = 'task-text';
        label.textContent = taskText;

        const editIcon = document.createElement('i');
        editIcon.className = 'bi bi-pencil text-primary edit-icon ml-2'; // Add edit-icon class for styling purposes
        editIcon.style.cursor = 'pointer';

        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'bi bi-trash text-danger delete-icon ml-2'; // Add delete-icon class for styling purposes
        deleteIcon.style.cursor = 'pointer';

        iconContainer.appendChild(editIcon); // Append edit icon first
        iconContainer.appendChild(deleteIcon); // Then append delete icon

        li.appendChild(icon);
        li.appendChild(label);
        li.appendChild(iconContainer); // Append the icon container
        taskList.appendChild(li);

        // Toggle icon visibility and completed class when task is clicked
        li.addEventListener('click', function(event) {
            if (event.target !== editIcon && event.target !== deleteIcon) {
                icon.style.display = icon.style.display === 'none' ? 'inline-block' : 'none';
                li.classList.toggle('completed');
                saveTasks(); // Save tasks to local storage when a task is clicked
            }
        });

        // Add event listener to the delete icon to delete the task
        deleteIcon.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent li click event from being triggered
            taskList.removeChild(li);
            saveTasks(); // Save tasks to local storage after deleting a task
        });

        // Add event listener to the edit icon to edit the task text
        editIcon.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent li click event from being triggered
            const newText = prompt('Edit task:', taskText);
            if (newText !== null && newText.trim() !== '') {
                label.textContent = newText.trim();
                saveTasks(); // Save tasks to local storage after editing a task
            }
        });
    }

    function saveTasks() {
        // Get all task items from <li> elements
        const taskItems = Array.from(taskList.querySelectorAll('.task-item'));
        // Create an array to store task objects with text and completion status
        const tasks = taskItems.map(taskItem => ({
            text: taskItem.querySelector('.task-text').textContent,
            completed: taskItem.classList.contains('completed')
        }));
        // Convert the tasks array to a JSON string and store it in local storage under the key 'tasks'
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        // Retrieve tasks from local storage
        const storedTasks = localStorage.getItem('tasks');
        // If there are stored tasks, parse the JSON string and add them to the task list
        if (storedTasks) {
            const tasks = JSON.parse(storedTasks);
            tasks.forEach(task => {
                addTask(task.text);
                // If the task is completed, mark it as completed
                if (task.completed) {
                    taskList.lastChild.classList.add('completed');
                    taskList.lastChild.querySelector('i').style.display = 'inline-block';
                }
            });
        }
    }
});
