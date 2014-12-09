<?php

include_once 'justgiving/JustGivingClient.php';
include_once 'justgiving/ApiClients/PageApi.php';
include_once 'auth.php';

$raisedAmount;
$currencySymbol;

function getStory() {

	global $client;
	global $pageShortName;

	$getPageObject = $client->Page->Retrieve($pageShortName);

	if($getPageObject->pageShortName == $pageShortName) {

		$story = $getPageObject->story;
		return $story;
	}
}

if( $story = getStory() ) {
	
	$result = array("status"=>"success", "data"=>$story);

} else {

	$result = array("status"=>"error", "data"=>"could not retrieve story from the server");
}

echo json_encode($result);

?>