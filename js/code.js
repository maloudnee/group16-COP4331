const urlBase = 'https://contactmanager-cop4331.xyz/';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

let toastTimeoutRef;
const toastDuration = 3000;

let searchResults = [];

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
				userId = jsonObject.ID;
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
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  

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

        showToast("Account Created!")

        document.getElementById("loginDiv").classList.remove("hidden");
        document.getElementById("createAccountDiv").classList.add("hidden");
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



function searchContacts() {

  // execute the followign code when a successful api response with results
	let search = document.getElementById("searchInput").value;

  const container = document.getElementById("resultsContainer");
  const resultsContainer = document.getElementById("results");
  resultsContainer.classList.add("hidden");
  
  document.querySelectorAll(".contact-card").forEach(card => card.remove());

  let tmp = {userId:userId,search:search};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/SearchContact.' + extension;
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
					showToast(error)
					return;
				}
        searchResults = jsonObject.results;
        // searchResults = [{FirstName, LastName, Phone, Email, ID},...]

        if (searchResults.length === 0) {
            container.style.display = "block";
            resultsContainer.classList.add("hidden")
            document.getElementById("noResults").classList.remove("hidden")
            document.getElementById("scrollUpArrow").classList.remove("show");
            document.getElementById("scrollDownArrow").classList.remove("show");
            return;
        }

        container.style.display = "block";
        document.getElementById("noResults").classList.add("hidden")
        document.getElementById("searchArea").style.paddingTop = "50px";
        resultsContainer.classList.remove("hidden")
        
        searchResults.forEach(contact => {
          const card = document.createElement("div");
          card.className = "contact-card";
          card.id = `contact${contact.ID}`

          // the data part of the contact card: includes contact name, phone, and email
          const contactData = document.createElement("div");
          contactData.className = "contact-data";
          
          const name = document.createElement("input");
          name.className = "contact-name";
          name.value = contact.FirstName + " " + contact.LastName;
          name.readOnly = true; 

          const phone = document.createElement("input");
          phone.className = "contact-info";
          phone.value = contact.Phone;
          phone.readOnly = true; 

          const email = document.createElement("input");
          email.className = "contact-info";
          email.value = contact.Email;
          email.readOnly = true; 

          contactData.appendChild(name);
          contactData.appendChild(phone);
          contactData.appendChild(email);

          const editDeleteDiv = document.createElement("div");
          editDeleteDiv.className = "edit-delete-div"
          const editContact = document.createElement("div");
          const deleteContact = document.createElement("div");

          const saveContact = document.createElement("div");

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
          let contactNameTemp;
          let contactPhoneTemp;
          let contactEmailTemp;

          editContact.onclick = function () {
            contactNameTemp = name.value;
            contactPhoneTemp = phone.value;
            contactEmailTemp = email.value;      

            editContact.classList.add("hidden");
            deleteContact.classList.add("hidden")
            saveContact.classList.remove("hidden");

            name.readOnly = false;
            phone.readOnly = false;
            email.readOnly = false;

            name.classList.add("input-focus");
            phone.classList.add("input-focus");
            email.classList.add("input-focus");
          }

          deleteContact.className = "delete-contact";
          deleteContact.innerHTML = `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-label="Delete"
          >
            <!-- Lid -->
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />

            <!-- Bin -->
            <path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />

            <!-- Lines inside -->
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>

          `

          deleteContact.onclick = function () {
            // popup confirmation
            if (!confirm("Delete contact?")){
              return;
            }

            let tmp = {UserID:userId, ID: contact.ID};
            let jsonPayload = JSON.stringify( tmp );
            let url = urlBase + '/DeleteContact.' + extension;
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
                    showToast("Error deleting contact")
                    return;
                  }
                  
                  document.getElementById(`contact${contact.ID}`)?.remove();

                }
              };
              xhr.send(jsonPayload);
            }
            catch(err)
            {
              showToast("Error deleting contact")
            }
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
            deleteContact.classList.remove("hidden");

            name.readOnly = true;
            phone.readOnly = true;
            email.readOnly = true;

            name.classList.remove("input-focus");
            phone.classList.remove("input-focus");
            email.classList.remove("input-focus");

            // write the http request here:
            // if saved correctly, do nothing
            // if error then show toast and revert back to previous values

            const fullName = name.value.trim();
            const parts = fullName.trim().split(/\s+/);
            const firstName = parts[0];
            const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
            
            let tmp = {FirstName:firstName,LastName:lastName, Phone:phone.value.trim(), Email: email.value.trim(), UserID: userId, ID: contact.ID};
            let jsonPayload = JSON.stringify( tmp );
            let url = urlBase + '/EditContact.' + extension;
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
                    if (error == "No contact updated")
                    {
                      return;
                    }
                    name.value = contactNameTemp;
                    phone.value = contactPhoneTemp;
                    email.value = contactEmailTemp;
                    showToast("Error Editing Contact")
                    
                  }
                }
              };
              xhr.send(jsonPayload);
            }
            catch(err)
            {
              name.value = contactNameTemp;
              phone.value = contactPhoneTemp;
              email.value = contactEmailTemp;
              showToast("Error Occured")
            }
          }

          editDeleteDiv.appendChild(editContact);
          editDeleteDiv.appendChild(deleteContact);

          card.appendChild(contactData);
          card.appendChild(editDeleteDiv);
          card.appendChild(saveContact);

          resultsContainer.appendChild(card);

        });

        document.getElementById("scrollUpArrow").classList.remove("show");
        if ((resultsContainer.scrollHeight > resultsContainer.clientHeight + 5)) {
            document.getElementById("scrollDownArrow").classList.add("show")
        }	
        else {
            document.getElementById("scrollDownArrow").classList.remove("show")
        }
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		showToast("Error Occured")
	}	
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
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  if ((firstName == "") || (lastName == "") || (phone == "") || (email == "")){
    return;
  }

  const modal = document.getElementById("modal");
  modal.style.display = "none";

  let tmp = {FirstName:firstName,LastName:lastName, Phone:phone, Email:email, ID: userId};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/AddContact.' + extension;
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
					showToast("Error adding contact")
					return;
				}

        showToast("Added Contact!")
        
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		showToast("Error adding contact")
	}	


}


// helpers
function showToast (text) {
  clearTimeout(toastTimeoutRef); 
  const toast = document.getElementById("toast");
  toast.innerHTML = text;
  toast.classList.add("show");
  toastTimeoutRef = setTimeout(() => {
    toast.classList.remove("show")
  }, toastDuration)
}