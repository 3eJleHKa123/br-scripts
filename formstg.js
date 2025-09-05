(function () {
    'use strict';

    // --- CONFIGURATION ---
    // ВСТАВЬТЕ СЮДА ТОКЕН ВАШЕГО TELEGRAM БОТА
    const BOT_TOKEN = '8220327317:AAFAMcxSwcjkINzVJXmBGexGy9JmAgd5s_M'; // <<--- ЗАМЕНИТЕ ЭТО НА РЕАЛЬНЫЙ ТОКЕН
    // --------------------

    // --- Constants ---
    const PREFIX = 'tglog';
    const STORAGE_KEYS = {
        LAST_CHAT_ID: `${PREFIX}_last_chat_id`,
        CONFIRMED_CHAT_IDS: `${PREFIX}_confirmed_chat_ids`
    };
    const CODE_LENGTH = 4;
    const CODE_LIFETIME_MINUTES = 10;

    // --- Styles ---
    const styles = `
        .${PREFIX}-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px 12px;
            margin-right: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #fff;
            background-color: #6a5acd;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
            flex-shrink: 0; /* Предотвращает сжатие кнопок */
        }
        .${PREFIX}-btn:hover {
            background-color: #5a4ab8;
        }
        .${PREFIX}-btn-select-all {
            background-color: #28a745;
        }
        .${PREFIX}-btn-select-all:hover {
            background-color: #218838;
        }
        .${PREFIX}-btn-deselect-all {
            background-color: #dc3545;
        }
        .${PREFIX}-btn-deselect-all:hover {
            background-color: #c82333;
        }
        .${PREFIX}-btn-telegram {
            background-color: #0088cc;
        }
        .${PREFIX}-btn-telegram:hover {
            background-color: #0077b3;
        }
        
        .${PREFIX}-icon {
            width: 16px;
            height: 16px;
            fill: currentColor;
            margin-right: 4px;
        }
        
        .${PREFIX}-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .${PREFIX}-modal {
            background: #1a1a1a;
            color: #fff;
            border-radius: 12px;
            padding: 20px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 30px rgba(0,0,0,.5);
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }
        
        .${PREFIX}-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        
        .${PREFIX}-modal-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }
        
        .${PREFIX}-close-btn {
            background: #ff4757;
            border: 0;
            color: #fff;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            font-weight: 900;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }
        
        .${PREFIX}-form-group {
            margin-bottom: 15px;
        }
        
        .${PREFIX}-form-label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .${PREFIX}-form-input {
            width: 100%;
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid #333;
            background-color: #2d2d2d;
            color: #fff;
            box-sizing: border-box;
        }
        
        .${PREFIX}-textarea {
            min-height: 80px;
            resize: vertical;
        }
        
        .${PREFIX}-submit-btn {
            background: linear-gradient(145deg, #2b8cff, #1f6cd9);
            color: #fff;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            margin-top: 10px;
        }
        
        .${PREFIX}-submit-btn:hover {
            filter: brightness(1.05);
        }
        
        .${PREFIX}-submit-btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
        }
        
        /* Стили для переключателя (toggle switch) */
        .${PREFIX}-toggle {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
            margin: 0 5px;
        }
        
        .${PREFIX}-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .${PREFIX}-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #4a4a5a;
            transition: .3s;
            border-radius: 20px;
        }
        
        .${PREFIX}-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
        }
        
        .${PREFIX}-toggle input:checked + .${PREFIX}-slider {
            background-color: #4CAF50;
        }
        
        .${PREFIX}-toggle input:checked + .${PREFIX}-slider:before {
            transform: translateX(20px);
        }
        
        /* Стили для фиксированной панели кнопок */
        .${PREFIX}-fixed-buttons {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #2a2a3a;
            padding: 10px;
            border-bottom: 1px solid #444;
            z-index: 9999; /* Высокий z-index для отображения поверх других элементов */
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        /* Стили для ячейки с индексом, когда в ней есть переключатель */
        .td-index.${PREFIX}-with-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px; /* Отступ между индексом и переключателем */
        }
        
        /* Отступ для основного контента, чтобы он не перекрывался фиксированной панелью */
        .${PREFIX}-content-offset {
            padding-top: 50px; /* Примерная высота панели кнопок */
        }
        
        /* Стили для состояния загрузки */
        .${PREFIX}-loading {
            opacity: 0.7;
            pointer-events: none;
        }
        .${PREFIX}-spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: ${PREFIX}-spin 1s linear infinite;
            display: inline-block;
            margin-right: 8px;
        }
        @keyframes ${PREFIX}-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Стили для инструкции */
        .${PREFIX}-instructions {
            font-size: 12px;
            margin-top: 5px;
        }
        .${PREFIX}-instructions a {
            color: #4da6ff;
        }
        .${PREFIX}-instructions code {
            background: #333;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        /* Стили для кода подтверждения */
        .${PREFIX}-code-input {
            width: 100%;
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid #333;
            background-color: #2d2d2d;
            color: #fff;
            box-sizing: border-box;
            font-family: monospace;
            font-size: 16px;
            letter-spacing: 2px;
            text-align: center;
        }
        
        .${PREFIX}-resend-code {
            margin-top: 10px;
            text-align: center;
        }
        
        .${PREFIX}-resend-code button {
            background: none;
            border: none;
            color: #4da6ff;
            cursor: pointer;
            text-decoration: underline;
            font-size: 12px;
        }
        
        .${PREFIX}-resend-code button:disabled {
            color: #6c757d;
            cursor: not-allowed;
            text-decoration: none;
        }
        
        .${PREFIX}-timer {
            font-size: 12px;
            color: #aaa;
            margin-top: 5px;
        }
        
        /* Стили для кнопки изменения ID */
        .${PREFIX}-change-id-btn {
            background: none;
            border: none;
            color: #4da6ff;
            cursor: pointer;
            text-decoration: underline;
            font-size: 12px;
            margin-top: 5px;
            padding: 2px 4px;
            display: inline-block;
        }
        .${PREFIX}-change-id-btn:hover {
            color: #2a80ff;
        }
    `;
    
    // --- Иконки ---
    const telegramIcon = '<svg class="' + PREFIX + '-icon" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.141-.259.259-.374.261l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/></svg>';
    const planeIcon = '<svg class="' + PREFIX + '-icon" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>';
    const editIcon = '<svg class="' + PREFIX + '-icon" style="width:12px;height:12px;margin-right:2px;" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 4.5 9.207 3.793 9.5 4.5 10.207 11.207 3.5z"/><path d="M13.5 3.5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1 0-1h9a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"/></svg>';

    // --- Global variables ---
    let observer; // For MutationObserver
    let isRecreatingToggles = false; // Flag to prevent recursion
    let confirmationCode = null; // Generated confirmation code
    let codeSentTimestamp = null; // Time when code was sent

    // --- Helper functions ---
    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    function waitForElement(selector, timeout = 20000) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                console.warn(`Элемент ${selector} не найден в течение ${timeout}мс`);
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // Enhanced waiting for logs content
    async function waitForLogsContent() {
        console.log('Начало усиленного ожидания содержимого логов...');
        // Wait for the log table
        const logTable = await waitForElement('#log-table', 20000); // Increased timeout to 20s
        console.log('Таблица #log-table найдена');

        // Additionally wait for tbody and at least one row
        await waitForElement('#log-table tbody', 10000);
        console.log('tbody найден');
        // Wait a bit longer for the first row, in case of slow rendering
        await waitForElement('#log-table tbody tr', 10000); 
        console.log('Первая строка tr найдена');

        // Additional small delay to ensure Vue "settles down"
        await new Promise(resolve => setTimeout(resolve, 200)); 
        console.log('Дополнительная задержка завершена');
        return logTable;
    }

    // New helper function for waiting for new logs
    function waitForNewLogs(tbody, timeout = 10000) {
        return new Promise((resolve, reject) => {
            let initialRowCount = tbody.querySelectorAll('tr').length;
            let isContentChanged = false;

            const intervalId = setInterval(() => {
                const currentRowCount = tbody.querySelectorAll('tr').length;
                // Check if the number of rows changed or a loading/no-logs indicator appeared
                const noLogsMsg = tbody.querySelector('.no-logs-message'); // If such exists
                const firstRow = tbody.querySelector('.first-row');
                
                if (currentRowCount !== initialRowCount || noLogsMsg || firstRow) {
                    isContentChanged = true;
                }
                
                if (isContentChanged) {
                    clearInterval(intervalId);
                    // Small additional delay to ensure Vue finishes rendering
                    setTimeout(resolve, 150);
                }
            }, 200); // Check every 200 ms

            // Timeout
            setTimeout(() => {
                clearInterval(intervalId);
                if (!isContentChanged) {
                    console.warn('Таймаут ожидания новых логов в tbody');
                    reject(new Error('Timeout waiting for new logs'));
                } else {
                    resolve(); // In case timeout triggered but content already changed
                }
            }, timeout);
        });
    }

    // Function for escaping special MarkdownV2 characters
    function escapeMarkdownV2(text) {
        // Escape all special MarkdownV2 characters except ` (backtick)
        return text.replace(/([_*\[\]()~>#+\-=|{}.!])/g, '\\$1');
    }
    
    // Function for generating random code
    function generateConfirmationCode(length) {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    
    // Function for checking if code expired
    function isCodeExpired(timestamp) {
        if (!timestamp) return true;
        const now = new Date().getTime();
        const sentTime = new Date(timestamp).getTime();
        const diffMinutes = (now - sentTime) / (1000 * 60);
        return diffMinutes > CODE_LIFETIME_MINUTES;
    }
    
    // Function for saving confirmed chat_id
    function saveConfirmedChatId(chatId) {
        try {
            const confirmedStr = GM_getValue ? GM_getValue(STORAGE_KEYS.CONFIRMED_CHAT_IDS, '{}') : localStorage.getItem(STORAGE_KEYS.CONFIRMED_CHAT_IDS) || '{}';
            const confirmed = JSON.parse(confirmedStr);
            confirmed[chatId] = new Date().toISOString();
            const confirmedJson = JSON.stringify(confirmed);
            if (GM_setValue) {
                GM_setValue(STORAGE_KEYS.CONFIRMED_CHAT_IDS, confirmedJson);
            } else {
                localStorage.setItem(STORAGE_KEYS.CONFIRMED_CHAT_IDS, confirmedJson);
            }
        } catch (e) {
            console.warn('Ошибка при сохранении подтвержденного chat_id:', e);
        }
    }
    
    // Function for checking if chat_id recently confirmed
    function isChatIdRecentlyConfirmed(chatId) {
        try {
            const confirmedStr = GM_getValue ? GM_getValue(STORAGE_KEYS.CONFIRMED_CHAT_IDS, '{}') : localStorage.getItem(STORAGE_KEYS.CONFIRMED_CHAT_IDS) || '{}';
            const confirmed = JSON.parse(confirmedStr);
            const timestamp = confirmed[chatId];
            if (!timestamp) return false;
            
            // Check if time hasn't expired (e.g., within last 24 hours)
            const now = new Date().getTime();
            const sentTime = new Date(timestamp).getTime();
            const diffHours = (now - sentTime) / (1000 * 60 * 60);
            return diffHours <= 24; // Confirmation is valid for 24 hours
        } catch (e) {
            console.warn('Ошибка при проверке подтвержденного chat_id:', e);
            return false;
        }
    }
    
    // New function for getting username from navbar
    function getUserNameFromNavbar() {
        try {
            const navbarLink = document.querySelector('#site-navbar .nav-link[href="/accounts/logout"]');
            if (navbarLink) {
                const text = navbarLink.textContent.trim();
                // Extract username from text "[Username]"
                const match = text.match(/\[(.*?)\]/);
                if (match && match[1]) {
                    return match[1];
                }
            }
        } catch (e) {
            console.warn('Ошибка при получении имени пользователя из навбара:', e);
        }
        return 'Неизвестный пользователь';
    }

    // --- Main logic ---
    async function init() {
        try {
            console.log('Инициализация BR Logs to Telegram скрипта...');
            addStyles();
            
            // Wait for the table and its content
            console.log('Ожидание таблицы логов и содержимого...');
            const logTable = await waitForLogsContent(); // Use enhanced waiting

            console.log('Таблица логов найдена:', logTable);

            // Add UI
            addUIControls(logTable);

            // Add toggles to rows
            addTogglesToRows(logTable);

            // Add MutationObserver for tracking changes
            observeLogChanges(logTable);
            
            // Add handlers for pagination buttons
            observePaginationButtons(logTable);

            console.log('BR Logs to Telegram скрипт инициализирован успешно');
        } catch (error) {
            console.error('Ошибка инициализации скрипта:', error);
            // Can try re-running after some time
            // setTimeout(init, 3000); 
        }
    }

    function addUIControls(tableElement) {
        console.log('Добавление UI элементов...');
        
        // Find the parent section with logs
        const logsSection = document.getElementById('logs-section');
        if (!logsSection) {
            console.warn('Элемент #logs-section не найден');
            return;
        }

        // Check if panel already added
        if (document.getElementById(`${PREFIX}-fixed-buttons-container`)) {
            console.log('Панель с кнопками уже существует');
            return;
        }

        // Create container for fixed buttons
        const fixedButtonsContainer = document.createElement('div');
        fixedButtonsContainer.className = `${PREFIX}-fixed-buttons`;
        fixedButtonsContainer.id = `${PREFIX}-fixed-buttons-container`;

        // "Select All" button
        const selectAllBtn = document.createElement('button');
        selectAllBtn.type = 'button';
        selectAllBtn.className = `${PREFIX}-btn ${PREFIX}-btn-select-all`;
        selectAllBtn.innerHTML = 'Выбрать все';
        selectAllBtn.addEventListener('click', () => toggleAllToggles(true));

        // "Deselect All" button
        const deselectAllBtn = document.createElement('button');
        deselectAllBtn.type = 'button';
        deselectAllBtn.className = `${PREFIX}-btn ${PREFIX}-btn-deselect-all`;
        deselectAllBtn.innerHTML = 'Снять выделение';
        deselectAllBtn.addEventListener('click', () => toggleAllToggles(false));

        // "Send to Telegram" button
        const sendToTelegramBtn = document.createElement('button');
        sendToTelegramBtn.type = 'button';
        sendToTelegramBtn.className = `${PREFIX}-btn ${PREFIX}-btn-telegram`;
        sendToTelegramBtn.innerHTML = `${telegramIcon} Отправить`;
        sendToTelegramBtn.addEventListener('click', openTelegramModal);

        // Add buttons to container
        fixedButtonsContainer.appendChild(selectAllBtn);
        fixedButtonsContainer.appendChild(deselectAllBtn);
        fixedButtonsContainer.appendChild(sendToTelegramBtn);

        // Add fixed panel to body, so it's outside the scroll context of #logs-section
        document.body.appendChild(fixedButtonsContainer);
        
        // Add offset to main content to prevent overlap with fixed panel
        if (!logsSection.classList.contains(`${PREFIX}-content-offset`)) {
            logsSection.classList.add(`${PREFIX}-content-offset`);
        }
        
        console.log('UI элементы добавлены');
    }

    function addTogglesToRows(tableElement) {
        console.log('Добавление переключателей к строкам...');
        const tbody = tableElement.querySelector('tbody');
        if (!tbody) {
            console.warn('tbody не найден в таблице логов');
            return;
        }

        // Find all table rows
        const allRows = Array.from(tbody.querySelectorAll('tr'));
        
        // Group rows by logs
        let currentGroup = [];
        const logGroups = [];
        
        // Start with the first row, if it's not tr-spacer
        if (allRows.length > 0 && !allRows[0].classList.contains('tr-spacer')) {
            currentGroup.push(allRows[0]);
        }

        allRows.forEach((row, index) => {
            // Skip the first row if it's already added
            if (index === 0 && currentGroup.length > 0) return;
            
            // Assume tr-spacer is a separator row
            if (row.classList.contains('tr-spacer')) {
                if (currentGroup.length > 0) {
                    logGroups.push([...currentGroup]);
                }
                currentGroup = [row];
            } else {
                currentGroup.push(row);
            }
        });
        
        // Don't forget the last group
        if (currentGroup.length > 0) {
            logGroups.push(currentGroup);
        }

        console.log(`Найдено ${logGroups.length} групп логов`);

        // Add toggles for each group
        logGroups.forEach((group, index) => {
            // Find the first row of the group (first-row)
            const firstRow = group.find(row => row.classList.contains('first-row'));
            
            if (firstRow) {
                // Find the index cell (td-index)
                const indexCell = firstRow.querySelector('.td-index');
                if (indexCell) {
                    // Check if toggle already added
                    if (indexCell.classList.contains(`${PREFIX}-with-toggle`)) {
                        // console.log(`Переключатель уже добавлен для группы ${index}`);
                        return; // Skip this group
                    }

                    // Create toggle
                    const toggleContainer = document.createElement('label');
                    toggleContainer.className = `${PREFIX}-toggle`;
                    
                    const toggleInput = document.createElement('input');
                    toggleInput.type = 'checkbox';
                    toggleInput.className = `${PREFIX}-checkbox`;
                    toggleInput.id = `${PREFIX}-log-toggle-${index}`;
                    toggleInput.dataset.groupIndex = index;
                    toggleInput.addEventListener('change', handleGroupSelection);
                    
                    const toggleSlider = document.createElement('span');
                    toggleSlider.className = `${PREFIX}-slider`;
                    
                    toggleContainer.appendChild(toggleInput);
                    toggleContainer.appendChild(toggleSlider);

                    // More gentle insertion method
                    const originalText = indexCell.textContent.trim();
                    // Clear content
                    indexCell.innerHTML = '';

                    // Create span for number
                    const indexSpan = document.createElement('span');
                    indexSpan.textContent = originalText;
                    
                    // Add class for styling
                    indexCell.classList.add(`${PREFIX}-with-toggle`);
                    // Add elements
                    indexCell.appendChild(indexSpan);
                    indexCell.appendChild(toggleContainer);
                    
                    // Add reference to toggle in each row of the group for convenience
                    group.forEach(row => {
                        row.dataset.groupToggleId = toggleInput.id;
                    });
                } else {
                    console.warn('Ячейка .td-index не найдена в first-row группы', index);
                }
            } else {
                console.warn('first-row не найдена для группы', index);
            }
        });
        
        console.log('Переключатели добавлены');
    }

    // Function for tracking changes in tbody
    function observeLogChanges(logTable) {
        if (observer) {
            observer.disconnect(); // Disconnect previous observer, if any
        }

        const tbody = logTable.querySelector('tbody');
        if (!tbody) return;

        observer = new MutationObserver(function(mutationsList) {
            // If we are recreating toggles ourselves, ignore mutations
            if (isRecreatingToggles) {
                // console.log("Игнорируем мутации, так как идет пересоздание переключателей");
                return;
            }

            let shouldReprocess = false;
            for(let mutation of mutationsList) {
                // Check if nodes were added/removed in tbody or its descendants
                if (mutation.type === 'childList') {
                     // Simple and effective check: any changes in tbody with a large number of nodes
                     if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                         shouldReprocess = true;
                         break;
                     }
                }
            }
            if (shouldReprocess) {
                console.log("Обнаружены изменения в tbody, планируем пересоздание переключателей...");
                // Use debounce to avoid recreating too frequently
                if (window.tglogReprocessTimeoutId) {
                    clearTimeout(window.tglogReprocessTimeoutId);
                }
                window.tglogReprocessTimeoutId = setTimeout(() => {
                    console.log("Пересоздаем переключатели после изменений...");
                    cleanupAndRecreateToggles(logTable, tbody);
                }, 300); // Increased delay to 300ms for debounce
            }
        });

        // Start observing changes in tbody and its descendants
        observer.observe(tbody, { childList: true, subtree: true });
        console.log("MutationObserver запущен для tbody");
    }

    // New function for observing pagination buttons
    function observePaginationButtons(logTable) {
        const nextBtn = document.getElementById('next-page-btn');
        const prevBtn = document.getElementById('prev-page-btn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                console.log("Клик по кнопке 'Вперед'");
                handlePaginationClick(logTable);
            });
        } else {
            console.warn("Кнопка 'Вперед' (#next-page-btn) не найдена");
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                console.log("Клик по кнопке 'Назад'");
                handlePaginationClick(logTable);
            });
        } else {
            console.warn("Кнопка 'Назад' (#prev-page-btn) не найдена");
        }
        
        if (!nextBtn && !prevBtn) {
            console.warn("Кнопки пагинации не найдены, отслеживание пагинации отключено");
        }
    }

    // New function for handling pagination button click
    async function handlePaginationClick(logTable) {
        const tbody = logTable.querySelector('tbody');
        if (!tbody) {
            console.error("tbody не найден при обработке пагинации");
            return;
        }

        try {
            // Wait for new logs to load and display
            await waitForNewLogs(tbody);
            console.log("Новые логи загружены, пересоздаем переключатели...");
            // Recreate toggles
            cleanupAndRecreateToggles(logTable, tbody);
        } catch (error) {
            console.error("Ошибка при ожидании новых логов:", error);
            // Even if timeout, try to recreate
            cleanupAndRecreateToggles(logTable, tbody);
        }
    }

    // New function for cleaning up and recreating toggles
    function cleanupAndRecreateToggles(logTable, tbody) {
        // Set flag so MutationObserver ignores changes
        isRecreatingToggles = true;
        
        // Clear previous timeout if it hasn't fired yet
        if (window.tglogReprocessTimeoutId) {
            clearTimeout(window.tglogReprocessTimeoutId);
            window.tglogReprocessTimeoutId = null;
        }

        try {
            // Remove old toggles
            const oldToggles = document.querySelectorAll(`.${PREFIX}-toggle`);
            oldToggles.forEach(t => {
                // Make sure we only remove our elements
                if (t.closest && t.closest('#log-table')) {
                    t.remove();
                }
            });
            
            // Remove classes and dataset from old elements
            const oldCells = tbody.querySelectorAll('.td-index.tglog-with-toggle');
            oldCells.forEach(c => c.classList.remove('tglog-with-toggle'));
            
            const allRows = tbody.querySelectorAll('tr');
            allRows.forEach(r => {
                if (r.dataset && r.dataset.groupToggleId) {
                    delete r.dataset.groupToggleId;
                }
            });

            // Recreate toggles
            addTogglesToRows(logTable);
            console.log("Переключатели успешно пересозданы");
        } catch (error) {
            console.error("Ошибка при пересоздании переключателей:", error);
        } finally {
            // Reset flag after a short delay, 
            // to give time to finish all DOM operations
            setTimeout(() => {
                isRecreatingToggles = false;
            }, 50);
        }
    }

    function handleGroupSelection(event) {
        const toggle = event.target;
        const groupIndex = toggle.dataset.groupIndex;
        
        // Find all rows associated with this toggle
        const allRows = Array.from(document.querySelectorAll(`tr[data-group-toggle-id="${toggle.id}"]`));
        
        // Remove/add selection class (but in CSS it's commented out, so visually no change)
        allRows.forEach(row => {
            if (toggle.checked) {
                row.classList.add(`${PREFIX}-selected-row`);
            } else {
                row.classList.remove(`${PREFIX}-selected-row`);
            }
        });
    }

    function toggleAllToggles(select) {
        const toggles = document.querySelectorAll(`.${PREFIX}-checkbox`);
        toggles.forEach(toggle => {
            if (toggle.checked !== select) {
                toggle.checked = select;
                // Create artificial change event to trigger handler
                toggle.dispatchEvent(new Event('change'));
            }
        });
    }

    function getSelectedGroups() {
        const selectedToggles = document.querySelectorAll(`.${PREFIX}-checkbox:checked`);
        return Array.from(selectedToggles).map(toggle => parseInt(toggle.dataset.groupIndex));
    }

    // New function for getting unique nicknames from selected groups
    function getUniquePlayerNamesFromSelectedGroups(selectedGroupIndexes) {
        const uniqueNames = new Set();
        
        selectedGroupIndexes.forEach(groupIndex => {
            // Find the group toggle
            const toggle = document.querySelector(`.${PREFIX}-checkbox[data-group-index="${groupIndex}"]`);
            if (!toggle) return;
            
            // Find all rows associated with this toggle
            const groupRows = document.querySelectorAll(`tr[data-group-toggle-id="${toggle.id}"]`);
            
            // Look for first-row and td-player-name in it
            const firstRow = Array.from(groupRows).find(row => row.classList.contains('first-row'));
            if (firstRow) {
                const playerNameCell = firstRow.querySelector('.td-player-name');
                if (playerNameCell) {
                    // Get text from cell (might be a link <a>)
                    const nameElement = playerNameCell.querySelector('a');
                    const playerName = nameElement ? nameElement.textContent.trim() : playerNameCell.textContent.trim();
                    if (playerName) {
                        uniqueNames.add(playerName);
                    }
                }
            }
        });
        
        return Array.from(uniqueNames);
    }

    function openTelegramModal() {
        const selectedGroups = getSelectedGroups();
        if (selectedGroups.length === 0) {
            alert('Пожалуйста, выберите хотя бы одну запись лога.');
            return;
        }

        // Get unique nicknames from selected logs
        const uniquePlayerNames = getUniquePlayerNamesFromSelectedGroups(selectedGroups);
        // Form string with nicknames for comment in monospace format
        const playerNamesComment = uniquePlayerNames.length > 0 ? 
            `Логи игрока(ов): ${uniquePlayerNames.map(name => `\`${name}\``).join(', ')}` : '';

        createTelegramModal(playerNamesComment); // Always show form with chat_id field
    }

    function createTelegramModal(initialComment = '') {
        // If modal already open, close it
        const existingOverlay = document.querySelector(`.${PREFIX}-modal-overlay`);
        if (existingOverlay) {
            document.body.removeChild(existingOverlay);
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = `${PREFIX}-modal-overlay`;

        // Create modal window
        const modal = document.createElement('div');
        modal.className = `${PREFIX}-modal`;

        // Modal header
        const header = document.createElement('div');
        header.className = `${PREFIX}-modal-header`;
        
        const title = document.createElement('h2');
        title.className = `${PREFIX}-modal-title`;
        title.textContent = 'Отправить в Telegram';
        
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = `${PREFIX}-close-btn`;
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => document.body.removeChild(overlay));

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Form
        const form = document.createElement('form');
        form.addEventListener('submit', handleTelegramSubmit);

        // Check if there's a saved chat_id
        const savedChatId = GM_getValue ? GM_getValue(STORAGE_KEYS.LAST_CHAT_ID, null) : localStorage.getItem(STORAGE_KEYS.LAST_CHAT_ID);
        
        if (savedChatId) {
            // If there is, show it and "Change" button
            const chatIdDisplayGroup = document.createElement('div');
            chatIdDisplayGroup.className = `${PREFIX}-form-group`;
            
            const chatIdLabel = document.createElement('label');
            chatIdLabel.className = `${PREFIX}-form-label`;
            chatIdLabel.textContent = 'Сохраненный Telegram Chat ID:';
            
            const chatIdDisplay = document.createElement('div');
            chatIdDisplay.textContent = savedChatId;
            chatIdDisplay.style.padding = '8px 12px';
            chatIdDisplay.style.backgroundColor = '#2d2d2d';
            chatIdDisplay.style.borderRadius = '4px';
            chatIdDisplay.style.border = '1px solid #333';
            chatIdDisplay.style.color = '#fff';
            chatIdDisplay.style.wordBreak = 'break-all';
            
            const changeBtn = document.createElement('button');
            changeBtn.type = 'button';
            changeBtn.className = `${PREFIX}-change-id-btn`;
            changeBtn.innerHTML = `${editIcon} Изменить`;
            changeBtn.addEventListener('click', () => {
                // Remove saved ID display and show input field
                document.body.removeChild(overlay);
                createTelegramModalWithInput(initialComment); // Create modal with input field
            });
            
            chatIdDisplayGroup.appendChild(chatIdLabel);
            chatIdDisplayGroup.appendChild(chatIdDisplay);
            chatIdDisplayGroup.appendChild(changeBtn);
            form.appendChild(chatIdDisplayGroup);
            
            // User info
            const userInfo = document.createElement('div');
            userInfo.className = `${PREFIX}-form-group`;
            const userName = getUserNameFromNavbar();
            userInfo.innerHTML = `<small>Запрос отправляется от: <strong>${userName}</strong></small>`;
            form.appendChild(userInfo);
            
        } else {
            // If not, show input field
            createTelegramModalWithInput(initialComment, form); // Pass form to fill
            // In this case, the function itself adds the form to the modal
            modal.appendChild(header);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            return; // Exit, as form is already added
        }

        // Comment field (always show)
        const commentGroup = document.createElement('div');
        commentGroup.className = `${PREFIX}-form-group`;
        
        const commentLabel = document.createElement('label');
        commentLabel.className = `${PREFIX}-form-label`;
        commentLabel.textContent = 'Комментарий (опционально)';
        commentLabel.htmlFor = `${PREFIX}-comment`;
        
        const commentInput = document.createElement('textarea');
        commentInput.id = `${PREFIX}-comment`;
        commentInput.className = `${PREFIX}-form-input ${PREFIX}-textarea`;
        commentInput.placeholder = 'Введите комментарий к скриншоту...';
        if (initialComment) {
            commentInput.value = initialComment;
        }
        
        commentGroup.appendChild(commentLabel);
        commentGroup.appendChild(commentInput);
        form.appendChild(commentGroup);

        // Submit button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = `${PREFIX}-submit-btn`;
        submitBtn.innerHTML = `${planeIcon} Отправить в Telegram`;
        submitBtn.disabled = false;

        form.appendChild(submitBtn);
        modal.appendChild(header);
        modal.appendChild(form);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }
    
    // New function for creating modal window with chat_id input field
    function createTelegramModalWithInput(initialComment = '', formToUse = null) {
        let form, modal, overlay;
        
        if (formToUse) {
            // Use passed form
            form = formToUse;
            const parentModal = form.closest(`.${PREFIX}-modal`);
            if (parentModal) {
                modal = parentModal;
                overlay = parentModal.parentElement;
            } else {
                // If form not in modal, create new structure
                overlay = document.createElement('div');
                overlay.className = `${PREFIX}-modal-overlay`;
                modal = document.createElement('div');
                modal.className = `${PREFIX}-modal`;
                const header = document.createElement('div');
                header.className = `${PREFIX}-modal-header`;
                const title = document.createElement('h2');
                title.className = `${PREFIX}-modal-title`;
                title.textContent = 'Отправить в Telegram';
                const closeBtn = document.createElement('button');
                closeBtn.type = 'button';
                closeBtn.className = `${PREFIX}-close-btn`;
                closeBtn.innerHTML = '&times;';
                closeBtn.addEventListener('click', () => document.body.removeChild(overlay));
                header.appendChild(title);
                header.appendChild(closeBtn);
                modal.appendChild(header);
                modal.appendChild(form);
                overlay.appendChild(modal);
                document.body.appendChild(overlay);
            }
        } else {
            // Create new form and modal
            const existingOverlay = document.querySelector(`.${PREFIX}-modal-overlay`);
            if (existingOverlay) {
                document.body.removeChild(existingOverlay);
            }
            
            overlay = document.createElement('div');
            overlay.className = `${PREFIX}-modal-overlay`;

            modal = document.createElement('div');
            modal.className = `${PREFIX}-modal`;

            const header = document.createElement('div');
            header.className = `${PREFIX}-modal-header`;
            
            const title = document.createElement('h2');
            title.className = `${PREFIX}-modal-title`;
            title.textContent = 'Отправить в Telegram';
            
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = `${PREFIX}-close-btn`;
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => document.body.removeChild(overlay));

            header.appendChild(title);
            header.appendChild(closeBtn);

            form = document.createElement('form');
            form.addEventListener('submit', handleTelegramSubmit);
            
            modal.appendChild(header);
            modal.appendChild(form);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
        }

        // Chat ID field
        const chatIdGroup = document.createElement('div');
        chatIdGroup.className = `${PREFIX}-form-group`;
        
        const chatIdLabel = document.createElement('label');
        chatIdLabel.className = `${PREFIX}-form-label`;
        chatIdLabel.textContent = 'Ваш Telegram Chat ID';
        chatIdLabel.htmlFor = `${PREFIX}-chat-id`;
        
        const chatIdInput = document.createElement('input');
        chatIdInput.type = 'text';
        chatIdInput.id = `${PREFIX}-chat-id`;
        chatIdInput.className = `${PREFIX}-form-input`;
        chatIdInput.placeholder = 'Введите ваш Telegram Chat ID (например: 123456789)';
        chatIdInput.required = true;
        
        // Try to fill from localStorage
        const savedChatId = GM_getValue ? GM_getValue(STORAGE_KEYS.LAST_CHAT_ID, null) : localStorage.getItem(STORAGE_KEYS.LAST_CHAT_ID);
        if (savedChatId) {
            chatIdInput.value = savedChatId;
        }
        
        chatIdGroup.appendChild(chatIdLabel);
        chatIdGroup.appendChild(chatIdInput);
        form.appendChild(chatIdGroup);

        // Instructions
        const instructions = document.createElement('div');
        instructions.className = `${PREFIX}-form-group ${PREFIX}-instructions`;
        instructions.innerHTML = `
            <p><strong>Как узнать свой Chat ID:</strong></p>
            <ol style="margin-left: 20px;">
                <li>Напишите боту <a href="https://t.me/userinfobot" target="_blank">@userinfobot</a> любое сообщение.</li>
                <li>Бот пришлет вам ваш Chat ID в формате <code>Id: 123456789</code>.</li>
                <li>Скопируйте только числовую часть (например, <code>123456789</code>) и вставьте в поле выше.</li>
            </ol>
        `;
        form.appendChild(instructions);
        
        // User info
        const userInfo = document.createElement('div');
        userInfo.className = `${PREFIX}-form-group`;
        const userName = getUserNameFromNavbar();
        userInfo.innerHTML = `<small>Запрос отправляется от: <strong>${userName}</strong></small>`;
        form.appendChild(userInfo);

        // Comment field
        const commentGroup = document.createElement('div');
        commentGroup.className = `${PREFIX}-form-group`;
        
        const commentLabel = document.createElement('label');
        commentLabel.className = `${PREFIX}-form-label`;
        commentLabel.textContent = 'Комментарий (опционально)';
        commentLabel.htmlFor = `${PREFIX}-comment`;
        
        const commentInput = document.createElement('textarea');
        commentInput.id = `${PREFIX}-comment`;
        commentInput.className = `${PREFIX}-form-input ${PREFIX}-textarea`;
        commentInput.placeholder = 'Введите комментарий к скриншоту...';
        if (initialComment) {
            commentInput.value = initialComment;
        }
        
        commentGroup.appendChild(commentLabel);
        commentGroup.appendChild(commentInput);
        form.appendChild(commentGroup);

        // Submit button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = `${PREFIX}-submit-btn`;
        submitBtn.innerHTML = `${planeIcon} Отправить в Telegram`;
        submitBtn.disabled = false;

        form.appendChild(submitBtn);
        
        // If we created a new modal, not used existing form
        if (!formToUse) {
            modal.appendChild(form);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
        }
    }
    
    // New function for creating code confirmation modal
    function createCodeConfirmationModal(chatId, onConfirm, onCancel) {
        const existingOverlay = document.querySelector(`.${PREFIX}-modal-overlay`);
        if (existingOverlay) {
            document.body.removeChild(existingOverlay);
        }

        const overlay = document.createElement('div');
        overlay.className = `${PREFIX}-modal-overlay`;

        const modal = document.createElement('div');
        modal.className = `${PREFIX}-modal`;

        const header = document.createElement('div');
        header.className = `${PREFIX}-modal-header`;
        
        const title = document.createElement('h2');
        title.className = `${PREFIX}-modal-title`;
        title.textContent = 'Подтверждение Telegram';
        
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = `${PREFIX}-close-btn`;
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            if (onCancel) onCancel();
        });

        header.appendChild(title);
        header.appendChild(closeBtn);

        const form = document.createElement('form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const codeInput = form.querySelector(`#${PREFIX}-code-input`);
            const enteredCode = codeInput.value.trim();
            if (enteredCode === confirmationCode) {
                document.body.removeChild(overlay);
                if (onConfirm) onConfirm();
            } else {
                alert('Неверный код подтверждения. Пожалуйста, попробуйте еще раз.');
                codeInput.value = '';
                codeInput.focus();
            }
        });

        const userName = getUserNameFromNavbar();
        const infoText = document.createElement('p');
        infoText.innerHTML = `Мы отправили 4-значный код подтверждения в ваш Telegram (<code>${chatId}</code>).<br/>Запрос отправлен от пользователя: <strong>${userName}</strong>.<br/>Пожалуйста, введите его ниже:`;
        infoText.style.marginBottom = '15px';
        infoText.style.fontSize = '14px';

        const codeGroup = document.createElement('div');
        codeGroup.className = `${PREFIX}-form-group`;
        
        const codeInput = document.createElement('input');
        codeInput.type = 'text';
        codeInput.id = `${PREFIX}-code-input`;
        codeInput.className = `${PREFIX}-code-input`;
        codeInput.placeholder = 'XXXX';
        codeInput.maxLength = CODE_LENGTH;
        codeInput.pattern = `[0-9]{${CODE_LENGTH}}`;
        codeInput.required = true;
        codeInput.autocomplete = 'off';
        codeInput.inputMode = 'numeric';
        
        codeInput.addEventListener('input', function() {
            if (this.value.length >= CODE_LENGTH) {
                this.value = this.value.slice(0, CODE_LENGTH); // Trim to 4 characters
                // Can automatically press Enter or shift focus
                // this.form.dispatchEvent(new Event('submit'));
            }
        });
        
        codeInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });
        
        codeGroup.appendChild(codeInput);
        form.appendChild(infoText);
        form.appendChild(codeGroup);
        
        const timerElement = document.createElement('div');
        timerElement.className = `${PREFIX}-timer`;
        timerElement.id = `${PREFIX}-code-timer`;
        updateTimerDisplay(timerElement);
        form.appendChild(timerElement);
        
        const resendGroup = document.createElement('div');
        resendGroup.className = `${PREFIX}-resend-code`;
        
        const resendBtn = document.createElement('button');
        resendBtn.type = 'button';
        resendBtn.textContent = 'Отправить код еще раз';
        resendBtn.disabled = true; // Disabled by default, activated via timer
        
        resendBtn.addEventListener('click', async function() {
            if (this.disabled) return;
            this.disabled = true;
            this.textContent = 'Отправка...';
            
            try {
                await sendConfirmationCode(chatId);
                alert('Код подтверждения отправлен повторно!');
                // Reset timer
                codeSentTimestamp = new Date().toISOString();
                updateTimerDisplay(timerElement);
                startTimer(timerElement, resendBtn);
                codeInput.value = '';
                codeInput.focus();
            } catch (error) {
                console.error('Ошибка повторной отправки кода:', error);
                alert('Не удалось отправить код повторно. Попробуйте позже.');
                this.disabled = false;
                this.textContent = 'Отправить код еще раз';
            }
        });
        
        resendGroup.appendChild(resendBtn);
        form.appendChild(resendGroup);
        
        // Start timer
        startTimer(timerElement, resendBtn);

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'submit';
        confirmBtn.className = `${PREFIX}-submit-btn`;
        confirmBtn.textContent = 'Подтвердить';
        confirmBtn.style.marginTop = '15px';

        form.appendChild(confirmBtn);
        modal.appendChild(header);
        modal.appendChild(form);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Focus on code input field
        setTimeout(() => {
            codeInput.focus();
        }, 100);
    }
    
    // Function for updating timer display
    function updateTimerDisplay(timerElement) {
        if (!codeSentTimestamp) return;
        
        const now = new Date().getTime();
        const sentTime = new Date(codeSentTimestamp).getTime();
        const elapsedMinutes = (now - sentTime) / (1000 * 60);
        const remainingMinutes = Math.max(0, CODE_LIFETIME_MINUTES - elapsedMinutes);
        const remainingSeconds = Math.floor(remainingMinutes * 60);
        
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        
        if (remainingSeconds > 0) {
            timerElement.textContent = `Код действителен еще ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        } else {
            timerElement.textContent = 'Код истек. Пожалуйста, запросите новый.';
        }
    }
    
    // Function for starting timer
    function startTimer(timerElement, resendBtn) {
        // Update timer every second
        const timerInterval = setInterval(() => {
            updateTimerDisplay(timerElement);
            
            // Check if time expired
            if (codeSentTimestamp && isCodeExpired(codeSentTimestamp)) {
                clearInterval(timerInterval);
                resendBtn.disabled = false;
                resendBtn.textContent = 'Отправить код еще раз';
            }
        }, 1000);
        
        // Immediate update
        updateTimerDisplay(timerElement);
    }

    // New function for sending confirmation code via Telegram
    async function sendConfirmationCode(chatId) {
        confirmationCode = generateConfirmationCode(CODE_LENGTH);
        codeSentTimestamp = new Date().toISOString();
        
        // Get username from navbar
        const userName = getUserNameFromNavbar();
        
        const messageText = `🔐 *Код подтверждения для получения логов BlackRussia*\n\n👤 *Пользователь:* \`${userName}\`\n🔢 *Код:* \`${confirmationCode}\`\n\nЕсли это не вы, просто проигнорируйте это сообщение.\n\n_Код действителен ${CODE_LIFETIME_MINUTES} минут._`;
        
        // Use GM_xmlhttpRequest if available, otherwise fetch
        let response;
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        chat_id: chatId,
                        text: messageText,
                        parse_mode: 'MarkdownV2'
                    }),
                    onload: resolve,
                    onerror: reject
                });
            });
        } else {
            response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: messageText,
                    parse_mode: 'MarkdownV2'
                })
            });
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка отправки кода подтверждения:', errorData);
            throw new Error(`Не удалось отправить код подтверждения: ${errorData.description || 'Unknown error'}`);
        }
        
        return await response.json();
    }

    async function handleTelegramSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitBtn = form.querySelector(`.${PREFIX}-submit-btn`);
        const commentInput = form.querySelector(`#${PREFIX}-comment`);
        // Check if there's a chat_id input field in the form (new input) or we use saved one
        const chatIdInput = form.querySelector(`#${PREFIX}-chat-id`);
        
        let chatId;
        if (chatIdInput) {
            // This is new input
            chatId = chatIdInput.value.trim();
            if (!chatId) {
                alert('Пожалуйста, введите ваш Telegram Chat ID.');
                return;
            }
            if (!/^-?\d+$/.test(chatId)) {
                alert('Chat ID должен быть числовым значением.');
                return;
            }
            // Save new chat_id
            if (GM_setValue) {
                GM_setValue(STORAGE_KEYS.LAST_CHAT_ID, chatId);
            } else {
                localStorage.setItem(STORAGE_KEYS.LAST_CHAT_ID, chatId);
            }
        } else {
            // Use saved chat_id
            chatId = GM_getValue ? GM_getValue(STORAGE_KEYS.LAST_CHAT_ID, null) : localStorage.getItem(STORAGE_KEYS.LAST_CHAT_ID);
            if (!chatId) {
                // Just in case saved ID was deleted
                alert('Chat ID не найден. Пожалуйста, введите его снова.');
                document.body.removeChild(form.closest(`.${PREFIX}-modal-overlay`));
                createTelegramModalWithInput(); // Open form with input
                return;
            }
        }
        
        const comment = commentInput.value.trim();

        // Block button during sending
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="${PREFIX}-spinner"></span> Отправка...`;
        form.classList.add(`${PREFIX}-loading`);

        try {
            // Check if confirmation needed
            if (!isChatIdRecentlyConfirmed(chatId)) {
                console.log(`Chat ID ${chatId} требует подтверждения.`);
                
                await sendConfirmationCode(chatId);
                console.log(`Код подтверждения отправлен на ${chatId}: ${confirmationCode}`);
                
                return new Promise((resolve, reject) => {
                    createCodeConfirmationModal(chatId, async () => {
                        // Code confirmed
                        console.log('Код подтвержден успешно.');
                        saveConfirmedChatId(chatId); // Save as confirmed
                        
                        try {
                            await proceedWithSending(chatId, comment, form, submitBtn, originalBtnText);
                            resolve();
                        } catch (error) {
                            console.error('Ошибка при отправке после подтверждения:', error);
                            alert(`Ошибка при отправке: ${error.message}`);
                            reject(error);
                        }
                    }, () => {
                        // User canceled confirmation
                        console.log('Пользователь отменил подтверждение.');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        form.classList.remove(`${PREFIX}-loading`);
                        reject(new Error('Подтверждение отменено пользователем'));
                    });
                });
            } else {
                console.log(`Chat ID ${chatId} уже подтвержден недавно, пропускаем подтверждение.`);
                await proceedWithSending(chatId, comment, form, submitBtn, originalBtnText);
            }

        } catch (error) {
            console.error('Ошибка при обработке отправки в Telegram:', error);
            alert(`Произошла ошибка: ${error.message}`);
        } finally {
            // Unblock button only if not in confirmation process
            // In case of confirmation, unblocking happens inside callbacks
            if (!confirmationCode) { // If confirmationCode not set, we're not waiting for confirmation
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                form.classList.remove(`${PREFIX}-loading`);
            }
        }
    }
    
    // New function containing actual logic for sending logs
    async function proceedWithSending(chatId, comment, form, submitBtn, originalBtnText) {
        try {
            // Get selected groups
            const selectedGroups = getSelectedGroups();
            if (selectedGroups.length === 0) {
                throw new Error('Нет выбранных логов для отправки.');
            }

            // Create temporary container for screenshot
            const tempContainer = document.createElement('div');
            tempContainer.style.padding = '15px';
            tempContainer.style.backgroundColor = '#1e1e2d';
            tempContainer.style.color = '#e0e0e0';
            tempContainer.style.fontFamily = 'monospace';
            tempContainer.style.fontSize = '14px';
            tempContainer.style.borderRadius = '4px';
            tempContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
            tempContainer.style.maxWidth = '1000px';
            tempContainer.style.overflow = 'hidden';

            // Create table inside container
            const tempTable = document.createElement('table');
            tempTable.style.width = '100%';
            tempTable.style.borderCollapse = 'collapse';
            tempTable.style.tableLayout = 'fixed';

            // Copy header styles from original table
            const originalTable = document.querySelector('#log-table');
            if (originalTable) {
                const originalThead = originalTable.querySelector('thead');
                if (originalThead) {
                    const clonedThead = originalThead.cloneNode(true);
                    // Apply basic styles to header
                    const ths = clonedThead.querySelectorAll('th');
                    ths.forEach(th => {
                        th.style.padding = '10px';
                        th.style.backgroundColor = '#2d2d3d';
                        th.style.borderBottom = '1px solid #444';
                        th.style.textAlign = 'left';
                        th.style.fontWeight = 'bold';
                        th.style.fontSize = '13px';
                        th.style.color = '#c0c0ff';
                    });
                    tempTable.appendChild(clonedThead);
                }
            }

            const tempTbody = document.createElement('tbody');
            tempTable.appendChild(tempTbody);

            // Clone selected rows
            selectedGroups.forEach(groupIndex => {
                // Find the group toggle
                const toggle = document.querySelector(`.${PREFIX}-checkbox[data-group-index="${groupIndex}"]`);
                if (!toggle) return;
                
                // Find all rows associated with this toggle
                const groupRows = document.querySelectorAll(`tr[data-group-toggle-id="${toggle.id}"]`);
                
                // Create fragment for new rows
                const fragment = document.createDocumentFragment();
                
                groupRows.forEach(row => {
                    // Determine row type
                    if (row.classList.contains('first-row')) {
                        // Create new first-row
                        const newRow = document.createElement('tr');
                        newRow.className = 'first-row';
                        newRow.style.borderBottom = '1px solid #333';
                        
                        // Copy cells, except td-index (restore original view)
                        const cells = row.querySelectorAll('td');
                        cells.forEach((cell, index) => {
                            if (cell.classList.contains('td-index')) {
                                // Restore original index cell
                                const newCell = document.createElement('td');
                                newCell.className = 'td-index';
                                newCell.style.padding = '8px';
                                newCell.style.wordBreak = 'break-word';
                                // Get original text from span inside cell
                                const indexSpan = cell.querySelector('span');
                                if (indexSpan) {
                                    newCell.textContent = indexSpan.textContent;
                                } else {
                                    newCell.textContent = cell.textContent;
                                }
                                newRow.appendChild(newCell);
                            } else {
                                // Copy other cells as is
                                const newCell = cell.cloneNode(true);
                                newCell.style.padding = '8px';
                                newCell.style.wordBreak = 'break-word';
                                newRow.appendChild(newCell);
                            }
                        });
                        
                        fragment.appendChild(newRow);
                    } else if (row.classList.contains('second-row')) {
                        // Create new second-row
                        const newRow = document.createElement('tr');
                        newRow.className = 'second-row';
                        newRow.style.borderBottom = '1px solid #333';
                        
                        // Copy cells
                        const cells = row.querySelectorAll('td');
                        cells.forEach(cell => {
                            const newCell = cell.cloneNode(true);
                            newCell.style.padding = '8px';
                            newCell.style.wordBreak = 'break-word';
                            
                            // Correct colspan for td-transaction-desc
                            if (newCell.classList.contains('td-transaction-desc')) {
                                const currentColspan = parseInt(newCell.getAttribute('colspan') || '8', 10);
                                const newColspan = Math.max(1, currentColspan - 1);
                                newCell.setAttribute('colspan', newColspan.toString());
                            }
                            
                            newRow.appendChild(newCell);
                        });
                        
                        fragment.appendChild(newRow);
                    } else if (row.classList.contains('tr-spacer')) {
                        // Copy tr-spacer as is
                        const newRow = row.cloneNode(true);
                        newRow.style.borderBottom = '1px solid #333';
                        fragment.appendChild(newRow);
                    }
                });
                
                tempTbody.appendChild(fragment);
            });

            tempContainer.appendChild(tempTable);

            // Add temporary container to DOM (hidden)
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '-9999px';
            document.body.appendChild(tempContainer);

            // Take screenshot using html2canvas
            const canvas = await html2canvas(tempContainer, {
                backgroundColor: '#1e1e2d',
                scale: 2, // Increase quality
                useCORS: true,
                logging: false
            });

            // Remove temporary container
            document.body.removeChild(tempContainer);

            // Convert canvas to Blob
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

            // Send to Telegram
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', blob, 'selected_logs.png');
            if (comment) {
                // Specify that caption uses Markdown
                formData.append('parse_mode', 'MarkdownV2');
                // Escape special MarkdownV2 characters
                const escapedComment = escapeMarkdownV2(comment);
                formData.append('caption', escapedComment);
            }

            // Use GM_xmlhttpRequest if available, otherwise fetch
            let response;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
                        data: formData,
                        onload: resolve,
                        onerror: reject
                    });
                });
            } else {
                response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: formData,
                });
            }

            if (response.ok) {
                const data = await response.json();
                console.log('Изображение успешно отправлено:', data);
                alert('✅ Скриншот успешно отправлен в Telegram!');
                
                // Close modal window
                const overlay = document.querySelector(`.${PREFIX}-modal-overlay`);
                if (overlay) {
                    document.body.removeChild(overlay);
                }
            } else {
                const errorText = await response.text();
                console.error('Ошибка отправки в Telegram:', response.status, errorText);
                // Check specific Telegram errors
                if (errorText.includes('chat not found')) {
                    throw new Error('Ошибка: Пользователь с таким Chat ID не найден или не начал диалог с ботом.');
                } else if (errorText.includes('bot was blocked')) {
                    throw new Error('Ошибка: Пользователь заблокировал бота.');
                } else {
                    throw new Error(`Ошибка ${response.status}: ${errorText}`);
                }
            }

        } catch (error) {
            console.error('Ошибка при создании или отправке скриншота:', error);
            alert(`❌ Произошла ошибка: ${error.message}`);
        } finally {
            // Unblock button and form
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            form.classList.remove(`${PREFIX}-loading`);
            // Reset confirmation code
            confirmationCode = null;
            codeSentTimestamp = null;
        }
    }

    // --- Launch ---
    // Just call init. It will wait for #log-table through waitForLogsContent
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
