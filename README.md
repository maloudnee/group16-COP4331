# Personal Contact Manager — COP4331 Small Project

## Contributors
- Lazaro Alfonso  
- Jerry Xie  
- Maloudnee Marcier  

---

## Frontend
**Technologies:** HTML, CSS, JavaScript  

### Pages
- Login page  
- Sign up page  
- Main page (logged in)  

---

## Database
**Database name:** `COP4331`

### Table: `Users`
| Field     | Type         | Constraints                                  |
|----------|--------------|----------------------------------------------|
| ID       | INT          | NOT NULL, AUTO_INCREMENT, PRIMARY KEY        |
| Name     | VARCHAR(50)  | NOT NULL, DEFAULT ''                         |
| Username | VARCHAR(50)  | NOT NULL, DEFAULT ''                         |
| Password | VARCHAR(50)  | NOT NULL, DEFAULT ''                         |

---

### Table: `Contacts`
| Field     | Type         | Constraints                                  |
|-----------|--------------|----------------------------------------------|
| ID        | INT          | NOT NULL, AUTO_INCREMENT, PRIMARY KEY        |
| FirstName | VARCHAR(50)  | NOT NULL, DEFAULT ''                         |
| LastName  | VARCHAR(50)  | NOT NULL, DEFAULT ''                         |
| Phone     | VARCHAR(50)  | NOT NULL, DEFAULT ''                         |
| Email     | VARCHAR(50)  | NOT NULL, DEFAULT ''                         |
| UserID    | INT          | NOT NULL, DEFAULT 0                          |

---

## PHP API Specification

### General Notes
- All requests and responses use JSON.
- On the frontend, an **empty string in the `error` field** indicates success.

---

### `Login.php`

**Request JSON**
```json
{
  "Login": "string",
  "Password": "string"
}
```

**Response JSON**
```json
{
  "ID": "int",
  "FirstName": "string",
  "LastName": "string",
  "error": "string"
}
```

### `Register.php`

**Request JSON**
```json
{
  "FirstName": "string",
  "LastName": "string",
  "Login": "string",
  "Password": "string"
}
```

**Response JSON**
```json
{
  "ID": "int",
  "FirstName": "string",
  "LastName": "string",
  "error": "string"
}
```

### `AddContact.php`

**Request JSON**
```json
{
  "FirstName": "string",
  "LastName": "string",
  "Phone": "string",
  "Email": "string",
  "UserID": "int",
}
```

**Response JSON**
```json
{
  "error": "string",
  "message": "string"
}
```

### `EditContact.php`

**Request JSON**
```json
{
  "FirstName": "string",
  "LastName": "string",
  "Phone": "string",
  "Email": "string",
  "UserID": "int",
  "ID": "int"
}
```

**Response JSON**
```json
{
  "error": "string",
  "message": "string"
}
```

### `DeleteContact.php`

**Request JSON**
```json
{
  "UserID": "int",
  "ID": "int"
}
```

**Response JSON**
```json
{
  "error": "string",
  "message": "string"
}
```
### `SearchContacts.php`

**Request JSON**
```json
{
  "userID": "int",
  "search": "string"
}
```

**Response JSON**
```json
{
  "results": [
    {
      "firstName": "string",
      "lastName": "string",
      "phone": "string",
      "email": "string",
      "contactID": "int",
      "error": "string"
    }
  ]
}
```

### `SearchContacts.php`

**Request JSON**
```json
{
  "userID": "int",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "email": "string"
}
```

**Response JSON**
```json
{
  "error": "string"
}
```

### add other endpoints

