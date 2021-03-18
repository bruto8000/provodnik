<?php

require('./connect.php');

$_POST = json_decode(file_get_contents('php://input'), true);






$fdate = $_POST['fdate'];
$sdate = $_POST['sdate'];
$nazvanie = $_POST['nazvanie'];

$zakazchik = $_POST['zakazchik'];
$bizness = $_POST['bizness'];
$zapusk = $_POST['zapusk'];
$status = $_POST['status'];
$soprovod = $_POST['soprovod'];
$opisanieBody = $_POST['opisanieBody'];
$flags = json_encode($_POST['flags'], JSON_UNESCAPED_UNICODE);
$audits = json_encode($_POST['audits'], JSON_UNESCAPED_UNICODE);
$ocenka = json_encode($_POST['ocenka'], JSON_UNESCAPED_UNICODE);
$AB = json_encode($_POST['AB'], JSON_UNESCAPED_UNICODE);
$statusZapusk = json_encode($_POST['statusZapusk'], JSON_UNESCAPED_UNICODE);


$id = $_POST['id'];
//$opisanie = $_POST['opisanie'];
// $ocenka = $_POST['ocenka'];
// $comments =  serialize($_POST['comments'] ) ;
// $dopcomments = serialize($_POST['dopcomments'] );



if (mysqli_query($connect, "UPDATE  projects SET fdate='$fdate',
 sdate='$sdate', nazvanie='$nazvanie', AB='$AB', statusZapusk='$statusZapusk',
 zakazchik='$zakazchik', ocenka='$ocenka', bizness='$bizness', zapusk='$zapusk',
  status='$status', soprovod='$soprovod', opisanieBody='$opisanieBody',
   flags='$flags', audits='$audits' WHERE id='$id'")) {



    echo "OK";
} else {
    echo "ERROR" . $connect->error;
}
