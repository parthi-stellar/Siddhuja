# User login dashboard

React + TypeScript interface for the Spring Boot `GET /user-logins` endpoint.

## Run locally

1. Start the Spring Boot application on `http://localhost:8080`.
2. In this directory, run `npm install` and then `npm run dev`.
3. Open the local URL printed by Vite.

Vite proxies `/user-logins` to the Spring Boot server. The current endpoint returns plain text, which the UI parses into user records.

## Android APK

Before building an APK for a phone on the same Wi-Fi, set `VITE_API_BASE_URL` in `.env.production.local` to the laptop's current Wi-Fi address and backend port, for example `http://192.168.0.111:8080`. Keep the Spring Boot backend running and allow inbound connections to port 8080 on the laptop's private network. Then run `npm run build`, `npx cap sync android`, and `android\gradlew.bat assembleDebug`. The debug APK is written to `android\app\build\outputs\apk\debug\app-debug.apk`.

The laptop's IP can change when it reconnects to Wi-Fi; update `.env.production.local` and rebuild the APK if it does. For use outside the local network, configure a stable HTTPS backend URL instead.
