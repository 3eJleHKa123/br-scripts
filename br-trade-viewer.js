(function () {
  'use strict';
  const REQUEST_DELAY_MS = 4000;
  const SHOW_CONNECT_BTN_DELAY_MS = 2000;
  let lastRequestTime = 0;
  const openModals = {};
  const SERVER_ID_MATCH = window.location.pathname.match(/\/gslogs\/(\d+)/);
  const SERVER_ID = SERVER_ID_MATCH ? SERVER_ID_MATCH[1] : '1';
  const css = `:root {
    --bg-main: rgba(26, 26, 26, 0.7);
    --bg-panel: rgba(30, 39, 46, 0.7);
    --text-primary: #ffffff;
    --text-secondary: #cccccc;
    --text-highlight: #2b8cff;
    --primary-gradient: linear-gradient(145deg, #2b8cff, #1f6cd9);
    --secondary-gradient: linear-gradient(145deg, #8e2de2, #4a00e0);
    --danger-color: #ff4757;
    --warning-color: #ffd700;
    --border-color: rgba(255, 255, 255, 0.1);
    --shadow: 0 10px 35px rgba(0,0,0,.5);
    --radius: 12px;
    --font-family: 'Segoe UI', sans-serif;
    --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.trade-btn-resp {
    background: var(--primary-gradient);
    color: white;
    border: none;
    padding: 6px 12px;
    margin: 2px;
    font-size: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: transform var(--transition), box-shadow var(--transition);
}
.trade-btn-resp:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(43, 140, 255, 0.3);
}
.trade-modal-overlay-resp {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.6);
    z-index: 9999;
    backdrop-filter: blur(4px);
    opacity: 0;
    transition: opacity var(--transition);
}
.trade-modal-overlay-resp.visible {
 opacity: 1;
}
/* - МОБИЛЬНЫЙ ВИД: ЦЕНТРИРОВАННОЕ ОКНО (Mobile-First) - */
.trade-wrapper-resp {
    position: fixed;
    z-index: 10000;
    inset: 0;
    display: flex;
    justify-content: center;
    /* Центрируем по вертикали */
    align-items: center;
    padding: 16px;
}
.trade-modal-resp {
    background: var(--bg-main);
    color: var(--text-primary);
    box-shadow: var(--shadow);
    width: 95%; /* Ограничиваем ширину на мобильных */
    max-width: 600px;
    height: auto;
    max-height: 90vh; /* Максимальная высота, чтобы не закрывать весь экран */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-family: var(--font-family);
    border: 1px solid var(--border-color);
    backdrop-filter: blur(15px);
    border-radius: var(--radius);
    /* Анимация появления */
    opacity: 0;
    transform: scale(0.95);
    transition: opacity var(--transition), transform var(--transition), height var(--transition);
}
.trade-wrapper-resp.visible .trade-modal-resp {
    opacity: 1;
    transform: scale(1);
}
.trade-modal-header-resp {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
}
/* Убираем "ручку" шторки */
.trade-modal-header-resp::before {
 display: none !important;
}
.trade-modal-title-resp {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-highlight);
    margin: 0;
    flex-grow: 1;
}
.trade-modal-close-resp {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 28px;
    line-height: 1;
    padding: 0 8px;
    cursor: pointer;
    transition: color var(--transition), transform var(--transition);
}
.trade-modal-content-resp {
    overflow-y: auto; /* Главный скролл */
    flex-grow: 1;
    padding: 8px 16px;
}
/* Мобильный карточный вид логов */
.trade-row-resp {
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.trade-player-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}
.trade-player-resp {
 font-weight: 600;
 color: var(--text-primary);
}
.trade-time-resp {
 font-size: 12px;
 color: var(--text-secondary);
}
.trade-desc-resp {
    font-size: 14px;
    color: var(--text-primary);
    line-height: 1.5;
    word-break: break-word;
    white-space: pre-wrap;
}
.trade-modal-footer-resp {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 16px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
    border-top: 1px solid var(--border-color);
    flex-shrink: 0;
    background: rgba(26, 26, 26, 0.8);
}
.both-nicks-btn-resp {
    background: var(--secondary-gradient);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    width: 100%;
}
.connect-panel-resp {
    background: var(--bg-panel);
    padding: 16px;
    border-radius: var(--radius);
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 16px 0; /* Отступы внутри скролла */
    border: 1px solid var(--border-color);
    backdrop-filter: blur(15px);
}
.connect-btn-resp {
    background: linear-gradient(145deg, #3742fa, #1e90ff);
    color: var(--text-primary);
    border: none;
    padding: 10px 14px;
    border-radius: 8px;
    font-weight: 500;
    text-align: left;
    font-size: 13px;
}
.connect-btn-resp.empty {
 background: rgba(47, 53, 66, 0.7);
 cursor: default;
}
/* - ДЕСКТОПНЫЙ ВИД (для экранов шире 800px) - */
@media (min-width: 800px) {
    .trade-wrapper-resp {
        flex-direction: row;
        align-items: center;
        padding: 32px;
    }
    /* - ИЗМЕНЕНИЯ ЗДЕСЬ - */
    .trade-modal-resp {
        max-width: 800px;
        width: 100%;
        height: auto; /* <-- ИЗМЕНЕНО: Высота зависит от контента */
        min-height: 150px; /* <-- ДОБАВЛЕНО: Минимальная высота для эстетики */
        max-height: 85vh; /* <-- ОСТАВЛЕНО: Ограничение максимальной высоты */
    }
    .trade-modal-header-resp {
 cursor: move;
 padding: 16px 24px;
}
    .trade-modal-content-resp {
 padding: 8px 24px;
}
    .trade-modal-footer-resp {
 padding: 16px 24px;
 padding-bottom: 16px;
}
    .both-nicks-btn-resp {
 width: auto;
}
    /* Табличный вид логов на ПК */
    .trade-row-resp {
        display: grid;
        grid-template-columns: 150px 180px 1fr;
        gap: 16px;
    }
    .trade-player-info {
 display: contents;
}
    .trade-player-resp {
 margin-bottom: 0;
}
    .trade-desc-resp {
 font-size: 13px;
}
    /* Панель подключения сбоку на ПК */
    .connect-panel-resp {
        width: 340px;
        flex-shrink: 0;
        margin: 0;
        height: auto;
        max-height: 85vh;
        overflow-y: auto;
    }
}`;
  const style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
  function formatTime(iso) {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}| ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  }
  async function globalThrottle() {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < REQUEST_DELAY_MS) {
      const delay = REQUEST_DELAY_MS - timeSinceLastRequest;
      showWaitMessage(delay);
      await new Promise(resolve => setTimeout(resolve, delay));
      hideWaitMessage();
    }
    lastRequestTime = Date.now();
  }
  function showWaitMessage(delayMs) {
    Object.values(openModals).forEach(modal => {
      const content = modal.querySelector('.trade-modal-content-resp');
      if (content) {
        let waitMsg = content.querySelector('.request-waiting-resp');
        if (!waitMsg) {
          waitMsg = document.createElement('div');
          waitMsg.className = 'request-waiting-resp';
          content.insertBefore(waitMsg, content.firstChild);
        }
        waitMsg.textContent = `Ожидание ${Math.ceil(delayMs / 1000)} сек...`;
      }
    });
  }
  function hideWaitMessage() {
    Object.values(openModals).forEach(modal => {
      const waitMsg = modal.querySelector('.request-waiting-resp');
      if (waitMsg)
        waitMsg.remove();
    });
  }
  async function loadConnectData(nick, tradeTime) {
    await globalThrottle();
    const tradeDate = new Date(tradeTime);
    const startDate = new Date(tradeDate.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const endDate = new Date(tradeDate.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const url = `https://logs.blackrussia.online/gslogs/${SERVER_ID}/api/list-game-logs/?category_id__exact=38&player_name__exact=${encodeURIComponent(nick)}&time__gte=${startDate}&time__lte=${endDate}&order_by=time&offset=0&auto=false`;
    return new Promise((resolve) => {
      fetch(url).then(response => {
        if (response.status !== 200) {
          console.error(`[BR-Viewer] API Error: ${response.status} for ${url}`);
          return resolve({
            nick,
            appmdid: null,
            level: null,
            playerIp: null
          });
        }
        return response.json();
      }).then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          return resolve({
            nick,
            appmdid: null,
            level: null,
            playerIp: null
          });
        }
        let appmdid = null, level = null, playerIp = null;
        let closestConnectTime = null, closestDisconnectTime = null;
        for (const item of data) {
          const itemTime = new Date(item.time).getTime();
          if (/подключился/i.test(item.transaction_desc)) {
            if (itemTime <= tradeDate.getTime() && (!closestConnectTime || itemTime > closestConnectTime)) {
              const match = item.transaction_desc.match(/APPMDID:\s*([A-Za-z0-9_-]+)/i);
              if (match) {
                appmdid = match[1];
                playerIp = item.player_ip;
                closestConnectTime = itemTime;
              }
            }
          }
          if (/отключился/i.test(item.transaction_desc)) {
            const timeDiff = Math.abs(itemTime - tradeDate.getTime());
            if (!closestDisconnectTime || timeDiff < Math.abs(closestDisconnectTime - tradeDate.getTime())) {
              const levelMatch = item.transaction_desc.match(/Уровень:\s*(\d+)/i);
              if (levelMatch) {
                level = levelMatch[1];
                if (!playerIp)
                  playerIp = item.player_ip;
                closestDisconnectTime = itemTime;
              }
            }
          }
        }
        resolve({
          nick,
          appmdid,
          level,
          playerIp
        });
      }).catch(error => {
        console.error('[BR-Viewer] Network error loading connection logs for ' + nick, error);
        resolve({
          nick,
          appmdid: null,
          level: null,
          playerIp: null
        });
      });
    });
  }
  function createConnectPanel(playerData, wrapper) {
    // Remove loading indicators
    wrapper.querySelectorAll('.connect-panel-resp').forEach(el => el.remove());
    const panel = document.createElement('div');
    panel.className = 'connect-panel-resp';
    let hasData = false;
    playerData.forEach(player => {
      if (player.appmdid) {
        hasData = true;
        const btn = document.createElement('button');
        btn.className = 'connect-btn-resp';
        btn.textContent = player.nick + ' | APPMDID: ' + player.appmdid;
        btn.onclick = () => {
          navigator.clipboard.writeText(player.appmdid).then(() => {
            const originalText = btn.textContent;
            btn.textContent = player.nick + ' | Скопировано!';
            setTimeout(() => btn.textContent = originalText, 1500);
          }).catch(err => console.error('[BR-Viewer] Could not copy APPMDID: ', err));
        };
        panel.appendChild(btn);
      }
      if (player.level) {
        hasData = true;
        const info = document.createElement('div');
        info.className = 'connect-btn-resp';
        info.textContent = player.nick + ' | Уровень: ' + player.level;
        panel.appendChild(info);
      }
      if (player.playerIp) {
        hasData = true;
        const info = document.createElement('div');
        info.className = 'connect-btn-resp';
        info.textContent = player.nick + ' | IP: ' + player.playerIp;
        panel.appendChild(info);
      }
    });
    if (!hasData) {
      panel.innerHTML = '<div class="loading-resp">Данные подключения не найдены.</div>';
    }
    const modalContent = wrapper.querySelector('.trade-modal-content-resp');
    const footer = wrapper.querySelector('.trade-modal-footer-resp');
    if (window.innerWidth < 800) {
      footer.appendChild(panel);
    } else {
      wrapper.appendChild(panel);
    }
  }
  function createModal(tradeID) {
    if (openModals[tradeID])
      return;
    const overlay = document.createElement("div");
    overlay.className = "trade-modal-overlay-resp";
    overlay.dataset.tradeId = tradeID;
    const wrapper = document.createElement("div");
    wrapper.className = "trade-wrapper-resp";
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-modal', 'true');
    wrapper.setAttribute('aria-labelledby', `trade-modal-title-${tradeID}`);
    const modal = document.createElement("div");
    modal.className = "trade-modal-resp";
    const header = document.createElement("div");
    header.className = "trade-modal-header-resp";
    const title = document.createElement("h3");
    title.className = "trade-modal-title-resp";
    title.id = `trade-modal-title-${tradeID}`;
    title.textContent = "Логи трейда #" + tradeID;
    const closeBtn = document.createElement("button");
    closeBtn.className = "trade-modal-close-resp";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute('aria-label', 'Закрыть окно');
    let offsetX, offsetY, isDragging = false;
    const dragStart = (e) => {
      if (window.innerWidth < 800 || e.target === closeBtn)
        return;
      const rect = modal.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      isDragging = true;
      document.body.style.userSelect = 'none';
    };
    const drag = (e) => {
      if (isDragging) {
        e.preventDefault();
        modal.style.left = (e.clientX - offsetX) + 'px';
        modal.style.top = (e.clientY - offsetY) + 'px';
        modal.style.transform = 'none';
      }
    };
    const dragEnd = () => {
      isDragging = false;
      document.body.style.userSelect = '';
    };
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    closeBtn.onclick = () => {
      modal.classList.remove('visible');
      overlay.classList.remove('visible');
      setTimeout(() => {
        overlay.remove();
        delete openModals[tradeID];
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleOutsideClick);
      }, 300);
    };
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        closeBtn.onclick();
      }
    }
    function handleOutsideClick(e) {
      if (wrapper && !wrapper.contains(e.target)) {
        closeBtn.onclick();
      }
    }
    header.appendChild(title);
    header.appendChild(closeBtn);
    const content = document.createElement("div");
    content.className = "trade-modal-content-resp";
    content.innerHTML = '<div class="loading-resp">Загрузка логов...</div>';
    const footer = document.createElement("div");
    footer.className = "trade-modal-footer-resp";
    modal.appendChild(header);
    modal.appendChild(content);
    modal.appendChild(footer);
    wrapper.appendChild(modal);
    overlay.appendChild(wrapper);
    document.body.appendChild(overlay);
    openModals[tradeID] = overlay;
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
      wrapper.classList.add('visible');
    });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);
    (async () => {
      await globalThrottle();
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
      const now = new Date().toISOString();
      const url = `https://logs.blackrussia.online/gslogs/${SERVER_ID}/api/list-game-logs/?transaction_desc__ilike=%25TradeID%3A+${tradeID}%25&time__gte=${fiveDaysAgo}&time__lte=${now}&order_by=time&offset=0&auto=false`;
      fetch(url).then(response => {
        if (response.status !== 200) {
          content.innerHTML = '<div class="error-resp">Ошибка загрузки: ' + response.status + '</div>';
          return;
        }
        return response.json();
      }).then(data => {
        content.innerHTML = '';
        if (!Array.isArray(data) || data.length === 0) {
          content.innerHTML = '<div class="loading-resp">Логи трейда не найдены.</div>';
          return;
        }
        const tradeTime = data[0].time;
        data.forEach(item => {
          const row = document.createElement("div");
          row.className = "trade-row-resp";
          row.innerHTML = `
        <div class="trade-player-info">
            <span class="trade-player-resp">${item.player_name}</span>
            <span class="trade-time-resp">${formatTime(item.time)}</span>
        </div>
        <div class="trade-desc-resp">${item.transaction_desc}</div>`;
          content.appendChild(row);
        });
        const uniquePlayers = [...new Set(data.map(i => i.player_name))].slice(0, 2);
        if (uniquePlayers.length === 2) {
          footer.innerHTML = `<span style="color:var(--text-secondary); font-size:12px; font-style:italic;">Кнопка загрузки данных появится через ${SHOW_CONNECT_BTN_DELAY_MS / 1000} с перед запросом...</span>`;
          setTimeout(async () => {
            footer.innerHTML = '';
            const connectBtn = document.createElement('button');
            connectBtn.className = 'both-nicks-btn-resp';
            connectBtn.textContent = 'Загрузить данные игроков';
            footer.appendChild(connectBtn);
            connectBtn.onclick = async () => {
              connectBtn.disabled = true;
              connectBtn.textContent = 'Загрузка...';
              try {
                const results = await Promise.allSettled([
                  loadConnectData(uniquePlayers[0], tradeTime),
                  loadConnectData(uniquePlayers[1], tradeTime)
                ]);
                const playerData = results.map(r => r.status === 'fulfilled' ? r.value : null).filter(Boolean);
                createConnectPanel(playerData, wrapper);
                connectBtn.remove();
              } catch (error) {
                console.error('[BR-Viewer] Error loading connection data:', error);
                connectBtn.textContent = "Ошибка загрузки";
                setTimeout(() => {
                  connectBtn.disabled = false;
                  connectBtn.textContent = `Повторить загрузку`;
                }, 3000);
              }
            };
          }, SHOW_CONNECT_BTN_DELAY_MS);
        } else {
          footer.innerHTML = `<span style="color:#777; font-size:12px;">Участники трейда не определены (${uniquePlayers.length} найдено).</span>`;
        }
      }).catch(err => {
        content.innerHTML = '<div class="error-resp">Ошибка соединения.</div>';
        console.error("[BR-Viewer] Network error loading trade logs #" + tradeID, err);
      });
    })();
  }
  function attachTradeButtons() {
    const tradeRegex = /TradeID:\s*(\d+)/g;
    document.querySelectorAll('td:not([class*="-resp"])').forEach(cell => {
      if (cell.textContent.includes('TradeID:') && !cell.querySelector('.trade-btn-resp')) {
        const tradeIDs = [...new Set(Array.from(cell.textContent.matchAll(tradeRegex), m => m[1]))];
        tradeIDs.forEach(id => {
          if (!cell.querySelector(`.trade-btn-resp[data-trade='${id}']`)) {
            const btn = document.createElement("button");
            btn.className = "trade-btn-resp";
            btn.dataset.trade = id;
            btn.textContent = "Трейд #" + id;
            btn.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              createModal(id);
            };
            cell.appendChild(btn);
          }
        });
      }
    });
  }
  attachTradeButtons();
  setInterval(attachTradeButtons, 1000);
}());
