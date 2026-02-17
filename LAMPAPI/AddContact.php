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
		// $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
		// $stmt->bind_param("s", $inData["login"]);
		// $stmt->execute();
		// $result = $stmt->get_result();

		// if( $row = $result->fetch_assoc()  )
		// {
        //     returnWithError("A user with this login already exists");
        //     exit();
		// }
		// else
		// {
            // $stmt->close();
			$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");

            $stmt->bind_param("ssssi", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["ID"]);

            $stmt->execute();
            $ID = $conn->insert_id;
            returnWithInfo($inData["FirstName"], $inData["LastName"], $ID);
		// }

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
		$retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $FirstName, $LastName, $ID )
	{
		$retValue = '{"ID":' . $ID . ',"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
