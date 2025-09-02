(async function() {
    try {
        // Получаем метку времени 6 месяцев назад
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        const tstart = sixMonthsAgo.getTime();

        const url = new URL(window.location.href);
        const currentTstart = url.searchParams.get('tstart');

        if (currentTstart != tstart) {
            url.searchParams.set('tstart', tstart);
            window.history.replaceState({}, '', url); // обновляем URL без перезагрузки
            console.log('[BR Scripts] tstart обновлен на 6 месяцев назад:', tstart);
        }

        // Если на странице есть функция обновления логов, триггерим её
        if (typeof updateLogs === 'function') {
            updateLogs();
            console.log('[BR Scripts] Логи обновлены через updateLogs()');
        }
    } catch (err) {
        console.error('[BR Scripts] Ошибка при выставлении tstart', err);
    }
})();
