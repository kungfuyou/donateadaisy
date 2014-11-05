<?php

include_once 'justgiving/JustGivingClient.php';
include_once 'justgiving/ApiClients/PageApi.php';
include_once 'auth.php';

$raisedAmount;
$currencySymbol;

function getTotal() {

	global $client;
	global $pageShortName;

	$getPageObject = $client->Page->ListAll();

	foreach ($getPageObject as $key => $value){ 

		if($value->pageShortName == $pageShortName) {

			$raisedAmount = number_format($value->raisedAmount, 2, '.', '');
			$currency = htmlentities($value->currencySymbol);
			$totalRaised = $currency . $raisedAmount;
			return $totalRaised;
		}
	}
}

if( $totalRaised = getTotal($pageShortName) ) {
	
	$result = array("status"=>"success", "data"=>$totalRaised);

} else {

	$result = array("status"=>"error", "data"=>"could not retrieve total raised from the server");
}

echo json_encode($result);

?>