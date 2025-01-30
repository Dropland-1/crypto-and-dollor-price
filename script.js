const apiUrl = 'https://hadiapex.pythonanywhere.com'; // آدرس API بک‌اند

let previousPrices = {
    dollor: null,
    notcoin: null,
    toncoin: null,
    bitcoin: null
};

async function fetchPrices() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

function updatePriceElement(element, currentPrice, previousPrice, currencyName) {
    if (previousPrice !== null) {
        if (currentPrice > previousPrice) {
            element.innerHTML = `قیمت ${currencyName}: ${currentPrice.toLocaleString()} تومان <span class="green">(▲)</span>`;
            element.classList.remove('red');
            element.classList.add('green');
        } else if (currentPrice < previousPrice) {
            element.innerHTML = `قیمت ${currencyName}: ${currentPrice.toLocaleString()} تومان <span class="red">(▼)</span>`;
            element.classList.remove('green');
            element.classList.add('red');
        } else {
            element.innerHTML = `قیمت ${currencyName}: ${currentPrice.toLocaleString()} تومان`;
            element.classList.remove('green', 'red');
        }
    } else {
        element.innerHTML = `قیمت ${currencyName}: ${currentPrice.toLocaleString()} تومان`;
        element.classList.remove('green', 'red');
    }
}

async function updatePrices() {
    try {
        const prices = await fetchPrices();

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
    } catch (error) {
        console.error("خطا در دریافت قیمت‌ها:", error);
    }
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
