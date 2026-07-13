// Janus Chat Widget - app
(function () {
  var API_BASE = "https://buf-sat-open-hall.trycloudflare.com"; // Cambiar por URL del tunnel en produccion
  var OPEN = false;
  var STREAMING = false;

  var html =
    '<button id="janus-chat-btn" aria-label="Abrir chat">💬</button>' +
    '<div id="janus-chat-window">' +
      '<div class="janus-chat-header">' +
        '<h3>JANUS</h3>' +
        '<button class="janus-chat-close" id="janus-chat-close" aria-label="Cerrar">✕</button>' +
      "</div>" +
      '<div class="janus-chat-messages" id="janus-chat-msgs">' +
        '<div class="janus-msg bot">!Hola! Soy Janus Bot. ?En que puedo ayudarte sobre JANUS Studio?</div>' +
      "</div>" +
      '<div class="janus-chat-input-area">' +
        '<input class="janus-chat-input" id="janus-chat-input" type="text" placeholder="Escribe tu pregunta..." autocomplete="off">' +
        '<button class="janus-chat-send" id="janus-chat-send" aria-label="Enviar">➤</button>' +
      "</div>" +
      '<div class="janus-chat-powered">' +
        '<a href="https://janus-landing-red.vercel.app" target="_blank">JANUS Studio</a> &middot; Asistente informativo' +
      "</div>" +
    "</div>";

  // Inject HTML
  var container = document.getElementById("janus-chat-widget");
  if (container) {
    container.innerHTML = html;
  } else {
    var div = document.createElement("div");
    div.id = "janus-chat-widget";
    div.innerHTML = html;
    document.body.appendChild(div);
  }

  var btn = document.getElementById("janus-chat-btn");
  var win = document.getElementById("janus-chat-window");
  var close = document.getElementById("janus-chat-close");
  var msgs = document.getElementById("janus-chat-msgs");
  var input = document.getElementById("janus-chat-input");
  var send = document.getElementById("janus-chat-send");

  function toggle() {
    OPEN = !OPEN;
    win.classList.toggle("open", OPEN);
    if (OPEN) {
      btn.textContent = "✕";
      input.focus();
    } else {
      btn.textContent = "💬";
    }
  }

  btn.addEventListener("click", toggle);
  close.addEventListener("click", toggle);

  function addMessage(text, cls) {
    var el = document.createElement("div");
    el.className = "janus-msg " + cls;
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  function getLastBotMsg() {
    var els = msgs.querySelectorAll(".janus-msg.bot");
    return els[els.length - 1] || null;
  }

  function sendQuestion() {
    var q = input.value.trim();
    if (!q || STREAMING) return;

    input.value = "";
    addMessage(q, "user");
    STREAMING = true;
    send.disabled = true;

    var botEl = addMessage("", "bot");
    var fullText = "";
    var dots = 0;
    var dotInterval = setInterval(function () {
      if (!STREAMING) { clearInterval(dotInterval); return; }
      dots = (dots + 1) % 4;
      var dotsStr = "";
      for (var i = 0; i < dots; i++) dotsStr += ".";
      botEl.textContent = fullText || "Pensando" + dotsStr;
    }, 400);

    var url = API_BASE + "/api/chat";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Error " + res.status);
        var reader = res.body.getReader();
        var decoder = new TextDecoder();
        var buffer = "";

        function read() {
          reader.read().then(function (result) {
            if (result.done) {
              clearInterval(dotInterval);
              STREAMING = false;
              send.disabled = false;
              botEl.textContent = fullText;
              msgs.scrollTop = msgs.scrollHeight;
              return;
            }
            buffer += decoder.decode(result.value, { stream: true });
            var lines = buffer.split("\n");
            buffer = lines.pop();

            lines.forEach(function (line) {
              if (line.startsWith("data: ")) {
                try {
                  var data = JSON.parse(line.slice(6));
                  if (data.error) {
                    clearInterval(dotInterval);
                    STREAMING = false;
                    send.disabled = false;
                    botEl.className = "janus-msg error";
                    botEl.textContent = "Error: " + data.error;
                    return;
                  }
                  if (data.token) {
                    fullText += data.token;
                    botEl.textContent = fullText;
                    msgs.scrollTop = msgs.scrollHeight;
                  }
                  if (data.done) {
                    clearInterval(dotInterval);
                    STREAMING = false;
                    send.disabled = false;
                  }
                } catch (e) {
                  // skip parse errors on partial lines
                }
              }
            });
            read();
          }).catch(function (err) {
            clearInterval(dotInterval);
            STREAMING = false;
            send.disabled = false;
            botEl.className = "janus-msg error";
            botEl.textContent = "Error de conexion. Verifica que el backend este corriendo.";
          });
        }
        read();
      })
      .catch(function (err) {
        clearInterval(dotInterval);
        STREAMING = false;
        send.disabled = false;
        botEl.className = "janus-msg error";
        botEl.textContent = "Error: " + err.message;
      });
  }

  send.addEventListener("click", sendQuestion);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendQuestion();
  });
})();
