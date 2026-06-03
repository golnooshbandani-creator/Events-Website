<?php
// public/register.php
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/functions.php';

$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $password2 = $_POST['password2'] ?? '';
    $role = in_array($_POST['role'] ?? 'student', ['student','teacher']) ? $_POST['role'] : 'student';

    if (!$name) $errors[] = 'نام را وارد کنید.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'ایمیل معتبر نیست.';
    if (strlen($password) < 6) $errors[] = 'رمز حداقل 6 کاراکتر باشد.';
    if ($password !== $password2) $errors[] = 'رمزها یکسان نیستند.';

    if (empty($errors)) {
        if (findUserByEmail($email)) {
            $errors[] = 'این ایمیل قبلاً ثبت شده.';
        } else {
            if (createUser($name, $email, $password, $role)) {
                header("Location: login.php?registered=1");
                exit;
            } else {
                $errors[] = 'خطا در ثبت‌نام.';
            }
        }
    }
}
?>
