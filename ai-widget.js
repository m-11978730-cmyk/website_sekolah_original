/* ===== AI Assistant Widget ===== */
(function () {
  const AI_CONFIG = {
    // --- Konfigurasi API AI (OpenAI-compatible) ---
    // Contoh untuk OpenRouter: https://openrouter.ai/api/v1/chat/completions
    // Ganti dengan API endpoint & key sendiri di bawah.
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: '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', // <-- Letakkan API key di sini (cth: sk-...)
    model: 'openrouter/free', // auto-pilih model free yang ada di OpenRouter
    systemPrompt:
      'Kamu adalah pembantu AI untuk laman web sekolah tentang teknologi masa depan (AI, angkasa, satelit, eVTOL, robot, kos tenaga). Jawab dalam Bahasa Melayu dengan ringkas dan jelas. Jika tidak tahu, beritahu secara jujur.',
    context: [
      {
        role: 'system',
        content:
          'Kamu adalah pembantu AI untuk laman web sekolah tentang teknologi masa depan (AI, angkasa, satelit, eVTOL, robot, kos tenaga). Jawab dalam Bahasa Melayu dengan ringkas dan jelas. Jika tidak tahu, beritahu secara jujur.'
      }
    ]
  };

  // ===== Bina elemen widget =====
  const button = document.createElement('button');
  button.className = 'ai-widget-btn';
  button.innerHTML = '<span class="ai-widget-pulse"></span>🤖';
  button.setAttribute('aria-label', 'Buka AI Assistant');
  button.title = 'Tanya AI Assistant';

  const panel = document.createElement('div');
  panel.className = 'ai-widget-panel';
  panel.innerHTML = `
    <div class="ai-widget-header">
      <div class="ai-widget-avatar">🗨️</div>
      <div class="ai-widget-title">AI Assistant</div>
      <div class="ai-widget-status">● Online</div>
      <button class="ai-widget-close" aria-label="Tutup">✕</button>
    </div>
    <div class="ai-widget-messages"></div>
    <div class="ai-widget-input-row">
      <input type="text" class="ai-widget-input" placeholder="Tanya apa-apa..." />
      <button class="ai-widget-send" aria-label="Hantar">➤</button>
    </div>
  `;

  document.body.appendChild(button);
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector('.ai-widget-messages');
  const inputEl = panel.querySelector('.ai-widget-input');
  const sendBtn = panel.querySelector('.ai-widget-send');
  const closeBtn = panel.querySelector('.ai-widget-close');
  const statusEl = panel.querySelector('.ai-widget-status');

  let isOpen = false;

  // ===== Pembuka / penutup =====
  function togglePanel(force) {
    isOpen = typeof force === 'boolean' ? force : !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen) {
      inputEl.focus();
      if (!messagesEl.children.length) {
        addBotMessage('👋 Hai! Saya AI Assistant. Ada apa-apa yang anda tidak faham? Tanya je!');
      }
    }
  }

  button.addEventListener('click', () => togglePanel());
  closeBtn.addEventListener('click', () => togglePanel(false));

  // ===== Mesej =====
  function addMessage(role, text) {
    const el = document.createElement('div');
    el.className = 'ai-widget-msg ' + role;
    el.textContent = text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function addBotMessage(text) {
    return addMessage('bot', text);
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'ai-widget-msg bot loading';
    el.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function removeTyping(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  // ===== Panggilan API =====
  async function askAI(userText) {
    const typingEl = showTyping();

    try {
      const messages = AI_CONFIG.context.concat([{ role: 'user', content: userText }]);

      const response = await fetch(AI_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + AI_CONFIG.apiKey,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Website Sekolah AI Assistant'
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      removeTyping(typingEl);

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error('API error ' + response.status + ': ' + errText.slice(0, 200));
      }

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content?.trim();
      if (!answer) throw new Error('Tiada jawapan dari AI');

      AI_CONFIG.context.push({ role: 'user', content: userText });
      AI_CONFIG.context.push({ role: 'assistant', content: answer });
      if (AI_CONFIG.context.length > 20) {
        AI_CONFIG.context = AI_CONFIG.context.slice(-20);
      }

      addBotMessage(answer);
    } catch (err) {
      removeTyping(typingEl);
      addBotMessage('⚠️ Gagal berhubung dengan AI: ' + err.message);
      statusEl.textContent = '● Error';
      statusEl.style.color = '#f87171';
    }
  }

  // ===== Hantar mesej =====
  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    addMessage('user', text);
    sendBtn.disabled = true;

    if (!AI_CONFIG.apiKey) {
      setTimeout(() => {
        sendBtn.disabled = false;
        addBotMessage(
          '⚠️ API key belum diset. Buka fail <b>ai-widget.js</b> dan letakkan API key anda dalam <b>AI_CONFIG.apiKey</b>. Anda boleh dapat API key percuma di openrouter.ai.'
        );
      }, 400);
      return;
    }

    askAI(text).finally(() => {
      sendBtn.disabled = false;
    });
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();