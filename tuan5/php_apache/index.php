<?php
$message = "Xin chao tu PHP 8.2 + Apache + Docker!";
$time = date('Y-m-d H:i:s');
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Apache Docker</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: linear-gradient(135deg, #f0f9ff, #ffffff);
        }

        .card {
            padding: 24px;
            border: 1px solid #d1d5db;
            border-radius: 12px;
            background: #ffffff;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            text-align: center;
        }

        h1 {
            margin: 0 0 12px;
            color: #1f2937;
        }

        p {
            margin: 6px 0;
            color: #4b5563;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1><?php echo $message; ?></h1>
        <p>Thoi gian server: <?php echo $time; ?></p>
    </div>
</body>
</html>
