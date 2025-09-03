// forum-buttons.js

(function () {
    'use strict';

    // --- Настройки ---
    // Определим URL, на котором скрипт должен работать
    const FORUM_THREAD_PATTERN = /^https:\/\/forum\.blackrussia\.online\/threads\/.*$/;

    // Проверяем, на нужной ли странице
    if (!FORUM_THREAD_PATTERN.test(window.location.href)) {
        console.log('[Forum Buttons Ext] Not on a thread page, exiting.');
        return;
    }

    console.log('[Forum Buttons Ext] Script started.');

    // --- Данные кнопок ---
    const buttons = [
        {
	title: 'Приветсвие',
	content:
"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
'[CENTER] текст [/CENTER][/FONT]',
},
	{
	title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  Для Логирования ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
{
	title: 'Форма',
	color: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема создана не по форме.<br>Пересоздайте тему и заполните форму, как указано ниже:<br><br> Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Рассмотрение',
	color: 'oswald: 3px; color: #FF8C00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Тема взята в работу и закреплена, ожидайте ответа в ней.<br>Часто рассмотрение темы может занять определенное время.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
	title: 'Передача Руководству',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и ожидает вердикта <u>Заместителя Куратора Технических Специалистов и/или Куратора Технических Специалистов</u>.<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]<u>Создавать подобные темы не нужно</u>.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Вам в Технический раздел',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема не как не относится к жалобам на технических специалистов, обратитесь с данной темой в <u>технический раздел вашего сервера</u> - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']клик[/URL]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Нет окна блокировки',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабетильно).<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'ДУБЛИРОВАНИЕ',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][COLOR=rgb(209, 213, 216)]Эта тема является копией вашей предыдущей темы. Пожалуйста, не создавайте похожие или одинаковые темы, иначе [COLOR=rgb(255, 255, 255)] Ваш аккаунт на форуме может быть заблокирован.[/COLOR]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Будете разблокированы',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]После дополнительной перепроверки было выявлена ошибка, ваш аккаунт будет разблокирован в течение 24-х часов.<br>[/CENTER]<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'ПРАВИЛА РАЗДЕЛА',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U][/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/SIZE][/FONT]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Срок подачи жб',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]С момента вынесения наказания техническим специалистом [COLOR=rgb(255, 255, 255)] прошло более 14 дней.[/COLOR]<br>В настоящее время изменить меру наказания невозможно. Однако Вы можете попробовать написать заявление на обжалование через определенный период времени.<br><br>Обращаем Ваше внимание, что некоторые наказания не подлежат обжалованию или амнистии. Детальнее ознакомиться с критериями можно здесь: [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/']нажмите[/URL]([/SIZE][/FONT][/COLOR][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Восст.доступа к аккаунту',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
	"[CENTER][FONT=Verdana]Подробнее в данной теме - [URL='https://forum.blackrussia.online/index.php?threads/lime-Защита-игрового-аккаунта.1201253/']клик[/URL][/center]<br><br>" +
	"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
	"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U] Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
	'[CENTER]К сожалению, иногда решение подобных вопросов требует много времени. Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[center][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
	title: 'Правила восстановления',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL]<br> Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
    title: 'Донат',
	color: '',
    content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
    '[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br>' +
    '[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. <br>В данном случае мы не восстанавливаем денежные средства согласно нашей политике оферты - "[URL="https://blackrussia.online/oferta.php"]клик[/URL] <br>' +
    '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 24-х часов, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br>' +
    '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][I]Решено[/I][/CENTER][/FONT][/SIZE]',
    prefix: DECIDED_PREFIX,
    status: false,
},
{
	title: 'Имущество восстановлено',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение двух недель. <br>Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.<br>" +
	'[CENTER]Для активации восстановления используйте команды:[COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(127, 255, 0)]Решено[/COLOR][/CENTER][/FONT][/SIZE]',
	status: false,
	prefix: DECIDED_PREFIX,
},
{
	title: 'НЕ ОТНОСИТСЯ',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста ознакомьтесь с праивилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Игрок будет заблокирован(Жб игроков)',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(65, 168, 95)][FONT=verdana]Игрок будет заблокирован[/COLOR][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/CENTER]",
},
{
	title: 'Игрок не будет заблокирован(Жб игроков)',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(255, 0, 0)]Доказательств недостаточно для блокировки игрока[/COLOR][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/CENTER]",
},
	{
	title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ  Для Форумников  ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠ',
	color: 'oswald: 3px; color: #DDA0DD; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
{
	title: 'ФОРМА',
	color: 'oswald: 3px; color: #DC143C; background: #FFEFD5; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER]/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'ЖБ на ТЕХОВ',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Вы получили наказание от технического специалиста Вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>' +
	"[CENTER]Ссылка на раздел, где можно оформить жалобу на технического специалиста - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']клик[/URL] <br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Нет скринов/видео',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'ПРАВИЛА РАЗДЕЛА',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/SIZE][/FONT][/QUOTE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Передача логисту',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и передана <u>Техническому Специалисту по Логированию</u> для дальнейшего вердикта,ожидайте ответ в данной теме.<br><br>" +
	'[CENTER]Создавать новые темы с данной проблемой — не нужно.'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)][/color][/CENTER][/FONT][/SIZE]',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
	title: 'Доп.Информация',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][SIZE=5][FONT=Verdana]Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<BR>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: "Проблемы с Кешом",
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[center]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share'+ 
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
 	title: 'Кик за ПО',
 	content:
 	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
 	'[CENTER]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
 	prefix: CLOSE_PREFIX,
 	status: false,
},
{
	title: 'Для ошибок во время ОБТ на IOS',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" + 
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Если вы нашли какую-либо ошибку во время Открытого Бэта Тестирования на IOS то сделайте следующие действия.<br><br>1. Отправьте пожалуйста найденную недоработку в данную форму - [URL="https://forms.gle/4adcNvKisfKF59Fi8"]клик[/URL]<br>2. Передайте данную форму своим друзьям, для ускорения процесса по сбору багов для их исправления.<br><br>Спасибо за ваш вклад в развитие игры!<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Законопослушность',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br>Повысить законопослушность можно тремя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нету PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<BR>3.На работе "Электрика"(доступна с 12 Игрового Уровня), для этого нужно починить 5 фонарей и тогда вам дадут 5 законопослушности.<br><br>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: "Баг со штрафами",
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[center]У вас произошла ошибка со штрафами, для её исправления вам нужно совершить проезд на красный свет, переехать через сплошную и оплатить все штрафы в банке.<br>Тогда данный баг пропадет, Команде Проекта известно о данной недоработке и активно ведется иправление.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Команде проекта',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков."+
	"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>',
	prefix: COMMAND_PREFIX,
	status: true,
},
{
	title: 'Известно КП',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'пропали все темы из раздела Жалобы',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Раздел "Жалобы" переведен в приватный режим, а именно:<br>Тему созданную пользователем пожет видеть <b>он сам</b> и <b>Администрация сервера</b>.<br>Ознакомиться с формой подачи тем в тот или иной раздел можно по данной ссылке: [URL="https://forum.blackrussia.online/index.php?forums/Правила-подачи-жалоб.202/"]клик[/URL]<br>Приятного времяпрепровождения на нашем форуме<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Не является багом',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Проблема с которой вы столкнулись не является багом, ошибкой сервера.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'В раздел Госс Организаций.',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br><br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'В раздел Криминальных Организаций',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера [/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Жб на адм',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Вы получили наказание которое не относится к технической части, оно относится к Административной части.<br> Обратитесь в раздел Жалобы на администрацию вашего сервера.<br>Форма для подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']тут[/URL]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жб на лидеров',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная тема не относится к техническому разделу.<br>Данное нарушение было совершено Лидером или его Заместителем и нарушает правила сервера, пожалуйста обратитесь в <br>'Жалобы на Лидеров'<br>Вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']тык[/URL]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жб на игроков',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная тема не относится к техническому разделу.<br>Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в <br>'Жалобы на игроков'<br>Вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']тык[/URL]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Обжалования',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения/обжалования обратитесь в раздел<br><<Обжалования>> вашего сервера.<br>Форма подачи темы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']клик[/URL]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Сервер не отвечает',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: <br><br>" +
	"[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
	"[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
	"[LEFT]• Использование VPN; <br>"+
	"[LEFT]• Перезагрузка роутера.<br><br>" +

	"[CENTER]Если методы выше не помогли, то переходим к следующим шагам: <br><br>" +

	'[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>'+
	'[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
	'[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
	'[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br>' +

	'[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
    title: 'Донат',
	color: '',
    content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
    '[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br>' +
    '[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. <br>В данном случае мы не восстанавливаем денежные средства согласно нашей политике оферты - "[URL="https://blackrussia.online/oferta.php"]клик[/URL] <br>' +
    '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 24-х часов, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br>' +
    '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][I]Решено[/I][/CENTER][/FONT][/SIZE]',
    prefix: DECIDED_PREFIX,
    status: false,
},
{
	title: 'Слетел аккаунт',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
	"[CENTER]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны!" +
	'[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU [/CENTER] <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][I]Рассмотрено[/I][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Будет исправленно',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная недоработка будет проверена и исправлена.<br> Спасибо, ценим Ваш вклад в развите проекта.<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][I]Рассмотрено[/I][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
	title: 'Правила восстановления',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL]<br>Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER]/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
// {
// 	title: 'Баг ФСИН(не выпустило)',
// 	content:
// 	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
// 	'[CENTER]Скоро будете выпущены,ожидайте.[/CENTER][/FONT][/SIZE]',
// 	prefix: CLOSE_PREFIX,
// 	status: false,
// },
{
	title: 'ХОЧУ СТАТЬ АДМ/ХЕЛПЕРОМ',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе форума - [URL='https://forum.blackrussia.online/forums/%D0%97%D0%90%D0%AF%D0%92%D0%9A%D0%98-%D0%9D%D0%90-%D0%94%D0%9E%D0%9B%D0%96%D0%9D%D0%9E%D0%A1%D0%A2%D0%98-%D0%9B%D0%98%D0%94%D0%95%D0%A0%D0%9E%D0%92-%D0%98-%D0%90%D0%93%D0%95%D0%9D%D0%A2%D0%9E%D0%92-%D0%9F%D0%9E%D0%94%D0%94%D0%95%D0%A0%D0%96%D0%9A%D0%98.3066/']тык[/URL] , где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице!<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Улучшения для серверов',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]' ,
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Вам нужны все прошивки',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Для активации какой либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'ТЕСТЕРАМ',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>',
	prefix: WAIT_PREFIX,
	status: false,
},
{
	title: 'Ответ от ТЕСТЕРОВ',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ответ от тестерского отдела дан выше.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Пропали вещи с аукциона',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Если вы выставили свои вещи на аукцион а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с + /time в новой теме<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Если не работают ссылки',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок https://clck.ru<br> Либо попробуйте вот так:<br>1) загрузка скриншота биографии на фотохостинг<br>2) в описание прикрепить ссылку с форума<br>3) скопировать пост с фотохостинга<br><br>2 способ:<br>Сократите ссылки для Ваших скриншотов и RP биографии, сделать можно тут goo.su  также Iformation замените на русский текст, просмотрите еще текст полностью и постарайтесь уменьшить такие знаки как !?<br>goo.su[/CENTER]<br>"+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
        // ... (добавь сюда остальные кнопки из ddd.txt, если нужно)
    ];

    // --- Функции ---

    // Получение данных пользователя и приветствия
    function getUserData() {
        // Это упрощенный пример. В реальном скрипте это сложнее.
        // Попробуем найти имя пользователя в DOM
        const userLink = document.querySelector('.p-navgroup-user-link');
        const userNameElement = userLink ? userLink.querySelector('.avatarWrapper span') : null;
        const userName = userNameElement ? userNameElement.textContent.trim() : 'Гость';

        const hours = new Date().getHours();
        let greeting;
        if (hours >= 6 && hours < 12) greeting = 'Доброе утро';
        else if (hours >= 12 && hours < 17) greeting = 'Добрый день';
        else if (hours >= 17 && hours < 23) greeting = 'Добрый вечер';
        else greeting = 'Доброй ночи';

        return { name: userName, greeting };
    }

    // Генерация контента с учетом шаблонов
    function generateContent(template, userData) {
        // Простая замена шаблонов
        return template.replace(/{{\s*user\.name\s*}}/gi, userData.name)
                      .replace(/{{\s*greeting\s*}}/gi, userData.greeting);
    }

    // Добавление кнопки на страницу
    function addButton(title, actionName, style = '') {
        // Ждем появления контейнера для кнопок
        const checkExist = setInterval(function () {
            const quickReply = document.querySelector('.block-container.lbContainer');
            if (quickReply) {
                clearInterval(checkExist);

                const buttonContainer = document.createElement('div');
                buttonContainer.id = `custom-button-container-${actionName}`;
                buttonContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; padding: 10px; border-top: 1px solid #eee;';

                quickReply.parentNode.insertBefore(buttonContainer, quickReply.nextSibling);

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = title;
                btn.className = 'button--link button';
                if (style) {
                    btn.style.cssText = style;
                }
                btn.dataset.action = actionName;

                btn.addEventListener('click', () => {
                    const btnData = buttons.find(b => b.title === title);
                    if (btnData) {
                        fillEditForm(btnData);
                    }
                });

                buttonContainer.appendChild(btn);
                console.log(`[Forum Buttons Ext] Button '${title}' added.`);
            }
        }, 100); // Проверяем каждые 100мс
    }

    // Заполнение формы редактирования
    async function fillEditForm(buttonData) {
        console.log('[Forum Buttons Ext] Filling form for button:', buttonData.title);

        // 1. Получаем данные пользователя
        const userData = getUserData();
        console.log('[Forum Buttons Ext] User data:', userData);

        // 2. Генерируем контент
        const finalContent = generateContent(buttonData.content, userData);
        console.log('[Forum Buttons Ext] Final content:', finalContent);

        // 3. Открываем форму редактирования (имитируем клик)
        const editButton = document.querySelector('a[href*="/edit"]');
        if (!editButton) {
            alert('Кнопка редактирования темы не найдена!');
            console.error('[Forum Buttons Ext] Edit button not found.');
            return;
        }

        // Имитируем клик по кнопке редактирования
        editButton.click();

        // 4. Ждем загрузки формы редактирования
        let attempts = 0;
        const maxAttempts = 50; // Максимум 5 секунд ожидания
        const waitForForm = setInterval(() => {
            attempts++;
            const form = document.querySelector('form[action*="/edit"]');
            const prefixSelect = form ? form.querySelector('select[name="prefix_id"]') : null;
            const messageEditor = form ? tinymce?.activeEditor : null; // Для TinyMCE
            
            // Альтернатива, если TinyMCE не доступен сразу или используется другая система
            const textareaEditor = form ? form.querySelector('textarea[data-editor]') : null; 

            if (form && (prefixSelect || messageEditor || textareaEditor)) {
                clearInterval(waitForForm);
                console.log('[Forum Buttons Ext] Edit form found.');

                // 5. Заполняем форму
                
                // Префикс
                if (prefixSelect && buttonData.prefix) {
                    prefixSelect.value = buttonData.prefix;
                    // Триггерим событие change, если слушатели зависят от него
                    prefixSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('[Forum Buttons Ext] Prefix set to:', buttonData.prefix);
                }

                // Сообщение
                if (messageEditor) {
                    // Если используется TinyMCE
                    messageEditor.setContent(finalContent);
                    console.log('[Forum Buttons Ext] Content set via TinyMCE.');
                } else if (textareaEditor) {
                    // Если используется обычный textarea (редко на XF)
                    textareaEditor.value = finalContent;
                    textareaEditor.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log('[Forum Buttons Ext] Content set via textarea.');
                } else {
                    // Если редактор не найден, попробуем вставить в скрытое поле или предупредить
                    console.warn('[Forum Buttons Ext] Message editor not found or not ready.');
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
                console.error('[Forum Buttons Ext] Edit form did not load in time.');
                alert('Форма редактирования не загрузилась или компоненты не найдены.');
            }
        }, 100);
    }

    // --- Инициализация ---
    function init() {
        // Добавляем кнопки
        // Упрощаем: добавляем только несколько, как пример
        // Можешь добавить все, что нужно
        const buttonsToAdd = buttons.filter(b => b.status); // Только активные
        
        if (buttonsToAdd.length > 0) {
            // Добавляем каждую кнопку с небольшой задержкой, чтобы DOM успел обновиться
            buttonsToAdd.forEach((btnData, index) => {
                setTimeout(() => {
                    addButton(btnData.title, `action_${index}`, btnData.color);
                }, index * 100);
            });
        } else {
            console.log('[Forum Buttons Ext] No active buttons to add.');
        }
    }

    // --- Запуск ---
    // Ждем полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM уже загружен
        init();
    }

    // На случай, если страница загружается динамически (SPA), можно использовать MutationObserver
    // Но для XenForo это обычно не нужно. Оставим простой вариант.

})();
