<?php
require_once __DIR__ . '/../includes/config.php';
// فرض: چک role
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    die('Unauthorized');
}

$registration_id = intval($_POST['registration_id'] ?? 0);
$present = isset($_POST['present']) ? 1 : 0;

$stmt = $pdo->prepare("INSERT INTO attendance (registration_id, present, marked_at) VALUES (?, ?, NOW())
    ON DUPLICATE KEY UPDATE present = VALUES(present), marked_at = VALUES(marked_at)");
$stmt->execute([$registration_id, $present]);

echo 'ok';
?>