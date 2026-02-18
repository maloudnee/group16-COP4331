<?php

    $indata = getRequestInfo();

    $searchResults = "";
    $searchCount = 0;

    $conn = new mysqli("localhost", "root", "QWer!@12QW", "ContactManager");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else 
    {
        $stmt = $conn->prepare("SELECT FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=? AND (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ?)");
        $userId = isset($indata["userId"]) ? intval($indata["userId"]) : 0;
        $search = isset($indata["search"]) ? $indata["search"] : "";
        $searchTerm = "%" . $search . "%";
        $stmt->bind_param("isss", $userId, $searchTerm, $searchTerm, $searchTerm);
        $stmt->execute();
        $result = $stmt->get_result();
        if(!$result){
            returnWithError("Query failed: " . $stmt->error);
        }
        while($row = $result->fetch_assoc())
        {
            if ($searchCount > 0)
            {
                $searchResults .= ",";
            }
            $searchResults .= '{"FirstName":"' . $row["FirstName"] . '","LastName":"' . $row["LastName"] . '","Phone":"' . $row["Phone"] . '","Email":"' . $row["Email"] . '"}';
            $searchCount++;
        }

        if ($searchCount == 0)
        {
            returnWithInfo("");
        }
        else
        {
            returnWithInfo($searchResults);
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
    function returnWithError($err)
    {
        $retValue = '{"id":0, "firstName":"","lastName":"","phone":"","email":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($searchResults)
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson($retValue);
    }