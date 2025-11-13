const BOT_TOKEN = "7510021990:AAG_idsp9-1pMiOp3Z2X_mJ3SM7DG6vxNJw";
const CHAT_ID = "-1003411716799";

const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("status");

const STATUS_TIMEOUT = 5000;

function renderStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.classList.remove("error", "success");
  if (type) {
    statusEl.classList.add(type);
  }
  if (text) {
    setTimeout(() => {
      if (statusEl.textContent === text) {
        statusEl.textContent = "";
        statusEl.classList.remove("error", "success");
      }
    }, STATUS_TIMEOUT);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();

  if (!BOT_TOKEN || BOT_TOKEN.includes("ВАШ_")) {
    renderStatus("Вкажіть реальний токен бота у script.js.", "error");
    return;
  }

  if (!CHAT_ID || CHAT_ID.includes("ВАШ_")) {
    renderStatus("Вкажіть chat_id для надсилання повідомлень.", "error");
    return;
  }

  const text = [
    "*Нова заявка з сайту*",
    `Ім’я: ${name || "—"}`,
    `Email: ${email || "—"}`,
    "Повідомлення:",
    message || "—",
    "",
    `Надіслано: ${new Intl.DateTimeFormat("uk", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date())}`,
  ].join("\n");

  renderStatus("Sending...", "");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.description || "Произошла ошибка Telegram API");
    }

    renderStatus("Message sent ✅", "success");
    form.reset();
  } catch (error) {
    console.error(error);
    renderStatus(`Failed to send: ${error.message}`, "error");
  }
});
