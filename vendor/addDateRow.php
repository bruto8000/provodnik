<?php

//BACKEND для добавления дат. Сами даты приходят с Front


require('./connect.php');

$_POST = json_decode(file_get_contents('php://input'), true);

$date = $_POST['date'];


if(mysqli_query($connect, "INSERT INTO `tabel` (`date`) values ('$date')")){
    echo "OK";
    }else {
        echo "ERROR" . $connect->error;
    }













