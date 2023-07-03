# crud-api

### How to instal

    git clone git@github.com:alextes90/crud-api.git
    git checkout crud-api
    npm i

### How to run

#### Dev mode

    npm run start:dev

#### Prod mode

    npm run start:prod

#### Run with balancer

    npm run start:multi

#### Tests

    npm test

## Api

### http://localhost:3000 - base url

### "/api/users" - end point

Methods:

"GET" - get all users

"POST" - create new user (all fields mandatory)

```
{ "username": string!,

"age": number!,

"hobbies": string[]!}

```

### "/api/users/{uuid} - end point

Methods:

"Get" - get user by uuid

"PUT" - update user info by uuid (all fields mandatory)

```
{ "username": string!,

"age": number!,

"hobbies": string[]!}

```

"DELETE" - delete user by uuid
