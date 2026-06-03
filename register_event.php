<?php
require_once __DIR__ . '/../includes/config.php';

// فقط کاربران لاگین میتونن ثبت‌نام کنن
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$event_id = intval($_POST['event_id'] ?? 0);

if ($event_id <= 0) {
    die('رویداد نامعتبر.');
}

// چک کن قبلاً ثبت‌نام نشده
$stmt = $pdo->prepare("SELECT * FROM registrations WHERE user_id=? AND event_id=?");
$stmt->execute([$user_id, $event_id]);
if ($stmt->fetch()) {
    $_SESSION['flash'] = 'قبلاً ثبت‌نام کرده‌اید.';
    header("Location: event.php?id={$event_id}");
    exit;
}

// ثبت‌نام
$stmt = $pdo->prepare("INSERT INTO registrations (user_id, event_id) VALUES (?, ?)");
$stmt->execute([$user_id, $event_id]);

$_SESSION['flash'] = 'ثبت‌نام با موفقیت انجام شد.';
header("Location: event.php?id={$event_id}");
exit;
