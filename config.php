<?php
// includes/config.php
session_start();

$DB_HOST = '127.0.0.1';
$DB_NAME = 'roydadland_db';
$DB_USER = 'root';
$DB_PASS = '';

try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) 
{
    die("DB connection failed: " . $e->getMessage());
}

function e($str)
 {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}
