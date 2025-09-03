// forum-buttons.js (адаптированный из ddd.txt для расширения)

(function () {
    'use strict';

    // --- Настройки и константы из ddd.txt ---
    console.log('[ForumBtns Ext] Script started');

    const UNACCEPT_PREFIX = 4;
    const PIN_PREFIX = 2;
    const COMMAND_PREFIX = 10;
    const CLOSE_PREFIX = 7;
    const DECIDED_PREFIX = 6;
    const TECHADM_PREFIX = 13;
    const WATCHED_PREFIX = 9;
    const WAIT_PREFIX = 14;
    const NO_PREFIX = 0;

    // --- Кнопки из ddd.txt ---
    // Взял только те, у которых status: true
    const buttons = [
        {
            title: 'Команде проекта',
            color: '',
            content: "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
                '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
                '[CENTER]<u>Создавать подобные темы не нужно</u>.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
            prefix: PIN_PREFIX, // Используем реальный префикс "Закрепить"
            status: true,
        }
        // Добавь сюда другие кнопки с status: true, если нужно
        // Например, "ПРАВИЛА РАЗДЕЛА" тоже имеет status: false в оригинале, так что не добавляю
    ].filter(b => b.status); // На всякий случай фильтруем

    // --- Функции-утилиты ---
    function getUserData() {
        console.log('[ForumBtns Ext] Getting user data...');
        // Простая попытка найти имя пользователя в DOM
        // На форуме BR это обычно .p-navgroup-user-link .avatarWrapper span
        const userLink = document.querySelector('.p-navgroup-user-link');
        const userNameElement = userLink ? userLink.querySelector('.avatarWrapper span') : null;
        const userName = userNameElement ? userNameElement.textContent.trim() : 'Гость';
        console.log('[ForumBtns Ext] Found username:', userName);

        const hours = new Date().getHours();
        let greeting;
        if (hours >= 6 && hours < 12) greeting = 'Доброе утро';
        else if (hours >= 12 && hours < 17) greeting = 'Добрый день';
        else if (hours >= 17 && hours < 23) greeting = 'Добрый вечер';
        else greeting = 'Доброй ночи';
        console.log('[ForumBtns Ext] Determined greeting:', greeting);

        return { name: userName, greeting };
    }

    function generateContent(template, userData) {
        console.log('[ForumBtns Ext] Generating content from template...');
        // Простая замена шаблонов
        return template.replace(/{{\s*user\.name\s*}}/gi, userData.name)
                      .replace(/{{\s*greeting\s*}}/gi, userData.greeting);
    }

    function addButton(title, actionName, style = '') {
        console.log(`[ForumBtns Ext] Adding button '${title}'...`);
        // Ждем появления контейнера для кнопок (как в оригинале)
        const checkExist = setInterval(function () {
            // Ищем контейнер, куда добавляются кнопки. На странице темы это обычно рядом с быстрым ответом.
            // Классы могут меняться, подбираем наиболее стабильный.
            // В ddd.txt используется '.block-container.lbContainer'. Проверим.
            const quickReply = document.querySelector('.block-container.lbContainer');
            if (quickReply) {
                console.log('[ForumBtns Ext] Found quick reply container.');
                clearInterval(checkExist);

                // Создаем контейнер для наших кнопок
                const buttonContainer = document.createElement('div');
                buttonContainer.id = `custom-button-container-${actionName}`;
                buttonContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; padding: 10px; border-top: 1px solid #eee;';

                // Вставляем контейнер ПОСЛЕ блока быстрого ответа
                quickReply.parentNode.insertBefore(buttonContainer, quickReply.nextSibling);

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = title;
                btn.className = 'button--link button'; // Классы кнопок XF
                if (style) {
                    btn.style.cssText = style;
                }
                btn.dataset.action = actionName; // data-action для идентификации

                // Обработчик клика
                btn.addEventListener('click', () => {
                    console.log(`[ForumBtns Ext] Button '${title}' clicked.`);
                    // Находим данные кнопки по названию
                    const btnData = buttons.find(b => b.title === title);
                    if (btnData) {
                        console.log('[ForumBtns Ext] Button data found, filling form.');
                        fillEditForm(btnData);
                    } else {
                        console.error('[ForumBtns Ext] Button data NOT found for:', title);
                    }
                });

                buttonContainer.appendChild(btn);
                console.log(`[ForumBtns Ext] Button '${title}' added successfully.`);
            } else {
                console.log('[ForumBtns Ext] Quick reply container not found yet, waiting...');
            }
        }, 100); // Проверяем каждые 100мс

        // Таймаут, чтобы не висело вечно
        setTimeout(() => {
            clearInterval(checkExist);
            console.log(`[ForumBtns Ext] Timeout adding button '${title}'.`);
        }, 5000); // 5 секунд
    }

    async function fillEditForm(buttonData) {
        console.log('[ForumBtns Ext] Filling edit form...');
        try {
            // 1. Получаем данные пользователя
            const userData = getUserData();
            console.log('[ForumBtns Ext] User data:', userData);

            // 2. Генерируем контент
            const finalContent = generateContent(buttonData.content, userData);
            console.log('[ForumBtns Ext] Final content (first 200 chars):', finalContent.substring(0, 200));

            // 3. Открываем форму редактирования (имитируем клик)
            console.log('[ForumBtns Ext] Looking for edit button...');
            const editButton = document.querySelector('a[href*="/edit"]');
            if (!editButton) {
                const errorMsg = 'Кнопка редактирования темы не найдена!';
                console.error('[ForumBtns Ext] Error:', errorMsg);
                alert(errorMsg);
                return;
            }
            console.log('[ForumBtns Ext] Edit button found, clicking...');
            editButton.click();

            // 4. Ждем загрузки формы редактирования
            let attempts = 0;
            const maxAttempts = 50; // Максимум 5 секунд ожидания
            console.log('[ForumBtns Ext] Waiting for edit form...');
            const waitForForm = setInterval(() => {
                attempts++;
                console.log(`[ForumBtns Ext] Form check attempt ${attempts}/${maxAttempts}`);
                const form = document.querySelector('form[action*="/edit"]');
                const prefixSelect = form ? form.querySelector('select[name="prefix_id"]') : null;
                const messageEditor = form ? tinymce?.activeEditor : null; // Для TinyMCE

                // Альтернатива, если TinyMCE не доступен сразу или используется другая система
                const textareaEditor = form ? form.querySelector('textarea[data-editor]') : null;

                if (form && (prefixSelect || messageEditor || textareaEditor)) {
                    console.log('[ForumBtns Ext] Edit form and components found.');
                    clearInterval(waitForForm);

                    // 5. Заполняем форму

                    // Префикс
                    if (prefixSelect && buttonData.prefix) {
                        console.log(`[ForumBtns Ext] Setting prefix to ${buttonData.prefix}`);
                        prefixSelect.value = buttonData.prefix;
                        // Триггерим событие change, если слушатели зависят от него
                        prefixSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        console.log('[ForumBtns Ext] Prefix set.');
                    } else if (buttonData.prefix) {
                         console.warn('[ForumBtns Ext] Prefix select not found or prefix ID is invalid.');
                    }

                    // Сообщение
                    if (messageEditor) {
                        // Если используется TinyMCE
                        console.log('[ForumBtns Ext] Filling content via TinyMCE.');
                        messageEditor.setContent(finalContent);
                        console.log('[ForumBtns Ext] Content set via TinyMCE.');
                    } else if (textareaEditor) {
                        // Если используется обычный textarea (редко на XF)
                        console.log('[ForumBtns Ext] Filling content via textarea.');
                        textareaEditor.value = finalContent;
                        textareaEditor.dispatchEvent(new Event('input', { bubbles: true }));
                        console.log('[ForumBtns Ext] Content set via textarea.');
                    } else {
                        // Если редактор не найден, попробуем вставить в скрытое поле или предупредить
                        console.warn('[ForumBtns Ext] Message editor not found or not ready.');
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
                    console.error('[ForumBtns Ext] Error:', errorMsg);
                    alert(errorMsg);
                } else {
                     console.log('[ForumBtns Ext] Form or components not ready yet...');
                }
            }, 100);

        } catch (error) {
            console.error('[ForumBtns Ext] Error in fillEditForm:', error);
            alert('Произошла ошибка при заполнении формы: ' + error.message);
        }
    }

    // --- Инициализация ---
    function init() {
        console.log('[ForumBtns Ext] Initializing...');
        // Проверяем URL (как в юзерскрипте)
        if (!/^https:\/\/forum\.blackrussia\.online\/threads\/.*$/.test(window.location.href)) {
            console.log('[ForumBtns Ext] Not on a thread page, exiting.');
            return;
        }
        console.log('[ForumBtns Ext] On a thread page.');

        // Добавляем кнопки
        if (buttons.length > 0) {
            console.log(`[ForumBtns Ext] Found ${buttons.length} active buttons to add.`);
            buttons.forEach((btnData, index) => {
                // Добавляем каждую кнопку с небольшой задержкой, чтобы DOM успел обновиться
                setTimeout(() => {
                    addButton(btnData.title, `action_${index}`, btnData.color);
                }, index * 100);
            });
        } else {
            console.log('[ForumBtns Ext] No active buttons found.');
        }
        console.log('[ForumBtns Ext] Initialization complete.');
    }

    // --- Запуск ---
    // Ждем полной загрузки DOM (как в юзерскрипте)
    if (document.readyState === 'loading') {
        console.log('[ForumBtns Ext] DOM not ready, adding listener.');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM уже загружен
        console.log('[ForumBtns Ext] DOM ready, calling init.');
        init();
    }

    // На случай, если страница загружается динамически (SPA), можно использовать MutationObserver
    // Но для XenForo это обычно не нужно. Оставим простой вариант.
    console.log('[ForumBtns Ext] Script setup complete.');

})();
