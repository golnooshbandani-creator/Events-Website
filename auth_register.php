<?php
// جلوگیری از دسترسی مستقیم
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: register.html");
    exit;
}

// اتصال به دیتابیس
$host = "localhost";
$dbname = "roydadland_db";
$user = "root";
$pass = "";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    die("خطا در اتصال به دیتابیس: " . $e->getMessage());
}

// دریافت داده‌ها
$fullname = trim($_POST['fullname'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirm_password = $_POST['confirm_password'] ?? '';
$role = $_POST['role'] ?? '';

// اعتبارسنجی اولیه
if (empty($fullname) || empty($email) || empty($password) || empty($confirm_password) || empty($role)) {
    die("همه فیلدها الزامی هستند");
}

// بررسی نقش
if (!in_array($role, ['student', 'teacher'])) {
    die("نقش کاربر نامعتبر است");
}

// بررسی تطابق رمز عبور
if ($password !== $confirm_password) {
    die("رمز عبور و تکرار آن یکسان نیست");
}

// حداقل طول رمز
if (strlen($password) < 6) {
    die("رمز عبور باید حداقل ۶ کاراکتر باشد");
}

// بررسی ایمیل دانشگاهی (نمونه ساده)
if (!str_ends_with($email, '.ac.ir')) {
    die("ایمیل دانشگاهی معتبر نیست");
}

// بررسی تکراری نبودن ایمیل
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->rowCount() > 0) {
    die("این ایمیل قبلاً ثبت‌نام شده است");
}

// هش کردن رمز عبور
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// درج در دیتابیس
$insert = $pdo->prepare("INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)");
$insert->execute([$fullname, $email, $hashedPassword, $role]);

// موفقیت → بازگشت به صفحه ورود
header("Location: login.html?register=success");
exit;
