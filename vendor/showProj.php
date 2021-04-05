<?php



require('./connect.php');

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

if ($response = mysqli_query($connect, "SELECT * FROM `projects` WHERE archived is null")) {
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


    $obj->eGrafiks = json_decode($obj->eGrafiks, JSON_UNESCAPED_UNICODE);

    if (!$obj->eGrafiks) {
      $obj->eGrafiks = [];
    }


    $obj->tags = json_decode($obj->tags, JSON_UNESCAPED_UNICODE);

    if (!$obj->tags) {
      $obj->tags = [];
    }

    array_push($result, $obj);
  };

  echo json_encode($result);
} else {
  http_response_code(500);
}
