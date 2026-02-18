<?php

	$inData = getRequestInfo();
	
	$UserID = 0;
	$FirstName = "";
	$LastName = "";
	$Phone = "";
	$Email = "";
	$UserID = 0;
	$ID = 0;

	$conn = new mysqli("localhost", "Laz", "COP4331-67", "ContactManager"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE UserID=? AND ID=?");

        $stmt->bind_param("ssssii", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"], $inData["ID"]);

        $stmt->execute();

        if($stmt->affected_rows > 0){
            returnWithInfo("Contact updated successfully");
        } else {
            returnWithError("No contact updated");
        }

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err .'","message":""}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($message)
	{
		$retValue = '{"error":"","message":"' . $message . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
