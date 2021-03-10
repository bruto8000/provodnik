<?php

require('./connect.php');

$_POST = json_decode(file_get_contents('php://input'), true);



$nid = $_POST['nid'];
$login = $_POST['login'];
$full_name = $_POST['full_name'];

if(mysqli_query($connect,"UPDATE employees SET login='$login', full_name='$full_name' WHERE nid='$nid'")){
  echo "OK";


}else{

    http_response_code(500);
    echo $connect->error;
}









