// Janus Chat Widget - app
(function () {
  var API_BASE = "https://app.janusdubber.website";
  var OPEN = false;
  var STREAMING = false;

  function t(key) {
    return typeof window.janusT === "function" ? window.janusT(key) : key;
  }

  var html =
    '<button id="janus-chat-btn" aria-label="' + t("chat.open_aria") + '">💬</button>' +
    '<div id="janus-chat-window">' +
      '<div class="janus-chat-header">' +
        '<h3>JANUS</h3>' +
        '<button class="janus-chat-close" id="janus-chat-close" aria-label="' + t("chat.close_aria") + '">✕</button>' +
      "</div>" +
      '<div class="janus-chat-messages" id="janus-chat-msgs">' +
        '<div class="janus-msg bot" id="janus-chat-greeting">' + t("chat.greeting") + "</div>" +
      "</div>" +
      '<div class="janus-chat-input-area">' +
        '<input class="janus-chat-input" id="janus-chat-input" type="text" placeholder="' + t("chat.placeholder") + '" autocomplete="off">' +
        '<button class="janus-chat-send" id="janus-chat-send" aria-label="' + t("chat.send_aria") + '">➤</button>' +
      "</div>" +
      '<div class="janus-chat-powered">' +
        '<a href="https://www.janusdubber.website" target="_blank">JANUS</a> &middot; <span id="janus-chat-powered-text">' + t("chat.powered") + "</span>" +
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
      botEl.textContent = fullText || t("chat.thinking") + dotsStr;
    }, 400);

    var url = API_BASE + "/api/chat";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q }),
    })
      .then(function (res) {
        if (!res.ok) {
          return res
            .json()
            .catch(function () {
              return null;
            })
            .then(function (body) {
              if (body && body.status === "maintenance") {
                throw { maintenance: true, message: body.message };
              }
              throw new Error("Error " + res.status);
            });
        }
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
                    botEl.textContent = t("chat.error_prefix").replace("%s", data.error);
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
            botEl.textContent = t("chat.err_connect");
          });
        }
        read();
      })
      .catch(function (err) {
        clearInterval(dotInterval);
        STREAMING = false;
        send.disabled = false;
        if (err && err.maintenance) {
          botEl.className = "janus-msg error";
          botEl.textContent =
            (err.message || t("chat.err_maintenance")) +
            " " + t("chat.err_maintenance_back");
          return;
        }
        botEl.className = "janus-msg error";
        botEl.textContent = t("chat.error_prefix").replace("%s", err.message);
      });
  }

  send.addEventListener("click", sendQuestion);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendQuestion();
  });

  document.addEventListener("janus:langchange", function () {
    var greeting = document.getElementById("janus-chat-greeting");
    if (greeting) greeting.textContent = t("chat.greeting");
    var powered = document.getElementById("janus-chat-powered-text");
    if (powered) powered.textContent = t("chat.powered");
    input.setAttribute("placeholder", t("chat.placeholder"));
    btn.setAttribute("aria-label", t("chat.open_aria"));
    close.setAttribute("aria-label", t("chat.close_aria"));
    send.setAttribute("aria-label", t("chat.send_aria"));
  });
})();
