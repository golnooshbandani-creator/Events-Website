<?php
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/libs/fpdf.php'; // دانلود کن از fpdf.org

// چک کن کاربر لاگین باشه یا admin باشه
if (!isset($_SESSION['user_id'])) 
    {
    header('Location: login.php');
    exit;
}

$event_id = intval($_GET['event_id'] ?? 0);
$user_id = $_SESSION['user_id'];

// چک کن کاربر حضور داشته یا ثبت‌نام داشته باشه
$stmt = $pdo->prepare("SELECT a.present FROM attendance a
    JOIN registrations r ON r.id = a.registration_id
    WHERE r.user_id = ? AND r.event_id = ?");
$stmt->execute([$user_id, $event_id]);
$att = $stmt->fetch();

if (!$att || !$att['present']) {
    die('شما حضور ندارید یا گواهی صادر نمی‌شود.');
}

// generate PDF
$pdf = new FPDF('L','mm','A4');
$pdf->AddPage();
$pdf->SetFont('Arial','B',24);
$pdf->Cell(0,20,iconv('UTF-8','ISO-8859-1','گواهی حضور'),0,1,'C');
$pdf->SetFont('Arial','',16);
$pdf->Cell(0,12, "این گواهی به ". $pdo->query("SELECT name FROM users WHERE id=$user_id")->fetchColumn() ." برای شرکت در رویداد تعلق گرفت.",0,1,'C');

// ذخیره فایل
$dir = __DIR__ . '/assets/certs';
if (!is_dir($dir)) mkdir($dir, 0755, true);
$filename = "certificate_{$user_id}_{$event_id}_" . time() . ".pdf";
$path = $dir . '/' . $filename;
$pdf->Output('F', $path);

// ذخیره در دیتابیس
$stmt = $pdo->prepare("INSERT INTO certificates (user_id, event_id, file_path) VALUES (?, ?, ?)");
$stmt->execute([$user_id, $event_id, 'assets/certs/'.$filename]);

// دانلود یا نمایش لینک
header('Content-Type: application/pdf');
header("Content-Disposition: inline; filename={$filename}");
readfile($path);
exit;

?>