// baninfo.js (или другой файл, который будет подключаться как content script)
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
        console.log('[Ban Checker] addStyle called');
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        const target = (document.head || document.getElementsByTagName('head')[0]);
        if (target) {
            target.appendChild(style);
            console.log('[Ban Checker] Styles added to <head>');
        } else {
            console.warn('[Ban Checker] <head> not found for styles');
        }
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
            console.log(`[Ban Checker] Throttling for ${REQUEST_DELAY_MS - since}ms`);
            await wait(REQUEST_DELAY_MS - since);
        }
    }

    // --- Логика API ---
    async function makeApiRequest(url) {
        console.log(`[Ban Checker] Fetching API: ${url}`);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                // credentials: 'include' // Может понадобиться
            });

            console.log(`[Ban Checker] API Response Status: ${response.status}`);
            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('TOO_MANY_REQUESTS');
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`[Ban Checker] API Response Parsed`);
            return data;
        } catch (error) {
            console.error('[Ban Checker] API request failed:', error);
            throw error;
        }
    }

    async function getPlayerBlocks(playerName, resultBoxElement) {
        console.log(`[Ban Checker] getPlayerBlocks called for: ${playerName}`);
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
            const errorMsg = 'Не удалось определить ID сервера из URL';
            console.error(`[Ban Checker] ${errorMsg}`);
            throw new Error(errorMsg);
        }
        console.log(`[Ban Checker] Determined serverId: ${serverId}`);
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
            console.log(`[Ban Checker] getPlayerBlocks returning ${logsArray.length} logs`);
            return logsArray;
        } catch (error) {
            if (error.message === 'TOO_MANY_REQUESTS') {
                console.log('[Ban Checker] Too many requests, retrying in 5s...');
                showResult('Слишком частые запросы. Повтор через 5 секунд...', 'loading', resultBoxElement);
                await wait(5000);
                return await getPlayerBlocks(playerName, resultBoxElement);
            }
            throw error;
        }
    }

    // --- Основная логика ---
    async function handleInfoButtonClick(event) {
        console.log('[Ban Checker] Button clicked');
        event.preventDefault();
        event.stopPropagation();

        const playerNameInput = document.querySelector('#playerNameInput');
        console.log('[Ban Checker] Found playerNameInput:', playerNameInput);
        let playerName = playerNameInput ? playerNameInput.value.trim() : '';
        console.log('[Ban Checker] playerName from input:', playerName);

        if (!playerName) {
            const urlParams = new URLSearchParams(window.location.search);
            playerName = urlParams.get('pname') || '';
            playerName = playerName.trim();
            console.log('[Ban Checker] playerName from URL:', playerName);
        }

        const resultBox = document.getElementById('ban-check-result-v41');
        console.log('[Ban Checker] Found resultBox:', resultBox);
        if (!playerName) {
            console.log('[Ban Checker] No player name provided');
            showResult('Имя игрока не указано.', 'error', resultBox);
            return;
        }

        showResult('Загрузка информации...', 'loading', resultBox);

        try {
            console.log(`[Ban Checker] Calling getPlayerBlocks for ${playerName}`);
            const logs = await getPlayerBlocks(playerName, resultBox);

            if (logs && logs.length > 0) {
                console.log(`[Ban Checker] Received ${logs.length} logs, sorting...`);
                const sortedLogs = logs.sort((a, b) => new Date(b.time) - new Date(a.time));
                const lastBlockLog = sortedLogs[0];
                console.log('[Ban Checker] Last block log:', lastBlockLog);

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
                    console.log('[Ban Checker] Last block log is missing transaction_desc');
                    showResult(`Ошибка обработки данных последней блокировки для "${playerName}".`, 'error', resultBox);
                }
            } else {
                console.log(`[Ban Checker] No logs found for ${playerName}`);
                showResult(`Блокировки для <b>"${playerName}"</b> не найдены.`, 'not_found', resultBox);
            }
        } catch (error) {
            console.error('[Ban Checker] Error in handleInfoButtonClick:', error);
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
        console.log('[Ban Checker] createBanCheckerUI called');
        // Проверяем, на правильной ли странице мы находимся
        if (!window.location.href.startsWith('https://logs.blackrussia.online/gslogs/')) {
            console.log('[Ban Checker] Not on the correct page, exiting');
            return;
        }
        console.log('[Ban Checker] On the correct page');

        const playerNameInput = document.querySelector('#playerNameInput');
        console.log('[Ban Checker] Looking for #playerNameInput, found:', playerNameInput);
        if (!playerNameInput) {
            console.log('[Ban Checker] #playerNameInput not found, will wait or retry');
            return; // Элемент еще не загрузился
        }

        // Проверяем, не создана ли кнопка уже
        if (document.getElementById('ban-check-container-v41')) {
            console.log('[Ban Checker] Button already exists, exiting');
            return;
        }
        console.log('[Ban Checker] Button does not exist, proceeding to create');

        // Добавляем стили один раз
        if (!document.getElementById('ban-check-styles-v41')) {
            console.log('[Ban Checker] Adding styles');
            addStyle(styles);
            const styleMarker = document.createElement('style');
            styleMarker.id = 'ban-check-styles-v41';
            styleMarker.textContent = '/* Ban Checker Styles Loaded */';
            (document.head || document.getElementsByTagName('head')[0]).appendChild(styleMarker);
        } else {
             console.log('[Ban Checker] Styles already added');
        }

        const container = document.createElement('div');
        container.id = 'ban-check-container-v41';
        console.log('[Ban Checker] Created container');

        const button = document.createElement('button');
        button.id = 'ban-check-btn-v41';
        button.textContent = '🚫';
        button.type = 'button';
        // Пробуем применить стили Bootstrap, если они есть
        button.className = 'btn btn-danger';
        console.log('[Ban Checker] Created button');

        const resultBox = document.createElement('div');
        resultBox.id = 'ban-check-result-v41';
        resultBox.textContent = 'Введите имя игрока и нажмите кнопку.';
        console.log('[Ban Checker] Created result box');

        container.appendChild(button);
        container.appendChild(resultBox);
        console.log('[Ban Checker] Appended button and result box to container');

        // --- КРИТИЧЕСКИ ВАЖНО: Правильная вставка ---
        console.log('[Ban Checker] Attempting to insert container after playerNameInput');
        console.log('[Ban Checker] Parent node of playerNameInput:', playerNameInput.parentNode);
        console.log('[Ban Checker] Next sibling of playerNameInput:', playerNameInput.nextSibling);
        
        // Вставляем контейнер ПОСЛЕ поля ввода имени игрока
        if (playerNameInput.nextSibling) {
            playerNameInput.parentNode.insertBefore(container, playerNameInput.nextSibling);
            console.log('[Ban Checker] Inserted container after playerNameInput (before next sibling)');
        } else {
            playerNameInput.parentNode.appendChild(container);
            console.log('[Ban Checker] Appended container to the end of parent node');
        }
        // --- КОНЕЦ ВСТАВКИ ---

        button.addEventListener('click', handleInfoButtonClick);
        console.log('[Ban Checker] Added click event listener to button');
        console.log('[Ban Checker] UI creation completed successfully');
    }

    // --- Инициализация (как в br-trade-viewer.js) ---
    console.log('[Ban Checker] Script initialized');
    
    // Пробуем создать UI сразу
    if (document.readyState === 'loading') {
        console.log('[Ban Checker] DOM not ready, adding DOMContentLoaded listener');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[Ban Checker] DOMContentLoaded event fired');
            createBanCheckerUI();
        });
    } else {
        console.log('[Ban Checker] DOM already ready, calling createBanCheckerUI');
        createBanCheckerUI();
    }

    // Наблюдаем за изменениями в DOM для динамически подгружаемых элементов
    console.log('[Ban Checker] Setting up MutationObserver');
    const observer = new MutationObserver(mutations => {
        // console.log('[Ban Checker] MutationObserver triggered'); // Слишком много логов
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                // Проверяем, появились ли нужные элементы
                if (document.querySelector('#playerNameInput') && !document.querySelector('#ban-check-container-v41')) {
                    console.log('[Ban Checker] MutationObserver detected #playerNameInput, scheduling UI creation');
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
    console.log('[Ban Checker] MutationObserver started');

    // Останавливаем наблюдение при выгрузке страницы
    window.addEventListener('beforeunload', () => {
        console.log('[Ban Checker] beforeunload event, disconnecting observer');
        observer.disconnect();
    });

    // Дополнительный интервал на случай, если что-то пошло не так
    console.log('[Ban Checker] Setting up fallback interval');
    const fallbackInterval = setInterval(() => {
        if (document.querySelector('#playerNameInput') && !document.querySelector('#ban-check-container-v41')) {
            console.log('[Ban Checker] Fallback interval detected #playerNameInput, calling createBanCheckerUI');
            createBanCheckerUI();
        }
    }, 2000); // Проверяем каждые 2 секунды

    // Останавливаем интервал через 30 секунд
    setTimeout(() => {
        console.log('[Ban Checker] Clearing fallback interval after 30s');
        clearInterval(fallbackInterval);
    }, 30000);

})();
