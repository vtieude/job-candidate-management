🚀 Express + TypeScript + TSOA + Swagger + JWT Auth

This project demonstrates how to build a typed REST API in Node.js (v22) using:

Express Typerscript – server framework

tsoa – generate routes + OpenAPI docs from TypeScript decorators

Swagger UI – interactive API docs

JWT Authentication – secure endpoints with Bearer tokens

Clas-Validator - input validate working with tsoa

Docker compose for Dev/Prd env

======================================== Node v22 --------------------------
Documents:
- View api Docs at
localhost:3000/docs
- seed Data example
npx ts-node src/configs/seed.ts

- Gen tsoa route
npm run tsoa:gen
- Run local project 
npm run dev (node v22)
- Run local project by docker (nodemon):
docker compose -f docker-compose-dev.yml up

