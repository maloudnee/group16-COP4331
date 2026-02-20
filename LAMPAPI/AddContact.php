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
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");

        $stmt->bind_param("ssssi", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["ID"]);

        $stmt->execute();
        $ID = $conn->insert_id;
        if($stmt->affected_rows > 0){
            returnWithInfo("Contact added successfully");
        } else {
            returnWithError("No contact added");
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
