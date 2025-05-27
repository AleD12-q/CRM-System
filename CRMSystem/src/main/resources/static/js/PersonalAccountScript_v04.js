// Логика отображения разделов
function showSection(sectionId) {
    document.querySelectorAll('.main-content > div').forEach(div => {
        div.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    // Загружаем данные при открытии раздела
    if (sectionId === 'tasks') {
        loadTasks();
    } else if (sectionId === 'employees-list') {
        loadEmployees();
    } else if (sectionId === 'stats') {
        loadTaskStats();
        loadDepartmentStats();
    }
}

// Управление модальными окнами
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Загрузка документов
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

// Создание задачи
function createTask() {
    const checkboxes = document.querySelectorAll('#assignees-checkbox-container input[type="checkbox"]:checked');
    const assignees = Array.from(checkboxes).map(checkbox => checkbox.value);

    // Валидация на клиенте
    const taskTitle = document.getElementById('taskTitle').value.trim();
    if (!taskTitle) {
        alert('Название задачи обязательно');
        return;
    }

    if (assignees.length === 0) {
        alert('Необходимо выбрать хотя бы одного исполнителя');
        return;
    }

    const formData = {
        taskTitle: taskTitle,
        taskDescription: document.getElementById('taskDescription').value.trim(),
        taskAssignees: assignees.map(id => parseInt(id)), // Преобразуем строки в числа
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
            alert(data.message);
            loadTasks(); // Обновляем список задач
            // Очищаем форму
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            document.getElementById('taskDeadline').value = '';
            // Снимаем выделение с исполнителей
            document.querySelectorAll('#assignees-checkbox-container input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
        } else {
            alert(data.error || 'Ошибка создания задачи!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Сетевая ошибка при создании задачи');
    })
    .finally(() => {
        closeModal('create-task');
    });
}

// Загрузка задач
async function loadTasks() {
    try {
        const privilege = document.body.getAttribute('data-privilege') || 'Low';
        const userDepartment = document.querySelector('.employee-card p:nth-child(3) span').textContent;

        const response = await fetch('/api/task-list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const tasks = await response.json();

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

    } catch (error) {
        console.error('Ошибка при загрузке списка задач:', error);
        document.getElementById('tasks-container').innerHTML =
            '<p class="empty-list error">Не удалось загрузить список задач</p>';
    }
}

// Загрузка сотрудников
async function loadEmployees() {
    try {
        const privilege = document.body.getAttribute('data-privilege') || 'Low';
        const userDepartment = document.querySelector('.employee-card p:nth-child(3) span').textContent;

        const response = await fetch('/api/user-list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const allUsers = await response.json();
        let employeesToShow = [];

        if (privilege === 'Medium') {
            employeesToShow = allUsers.filter(user => user.department === userDepartment);
        } else if (['High', 'VeryHigh'].includes(privilege)) {
            employeesToShow = allUsers;
        }

        const container = document.getElementById('employees-container');
        const assigneeContainer = document.getElementById('assignees-checkbox-container');

        // Очищаем контейнеры перед заполнением
        container.innerHTML = '';
        assigneeContainer.innerHTML = '';

        // Заполняем чекбоксы для выбора исполнителей
        employeesToShow.forEach(employee => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox-item';
            checkboxDiv.innerHTML = `
                <input type="checkbox" id="assignee-${employee.id}" value="${employee.id}">
                <label for="assignee-${employee.id}">${employee.fullName} (${employee.position})</label>
            `;
            assigneeContainer.appendChild(checkboxDiv);
        });

        // Формируем HTML для отображения сотрудников
        employeesToShow.forEach(employee => {
            const employeeDiv = document.createElement('div');
            employeeDiv.className = 'employee-item';
            employeeDiv.dataset.id = employee.id;
            employeeDiv.innerHTML = `
                <h4>${employee.fullName}</h4>
                <div class="employee-details">
                    <p><strong>Должность:</strong> ${employee.position}</p>
                    <p><strong>Отдел:</strong> ${employee.department}</p>
                    <p><strong>Email:</strong> ${employee.email}</p>
                    ${['High', 'VeryHigh'].includes(privilege) ?
                      `<p><strong>ID:</strong> ${employee.id}</p>` : ''}
                </div>
            `;

            // Добавляем обработчик клика для выделения сотрудника
            employeeDiv.addEventListener('click', function(e) {
                // Если клик был по ссылке или кнопке внутри, не выделяем
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                    return;
                }

                // Снимаем выделение со всех сотрудников
                document.querySelectorAll('.employee-item').forEach(item => {
                    item.classList.remove('selected');
                });

                // Выделяем текущего сотрудника
                this.classList.toggle('selected');

                // Показываем кнопки управления, если есть права
                if (['High', 'VeryHigh'].includes(privilege) && this.classList.contains('selected')) {
                    showEmployeeActions(employee);
                }
            });

            container.appendChild(employeeDiv);
        });

        if (employeesToShow.length === 0) {
            container.innerHTML = '<p class="empty-list">Сотрудники не найдены</p>';
        }

    } catch (error) {
        console.error('Ошибка при загрузке списка сотрудников:', error);
        document.getElementById('employees-container').innerHTML =
            '<p class="empty-list error">Не удалось загрузить список сотрудников</p>';
    }
}

// Показать действия для сотрудника
function showEmployeeActions(employee) {
    const modal = document.getElementById('employee-actions');
    const infoDiv = document.getElementById('selected-employee-info');

    infoDiv.innerHTML = `
        <p><strong>Сотрудник:</strong> ${employee.fullName}</p>
        <p><strong>Текущая должность:</strong> ${employee.position}</p>
        <p><strong>Отдел:</strong> ${employee.department}</p>
        <p><strong>Текущая привилегия:</strong> ${translatePrivilege(employee.privilegeLevel)}</p>
    `;

    // Устанавливаем текущие значения в селекторы
    document.getElementById('privilege-select').value = employee.privilegeLevel || 'Low';
    document.getElementById('department-select').value = employee.department || 'IT';

    // Показываем модальное окно
    modal.style.display = 'block';
    modal.dataset.employeeId = employee.id;
}

// Перевод привилегий в читаемый формат
function translatePrivilege(privilege) {
    const translations = {
        'Low': 'Низкий',
        'Medium': 'Средний',
        'High': 'Высокий',
        'VeryHigh': 'Администратор'
    };
    return translations[privilege] || privilege;
}

// Обновление привилегий сотрудника
function updateEmployeePrivilege() {
    const employeeId = document.getElementById('employee-actions').dataset.employeeId;
    const newPrivilege = document.getElementById('privilege-select').value;

    if (!employeeId) {
        alert('Не выбран сотрудник');
        return;
    }

    fetch('/api/update-employee-privilege', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            employeeId: employeeId,
            privilegeLevel: newPrivilege
        })
    })
    .then(async response => {
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            loadEmployees(); // Обновляем список сотрудников
            closeModal('employee-actions');
        } else {
            alert(data.error || 'Ошибка обновления привилегий!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Сетевая ошибка при обновлении привилегий');
    });
}

// Перевод сотрудника в другой отдел
function transferEmployee() {
    const employeeId = document.getElementById('employee-actions').dataset.employeeId;
    const newDepartment = document.getElementById('department-select').value;

    if (!employeeId) {
        alert('Не выбран сотрудник');
        return;
    }

    fetch('/api/transfer-employee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            employeeId: employeeId,
            department: newDepartment
        })
    })
    .then(async response => {
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            loadEmployees(); // Обновляем список сотрудников
            closeModal('employee-actions');
        } else {
            alert(data.error || 'Ошибка перевода сотрудника!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Сетевая ошибка при переводе сотрудника');
    });
}

// Удаление сотрудника
function deleteEmployee() {
    const employeeId = document.getElementById('employee-actions').dataset.employeeId;

    if (!employeeId) {
        alert('Не выбран сотрудник');
        return;
    }

    if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
        return;
    }

    fetch('/api/delete-employee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            employeeId: employeeId
        })
    })
    .then(async response => {
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            loadEmployees(); // Обновляем список сотрудников
            closeModal('employee-actions');
        } else {
            alert(data.error || 'Ошибка удаления сотрудника!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Сетевая ошибка при удалении сотрудника');
    });
}

// Проверка прав доступа
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

// Инициализация календаря
function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const now = new Date();
        const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                          "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

        let calendarHTML = `
            <h3>${monthNames[now.getMonth()]} ${now.getFullYear()}</h3>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px;">
                <div style="text-align: center; font-weight: bold;">Пн</div>
                <div style="text-align: center; font-weight: bold;">Вт</div>
                <div style="text-align: center; font-weight: bold;">Ср</div>
                <div style="text-align: center; font-weight: bold;">Чт</div>
                <div style="text-align: center; font-weight: bold;">Пт</div>
                <div style="text-align: center; font-weight: bold;">Сб</div>
                <div style="text-align: center; font-weight: bold;">Вс</div>
        `;

        // Простой календарь без логики (можно заменить на полноценную библиотеку)
        for (let i = 1; i <= 31; i++) {
            calendarHTML += `<div style="text-align: center; padding: 5px; border-radius: 50%;
                ${i === now.getDate() ? 'background: #2A5CAA; color: white;' : ''}">${i}</div>`;
        }

        calendarHTML += `</div>`;
        calendarEl.innerHTML = calendarHTML;
    }
}

// Загрузка статистики задач
async function loadTaskStats() {
    const chartEl = document.getElementById('task-stats-chart');
    if (!chartEl) return;

    try {
        const response = await fetch('/api/task-stats');
        if (!response.ok) throw new Error('Ошибка сервера');

        const stats = await response.json();

        if (typeof Chart === 'undefined') {
            chartEl.innerHTML = '<p class="empty-list">Chart.js не загружен</p>';
            return;
        }

        // Удаляем предыдущий график, если он существует
        if (chartEl.chart) {
            chartEl.chart.destroy();
        }

        // Создаем новый график
        chartEl.innerHTML = '<canvas></canvas>';
        const ctx = chartEl.querySelector('canvas').getContext('2d');

        chartEl.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Выполнено', 'В процессе', 'Небольшая задержка', 'Сильное опоздание'],
                datasets: [{
                    data: [
                        stats.completed || 0,
                        stats.inProgress || 0,
                        stats.slightDelay || 0,
                        stats.severeDelay || 0
                    ],
                    backgroundColor: [
                        '#2A5CAA', '#5cb85c', '#f0ad4e', '#d9534f'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Статус задач'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        chartEl.innerHTML = '<p class="empty-list error">Ошибка загрузки статистики</p>';
    }
}

// Загрузка статистики отдела
async function loadDepartmentStats() {
    const chartEl = document.getElementById('department-stats-chart');
    if (!chartEl) return;

    try {
        const response = await fetch('/api/department-stats');
        if (!response.ok) throw new Error('Ошибка сервера');

        const stats = await response.json();

        if (typeof Chart === 'undefined') {
            chartEl.innerHTML = '<p class="empty-list">Chart.js не загружен</p>';
            return;
        }

        // Удаляем предыдущий график, если он существует
        if (chartEl.chart) {
            chartEl.chart.destroy();
        }

        // Создаем новый график
        chartEl.innerHTML = '<canvas></canvas>';
        const ctx = chartEl.querySelector('canvas').getContext('2d');

        chartEl.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: stats.departments || ['IT', 'HR', 'Финансы', 'Маркетинг'],
                datasets: [{
                    label: 'Завершено',
                    data: stats.completed || [12, 19, 3, 5],
                    backgroundColor: '#5cb85c'
                }, {
                    label: 'В процессе',
                    data: stats.inProgress || [8, 12, 6, 9],
                    backgroundColor: '#f0ad4e'
                }, {
                    label: 'Просрочено',
                    data: stats.overdue || [3, 5, 2, 4],
                    backgroundColor: '#d9534f'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Статистика по отделам'
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        chartEl.innerHTML = '<p class="empty-list error">Ошибка загрузки статистики</p>';
    }
}

// Инициализация при загрузке страницы
window.onload = () => {
    loadDocuments();
    loadTasks();
    loadEmployees();
    checkPrivileges();
    initCalendar();
    loadTaskStats();
    loadDepartmentStats();
};