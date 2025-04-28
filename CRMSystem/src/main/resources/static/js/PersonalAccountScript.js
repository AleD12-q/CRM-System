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

function showPersonalInfo() {
    document.querySelectorAll('.main-content > div').forEach(div => {
        div.style.display = 'none';
    });
    document.querySelector('.employee-card').style.display = 'block';
}

// Проверка привилегий и скрытие кнопок
function checkPrivileges() {
    const privilege = document.body.getAttribute('data-privilege') || 'low';
    const adminButtons = document.querySelectorAll('.admin-button');
    
    if (privilege === 'low') {
        adminButtons.forEach(button => {
            button.style.display = 'none';
        });
    }
}

// Инициализация
window.onload = () => {
    loadDocuments();
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