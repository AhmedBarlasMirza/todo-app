const API_URL = 'http://localhost:8080/api/todos';

const todoInput = document.getElementById('todoInput');
const todoDescription = document.getElementById('todoDescription');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// Load todos when page opens
document.addEventListener('DOMContentLoaded', loadTodos);

// Add todo when button is clicked
addBtn.addEventListener('click', addTodo);

// Load all todos from backend
async function loadTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        displayTodos(todos);
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}

// Display todos on the page
function displayTodos(todos) {
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        todoItem.innerHTML = `
            <div class="todo-content">
                <div class="todo-title">${todo.title}</div>
                <div class="todo-description">${todo.description || 'No description'}</div>
            </div>
            <div>
                <button class="complete-btn" onclick="toggleTodo(${todo.id}, ${todo.completed})">
                    ${todo.completed ? 'Undo' : 'Done'}
                </button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `;
        
        todoList.appendChild(todoItem);
    });
}

// Add new todo
async function addTodo() {
    const title = todoInput.value.trim();
    const description = todoDescription.value.trim();
    
    if (title === '') {
        alert('Please enter a todo title!');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: false
            })
        });
        
        if (response.ok) {
            todoInput.value = '';
            todoDescription.value = '';
            loadTodos(); // Refresh the list
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

// Delete a todo
async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadTodos(); // Refresh the list
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Toggle todo completion status
async function toggleTodo(id, currentStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                completed: !currentStatus
            })
        });
        
        if (response.ok) {
            loadTodos(); // Refresh the list
        }
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}