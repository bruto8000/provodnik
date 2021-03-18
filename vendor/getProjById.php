<?php



require('./connect.php');




$id = $_GET['id'];

if ($response = mysqli_query($connect, "SELECT * FROM `projects` WHERE id=$id limit 1")) {


    $result = $response->fetch_object();

    if ($response->num_rows == 0) {
        http_response_code(500);
    } else {
        $result->flags = json_decode($result->flags, JSON_UNESCAPED_UNICODE);

        $result->audits = json_decode($result->audits, JSON_UNESCAPED_UNICODE);
        $result->ocenka = json_decode($result->ocenka, JSON_UNESCAPED_UNICODE);

        echo json_encode($result);
    }
} else {
    http_response_code(500);
    echo json_encode($connect->error);
}
