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
            deadline: "2023-12-15",
            status: "active"
        },
        {
            id: 2,
            title: "Провести встречу",
            description: "Совещание с клиентом",
            assignee: "Петров П.П.",
            deadline: "2023-11-30",
            status: "overdue-25"
        },
        {
            id: 3,
            title: "Обновить базу данных",
            description: "Перенос данных на новый сервер",
            assignee: "Сидоров С.С.",
            deadline: "2023-11-10",
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
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const assignee = document.getElementById('task-assignee').value;
    const deadline = document.getElementById('task-deadline').value;

    // Здесь будет отправка данных на сервер
    console.log({ title, description, assignee, deadline });

    closeModal('create-task');
    loadTasks(); // Перезагружаем список задач
}

// Проверка привилегий и скрытие кнопок
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

// Инициализация
window.onload = () => {
    loadDocuments();
    loadTasks();
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