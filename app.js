// Состояние приложения
let currentScreen = 'program';
let currentProgram = null;
let composers = [];
let tickets = { doop: [], fgt: [] };
let tests = [];

// Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Функция рендеринга
function render() {
    const app = document.getElementById('app');
    
    if (currentScreen === 'program') {
        renderProgramScreen(app);
    } else if (currentScreen === 'main') {
        renderMainMenu(app);
    } else if (currentScreen === 'composers') {
        renderComposersList(app);
    } else if (currentScreen === 'composerDetail' && window.selectedComposer) {
        renderComposerDetail(app, window.selectedComposer);
    } else if (currentScreen === 'tickets') {
        renderTicketsList(app);
    } else if (currentScreen === 'ticketDetail' && window.selectedTicket) {
        renderTicketDetail(app, window.selectedTicket);
    } else {
        renderProgramScreen(app);
    }
}

// Экран выбора программы
function renderProgramScreen(container) {
    container.innerHTML = `
        <div class="header">
            <h1>🎵 Музлит-репетитор</h1>
            <p class="subtitle">Подготовка к экзамену по русской музыкальной литературе</p>
        </div>
        <div class="card" onclick="selectProgram('FGT')">
            <div class="icon">🎓</div>
            <h3>ФГТ / ДПОП</h3>
            <p>Предпрофессиональная программа</p>
            <p class="subtitle">5 лет обучения, углублённо, экзамен + реферат</p>
        </div>
        <div class="card" onclick="selectProgram('DOOP')">
            <div class="icon">🎨</div>
            <h3>ДООП / ОРП</h3>
            <p>Общеразвивающая программа</p>
            <p class="subtitle">4 года обучения, обзорно, экзамен</p>
        </div>
        <div class="footer">
            <p>ДШИ «Лицей искусств» им. В.Н. Сафонова, Тольятти</p>
        </div>
    `;
}

// Главное меню
function renderMainMenu(container) {
    const programName = currentProgram === 'FGT' ? 'Предпрофессиональная' : 'Общеразвивающая';
    container.innerHTML = `
        <div class="header">
            <h1>🎵 Музлит-репетитор</h1>
            <p class="subtitle">${programName} программа</p>
        </div>
        <div class="menu-grid">
            <div class="menu-card" onclick="goToComposers()">
                <div class="icon">📚</div>
                <h3>Композиторы</h3>
                <p>${composers.length} композиторов с биографиями и разборами</p>
            </div>
            <div class="menu-card" onclick="goToTickets()">
                <div class="icon">📝</div>
                <h3>Экзаменационные билеты</h3>
                <p>${currentProgram === 'DOOP' ? '10' : '15'} билетов с полными ответами</p>
            </div>
            <div class="menu-card" onclick="alert('Скоро будет доступно!')">
                <div class="icon">✍️</div>
                <h3>Тесты</h3>
                <p>Проверьте свои знания</p>
            </div>
            <div class="menu-card" onclick="alert('Скоро будет доступно!')">
                <div class="icon">🎧</div>
                <h3>Аудиовикторина</h3>
                <p>Тренируйте музыкальный слух</p>
            </div>
        </div>
        <button class="btn-back" onclick="backToProgram()">← Изменить программу</button>
        <div class="footer">
            <p>ДШИ «Лицей искусств» им. В.Н. Сафонова, Тольятти</p>
        </div>
    `;
}

// Список композиторов
function renderComposersList(container) {
    const filteredComposers = currentProgram === 'FGT' ? composers : composers;
    
    let html = `
        <div class="header">
            <button class="btn-back" onclick="goToMain()" style="margin-bottom: 12px;">← Назад</button>
            <h1>Композиторы</h1>
        </div>
    `;
    
    filteredComposers.forEach(composer => {
        html += `
            <div class="composer-card" onclick="showComposerDetail('${composer.id}')">
                <h3>${composer.name}</h3>
                <p class="subtitle">${composer.years}</p>
                <p>${composer.shortBio.substring(0, 100)}...</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Детальная карточка композитора
function renderComposerDetail(container, composer) {
    container.innerHTML = `
        <div class="header">
            <button class="btn-back" onclick="goToComposers()" style="margin-bottom: 12px;">← Назад</button>
            <h1>${composer.name}</h1>
            <p class="subtitle">${composer.years}</p>
        </div>
        <div style="background: var(--tg-theme-secondary-bg-color, #f5f5f5); border-radius: 16px; padding: 20px;">
            <div style="margin-bottom: 20px;">
                <h3>📖 Биография</h3>
                <p>${composer.shortBio}</p>
            </div>
            <div style="margin-bottom: 20px;">
                <h3>🎵 Главные произведения</h3>
                <p>${composer.mainWorks}</p>
            </div>
            <div>
                <h3>🎓 Что нужно знать на экзамене</h3>
                <p>${composer.examNotes}</p>
            </div>
        </div>
    `;
}

// Список билетов
function renderTicketsList(container) {
    const ticketsList = currentProgram === 'DOOP' ? tickets.doop : tickets.fgt;
    
    let html = `
        <div class="header">
            <button class="btn-back" onclick="goToMain()" style="margin-bottom: 12px;">← Назад</button>
            <h1>Экзаменационные билеты</h1>
        </div>
    `;
    
    ticketsList.forEach(ticket => {
        html += `
            <div class="composer-card" onclick="showTicketDetail(${ticket.ticketNumber})">
                <h3>Билет №${ticket.ticketNumber}</h3>
                <p class="subtitle">${ticket.questions[0].substring(0, 80)}...</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Детальный билет
function renderTicketDetail(container, ticket) {
    let answersHtml = '';
    for (let i = 0; i < ticket.questions.length; i++) {
        const answerKey = `showAnswer${i}`;
        answersHtml += `
            <div style="background: var(--tg-theme-secondary-bg-color, #f5f5f5); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                <h3>Вопрос ${i + 1}</h3>
                <p>${ticket.questions[i]}</p>
                <button class="btn-back" onclick="toggleAnswer(${i})" style="margin-top: 12px;">Показать ответ</button>
                <div id="answer-${i}" style="display: none; margin-top: 12px; padding: 12px; background: var(--tg-theme-bg-color, #fff); border-radius: 8px;">
                    <p>${ticket[`fullAnswer${i + 1}`]}</p>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="header">
            <button class="btn-back" onclick="goToTickets()" style="margin-bottom: 12px;">← Назад</button>
            <h1>Билет №${ticket.ticketNumber}</h1>
        </div>
        ${answersHtml}
    `;
    
    // Сохраняем текущий билет для функций переключения ответов
    window.currentTicket = ticket;
}

// Загрузка данных
async function loadData() {
    try {
        const composersRes = await fetch('/composers.json');
        const composersData = await composersRes.json();
        composers = composersData.composers;
        
        const ticketsRes = await fetch('/tickets.json');
        tickets = await ticketsRes.json();
        
        const testsRes = await fetch('/tests.json');
        const testsData = await testsRes.json();
        tests = testsData.tests;
        
        render();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        document.getElementById('app').innerHTML = '<div class="loading">Ошибка загрузки данных. Проверьте файлы JSON.</div>';
    }
}

// Навигация
window.selectProgram = (program) => {
    currentProgram = program;
    currentScreen = 'main';
    render();
};

window.backToProgram = () => {
    currentScreen = 'program';
    currentProgram = null;
    render();
};

window.goToMain = () => {
    currentScreen = 'main';
    render();
};

window.goToComposers = () => {
    currentScreen = 'composers';
    render();
};

window.goToTickets = () => {
    currentScreen = 'tickets';
    render();
};

window.showComposerDetail = (id) => {
    window.selectedComposer = composers.find(c => c.id === id);
    currentScreen = 'composerDetail';
    render();
};

window.showTicketDetail = (ticketNumber) => {
    const ticketsList = currentProgram === 'DOOP' ? tickets.doop : tickets.fgt;
    window.selectedTicket = ticketsList.find(t => t.ticketNumber === ticketNumber);
    currentScreen = 'ticketDetail';
    render();
};

window.toggleAnswer = (index) => {
    const answerDiv = document.getElementById(`answer-${index}`);
    const button = answerDiv.previousElementSibling;
    if (answerDiv.style.display === 'none') {
        answerDiv.style.display = 'block';
        button.textContent = 'Скрыть ответ';
    } else {
        answerDiv.style.display = 'none';
        button.textContent = 'Показать ответ';
    }
};

// Запуск приложения
loadData();
