const messageGenerator = (message, name) => {
    return {
        name,
        message,
        date: new Date().getTime()
    }
}

const locationGenerator = (latitude, longitude, name) => {
    return {
        name,
        location: `https://www.google.com/maps/@${latitude},${longitude},10z`,
        date: new Date().getTime()
    }
}

module.exports = {
    messageGenerator,
    locationGenerator
}