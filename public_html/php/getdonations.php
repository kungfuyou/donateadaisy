<?php
include_once 'justgiving/JustGivingClient.php';
include_once 'justgiving/ApiClients/PageApi.php';
include_once 'auth.php';


date_default_timezone_set('GMT');

function getDonationsObject($pageSize , $pageNumber) {

	global $client;
	global $pageShortName;
	$donationsObject = $client->Page->RetrieveDonationsForPage($pageShortName, $pageSize, $pageNumber);
	return $donationsObject;
};

function cleanDonationsArray($donationsArray) {
	
	global $totalResults;
	$i = 0;

	foreach($donationsArray as $obj){

		//Weed out the unwanted Keys
		foreach($obj as $key=>$val){

			if (!in_array($key, array('donationDate', 'donorDisplayName' , 'donorRealName', 'message'))){

				unset($obj->{$key});

			} else if($key == 'donationDate'){

				$obj->$key = parseDate($val);
			}
		}
		//if display name is anonymous
		/* if($obj->donorDisplayName == 'Anonymous'){

			$obj->donorDisplayName = $obj->donorRealName;
		} */

		//add the index as id before reversing
		$obj->id = $totalResults - $i;
		$i++;
	}

	return $donationsArray;
};

function parseDate($timestamp){
	preg_match('/(\d{10})(\d{3})([\+\-]\d{4})/', $timestamp, $matches);
	return date( "d/M/Y", $matches[1]);
}

if( $donationsObject = getDonationsObject($pageSize , 1) ){

	$donationsArray = $donationsObject->donations;
	$paginationObject = $donationsObject->pagination;
	$totalPages = $donationsObject->pagination->totalPages;
	$totalResults = $donationsObject->pagination->totalResults;

	if($totalPages > 1) {
		
		//Get the rest of the results
		for($x=2; $x <= $totalPages; $x++){
			$nextPage = getDonationsObject($pageSize, $x);
			$donationsArray = array_merge($donationsArray, $nextPage->donations);
		}
	}

	//need to filter the array objects to remove unnesessary params
	$cleanDonationsArray = cleanDonationsArray($donationsArray);
	//Reverse the array 
	//$reverseDonationsArray = array_reverse($cleanDonationsArray);

	$result = array("status"=>"success", "data"=>$cleanDonationsArray);

} else {

	$result = array("status"=>"error", "data"=>"Could not retrieve donations from server");
}

echo json_encode($result);
?>