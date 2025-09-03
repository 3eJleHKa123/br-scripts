// baninfo.js (https://raw.githubusercontent.com/3eJleHKa123/br-scripts/main/baninfo.js)
// Версия без логов

(function () {
    'use strict';

    // --- Настройки ---
    const PERIOD_DAYS = 179;
    const REQUEST_DELAY_MS = 1200;
    let lastRequestTime = 0;

    // --- Стили ---
    const styles = `
        #log-filter-section {
            width: 320px !important;
            max-width: 320px !important;
            min-width: 320px !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
        }
        #log-filter-form {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
        }
        #ban-check-container-v41 {
            display: flex;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
            width: 100%;
            box-sizing: border-box;
        }
        #ban-check-btn-v41 {
            width: 111px;
            height: 38px;
            background-color: #dc3545 !important;
            border-color: #dc3545 !important;
            border-radius: 4px !important;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 !important;
            font-size: 20px;
            font-weight: bold;
            color: white !important;
            cursor: pointer;
            flex-shrink: 0;
        }
        #ban-check-btn-v41:hover {
            background-color: #c82333 !important;
            border-color: #bd2130 !important;
        }
        #ban-check-btn-v41:focus {
             outline: 0 !important;
             box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
        }
        #ban-check-btn-v41:disabled {
            background-color: #6c757d !important;
            border-color: #6c757d !important;
            opacity: 0.65;
            cursor: not-allowed;
        }
        #ban-check-result-v41 {
            flex-grow: 1;
            width: 100%;
            padding: 8px;
            border-radius: 6px;
            font-size: 14px;
            background: #f5f5f5;
            min-height: 20px;
            box-sizing: border-box;
            word-wrap: break-word;
            overflow-wrap: break-word;
            overflow-x: auto;
            line-height: 1.3;
        }
        #ban-check-result-v41 > div {
             margin: 0 0 2px 0;
        }
        .ban-info-banned-v41 {
            color: #d32f2f;
            font-weight: bold;
            margin-bottom: 4px;
        }
        .ban-info-not-found-v41, .ban-info-success-v41 {
            color: green;
            font-weight: bold;
        }
        .ban-info-error-v41 {
            color: #d32f2f;
        }
        .ban-info-loading-v41 {
            color: #1976d2;
        }
    `;

    // --- Функции-утилиты ---
    function addStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        (document.head || document.getElementsByTagName('head')[0]).appendChild(style);
    }

    function showResult(message, type = 'info', resultBoxElement) {
        if (!resultBoxElement) return;
        resultBoxElement.textContent = '';
        resultBoxElement.className = '';
        if (type === 'loading') {
            resultBoxElement.classList.add('ban-info-loading-v41');
            resultBoxElement.textContent = message;
        } else if (type === 'error') {
            resultBoxElement.classList.add('ban-info-error-v41');
            resultBoxElement.textContent = message;
        } else if (type === 'not_found') {
            resultBoxElement.classList.add('ban-info-not-found-v41');
            resultBoxElement.innerHTML = message;
        } else if (type === 'success') {
            resultBoxElement.classList.add('ban-info-success-v41');
            resultBoxElement.innerHTML = message;
        } else {
            resultBoxElement.textContent = message;
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    function parseBanInfo(transactionDesc, playerName) {
        let duration = "Неизвестно";
        let reason = "Не указана";

        const foreverMatch = /Навсегда/i.test(transactionDesc);
        const timeMatch = transactionDesc.match(/на\s+(\d+)\s+(день|дня|дней|час|часа|часов|минуту|минуты|минут|неделю|недели|недель|месяц|месяца|месяцев)/i);
        if (foreverMatch) {
            duration = "Навсегда";
        } else if (timeMatch) {
            duration = `${timeMatch[1]} ${timeMatch[2]}`;
        }

        const reasonMatch = transactionDesc.match(/Причина\s*([^|]+?)(?:\s*\||$)/i);
        if (reasonMatch) {
            reason = reasonMatch[1].trim();
        }

        return { duration, reason };
    }

    function daysAgo(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    }

    function iso(date) {
        return date.toISOString().slice(0, -5) + 'Z';
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function throttle() {
        const since = Date.now() - lastRequestTime;
        if (since < REQUEST_DELAY_MS) {
            await wait(REQUEST_DELAY_MS - since);
        }
    }

    // --- Логика API ---
    async function makeApiRequest(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                // credentials: 'include' // Может понадобиться
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('TOO_MANY_REQUESTS');
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async function getPlayerBlocks(playerName, resultBoxElement) {
        await throttle();
        lastRequestTime = Date.now();

        const endDate = new Date();
        const startDate = daysAgo(PERIOD_DAYS);

        const descFilterRaw = `%заблокировал% %${playerName}%`;

        const params = new URLSearchParams({
            category_id__exact: '',
            player_name__exact: '',
            player_id__exact: '',
            player_ip__exact: '',
            transaction_amount__exact: '',
            balance_after__exact: '',
            transaction_desc__ilike: descFilterRaw,
            time__gte: iso(startDate),
            time__lte: iso(endDate),
            order_by: 'time',
            offset: '0',
            limit: '200',
            auto: 'false'
        });

        let paramsString = params.toString();
        paramsString = paramsString.replace(/time__gte=[^&]*?%3A/g, (match) => match.replace(/%3A/g, ':'));
        paramsString = paramsString.replace(/time__lte=[^&]*?%3A/g, (match) => match.replace(/%3A/g, ':'));

        // Определяем SERVER_ID из URL
        const pathParts = location.pathname.split('/').filter(p => p);
        const gslogsIndex = pathParts.indexOf('gslogs');
        const serverId = (gslogsIndex !== -1 && pathParts[gslogsIndex + 1] && !isNaN(pathParts[gslogsIndex + 1])) ? pathParts[gslogsIndex + 1] : null;

        if (!serverId) {
            throw new Error('Не удалось определить ID сервера из URL');
        }
        const API_BASE_URL = `${location.origin}/gslogs/${serverId}/api/list-game-logs/`;
        const url = `${API_BASE_URL}?${paramsString}`;

        try {
            const data = await makeApiRequest(url);
            
            let logsArray;
            if (Array.isArray(data)) {
                logsArray = data;
            } else if (data && typeof data === 'object' && Array.isArray(data.results)) {
                logsArray = data.results;
            } else {
                logsArray = Array.isArray(data) ? data : (data ? [data] : []);
            }
            return logsArray;
        } catch (error) {
            if (error.message === 'TOO_MANY_REQUESTS') {
                showResult('Слишком частые запросы. Повтор через 5 секунд...', 'loading', resultBoxElement);
                await wait(5000);
                return await getPlayerBlocks(playerName, resultBoxElement);
            }
            throw error;
        }
    }

    // --- Основная логика ---
    async function handleInfoButtonClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const playerNameInput = document.querySelector('#playerNameInput');
        let playerName = playerNameInput ? playerNameInput.value.trim() : '';

        if (!playerName) {
            const urlParams = new URLSearchParams(window.location.search);
            playerName = urlParams.get('pname') || '';
            playerName = playerName.trim();
        }

        const resultBox = document.getElementById('ban-check-result-v41');
        if (!playerName) {
            showResult('Имя игрока не указано.', 'error', resultBox);
            return;
        }

        showResult('Загрузка информации...', 'loading', resultBox);

        try {
            const logs = await getPlayerBlocks(playerName, resultBox);

            if (logs && logs.length > 0) {
                const sortedLogs = logs.sort((a, b) => new Date(b.time) - new Date(a.time));
                const lastBlockLog = sortedLogs[0];

                if (lastBlockLog && lastBlockLog.transaction_desc) {
                    const adminNick = lastBlockLog.player_name || "Неизвестен";
                    const blockInfo = parseBanInfo(lastBlockLog.transaction_desc, playerName);
                    const formattedTime = formatDate(lastBlockLog.time);

                    const html = `
                        <div class="ban-info-banned-v41">🛑 Последняя блокировка ${playerName}</div>
                        <div><b>Срок:</b> ${blockInfo.duration}</div>
                        <div><b>Причина:</b> ${blockInfo.reason}</div>
                        <div><b>Админ:</b> ${adminNick}</div>
                        <div><b>Время:</b> ${formattedTime}</div>
                    `;
                    showResult(html, 'success', resultBox);
                } else {
                    showResult(`Ошибка обработки данных последней блокировки для "${playerName}".`, 'error', resultBox);
                }
            } else {
                showResult(`Блокировки для <b>"${playerName}"</b> не найдены.`, 'not_found', resultBox);
            }
        } catch (error) {
            if (error.message && error.message.includes('HTTP')) {
                showResult(`Ошибка API: ${error.message}`, 'error', resultBox);
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                 showResult('Ошибка сети. Проверьте соединение.', 'error', resultBox);
            } else {
                 showResult(`Ошибка: ${error.message || 'Неизвестная ошибка'}`, 'error', resultBox);
            }
        }
    }

    function createBanCheckerUI() {
        // Проверяем, на правильной ли странице мы находимся
        if (!window.location.href.startsWith('https://logs.blackrussia.online/gslogs/')) {
            return;
        }

        const playerNameInput = document.querySelector('#playerNameInput');
        if (!playerNameInput) {
            return; // Элемент еще не загрузился
        }

        // Проверяем, не создана ли кнопка уже
        if (document.getElementById('ban-check-container-v41')) {
            return;
        }

        // Добавляем стили один раз
        if (!document.getElementById('ban-check-styles-v41')) {
            addStyle(styles);
            const styleMarker = document.createElement('style');
            styleMarker.id = 'ban-check-styles-v41';
            styleMarker.textContent = '/* Ban Checker Styles Loaded */';
            (document.head || document.getElementsByTagName('head')[0]).appendChild(styleMarker);
        }

        const container = document.createElement('div');
        container.id = 'ban-check-container-v41';

        const button = document.createElement('button');
        button.id = 'ban-check-btn-v41';
        button.textContent = '🚫';
        button.type = 'button';
        // Пробуем применить стили Bootstrap, если они есть
        button.className = 'btn btn-danger';

        const resultBox = document.createElement('div');
        resultBox.id = 'ban-check-result-v41';
        resultBox.textContent = 'Введите имя игрока и нажмите кнопку.';

        container.appendChild(button);
        container.appendChild(resultBox);

        playerNameInput.parentNode.insertBefore(container, playerNameInput.nextSibling);

        button.addEventListener('click', handleInfoButtonClick);
    }

    // --- Инициализация (как в br-trade-viewer.js) ---
    
    // Пробуем создать UI сразу
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBanCheckerUI);
    } else {
        createBanCheckerUI();
    }

    // Наблюдаем за изменениями в DOM для динамически подгружаемых элементов
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                // Проверяем, появились ли нужные элементы
                if (document.querySelector('#playerNameInput') && !document.querySelector('#ban-check-container-v41')) {
                    setTimeout(createBanCheckerUI, 100); // Небольшая задержка для уверенности
                }
            }
        });
    });

    // Начинаем наблюдение
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Останавливаем наблюдение при выгрузке страницы
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });

})();
