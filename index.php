<?php
require_once __DIR__ . '/../includes/config.php';

$stmt = $pdo->query("SELECT * FROM events ORDER BY start_datetime ASC");
$events = $stmt->fetchAll();
?>
<!doctype html>
<html lang="fa">
<head>
  <meta charset="utf-8">
  <title>رویدادلند</title>
  <link rel="stylesheet" href="/roydadland/assets/css/style.css">
</head>
<body>
  <div class="container">
    <h1>رویدادها</h1>
    <div class="events-grid">
    <?php foreach($events as $ev): ?>
      <div class="event-card">
        <?php if($ev['banner']): ?>
          <img src="/roydadland/assets/uploads/<?php echo e($ev['banner']); ?>" alt="">
        <?php endif; ?>
        <div class="event-body">
          <h4><?php echo e($ev['title']); ?></h4>
          <div class="event-meta"><?php echo e($ev['start_datetime']); ?> — <?php echo e($ev['location']); ?></div>
          <div class="event-cta">
            <a href="event.php?id=<?php echo $ev['id']; ?>" class="cta-secondary">جزئیات</a>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
    </div>
  </div>
</body>
</html>
