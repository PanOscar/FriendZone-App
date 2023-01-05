import Chat from './Chat'
import ChatInput from './ChatInput'
import axios from 'axios'
import {useEffect, useState} from "react"


const ChatDisplay = ({user, matchedUser}) => {
    const Username = user?.username
    const clickedUserUsername = matchedUser?.username
    const [usersMessages, setUsersMessages] = useState(null)
    const [clickedUsersMessages, setClickedUsersMessages] = useState(null)

    const getUsersMessages = async () => {
        try {
            const response = await axios.get('https://uwo2besei9.execute-api.us-east-1.amazonaws.com/prod/messages/find', {
                params: {fromUsername: Username, toUsername: clickedUserUsername}
            })
            setUsersMessages(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getClickedUsersMessages = async () => {
        try {
            const response = await axios.get('https://uwo2besei9.execute-api.us-east-1.amazonaws.com/prod/messages/find', {
                params: {fromUsername: clickedUserUsername, toUsername: Username}
            })
            setClickedUsersMessages(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUsersMessages()
        getClickedUsersMessages()
    }, [])

    const messages = []

    usersMessages?.forEach(message => {
        const messageArray = {}
        messageArray['username'] = user?.username
        messageArray['name'] = user?.first_name
        messageArray['img'] = user?.photo
        messageArray['message'] = message.message
        messageArray['created_date'] = message.created_date
        messages.push(messageArray)
    })

    clickedUsersMessages?.forEach(message => {
        const messageArray = {}
        messageArray['username'] = matchedUser?.username
        messageArray['name'] = matchedUser?.first_name
        messageArray['img'] = matchedUser?.photo
        messageArray['message'] = message.message
        messageArray['created_date'] = message.created_date
        messages.push(messageArray)
    })

    const descendingOrderMessages = messages?.sort((a, b) => a.created_date.localeCompare(b.created_date))

    return (
        <>
            <Chat descendingOrderMessages={descendingOrderMessages} Username={Username}/>
            <ChatInput
                user={user}
                clickedUser={matchedUser} getUserMessages={getUsersMessages}
                getClickedUsersMessages={getClickedUsersMessages}/>
        </>
    )
}

export default ChatDisplay