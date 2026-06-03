<?php
require_once __DIR__ . '/includes/config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(['success'=>false, 'error'=>'Invalid request']);
  exit;
}

$event_id = intval($_POST['event_id'] ?? 0);
$email = trim($_POST['email'] ?? '');
$name = trim($_POST['name'] ?? '');
$rating = intval($_POST['rating'] ?? 0);
$comment = trim($_POST['comment'] ?? '');

// basic validation
if ($event_id <= 0 || !filter_var($email, FILTER_VALIDATE_EMAIL) || $rating < 1 || $rating > 10 || $comment === '') {
  echo json_encode(['success'=>false, 'error'=>'اطلاعات ناقص یا نامعتبر']);
  exit;
}

// find user by email (optionally create guest user)
$stmt = $pdo->prepare("SELECT id FROM users WHERE university_email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
  // optionally create a lightweight user (guest)
  $password = bin2hex(random_bytes(6));
  $hash = password_hash($password, PASSWORD_DEFAULT);
  $stmt = $pdo->prepare("INSERT INTO users (name, university_email, password_hash, role) VALUES (?, ?, ?, 'student')");
  $stmt->execute([$name ?: 'مهمان', $email, $hash]);
  $user_id = $pdo->lastInsertId();
} else {
  $user_id = $user['id'];
}

// insert comment
$stmt = $pdo->prepare("INSERT INTO comments (user_id, event_id, rating, comment) VALUES (?, ?, ?, ?)");
$stmt->execute([$user_id, $event_id, $rating, $comment]);

echo json_encode(['success'=>true]);
