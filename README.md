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

Deploy this project as a single Render Web Service from GitHub. Express serves the built React app from `client/build`, and Socket.IO runs on the same service origin.

Render can use `render.yaml` as a Blueprint, or you can create a Web Service manually with the same settings:

- Build command: `npm ci && npm ci --prefix client && npm run build --prefix client`
- Start command: `npm start`
- Health check path: `/healthz`
- Required environment variable: `MONGODB_URI`
- Suggested instance type: Free for demos

Before deploying, rotate the old MongoDB Atlas password and set the new connection string as `MONGODB_URI` in Render. Do not commit real database credentials.

If MongoDB Atlas has an IP access list enabled, allow Render outbound access. For a demo app, the simplest option is allowing `0.0.0.0/0`; for production, use a tighter network setup.
