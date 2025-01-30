const apiUrl = 'https://cors-anywhere.herokuapp.com/https://hadiapex.pythonanywhere.com/prices'; // آدرس API بک‌اند

let previousPrices = {
    dollor: null,
    notcoin: null,
    toncoin: null,
    bitcoin: null
};

async function fetchPrices() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('خطا در دریافت داده‌ها');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("خطا در دریافت قیمت‌ها:", error);
        return null;
    }
}

function updatePriceElement(element, currentPrice, previousPrice, currencyName) {
    if (currentPrice === null) {
        element.innerHTML = `قیمت ${currencyName}: خطا در دریافت داده‌ها`;
        element.classList.remove('green', 'red');
        return;
    }

    const price = Math.round(currentPrice); // حذف اعشار و گرد کردن قیمت
    if (previousPrice !== null) {
        if (price > previousPrice) {
            element.innerHTML = `قیمت ${currencyName}: ${price.toLocaleString()} تومان <span class="green">(▲)</span>`;
            element.classList.remove('red');
            element.classList.add('green');
        } else if (price < previousPrice) {
            element.innerHTML = `قیمت ${currencyName}: ${price.toLocaleString()} تومان <span class="red">(▼)</span>`;
            element.classList.remove('green');
            element.classList.add('red');
        } else {
            element.innerHTML = `قیمت ${currencyName}: ${price.toLocaleString()} تومان`;
            element.classList.remove('green', 'red');
        }
    } else {
        element.innerHTML = `قیمت ${currencyName}: ${price.toLocaleString()} تومان`;
        element.classList.remove('green', 'red');
    }
}

async function updatePrices() {
    const prices = await fetchPrices();
    if (prices === null) {
        return; // اگر داده‌ها دریافت نشدند، ادامه نده
    }

    const dollorElement = document.getElementById('dollor-price');
    const notcoinElement = document.getElementById('notcoin-price');
    const toncoinElement = document.getElementById('toncoin-price');
    const bitcoinElement = document.getElementById('bitcoin-price');

    updatePriceElement(dollorElement, prices.dollor, previousPrices.dollor, 'دلار');
    updatePriceElement(notcoinElement, prices.notcoin, previousPrices.notcoin, 'نات کوین');
    updatePriceElement(toncoinElement, prices.toncoin, previousPrices.toncoin, 'تون کوین');
    updatePriceElement(bitcoinElement, prices.bitcoin, previousPrices.bitcoin, 'بیت کوین');

    previousPrices.dollor = prices.dollor;
    previousPrices.notcoin = prices.notcoin;
    previousPrices.toncoin = prices.toncoin;
    previousPrices.bitcoin = prices.bitcoin;
}

function startTimer(seconds) {
    const timerElement = document.getElementById('timer');
    let remainingSeconds = seconds;

    const interval = setInterval(() => {
        remainingSeconds--;
        timerElement.textContent = `زمان تا به‌روزرسانی بعدی: ${remainingSeconds} ثانیه`;

        if (remainingSeconds <= 0) {
            clearInterval(interval);
            updatePrices();
            startTimer(30);
        }
    }, 1000);
}

// اولین فراخوانی
updatePrices();
startTimer(30);
