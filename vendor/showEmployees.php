<?php



require('./connect.php');



if($response = mysqli_query($connect, "SELECT * FROM `employees`")){
    $result = [];
    while ($obj = $response -> fetch_object()) {
      if($obj->is_active == 0){
        array_push($result, $obj);
      }

      
    };



    echo json_encode($result, JSON_UNESCAPED_UNICODE);
}else{
    http_response_code(500);
}







