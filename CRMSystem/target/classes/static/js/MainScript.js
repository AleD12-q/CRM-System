document.addEventListener('DOMContentLoaded', function() {
    // Создаем логотип с помощью Canvas
    const logo = document.getElementById('logo');
    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');

    // Рисуем логотип
    ctx.fillStyle = '#2A5CAA';
    ctx.beginPath();
    ctx.arc(25, 25, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M', 25, 25);

    logo.appendChild(canvas);

    // Анимация кнопок
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});