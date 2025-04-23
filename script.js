let cart = [];
const cartElement = document.getElementById("cart");
const cartItemsElement = document.getElementById("cart-items");
const totalElement = document.getElementById("total");
const openCartBtn = document.getElementById("open-cart");

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
}

function updateCart() {
  cartItemsElement.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price}₽`;
    cartItemsElement.appendChild(li);
    total += item.price;
  });
  totalElement.textContent = total;
}

function clearCart() {
  cart = [];
  updateCart();
}

function toggleCart() {
  cartElement.classList.toggle("show");
}

openCartBtn.addEventListener("click", toggleCart);

function checkout() {
  const username = document.getElementById("username").value.trim();
  const name = document.getElementById("name").value.trim();

  if (!username || !name) {
    alert("Пожалуйста, заполните имя и Telegram.");
    return;
  }

  if (cart.length === 0) {
    alert("Корзина пуста.");
    return;
  }

  const message = cart.map(item => `• ${item.name} - ${item.price}₽`).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const fullMessage = `🛒 Новый заказ:\n\n${message}\n\nИтого: ${total}₽\n\n👤 Имя: ${name}\n📱 Telegram: ${username}`;

  const botToken = '8036268451:AAHRqsq-VKxVjKff2I2JrmSGR-mLTcuyLts';
  const chatId = '1002520560909';

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: fullMessage,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📩 Написать покупателю",
              url: `https://t.me/${username.replace('@', '')}`
            }
          ]
        ]
      }
    })
  })
  .then(response => {
    if (response.ok) {
      alert("Заказ отправлен! Мы скоро свяжемся с вами.");
      clearCart();
      document.getElementById("order-form").reset();
      toggleCart();
    } else {
      alert("Ошибка при отправке заказа.");
    }
  })
  .catch(error => {
    alert("Ошибка подключения к Telegram.");
    console.error(error);
  });
}
