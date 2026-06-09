function selectProgram(program) {
    const tg = window.Telegram.WebApp;
    tg.sendData(JSON.stringify({ program: program }));
    tg.close();
}

document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('click', () => {
        const program = card.getAttribute('data-program');
        selectProgram(program);
    });
});

// Расширяем Mini App на весь экран
const tg = window.Telegram.WebApp;
tg.expand();
