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
$difficulty = $_POST['difficulty'];
$flags = json_encode($_POST['flags'], JSON_UNESCAPED_UNICODE);
$audits = json_encode($_POST['audits'], JSON_UNESCAPED_UNICODE);
$ocenka = json_encode($_POST['ocenka'], JSON_UNESCAPED_UNICODE);
$AB = json_encode($_POST['AB'], JSON_UNESCAPED_UNICODE);
$statusZapusk = json_encode($_POST['statusZapusk'], JSON_UNESCAPED_UNICODE);
$risks = json_encode($_POST['risks'], JSON_UNESCAPED_UNICODE);
$bugs = json_encode($_POST['bugs'], JSON_UNESCAPED_UNICODE);
$eGrafiks = json_encode($_POST['eGrafiks'], JSON_UNESCAPED_UNICODE);
$tags = json_encode($_POST['tags'], JSON_UNESCAPED_UNICODE);
$zamenas = json_encode($_POST['zamenas'], JSON_UNESCAPED_UNICODE);
$dopinfo = $_POST['dopinfo'];


$id = $_POST['id'];
//$opisanie = $_POST['opisanie'];
// $ocenka = $_POST['ocenka'];
// $comments =  serialize($_POST['comments'] ) ;
// $dopcomments = serialize($_POST['dopcomments'] );



if (mysqli_query($connect, "UPDATE  projects SET fdate='$fdate', difficulty ='$difficulty',
 sdate='$sdate', nazvanie='$nazvanie', AB='$AB', tags='$tags',statusZapusk='$statusZapusk', risks='$risks',
 bugs='$bugs',zakazchik='$zakazchik', ocenka='$ocenka', eGrafiks='$eGrafiks',  bizness='$bizness', zapusk='$zapusk',
  status='$status', soprovod='$soprovod', opisanieBody='$opisanieBody', dopinfo='$dopinfo',
   flags='$flags',  zamenas='$zamenas', audits='$audits' WHERE id='$id'")) {



    echo "OK";
} else {
    echo "ERROR" . $connect->error;
}
