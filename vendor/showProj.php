<?php



require('./connect.php');



if($response = mysqli_query($connect, "SELECT * FROM `projects`")){
    $result = [];
    while ($obj = $response -> fetch_object()) {
      $obj->flags = json_decode(  $obj->flags, JSON_UNESCAPED_UNICODE);
      $obj->audits = json_decode( $obj->audits, JSON_UNESCAPED_UNICODE);
  array_push($result, $obj);
      
    };

    echo json_encode($result);
}else{
    http_response_code(500);
}







