document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Здесь можно добавить валидацию формы
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        position: document.getElementById('position').value,
        department: document.getElementById('department').value
    };

   fetch('/api/register', {  // Указываем путь к API
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