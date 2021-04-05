<?php

require('./connect.php');

$_POST = json_decode(file_get_contents('php://input'), true);









$id = $_POST['id'];
//$opisanie = $_POST['opisanie'];
// $ocenka = $_POST['ocenka'];
// $comments =  serialize($_POST['comments'] ) ;
// $dopcomments = serialize($_POST['dopcomments'] );



if (mysqli_query($connect, "UPDATE  projects SET archived='1' WHERE id='$id'")) {



    echo "OK";
} else {
    echo "ERROR" . $connect->error;
}
