// فایل: survey.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. انتخاب عناصر
    const form = document.getElementById('surveyForm');
    const emailInput = document.getElementById('user-email');
    const commentTextarea = document.getElementById('feedback-improve');
    const ratingGroup = document.getElementById('ratingGroup'); // برای پیدا کردن رادیو باتن‌ها

    if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('user-email').value.trim();
    const comment = document.getElementById('feedback-improve').value.trim();
    const rating = document.querySelector('input[name="rating"]:checked');

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}


    if (!validateEmail(email)) { alert('ایمیل معتبر نیست'); return; }
    if (!comment) { alert('پیام خالی است'); return; }
    if (!rating) { alert('به رویداد امتیاز بده'); return; }

        const fd = new FormData(form);
    try {
      const res = await fetch('submit_survey.php', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (data.success) {
        alert('نظر شما ثبت شد ✅');
        form.reset();
      } else {
        alert(data.error || 'خطا در ثبت');
      }
    } catch (err) {
      alert('خطا در ارتباط با سرور');
    }
  });



    
    // انتخاب محل‌های نمایش خطا و وضعیت
    const emailError = document.getElementById('emailError');
    const commentError = document.getElementById('commentError');
    const ratingError = document.getElementById('ratingError');
    const formStatusMessage = document.getElementById('formStatusMessage');

    // 2. تابع اعتبارسنجی ایمیل با استفاده از Regex
    function validateEmail(email) {
        // Regex استاندارد برای بررسی فرمت ایمیل 
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // 3. تابع اعتبارسنجی کلی
    function validateForm(event) {
        event.preventDefault(); // جلوگیری از ارسال پیش‌فرض فرم

        // پاک کردن پیام‌های قبلی
        formStatusMessage.textContent = '';
        emailError.textContent = '';
        commentError.textContent = '';
        ratingError.textContent = '';
        formStatusMessage.style.color = 'initial';
        
        let isValid = true;
        let errors = {};

        // بررسی ۱: فیلد ایمیل خالی نباشد و فرمت درست داشته باشد [cite: 10, 11]
        if (emailInput.value.trim() === '') {
            errors.email = 'لطفاً آدرس ایمیل خود را وارد کنید.';
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            errors.email = 'فرمت ایمیل وارد شده صحیح نیست.';
            isValid = false;
        }

        // بررسی ۲: فیلد کامنت (پیشنهاد/انتقاد) خالی نباشد [cite: 10]
        if (commentTextarea.value.trim() === '') {
            errors.comment = 'لطفاً پیشنهاد یا انتقاد خود را وارد کنید.';
            isValid = false;
        }
        
        // بررسی ۳: پاسخ به سوالات چهارگزینه‌ای (Radio Group) داده شده باشد [cite: 10]
        const ratingRadios = ratingGroup.querySelectorAll('input[type="radio"][name="rating"]');
        let isRatingSelected = Array.from(ratingRadios).some(radio => radio.checked);
        
        if (!isRatingSelected) {
            errors.rating = 'لطفاً به سوال ارزیابی نمره دهید.';
            isValid = false;
        }

        // نمایش خطاها
        if (errors.email) { emailError.textContent = errors.email; }
        if (errors.comment) { commentError.textContent = errors.comment; }
        if (errors.rating) { ratingError.textContent = errors.rating; }


        // نتیجه نهایی اعتبارسنجی
        if (isValid) {
            // اعتبارسنجی موفقیت‌آمیز بود 
            
            // نمایش پیام موفقیت
            formStatusMessage.textContent = 'نظر شما ارسال شد.';
            formStatusMessage.style.color = '#4CAF50'; // سبز

            // توجه: چون در حال حاضر بک‌اند واقعی نداریم، فقط پیام را نمایش می‌دهیم.
            // در پروژه‌های واقعی، اینجا باید اطلاعات را با fetch/axios به سرور بفرستید.

            // ذخیره اطلاعات (برای بخش بعدی: LocalStorage)
            saveCommentToLocalStorage(
                document.getElementById('event-select').value, 
                commentTextarea.value, 
                document.querySelector('input[name="rating"]:checked').value 
            );

            // پاک کردن فرم (اختیاری)
            form.reset();

        } else {
            // اعتبارسنجی ناموفق بود. هیچ کاری برای سابمیت انجام نمی‌شود.
            formStatusMessage.textContent = 'لطفاً موارد مشخص شده را اصلاح کنید.';
            formStatusMessage.style.color = '#ff5252'; // قرمز
        }
    }

    // 4. اتصال تابع اعتبارسنجی به رویداد سابمیت فرم
    form.addEventListener('submit', validateForm);
    
    // **********************************************
    // این بخش برای LocalStorage است (بند ۴ پروژه)
    // **********************************************
    function saveCommentToLocalStorage(event_id, comment_text, rating) {
        // ساخت یک شی برای نظر جدید
        const newComment = {
            comment: comment_text,
            rating: rating,
            timestamp: new Date().toISOString()
        };

        // کلید LocalStorage را بر اساس event_id تعریف می‌کنیم
        const storageKey = `comments_for_${event_id}`;
        
        // دریافت نظرات ذخیره شده قبلی (اگر وجود داشته باشد)
        let comments = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        // اضافه کردن نظر جدید
        comments.push(newComment);

        // ذخیره مجدد در LocalStorage [cite: 18, 19]
        localStorage.setItem(storageKey, JSON.stringify(comments));
    }
});