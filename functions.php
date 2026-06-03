<?php
// includes/functions.php
require_once __DIR__ . '/config.php';

function findUserByEmail($email) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM users WHERE university_email = ?");
    $stmt->execute([$email]);
    return $stmt->fetch();
}

function createUser($name, $email, $password, $role='student') {
    global $pdo;
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (name, university_email, password_hash, role) VALUES (?, ?, ?, ?)");
    return $stmt->execute([$name, $email, $hash, $role]);
}
