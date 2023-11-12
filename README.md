# Public-Transportation
is app will help you public transportation in citys that makes easy to now what time will go and what time will stop 
this app is development level 

## coming soon إن شاء الله

## Create a new admin
- Method: POST
- Endpoint: /signup
- Description: Creates a new admin with the provided name, email, and password in the request body.
- Response:
  - Status: 201 (Created)
  - Body: 
    - message: "admin successfully created."
    - admin: The newly created admin object

## Admin login
- Method: POST
- Endpoint: /login
- Description: Authenticates an admin with the provided email and password in the request body.
- Response:
  - Status: 200 (OK)
  - Body:
    - message: "Login successful."
    - token: A JSON Web Token (JWT) for authentication

## Create a new user
- Method: POST
- Endpoint: /signup
- Description: Creates a new user with the provided name, email, and password in the request body.
- Response:
  - Status: 201 (Created)
  - Body:
    - message: "user successfully created."
    - user: The newly created user object

## User login
- Method: POST
- Endpoint: /login
- Description: Authenticates a user with the provided email and password in the request body.
- Response:
  - Status: 200 (OK)
  - Body:
    - message: "Login successful."
    - token: A JSON Web Token (JWT) for authentication

## Get all buses
- Method: GET
- Endpoint: /
- Description: Retrieves all buses.
- Response:
  - Status: 200 (OK)
  - Body: An array of bus objects

## Get a bus by ID
- Method: GET
- Endpoint: /:id
- Description: Retrieves a bus by its ID.
- Response:
  - Status: 200 (OK)
  - Body: The bus object with the specified ID

## Create a new bus
- Method: POST
- Endpoint: /add
- Description: Creates a new bus with the provided number and capacity in the request body.
- Response:
  - Status: 200 (OK)
  - Body: The newly created bus object

## Update a bus
- Method: PUT
- Endpoint: /update/:id
- Description: Updates a bus with the provided number and capacity in the request body, based on its ID.
- Response:
  - Status: 200 (OK)
  - Body: The updated bus object

## Delete a bus
- Method: DELETE
- Endpoint: /delete/:id
- Description: Deletes a bus with the specified ID.
- Response:
  - Status: 200 (OK)
  - Body:
    - message: "Bus deleted successfully."