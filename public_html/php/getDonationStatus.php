<?php

include_once 'justgiving/JustGivingClient.php';
include_once 'justgiving/ApiClients/DonationApi.php';
include_once 'auth.php';

function getDonationStatus() {

	global $client;
	global $donationId;
	global $pageShortName;

	if($getDonationObject = $client->Donation->Retrieve($donationId)){
		
		$dPageName = $getDonationObject->pageShortName;
		$dStatus =  $getDonationObject->status;
		$dDonor = $getDonationObject->donorDisplayName;
		$dMessage = $getDonationObject->message;

		if ($dStatus == 'null' || $dStatus == '' || $dPageName != $pageShortName) {

			$data = "Donation Id was not recognised";
			$status = "error";

		} else {

			$data = array("dStatus"=>$dStatus , "dDonor"=>$dDonor , "dMessage" => $dMessage );
			$status = "success";
		}

		$result = array("status"=>$status, "data"=>$data);
		return $result;
	}
}

if ($donationId = $_GET['donationId']){

	$result = getDonationStatus();

} else {

	$result = array("status"=>"error", "data"=>"No donation Id to query");
};

echo json_encode($result);

?>