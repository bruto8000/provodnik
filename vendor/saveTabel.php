<?php


require('./connect.php');


$_POST = json_decode(file_get_contents('php://input'), true);






$ARR = $_POST;


foreach ($ARR as &$row){

$BDL = $row['BDL'];
$DED = $row['DED'];
$FEN = $row['FEN'];
$GNA = $row['GNA'];
$KEV = $row['KEV'];
$KII = $row['KII'];
$KSA = $row['KSA'];
$NOV = $row['NOV'];
$PTP = $row['PTP'];
$SYI = $row['SYI'];
$WAA = $row['WAA'];
$WAS = $row['WAS'];
$id  = $row['id'];
$err = false;
$err_msg = '';
    if(mysqli_query($connect,"UPDATE tabel SET BDL='$BDL', DED='$DED', FEN='$FEN', GNA='$GNA', KEV='$KEV', KII='$KII',KSA='$KSA', NOV='$NOV', PTP='$PTP', SYI='$PTP', WAA='$WAA', WAS='$WAS' WHERE id=$id")){
  
            }else {
             $err = true; $err_msg = $connect->error;
            }
        
}

if($err){
    echo $err_msg;
}
else{
echo "OK";
}


// $ocenka = $_POST['ocenka'];
// $comments =  serialize($_POST['comments'] ) ;
// $dopcomments = serialize($_POST['dopcomments'] );




    











