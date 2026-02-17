const urlBase = 'http://138.197.69.14//CONTACTMANAGERAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

let toastTimeoutRef;
const toastDuration = 3000;

let searchResults;

function onLoginClick()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginUsername").value.trim();
	let password = document.getElementById("loginPassword").value.trim();

  if ((login == "") || (password == ""))
  {
    return;
  }

	const loginResult = document.getElementById("loginResult");
	loginResult.innerHTML = "";
  
  let tmp = {Login:login,Password:password};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/Login.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
        const error = jsonObject.error;
        
				if(error !== "")
				{		
					loginResult.innerHTML = error;
          loginResult.classList.remove("hidden")
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

        loginResult.innerHTML = "";
        loginResult.classList.add("hidden");
	
				window.location.href = "contacts.html";
			}
      else 
      {
        loginResult.innerHTML = "Error contacting server";
        loginResult.classList.remove("hidden")
      }
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		loginResult.innerHTML = err.message;
    loginResult.classList.remove("hidden")
	}	
}

function newAccountNav () {
  document.getElementById("loginDiv").classList.add("hidden");
  document.getElementById("createAccountDiv").classList.remove("hidden");
}

function onBackToLoginClick () {
  document.getElementById("loginDiv").classList.remove("hidden");
  document.getElementById("createAccountDiv").classList.add("hidden");
}


function onCreateAccountClick () { 
  const name = document.getElementById("createAccountName").value;
  const username = document.getElementById("createAccountUsername").value.trim();
  const password = document.getElementById("createAccountPassword").value.trim();

  if ((name == "") || (password == "") || (username == ""))
  {
    return;
  }

  // split the name into first and last name:
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : null;
  if (lastName === null)
  {
    clearTimeout(toastTimeoutRef); 
    const toast = document.getElementById("toast");
    toast.innerHTML = "Include your full name!";
    toast.classList.add("show");
    toastTimeoutRef = setTimeout(() => {
      toast.classList.remove("show")
    }, toastDuration)
    return;
  }

	const createAccountResult = document.getElementById("createAccountResult");
	createAccountResult.innerHTML = "";
  
  let tmp = {FirstName:firstName,LastName:lastName, Login:username, Password:password};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/Register.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
        const error = jsonObject.error;
        
				if(error !== "")
				{		
					createAccountResult.innerHTML = error;
          createAccountResult.classList.remove("hidden")
					return;
				}

        createAccountResult.innerHTML = "";
        createAccountResult.classList.add("hidden");

        clearTimeout(toastTimeoutRef); 
        const toast = document.getElementById("toast");
        toast.innerHTML = "Account Created!";
        toast.classList.add("show");
        toastTimeoutRef = setTimeout(() => {
          toast.classList.remove("show")
        }, toastDuration)

        document.getElementById("loginDiv").classList.remove("hidden");
        document.getElementById("createAccountDiv").classList.add("hidden");
			}
      else 
      {
        createAccountResult.innerHTML = "Error contacting server";
        createAccountResult.classList.remove("hidden")
      }
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		createAccountResult.innerHTML = err.message;
    createAccountResult.classList.remove("hidden")
	}	
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

let contactNameTemp;
let contactPhoneTemp;
let contactEmailTemp;

function searchContacts() {

  // execute the followign code when a successful api response with results
	let search = document.getElementById("searchInput").value;
  const container = document.getElementById("results");
  document.querySelectorAll(".user-card").forEach(card => card.remove());
  document.getElementById("searchArea").style.paddingTop = "50px";
  document.getElementById("resultsContainer").style.display = "block";

  // testing
  const searchResults = [
    { name: "Alice Smith", phone: "123-456-7890", email: "alice@test.com", contactID: 1646 },
    { name: "Bob Jones", phone: "987-654-3210", email: "bob@test.com", contactID: 2 } ,
    { name: "Alice Smith", phone: "123-456-7890", email: "alice@test.com", contactID: 143526 },
    { name: "Bob Jones", phone: "987-654-3210", email: "bob@test.com", contactID: 4 },
    { name: "Alice Smith", phone: "123-456-7890", email: "alice@test.com", contactID: 124156235 },
    { name: "Bob Jones", phone: "987-654-3210", email: "bob@test.com", contactID: 6 },
    { name: "Alice Smith", phone: "123-456-7890", email: "alice@test.com", contactID: 114546 },
    { name: "Bob Jones", phone: "987-654-3210", email: "bob@test.com", contactID: 8 },
    { name: "Alice Smith", phone: "123-456-7890", email: "alice@test.com", contactID: 114346 },
    { name: "Bob Jones", phone: "987-654-3210", email: "bob@test.com", contactID: 110 },
    { name: "Alice Smith", phone: "123-456-7890", email: "alice@test.com", contactID: 123423423 },
    { name: "Bob Jones", phone: "987-654-3210", email: "bob@test.com", contactID: 124 },
    { name: "Alice Smith", phone: "123-456-7890", email: "alice@test.com", contactID: 134 },
    { name: "Bob Jones", phone: "987-654-3210", email: "bob@test.com", contactID: 12342 },
  ];


  if (!searchResults.length) {
    container.textContent = "No users found";
    return;
  }

  searchResults.forEach(contact => {
    const card = document.createElement("div");
    card.className = "contact-card";

    // the data part of the contact card: includes contact name, phone, and email
    const contactData = document.createElement("div");
    contactData.className = "contact-data";
    
    const name = document.createElement("input");
    name.className = "contact-name";
    name.value = contact.name; 
    name.readOnly = true; 

    const phone = document.createElement("input");
    phone.className = "contact-info";
    phone.value = contact.phone;
    phone.readOnly = true; 

    const email = document.createElement("input");
    email.className = "contact-info";
    email.value = contact.email;
    email.readOnly = true; 

    contactData.appendChild(name);
    contactData.appendChild(phone);
    contactData.appendChild(email);

    const editContact = document.createElement("div");
    const saveContact = document.createElement("div");

    // the edit button of the contact card (initially shown)
    editContact.className = "edit-contact";
    editContact.innerHTML = `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
    `
    editContact.onclick = function () {
      contactNameTemp = name.value;
      contactPhoneTemp = phone.value;
      contactEmailTemp = email.value;      

      editContact.classList.add("hidden")
      saveContact.classList.remove("hidden");

      name.readOnly = false;
      phone.readOnly = false;
      email.readOnly = false;

      name.classList.add("input-focus");
      phone.classList.add("input-focus");
      email.classList.add("input-focus");
    }
    
    // the save button which saves edits from the user (shown after clicking the edit button)
    saveContact.className = "save-contact hidden";
    saveContact.innerHTML = "Save";
    saveContact.onclick = function () {
      // send http request with contact id, name, phone, email
      // if succeeds, do nothing
      // if fails, return the values in the name, phone, emails to the temp
      saveContact.classList.add("hidden");
      editContact.classList.remove("hidden");

      name.readOnly = true;
      phone.readOnly = true;
      email.readOnly = true;

      name.classList.remove("input-focus");
      phone.classList.remove("input-focus");
      email.classList.remove("input-focus");

      // write the http request here:

      if (false){
        // show toast as well
        name.value = contactNameTemp;
        phone.value = contactPhoneTemp;
        email.value = contactEmailTemp;
      }

    }

    card.appendChild(contactData);
    card.appendChild(editContact);
    card.appendChild(saveContact);

    container.appendChild(card);

  });

  if (container.scrollHeight > container.clientHeight + 5) {
    document.getElementById("scrollDownArrow").classList.add("show")
  }

  /**
  let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
  */
	
	
}


function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact () {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}


