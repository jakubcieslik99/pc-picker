# <img src="https://i.ibb.co/3hN8B9H/pc-picker-1.png" width="520">

## PC Picker 🖥️ _(currently being refactored)_

🔃 Simple PC setup builder & PC components manager app with REST API server, based on the MERN stack. Project contains
Express.js app as a backend (server) and React app as a frontend (client).

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/jakubcieslik99/pc-picker?color=orange&filename=server%2Fpackage.json&label=server%20version)
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/jakubcieslik99/pc-picker?color=orange&filename=client%2Fpackage.json&label=client%20version)
![GitHub top language](https://img.shields.io/github/languages/top/jakubcieslik99/pc-picker)
![GitHub repo size](https://img.shields.io/github/repo-size/jakubcieslik99/pc-picker)
[![Website)](https://img.shields.io/website?label=demo%20website&url=https%3A%2F%2Fdiscount.jakubcieslik.com%2F)](https://pc-picker.jakubcieslik.com/)

## Features

- Searching and filtering through pc setups and components
- Adding, editing and deleting new components
- Creating own PC setups
- Adding likes to setups created by other users
- Additional admin functionalities in separate [app](https://www.github.com/jakubcieslik99/pc-picker-manager)

## Screenshots

<img src="https://i.ibb.co/" width="800">

## Run Locally

- Clone repository

```bash
  git clone https://github.com/jakubcieslik99/pc-picker.git
```

ℹ️ Instructions for running server app locally:

- Navigate to the server directory and install dependencies

```bash
  cd pc-picker/server
  npm install
```

- Run server app in development mode

```bash
  npm run dev
  npm run dev:win   //only on Windows
```

ℹ️ Instructions for running client app locally:

- Navigate to the client directory and install dependencies

```bash
  cd pc-picker/client
  npm install
```

- Run client app in development mode

```bash
  npm run dev
  npm run dev:win   //only on Windows
```

## Deployment

ℹ️ Instructions for building and running server app in production

- Transpile to production build

```bash
  npm run build
```

- Run server app in production mode

```bash
  npm install --omit=dev
  npm run prod
```

ℹ️ Instructions for building client app to production

- Create production build

```bash
  npm run build
```

## Environment Variables

⚙️ To run server app, you will need to add the following environment variables to your .env file

- `ENV`

- `PORT`

- `IP`

- `API_URL`

- `WEBAPP_URL`

- `MONGODB_URI`

- `JWT_TOKEN_SECRET`

- `GMAIL_ADDRESS`

- `GMAIL_PASSWORD`

- `NOREPLY_ADDRESS`

⚙️ To build client app, you will need to add the following environment variables to your .env file

- `REACT_APP_ENV`

- `REACT_APP_API_URL`

## Languages

🔤 Available client app languages: **PL**

## Feedback

If you have any feedback, please reach out to me at ✉️ contact@jakubcieslik.com

## Authors

- [@jakubcieslik99](https://www.github.com/jakubcieslik99)
