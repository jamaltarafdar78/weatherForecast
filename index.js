'use strict';

const { 
    GraphQLSchema, 
    GraphQLInputObjectType,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLList
} = require('graphql');
const express = require('express');  
const graphlHTTP = require('express-graphql'); 
const { nodeInterface, nodeField } = require('./interfaces/node');
const { 
    globalIdField,
    connectionDefinitions,
    connectionFromPromisedArray,
    connectionArgs,
    mutationWithClientMutationId
} = require('graphql-relay');


var {
    createVideo,
    getVideoById, 
    getVideos
} = require('./data');

const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
    name: 'Video',
    description: 'A video on Egghead.io',
    fields: {
        id: globalIdField(),
        title: {
            type: GraphQLString,
            description: 'Title'
        },
        duration: {
            type: GraphQLInt,
            description: 'secs'
        },
        watched: {
            type: GraphQLBoolean
        },
        released: {
            type: GraphQLBoolean
        }
    },
    interfaces: [nodeInterface]
})

exports.videoType = videoType;

const { connectionType: VideoConnection }= connectionDefinitions({
    nodeType: videoType,
    connectionFields: () => ({
        totalCount: {
            type: GraphQLInt,
            description: 'Total number of videos',
            resolve: conn => conn.edges.length
        }
    })
})

const queryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'The root query type',
    fields: {
        video: {
            type: videoType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID), 
                    description: 'id'
                }
            },
            resolve: (_, {id}) => getVideoById(id)
        },
        videos: {
            type: VideoConnection,
            args: connectionArgs,
            resolve: (_, args) => connectionFromPromisedArray(
                getVideos(),
                args
            )
        },
        node: nodeField
    }
})

const videoMutation = mutationWithClientMutationId({
    name: 'AddVideo',
    inputFields: {
        title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The title of the video'
        },
        duration: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'seconds'
        },
        released: {
            type: new GraphQLNonNull(GraphQLBoolean)
        }
    },
    outputFields: {
        video: {
            type: videoType
        }
    },
    mutateAndGetPayload: args => new Promise((resolve, reject) => Promise.resolve(createVideo(args))
        .then(video => resolve({ video }))
        .catch(reject)
    )
})

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root mutation',
    fields: {
        createVideo: videoMutation
    }
})

const schemaJS = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
})

server.use('/graphql', graphlHTTP({
    schema: schemaJS,
    graphiql: true
}));

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT} `)
})