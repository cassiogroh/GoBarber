<h1 align="center">
  <img alt="Logo" src="assets/logo.svg" width="200px">
</h1>

<h3 align="center">
  Frontend mobile application for GoBarber project
</h3>

<p align="center">The best way to schedule your service!</p>

<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/cassiogroh/GoBarber-mobile?color=%23FF9000">

  <a href="https://www.linkedin.com/in/cassiogroh/" target="_blank" rel="noopener noreferrer">
    <img alt="Made by" src="https://img.shields.io/badge/made%20by-cassiogroh-%23FF9000">
  </a>

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/cassiogroh/GoBarber-mobile?color=%23FF9000">

  <a href="https://github.com/cassiogroh/GoBarber-mobile/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/cassiogroh/GoBarber-mobile?color=%23FF9000">
  </a>

  <a href="https://github.com/cassiogroh/GoBarber-mobile/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/cassiogroh/GoBarber-mobile?color=%23FF9000">
  </a>

  <img alt="GitHub" src="https://img.shields.io/github/license/cassiogroh/GoBarber-mobile?color=%23FF9000">
</p>

<p align="center">
  <a href="#%EF%B8%8F-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-to-contribute">How to contribute</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

<p align="center">
  <img alt="GoBarber Mobile" src="assets/mockup.jpg" width="70%">
</p>

## 💇🏻‍♂️ About the project

This app provides everything needed to organize appointments between barbers and customers.

 - Customers can choose the best time available to them.

 - Providers can see all their appointments and manage their schedule.

To see the **API client**, click here: [GoBarber API](https://github.com/cassiogroh/GoBarber-backend)<br />
To see the **web client**, click here: [GoBarber Web](https://github.com/cassiogroh/GoBarber)

## 🚀 Technologies

Technologies used to develop frontend mobile
 - [React-native](https://reactnative.dev/)
 - [Typescript](https://www.typescriptlang.org/)
 - [Axios](https://github.com/axios/axios)
 - [Styled-components](https://styled-components.com/)
 - [Date-fns](https://date-fns.org/)
 - [React-native-image-picker](https://www.npmjs.com/package/react-native-image-picker))
 - [React-native-datetime-picker](https://www.npmjs.com/package/@react-native-community/datetimepicker)
 - [React-native-vector-icons](https://github.com/oblador/react-native-vector-icons)
 - [Unform](https://github.com/Rocketseat/unform)
 - [Jest](https://jestjs.io/)
 - [Yup](https://www.npmjs.com/package/yup)

## 💻 Getting started

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)
- One instance of [PostgreSQL](https://www.postgresql.org/)

> Obs.: Docker recommended

**Clone the API project and access the folder**

```bash
$ git clone https://github.com/cassiogroh/GoBarber-backend && cd GoBarber-backend
```

**Follow the steps below**

```bash
# Install the dependencies
$ yarn

# Make a copy of '.env.example' to '.env'
# and set with YOUR environment variables.
# The aws variables do not need to be filled for dev environment
$ cp .env.example .env

# Create the instance of postgreSQL using docker
$ docker run --name gobarber-postgres -e POSTGRES_USER=docker \
              -e POSTGRES_DB=gostack_gobarber -e POSTGRES_PASSWORD=docker \
              -p 5432:5432 -d postgres

# Create the instance of mongoDB using docker
$ docker run --name mongodb -p 27017:27017 -d -t mongo

# Create the instance of redis using docker
$ docker run --name redis -p 6379:6379 -d -t redis:alpine

# Make a copy of 'ormconfig.example.json' to 'ormconfig.json'
# and set the values, if they are not filled,
# to connect with docker database containers
$ cp ormconfig.example.json ormconfig.json

# Once the services are running, run the migrations
$ yarn typeorm migration:run

# To finish, run the api service
$ yarn dev:server

# Well done, server started!

# Clone frontend mobile
$ git clone https://github.com/cassiogroh/GoBarber-mobile && cd GoBarber-mobile

# Install dependecies
$ yarn install

# Start react app using your favorite emulator
$ yarn android / yarn ios

# Well done, project is running!

```


## 🤔 How to contribute

**Fork this repository**

```bash
# Fork using GitHub command line or trhough website

$ gh repo fork cassiogroh/GoBarber-mobile
```

**Follow the steps below**

```bash
# Clone your fork
$ git clone your-fork-url && cd GoBarber-mobile

# Create a branch with your feature
$ git checkout -b my-feature

# Make the commit with your changes
$ git commit -m 'feat: My new feature'

# Send the code to your remote branch
$ git push origin my-feature
```

After your pull request is merged, you can delete your branch

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with 💜 &nbsp;by Cassio Groh 👋 &nbsp;[See my linkedin](https://www.linkedin.com/in/cassiogroh/)