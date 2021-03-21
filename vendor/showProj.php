<?php



require('./connect.php');



if ($response = mysqli_query($connect, "SELECT * FROM `projects`")) {
  $result = [];
  while ($obj = $response->fetch_object()) {

    $obj->flags = json_decode($obj->flags, JSON_UNESCAPED_UNICODE);
    if (!$obj->flags) {
      $obj->flags = [];
    }

    $obj->audits = json_decode($obj->audits, JSON_UNESCAPED_UNICODE);

    if (!$obj->audits) {
      $obj->audits = [];
    }

    $obj->AB = json_decode($obj->AB, JSON_UNESCAPED_UNICODE);
    if (!$obj->AB) {
      $obj->AB = [];
    }


    $obj->ocenka = json_decode($obj->ocenka, JSON_UNESCAPED_UNICODE);

    if (!$obj->ocenka) {
      $obj->ocenka = (object)[];
    }

    $obj->statusZapusk = json_decode($obj->statusZapusk, JSON_UNESCAPED_UNICODE);

    if (!$obj->statusZapusk) {
      $obj->statusZapusk = [];
    }



    $obj->risks = json_decode($obj->risks, JSON_UNESCAPED_UNICODE);

    if (!$obj->risks) {
      $obj->risks = [];
    }


    $obj->bugs = json_decode($obj->bugs, JSON_UNESCAPED_UNICODE);

    if (!$obj->bugs) {
      $obj->bugs = [];
    }


    array_push($result, $obj);
  };

  echo json_encode($result);
} else {
  http_response_code(500);
}
