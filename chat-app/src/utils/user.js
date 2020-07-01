/*
addUser
removeUser
getUser
getUsersinRoom
*/

const users = []

const addUser = ({id, name, room}) => {

    //Trim username and room
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(name === '' || room === '') {
        return {
            error: 'Username and room are required!'
        }
    }

    //Name and room must be unique
    const user = users.find(data => {
        return data.name === name && data.room === room
    })

    if(user) {
        return {
            error: 'Username has already been taken!'
        }
    }

    return users.push({id, name, room})
}

const removeUser = id => {
    const indexUser = users.findIndex(data => {
        return data.id === id
    })
    return users.splice(indexUser, 1)
}

const getUser = id => {
    const user = users.find(data => {
        return data.id === id
    })
    return user ? user : {error: 'User not found!'}
}

const getUsersInRoom = room => {
    const usersInRoom = users.filter(data => data.room === room)
    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}