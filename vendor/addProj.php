<?php

require('./connect.php');

$_POST = json_decode(file_get_contents('php://input'), true);






$fdate = $_POST['fdate'];
$sdate = $_POST['sdate'];
$nazvanie = $_POST['nazvanie'];
$opisanie = $_POST['opisanie'];
$zakazchik = $_POST['zakazchik'];
$bizness = $_POST['bizness'];
$zapusk = $_POST['zapusk'];
$status = $_POST['status'];
$soprovod = $_POST['soprovod'];
$opisanieBody = $_POST['opisanieBody'] ;
// $ocenka = $_POST['ocenka'];
// $comments =  serialize($_POST['comments'] ) ;
// $dopcomments = serialize($_POST['dopcomments'] );



if(mysqli_query($connect,"INSERT INTO `projects`( `fdate`, `sdate`, `nazvanie`, `opisanie`, `zakazchik`, `bizness`,`zapusk`, `status`, `soprovod`, `opisanieBody`) VALUES ('$fdate','$sdate','$nazvanie', '$opisanie','$zakazchik', '$bizness', '$zapusk','$status' , '$soprovod', '$opisanieBody')")){
echo "OK";
    }else {
        echo "ERROR" . $connect->error;
    }


    



