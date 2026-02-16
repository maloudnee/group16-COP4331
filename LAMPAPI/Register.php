
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";


	$conn = new mysqli("localhost", "Laz", "COP4331-67", "ContactManager"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
            returnWithError("A user with this login already exists");
            exit();
			// returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
		}
		else
		{
            $stmt->close();
			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");

            $stmt->bind_param("ssss", $inData["FirstName"], $inData["LastName"], $inData["Login"], $inData["Password"]);

            $stmt->execute();
            $id = $conn->insert_id;
            returnWithInfo($inData["FirstName"], $inData["LastName"], $id);
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
		$retValue = '{"ID":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $ID )
	{
		$retValue = '{"ID":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
