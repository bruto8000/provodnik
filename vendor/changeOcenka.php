<?php

require('./connect.php');

$_POST = json_decode(file_get_contents('php://input'), true);





$ocenka = json_encode($_POST['ocenka'], JSON_UNESCAPED_UNICODE);


$id = $_POST['id'];
//$opisanie = $_POST['opisanie'];
// $ocenka = $_POST['ocenka'];
// $comments =  serialize($_POST['comments'] ) ;
// $dopcomments = serialize($_POST['dopcomments'] );



if (mysqli_query($connect, "UPDATE  projects SET  ocenka='$ocenka' WHERE id='$id'")) {



    echo "OK";
} else {
    echo "ERROR" . $connect->error;
}
