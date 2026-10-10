# User login dashboard

React + TypeScript interface for the Spring Boot `GET /user-logins` endpoint.

## Run locally

1. Start the Spring Boot application on `http://localhost:8080`.
2. In this directory, run `npm install` and then `npm run dev`.
3. Open the local URL printed by Vite.

Vite proxies `/user-logins` to the Spring Boot server. The current endpoint returns plain text, which the UI parses into user records.
