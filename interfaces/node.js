const {
    nodeDefinitions,
    fromGlobalId
} = require('graphql-relay');

const { getObjectById } = require('../data');

const { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
        const { type, id } = fromGlobalId(globalId);
        return getObjectById(type, id);
    },
    (object) => {
        const { videoType } = require('../');
        return object.title ? videoType : null
    }   
)

exports.nodeInterface = nodeInterface;
exports.nodeField = nodeField;