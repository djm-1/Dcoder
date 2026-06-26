# Dcoder
#### ~~Gorib er MacBook~~
+ Dcoder is a realtime collaborative text editor, specially developed for coding interviews
+ Also gives you Macbook like feeling without spending any money :)

#### Tech stack Used
1. React
2. Express
3. Socket.io
4. MongoDB
5. CodeMirror
6. MDBootstrap and some other npm packages

## Deploy on Render

Deploy this project as a single Render Web Service. Express serves the built React app from `client/build`, and Socket.IO runs on the same service origin.

Render settings:

- Build command: `npm ci && npm ci --prefix client && npm run build --prefix client`
- Start command: `npm start`
- Health check path: `/healthz`
- Required environment variable: `MONGODB_URI`

Before deploying, rotate the old MongoDB Atlas password and set the new connection string as `MONGODB_URI` in Render. Do not commit real database credentials.
