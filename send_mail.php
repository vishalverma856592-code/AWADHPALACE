<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(strip_tags($_POST["name"] ?? ''));
    $phone = htmlspecialchars(strip_tags($_POST["phone"] ?? ''));
    $email = filter_var($_POST["email"] ?? '', FILTER_SANITIZE_EMAIL);
    $checkin = htmlspecialchars(strip_tags($_POST["checkin"] ?? ''));
    $checkout = htmlspecialchars(strip_tags($_POST["checkout"] ?? ''));
    $message = htmlspecialchars(strip_tags($_POST["message"] ?? ''));

    if(empty($name) || empty($phone) || empty($email) || empty($checkin) || empty($checkout)) {
        echo json_encode(["status" => "error", "message" => "Please fill all required fields."]);
        exit;
    }

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
         echo json_encode(["status" => "error", "message" => "Invalid email format."]);
         exit;
    }

    $to = "contact@awadhpalacehotel.com";
    $subject = "New Booking Contact from $name";
    
    $body = "Name: $name\nPhone: $phone\nEmail: $email\nCheck-in: $checkin\nCheck-out: $checkout\n\nMessage:\n$message\n";

    $headers = "From: no-reply@awadhpalacehotel.com\r\nReply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(["status" => "success", "message" => "Message sent successfully! We will get back to you soon."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to send message. Please try again later."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
