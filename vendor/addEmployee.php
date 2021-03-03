<?php




require('./connect.php');

$_POST = json_decode(file_get_contents('php://input'), true);

$full_name = $_POST['full_name'];
$nid= $_POST['nid'];
$login= $_POST['login'];

$result = mysqli_query($connect, "SELECT * FROM `employees` WHERE nid='$nid'");

if($result->num_rows > 0){
    echo "NID";
    exit;
} 



if(mysqli_query($connect, "INSERT INTO `employees` (`full_name`, `nid`, `login` ) values ('$full_name', '$nid', '$login')")){
    echo "OK";
    }else {
        echo "ERROR" . $connect->error;
    }




