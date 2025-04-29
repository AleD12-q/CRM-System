document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    fetch('/api/login', {
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
            alert(data.error || 'Ошибка входа!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Сетевая ошибка');
    });
});