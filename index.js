// فایل: index.js
// منطق: اسلایدر محوشونده + شمارش معکوس + انتخاب تم

// **********************************************
// ۱. شمارش معکوس (Countdown Timer)
// **********************************************
function setupCountdownTimer() {
    const countdownWrapper = document.getElementById('countdownWrapper');
    if (!countdownWrapper) return; // اگر وجود ندارد، خارج شو

    const targetDateString = countdownWrapper.dataset.targetDate;
    const countdownDisplay = document.getElementById('countdownTimer');
    const registerCta = document.getElementById('registerCta');

    const targetDate = new Date(targetDateString).getTime();
    if (isNaN(targetDate)) {
        countdownDisplay.innerHTML = '<span class="event-passed-message">تاریخ رویداد نامعتبر است.</span>';
        return;
    }

    const interval = setInterval(() => {
        const now = Date.now();
        const distance = targetDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownDisplay.innerHTML = `
                <div class="countdown-box"><span class="countdown-value">${days}</span><span class="countdown-label">روز</span></div>
                <div class="countdown-box"><span class="countdown-value">${hours.toString().padStart(2,'0')}</span><span class="countdown-label">ساعت</span></div>
                <div class="countdown-box"><span class="countdown-value">${minutes.toString().padStart(2,'0')}</span><span class="countdown-label">دقیقه</span></div>
                <div class="countdown-box"><span class="countdown-value">${seconds.toString().padStart(2,'0')}</span><span class="countdown-label">ثانیه</span></div>
            `;
        } else {
            clearInterval(interval);
            countdownDisplay.innerHTML = '<span class="event-passed-message">این رویداد به پایان رسید.</span>';

            if (registerCta) {
                registerCta.textContent = 'ثبت‌نام بسته شد';
                registerCta.classList.replace('cta-primary', 'cta-secondary');
                registerCta.style.opacity = '0.7';
                registerCta.style.cursor = 'not-allowed';
                registerCta.href = '#';
            }
        }
    }, 1000);
}

// **********************************************
// ۲. انتخاب تم (Theme Selection)
// **********************************************
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const root = document.documentElement;
    const localStorageKey = 'theme';
    const lightThemeClass = 'light-theme';
    const darkThemeClass = 'dark-theme';

    // بارگذاری تم ذخیره‌شده
    function loadTheme() {
        const savedTheme = localStorage.getItem(localStorageKey);
        if (savedTheme === lightThemeClass) {
            root.classList.add(lightThemeClass);
            themeToggle.textContent = '☀️';
        } else {
            root.classList.remove(lightThemeClass);
            themeToggle.textContent = '🌙';
        }
    }

    // سوئیچ تم
    function toggleTheme() {
        const isLight = root.classList.toggle(lightThemeClass);
        localStorage.setItem(localStorageKey, isLight ? lightThemeClass : darkThemeClass);
        themeToggle.textContent = isLight ? '☀️' : '🌙';
    }

    themeToggle.addEventListener('click', toggleTheme);
    loadTheme();
}

// **********************************************
// ۳. اسلایدر محوشونده
// **********************************************
function setupSlider() {
    const slides = document.querySelectorAll(".slide");
    const nextButton = document.querySelector(".next-btn");
    const prevButton = document.querySelector(".prev-btn");
    const dotContainer = document.querySelector(".dot-indicators");

    if (!slides.length) return;

    let currentSlide = 0;
    const intervalTime = 5000;
    let timer;

    // ایجاد دات‌ها
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            showSlide(i);
            resetTimer();
        });
        dotContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');

    function showSlide(n) {
        if (n >= slides.length) n = 0;
        if (n < 0) n = slides.length - 1;

        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        slides[n].classList.add('active');
        dots[n].classList.add('active');

        currentSlide = n;
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function startTimer() { timer = setInterval(nextSlide, intervalTime); }
    function resetTimer() { clearInterval(timer); startTimer(); }

    nextButton?.addEventListener('click', () => { nextSlide(); resetTimer(); });
    prevButton?.addEventListener('click', () => { showSlide(currentSlide - 1); resetTimer(); });

    showSlide(currentSlide);
    startTimer();
}

// **********************************************
// ۴. بارگذاری DOM
// **********************************************
document.addEventListener("DOMContentLoaded", () => {
    setupSlider();
    setupCountdownTimer();
    setupThemeToggle();
});


// ===========================================================
// Countdown Timer for Multiple Event Cards — Responsive & Animated
// ===========================================================
function initializeCountdowns() {
    const countdownWrappers = document.querySelectorAll('.event-card .countdown-wrapper');

    countdownWrappers.forEach(wrapper => {
        const targetDateStr = wrapper.getAttribute('data-target-date');
        if (!targetDateStr) return;

        const countdownTimer = document.createElement('div');
        countdownTimer.classList.add('countdown-timer');
        wrapper.appendChild(countdownTimer);

        // Create boxes for Days, Hours, Minutes, Seconds
        const labels = ['روز', 'ساعت', 'دقیقه', 'ثانیه'];
        labels.forEach(label => {
            const box = document.createElement('div');
            box.classList.add('countdown-box');
            box.innerHTML = `<span class="countdown-value">00</span><span class="countdown-label">${label}</span>`;
            countdownTimer.appendChild(box);
        });

        const interval = setInterval(() => {
            const now = new Date();
            const targetDate = new Date(targetDateStr);
            let diff = targetDate - now;

            if (diff <= 0) {
                clearInterval(interval);
                countdownTimer.innerHTML = '<span class="event-passed-message">رویداد آغاز شد!</span>';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            const values = [days, hours, minutes, seconds];

            // Animate value change
            countdownTimer.querySelectorAll('.countdown-value').forEach((el, idx) => {
                if (el.textContent !== values[idx].toString().padStart(2, '0')) {
                    el.style.transform = 'translateY(-10px)';
                    el.style.opacity = '0';
                    setTimeout(() => {
                        el.textContent = values[idx].toString().padStart(2, '0');
                        el.style.transform = 'translateY(0)';
                        el.style.opacity = '1';
                    }, 150);
                }
            });
        }, 1000);
    });
}

// Initialize countdowns after page load
document.addEventListener('DOMContentLoaded', () => {
    initializeCountdowns();
});
