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
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID=? AND ID=?");

        $stmt->bind_param("ii", $inData["UserID"], $inData["ID"]);
        $stmt->execute();

        if($stmt->affected_rows > 0){
            returnWithInfo("Contact deleted succesfully");
        } else {
            returnWithError("No contact deleted");
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
