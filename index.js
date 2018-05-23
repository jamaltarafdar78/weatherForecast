'use strict';

const path = require('path');

const { 
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLFloat
} = require('graphql');

const express = require('express');  
const graphlHTTP = require('express-graphql'); 

var {
    getWeatherByCity
} = require('./data');

const PORT = process.env.PORT || 3000;
const server = express();


const OpenWeatherForecastMainType = new GraphQLObjectType({
    name: 'OpenWeatherMapForecastMain',
    description: 'Temperatures in the main type from an OpenWeatherMap forecast',
    fields: {
        temp: {
            type: GraphQLFloat,
            description: 'Expected temperature'
        },
        temp_min: {
            type: GraphQLFloat,
            description: 'Max temperature'
        },
        temp_max: {
            type: GraphQLFloat,
            description: 'Min temperature'
        }
    }
})

const openWeatherForecastType = new GraphQLObjectType({
    name: 'OpenWeatherMapForecast',
    description: '5 day, 3 hourly forecast',
    fields: {
        main: {
            type: OpenWeatherForecastMainType,
            description:  'Temperatures'
        },
        dt: {
            type: GraphQLString, 
            description: 'DateTime of forecast'
        }
    }
})

const openWeatherForecastQueryType = new GraphQLObjectType({
    name: 'OpenWeatherForecastQueryType',
    description: 'The root query type',
    fields:{
        forecast:{
            type: new GraphQLList(openWeatherForecastType),
            args: {
                city: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'UK City'
                }
            },
            resolve: (_, {city}) => getWeatherByCity(city)
        }
    }
})

const schemaJS = new GraphQLSchema({
    query: openWeatherForecastQueryType
})

server.use('/graphql', graphlHTTP({
    schema: schemaJS,
    graphiql: true
}));

server.use('/', express.static(path.join(__dirname, 'public')))

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT} `)
})