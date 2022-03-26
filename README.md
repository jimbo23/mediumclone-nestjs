<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

</p>

## Some Notes:

#### how to bring in validaton in nestjs?

1. install `class-validator` and `class-transformer` package.
2. use @UsePipes decorator
3. apply validation decorator in DTO

#### how to use jwt-token in nestjs

1. install `jwtwebtoken`
2. apply sign() method and provide 2 args (payload, JWT_SECRET)
3. that's all. you get back a string in return

   <img src='./jwt-signed-encoded-vs-decoded.png' width='300'/>

### verify token via jwt

1. the idea of this is to obtain the jwt token from Authorization header
2. decode the token with the JWT_SECRET (YOUR SECRET) and you retrieve your payload
3. most likely the payload contains some user info, eg user id and username
4. use available info to retrieve user object from the database
5. set request.user to user so you can user anywhere

```
if (!req.user) {
  // user is not logged in
}
```

### what is a middleware?

<img src='./middleware.png' height='200px'/>

## Installation

```bash
$ yarn
```

## Running the app

```bash
$ npm run start
```
