const videoA = {
    id: 'a',
    title: 'bar',
    duration: 180,
    released: true,
    watched: true
}

const videoB = {
    id: 'b',
    title: 'foo',
    duration: 100, 
    released: true,
    watched: true
}

const videos = [videoA, videoB];

const getObjectById = (type, id) => {

    const types = {
        video: getVideoById
    }

    return types[type.toLowerCase()](id);
}

const getVideoById = (id) => new Promise((resolve) => {
    const [video] = videos.filter(v => v.id === id );
    return resolve({video})
})

exports.getObjectById = getObjectById;

exports.getVideos = () => new Promise((resolve) => resolve(videos))

exports.getVideoById = getVideoById

exports.createVideo = ({title, duration, released}) => {
    const video = {
        id: (new Buffer(title, 'utf8')).toString('base64'),
        title,
        duration,
        released,
        watched: false
    }

    videos.push(video);

    return video;
}