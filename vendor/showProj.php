<?php



require('./connect.php');



if($response = mysqli_query($connect, "SELECT * FROM `projects`")){
    $result = [];
    while ($obj = $response -> fetch_object()) {
  array_push($result, $obj);
      
    };

    echo json_encode($result);
}else{
    http_response_code(500);
}







