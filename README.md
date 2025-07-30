# AI vs. Human Art Backend

Welcome to the backend for the ai-vs-human-art project.

## Quick Start

> \[!TIP]\
> Make sure your code isn't ugly by using Prettier.

1. Download Node, clone repo etc.

2. place an .env file in /backend, and place your token/database secrets in there.

3. Install dependencies and run[^1].

```sh
npm install
npm run dev
```

## About this Project

This project is an express.,js project built on top of a Mongoose/MongoDB account database and a Cloudinary/Multer image database.

## Dependencies/Packages

### General

`Cloudinary` -- image server

`Multer` -- image sending middleware -- We decided against the use of `multer-storage-cloudinary`

`nodemon` -- hot server updating

### Encryption

`bcrypt` -- password hasher

`cookie-parser` -- req.cookie parsing

`cors` -- express-cors middleware

~~`dotenv`  .env -- secrets~~ Native node support for .env files has deprecated the use of the dotenv package

## Tutorials Used

- MEVN Stack Tutorial by Martial Coding

- Github User TuralHasanov11

- previous siths project [*Lowballd*](https://github.com/staten-island-tech/lowballd-backend)

[^1]: By default this runs the server through node demon and ensures that the project reads the .env file (as opposed to using the dotenv dependency)
