# Guide for Weather Forecast App

## Introduction 
This app contains the Server and Client to retrieve and display 5-day, 3-hourly temperature and weather forecast for selected UK cities.

The data comes from http://api.openweathermap.org/

The Server has a Graph QL endpoint ($host/graphql) where a *forecast* query that accepts a city input parameter.

The client uses [Apollo Graph QL Client](https://www.apollographql.com/client) to direct use the Graph QL endpoint to get temperature and weather for the chosen city.

## Scripts

`npm i` install dependencies

`npm run build` build client app

`npm start` start Graph QL server and serve app client under root path 

`npm run dev` start nodemon watcher on root of project 