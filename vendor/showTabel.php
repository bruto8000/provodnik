<?php



require('./connect.php');



if($response = mysqli_query($connect, "SELECT * FROM `tabel`")){
    $result = [];
    while ($obj = $response -> fetch_object()) {
      $obj->body = json_decode($obj->body);
  array_push($result, $obj);
      
    };

    echo json_encode($result);
}else{
    http_response_code(500);
}







