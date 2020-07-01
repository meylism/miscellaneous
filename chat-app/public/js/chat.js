const socket = io()

const $formChat = document.querySelector('#formChat')
const $buttonLocation = document.querySelector('#shareLocation')
const $buttonSend = $formChat.querySelector('button')
const $inputMessage = $formChat.querySelector('input')
const $containerMessages = document.querySelector('#messagesContainer')
const $sidebarChat = document.querySelector('#sidebarChat')
const $sidebarBox = document.querySelector('.sidebar__box')


//Templates
const templateMessage = document.querySelector('#template-message').innerHTML
const templateMessageMine = document.querySelector('#template-message--mine').innerHTML
const templateLocation = document.querySelector('#template-location').innerHTML
const templateUsers = document.querySelector('#template-users').innerHTML

const user = Qs.parse(window.location.search, {ignoreQueryPrefix: true})
socket.emit('join', user, (error) => {
    if(error) {
        alert(`Error: ${error}`)
        location.pathname = '/'
        //location.search = ''
    }
})

const autoScroll = () => {
    const $message = document.querySelector('.message')
    
    const heightOfMessage = parseInt(window.getComputedStyle($message).marginBottom) + $message.offsetHeight
    const scrHeight = $containerMessages.scrollHeight
    const scrTop = $containerMessages.scrollTop
    const offHeight = $containerMessages.offsetHeight
    
    if(scrHeight - scrTop >= offHeight)
        $containerMessages.scrollTop += heightOfMessage
    
}

$formChat.addEventListener('submit', (e) => {
    e.preventDefault()
    //This is how we select by name
    const message = e.target.elements.message.value
    $buttonSend.setAttribute('disabled', 'disabled')
    $inputMessage.value = ''
    $inputMessage.focus()


    socket.emit('message', message, msg => {
        $buttonSend.removeAttribute('disabled', 'disabled')
        if(msg.error) return alert('Using profane words are not allowed!')
        const html = Mustache.render(templateMessageMine, {
            message: message,
            date: moment().format('h:mm A'),
            name: user.name
        })
        $containerMessages.insertAdjacentHTML('beforeend', html)
        autoScroll()
    })
    
})

socket.on('message', (data) => {
    const html = Mustache.render(templateMessage, {
        message: data.message,
        date: moment(data.date).format('h:mm A'),
        name: data.name

    })
    $containerMessages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationShared', (data) => {
    const locationHTML = Mustache.render(templateLocation, {
        name: data.name,
        location: data.location ,
        date: moment(data.date).format('h:mm A')
    })
    $containerMessages.insertAdjacentHTML('beforeend', locationHTML)
    autoScroll()
})


$buttonLocation.addEventListener('click', () => {
    $buttonLocation.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }
    navigator.geolocation.getCurrentPosition((data) => {
        socket.emit('location', data.coords.latitude, data.coords.longitude, () => {
            console.log('Location shared successfully!')
            $buttonLocation.removeAttribute('disabled', 'disabled')
        })
    })
    
})

socket.on('updateUsers', ({users, room}) => {
    const html = Mustache.render(templateUsers, {
        users: users,
        roomName: room
    })
    $sidebarBox.innerHTML = html
})