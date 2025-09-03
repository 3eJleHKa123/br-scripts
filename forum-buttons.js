// forum-buttons.js (с полным логированием)

(function () {
    'use strict';

    // --- Настройки ---
    console.log('[ForumBtns Debug] Script started');
    const FORUM_THREAD_PATTERN = /^https:\/\/forum\.blackrussia\.online\/threads\/.*$/;

    // Проверяем, на нужной ли странице
    if (!FORUM_THREAD_PATTERN.test(window.location.href)) {
        console.log('[ForumBtns Debug] Not on a thread page, exiting.');
        return;
    }

    console.log('[ForumBtns Debug] On a thread page, continuing...');

    // --- Данные кнопок ---
    const buttons = [
        {
            title: 'Приветствие',
            color: 'oswald: 3px; color: #FF69B4; background: #000000;',
            content: "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>',
            prefix: 0, // Заменить на реальный ID префикса, если нужно
            status: true,
        },
        {
            title: 'Закрыто',
            color: '',
            content: '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: 7, // Заменить на реальный ID префикса
            status: false,
        },
        {
            title: 'Команде проекта',
            color: '',
            content: "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER][COLOR=rgb(255, 204, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: 10, // Заменить на реальный ID префикса
            status: true,
        }
        // ... (добавь сюда остальные кнопки из ddd.txt, если нужно)
    ];

    // --- Функции ---

    // Получение данных пользователя и приветствия
    function getUserData() {
        console.log('[ForumBtns Debug] getUserData called');
        // Это упрощенный пример. В реальном скрипте это сложнее.
        // Попробуем найти имя пользователя в DOM
        const userLink = document.querySelector('.p-navgroup-user-link');
        const userNameElement = userLink ? userLink.querySelector('.avatarWrapper span') : null;
        const userName = userNameElement ? userNameElement.textContent.trim() : 'Гость';
        console.log('[ForumBtns Debug] Found username in DOM:', userName);

        const hours = new Date().getHours();
        let greeting;
        if (hours >= 6 && hours < 12) greeting = 'Доброе утро';
        else if (hours >= 12 && hours < 17) greeting = 'Добрый день';
        else if (hours >= 17 && hours < 23) greeting = 'Добрый вечер';
        else greeting = 'Доброй ночи';
        console.log('[ForumBtns Debug] Determined greeting based on time:', greeting);

        const result = { name: userName, greeting };
        console.log('[ForumBtns Debug] getUserData result:', result);
        return result;
    }

    // Генерация контента с учетом шаблонов
    function generateContent(template, userData) {
        console.log('[ForumBtns Debug] generateContent called with template and userData');
        // Простая замена шаблонов
        const result = template.replace(/{{\s*user\.name\s*}}/gi, userData.name)
                      .replace(/{{\s*greeting\s*}}/gi, userData.greeting);
        console.log('[ForumBtns Debug] generateContent result (first 200 chars):', result.substring(0, 200));
        return result;
    }

    // Добавление кнопки на страницу
    function addButton(title, actionName, style = '') {
        console.log(`[ForumBtns Debug] addButton called for '${title}'`);
        // Ждем появления контейнера для кнопок
        const checkExist = setInterval(function () {
            console.log('[ForumBtns Debug] Checking for quick reply container...');
            const quickReply = document.querySelector('.block-container.lbContainer');
            if (quickReply) {
                console.log('[ForumBtns Debug] Quick reply container found.');
                clearInterval(checkExist);

                const buttonContainer = document.createElement('div');
                buttonContainer.id = `custom-button-container-${actionName}`;
                buttonContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; padding: 10px; border-top: 1px solid #eee;';

                quickReply.parentNode.insertBefore(buttonContainer, quickReply.nextSibling);
                console.log('[ForumBtns Debug] Button container inserted into DOM.');

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = title;
                btn.className = 'button--link button';
                if (style) {
                    btn.style.cssText = style;
                }
                btn.dataset.action = actionName;
                console.log(`[ForumBtns Debug] Button element for '${title}' created.`);

                btn.addEventListener('click', () => {
                    console.log(`[ForumBtns Debug] Click event fired for button '${title}'`);
                    const btnData = buttons.find(b => b.title === title);
                    if (btnData) {
                        console.log(`[ForumBtns Debug] Button data found for '${title}', calling fillEditForm.`);
                        fillEditForm(btnData);
                    } else {
                        console.warn(`[ForumBtns Debug] Button data NOT found for '${title}'`);
                    }
                });

                buttonContainer.appendChild(btn);
                console.log(`[ForumBtns Debug] Button '${title}' appended to container.`);
            } else {
                 console.log('[ForumBtns Debug] Quick reply container not found yet...');
            }
        }, 100); // Проверяем каждые 100мс
        // Добавим таймаут, чтобы не висело вечно
        setTimeout(() => {
             clearInterval(checkExist);
             console.log('[ForumBtns Debug] addButton timeout reached for', title);
        }, 5000); // 5 секунд
    }

    // Заполнение формы редактирования
    async function fillEditForm(buttonData) {
        console.log('[ForumBtns Debug] fillEditForm called with buttonData:', buttonData);

        // 1. Получаем данные пользователя
        const userData = getUserData();
        console.log('[ForumBtns Debug] User data retrieved:', userData);

        // 2. Генерируем контент
        const finalContent = generateContent(buttonData.content, userData);
        console.log('[ForumBtns Debug] Final content generated (first 200 chars):', finalContent.substring(0, 200));

        // 3. Открываем форму редактирования (имитируем клик)
        console.log('[ForumBtns Debug] Looking for edit button...');
        const editButton = document.querySelector('a[href*="/edit"]');
        if (!editButton) {
            const errorMsg = 'Кнопка редактирования темы не найдена!';
            console.error('[ForumBtns Debug] Error:', errorMsg);
            alert(errorMsg);
            return;
        }
        console.log('[ForumBtns Debug] Edit button found:', editButton);

        // Имитируем клик по кнопке редактирования
        console.log('[ForumBtns Debug] Simulating click on edit button...');
        editButton.click();

        // 4. Ждем загрузки формы редактирования
        let attempts = 0;
        const maxAttempts = 50; // Максимум 5 секунд ожидания
        console.log('[ForumBtns Debug] Waiting for edit form to load...');
        const waitForForm = setInterval(() => {
            attempts++;
            console.log(`[ForumBtns Debug] Form check attempt ${attempts}/${maxAttempts}`);
            const form = document.querySelector('form[action*="/edit"]');
            const prefixSelect = form ? form.querySelector('select[name="prefix_id"]') : null;
            const messageEditor = form ? tinymce?.activeEditor : null; // Для TinyMCE
            
            // Альтернатива, если TinyMCE не доступен сразу или используется другая система
            const textareaEditor = form ? form.querySelector('textarea[data-editor]') : null; 

            if (form) {
                 console.log('[ForumBtns Debug] Edit form found.');
                 if (prefixSelect) console.log('[ForumBtns Debug] Prefix select found.');
                 if (messageEditor) console.log('[ForumBtns Debug] TinyMCE editor found.');
                 if (textareaEditor) console.log('[ForumBtns Debug] Textarea editor found.');
                 
                clearInterval(waitForForm);
                

                // 5. Заполняем форму
                
                // Префикс
                if (prefixSelect && buttonData.prefix) {
                    console.log(`[ForumBtns Debug] Setting prefix to ${buttonData.prefix}`);
                    prefixSelect.value = buttonData.prefix;
                    // Триггерим событие change, если слушатели зависят от него
                    prefixSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('[ForumBtns Debug] Prefix set and change event dispatched.');
                } else if (buttonData.prefix) {
                     console.warn('[ForumBtns Debug] Prefix select not found or prefix ID is invalid.');
                }

                // Сообщение
                if (messageEditor) {
                    // Если используется TinyMCE
                    console.log('[ForumBtns Debug] Filling content via TinyMCE setContent.');
                    messageEditor.setContent(finalContent);
                    console.log('[ForumBtns Debug] Content set via TinyMCE.');
                } else if (textareaEditor) {
                    // Если используется обычный textarea (редко на XF)
                    console.log('[ForumBtns Debug] Filling content via textarea value.');
                    textareaEditor.value = finalContent;
                    textareaEditor.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log('[ForumBtns Debug] Content set via textarea.');
                } else {
                    // Если редактор не найден, попробуем вставить в скрытое поле или предупредить
                    console.warn('[ForumBtns Debug] Message editor (TinyMCE or textarea) not found or not ready.');
                    alert('Не удалось автоматически вставить сообщение. Пожалуйста, вставьте его вручную.');
                    // Можно открыть prompt и попросить пользователя вставить
                    // const manualContent = prompt("Скопируйте и вставьте это сообщение в редактор:", finalContent);
                }

                // 6. Авто-сохранение/сабмит (ОПЦИОНАЛЬНО, может быть небезопасно)
                // Раскомментируй, если хочешь, чтобы форма сама отправлялась (но будь осторожен!)
                /*
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    setTimeout(() => {
                        if (confirm(`Вы уверены, что хотите применить шаблон "${buttonData.title}"?`)) {
                            submitBtn.click();
                        }
                    }, 300); // Небольшая задержка
                }
                */
                
            } else if (attempts > maxAttempts) {
                clearInterval(waitForForm);
                const errorMsg = 'Форма редактирования не загрузилась или компоненты не найдены.';
                console.error('[ForumBtns Debug] Error:', errorMsg);
                alert(errorMsg);
            } else {
                 console.log('[ForumBtns Debug] Form not ready yet...');
            }
        }, 100);
    }

    // --- Инициализация ---
    function init() {
        console.log('[ForumBtns Debug] init function called');
        // Добавляем кнопки
        // Упрощаем: добавляем только несколько, как пример
        // Можешь добавить все, что нужно
        const buttonsToAdd = buttons.filter(b => b.status); // Только активные
        
        if (buttonsToAdd.length > 0) {
            console.log(`[ForumBtns Debug] Found ${buttonsToAdd.length} active buttons to add.`);
            // Добавляем каждую кнопку с небольшой задержкой, чтобы DOM успел обновиться
            buttonsToAdd.forEach((btnData, index) => {
                console.log(`[ForumBtns Debug] Scheduling addition of button '${btnData.title}' with index ${index}`);
                setTimeout(() => {
                    addButton(btnData.title, `action_${index}`, btnData.color);
                }, index * 100);
            });
        } else {
            console.log('[ForumBtns Debug] No active buttons to add.');
        }
    }

    // --- Запуск ---
    // Ждем полной загрузки DOM
    if (document.readyState === 'loading') {
        console.log('[ForumBtns Debug] DOM not ready, adding DOMContentLoaded listener.');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM уже загружен
        console.log('[ForumBtns Debug] DOM already loaded, calling init directly.');
        init();
    }

    // На случай, если страница загружается динамически (SPA), можно использовать MutationObserver
    // Но для XenForo это обычно не нужно. Оставим простой вариант.
    console.log('[ForumBtns Debug] Script initialization setup complete.');

})();
