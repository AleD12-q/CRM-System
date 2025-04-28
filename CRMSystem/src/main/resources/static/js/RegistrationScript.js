document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        position: document.getElementById('position').value,
        department: document.getElementById('position').value === 'admin' ? null : document.getElementById('department').value,
        privilegeKey: document.getElementById('privilegeKey')?.value || null
    };

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(async response => {
        const data = await response.json();

        if (response.ok) {
            window.location.href = '/personal-account';
        } else {
            alert(data.error || 'Ошибка регистрации!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Сетевая ошибка');
    });
});

// Показывать/скрывать поле отдела и поле ключа привилегий в зависимости от должности
document.getElementById('position').addEventListener('change', function() {
    const isAdmin = this.value === 'admin';
    document.getElementById('department-group').style.display = isAdmin ? 'none' : 'block';
    document.getElementById('privilege-key-group').style.display = isAdmin ? 'block' : 'none';
});