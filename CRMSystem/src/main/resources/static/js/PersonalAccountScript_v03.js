// Логика отображения разделов
function showSection(sectionId) {
    document.querySelectorAll('.main-content > div').forEach(div => {
        div.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Управление модальными окнами
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function loadDocuments() {
    const docs = []; // Пустой массив
    const container = document.getElementById('documents-container');
    container.innerHTML = docs.map(doc => `
        <div class="document-item" ondblclick="openDocument('${doc.title}')">
            <h4>${doc.title}</h4>
            <p>${doc.date}</p>
        </div>
    `).join('');

    if(docs.length === 0) {
        container.innerHTML = '<p class="empty-list">Документы не найдены</p>';
    }
}

function loadTasks() {
    const tasks = [
        {
            id: 1,
            title: "Подготовить отчет",
            description: "Ежеквартальный отчет по лечению",
            assignee: "Иванов И.И.",
            deadline: "2025-05-05",
            status: "active"
        },
        {
            id: 2,
            title: "Провести встречу",
            description: "Совещание с клиентом",
            assignee: "Петров П.П.",
            deadline: "2025-04-29",
            status: "overdue-25"
        },
        {
            id: 3,
            title: "Провести перерасчет",
            description: "Провести перерасчет лекарств на складе",
            assignee: "Сидоров С.С.",
            deadline: "2025-03-10",
            status: "overdue-full"
        }
    ];

    const container = document.getElementById('tasks-container');
    container.innerHTML = tasks.map(task => `
        <div class="task-item ${task.status}">
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description}</div>
            <div class="task-assignee">Исполнитель: ${task.assignee}</div>
            <div class="task-deadline">Срок: ${task.deadline}</div>
        </div>
    `).join('');

    if(tasks.length === 0) {
        container.innerHTML = '<p class="empty-list">Задачи не найдены</p>';
    }
}

function showPersonalInfo() {
    document.querySelectorAll('.main-content > div').forEach(div => {
        div.style.display = 'none';
    });
    document.querySelector('.employee-card').style.display = 'block';
}

function logout() {
    fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            window.location.href = '/';
        }
    }).catch(error => {
        console.error('Ошибка при выходе:', error);
    });
}

function createTask() {

    const formData = {
        taskTitle: document.getElementById('taskTitle').value,
        taskDescription: document.getElementById('taskDescription').value,
        taskAssignee: document.getElementById('taskAssignee').value,
        taskDeadline: document.getElementById('taskDeadline').value
    };

    fetch('/api/create-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(async response => {
            const data = await response.json();

            if (response.ok) {
                alert('Успешно!')
            } else {
                alert(data.error || 'Ошибка регистрации!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Сетевая ошибка');
        });


    closeModal('create-task');
    loadTasks();
}

// Добавьте эту функцию для загрузки сотрудников
function loadEmployees() {
    const privilege = document.body.getAttribute('data-privilege') || 'Low';
    const userDepartment = document.querySelector('.employee-card p:nth-child(3) span').textContent;

    // Получаем всех пользователей из атрибута (в реальном приложении это будет fetch запрос)
    const allUsers = JSON.parse(document.body.getAttribute('allusers') || '[]');

    // Фильтруем пользователей в зависимости от привилегий
    let employeesToShow = [];
    if (privilege === 'Medium') {
        employeesToShow = allUsers.filter(user => user.department === userDepartment);
    } else if (['High', 'VeryHigh'].includes(privilege)) {
        employeesToShow = allUsers;
    }

    const container = document.getElementById('employees-container');
    container.innerHTML = employeesToShow.map(employee => `
        <div class="employee-item">
            <h4>${employee.fullName}</h4>
            <div class="employee-details">
                <p><strong>Должность:</strong> ${employee.position}</p>
                <p><strong>Отдел:</strong> ${employee.department}</p>
                <p><strong>Email:</strong> ${employee.email}</p>
            </div>
        </div>
    `).join('');

    if(employeesToShow.length === 0) {
        container.innerHTML = '<p class="empty-list">Сотрудники не найдены</p>';
    }
}

// Обновите функцию checkPrivileges
function checkPrivileges() {
    const privilege = document.body.getAttribute('data-privilege') || 'Low';
    const adminButtons = document.querySelectorAll('.admin-button');

    // Показываем кнопки администратора для Medium, High и VeryHigh
    if (['Medium', 'High', 'VeryHigh'].includes(privilege)) {
        adminButtons.forEach(button => {
            button.style.display = 'block';
        });
    } else {
        adminButtons.forEach(button => {
            button.style.display = 'none';
        });
    }

    // Показываем кнопку создания задач только для High и VeryHigh
    const createTaskBtn = document.getElementById('create-task-btn');
    if (['High', 'VeryHigh'].includes(privilege)) {
        createTaskBtn.style.display = 'block';
    } else {
        createTaskBtn.style.display = 'none';
    }
}

// Обновите функцию инициализации
window.onload = () => {
    loadDocuments();
    loadTasks();
    loadEmployees(); // Добавьте эту строку
    checkPrivileges();
    
    if (typeof Chart !== 'undefined') {
        new Chart(document.getElementById('chart-container'), {
            type: 'bar',
            data: {
                labels: ['Посещения', 'Успешные случаи'],
                datasets: [{
                    label: 'Статистика',
                    data: [85, 65],
                    backgroundColor: ['#2A5CAA', '#1E457B']
                }]
            }
        });
    }
};