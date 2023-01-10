import Chat from './Chat'
import ChatInput from './ChatInput'
import axios from 'axios'
import {useEffect, useRef, useState} from "react"
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'ws://fza-chat.herokuapp.com/ws-message';
var stompClient = null;

const ChatDisplay = ({user, matchedUser}) => {
    const Username = user?.username
    const clickedUserUsername = matchedUser?.username
    const [usersMessages, setUsersMessages] = useState(null)
    const [clickedUsersMessages, setClickedUsersMessages] = useState(null)
    const [messageData, setMessageData] = useState({
        fromUsername: '',
        toUsername: '',
        message: ''
    });
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }


    useEffect(() => {
        connect();
    }, [])

    const connect = () => {
        let Sock = new SockJS('https://fza-chat.herokuapp.com/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setMessageData({...messageData, "connected": true});
        stompClient.subscribe('/topic/message', onMessageReceived);
    }

    const onMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        setMessageData(payloadData)
        const messageArray3 = {}
        messageArray3['username'] = payloadData?.fromUsername
        messageArray3['name'] = payloadData?.fromUsername === Username ? user?.name : matchedUser?.name
        messageArray3['img'] = payloadData?.fromUsername === Username ? user?.photo : matchedUser?.photo
        messageArray3['message'] = payload.message
        messageArray3['created_date'] = payload.created_date
        messages.push(messageArray3)

        getClickedUsersMessages()
        getUsersMessages()
        window.fetch()
    }

    const onError = (err) => {
        console.log(err);
    }


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

    useEffect(() => {
        scrollToBottom()
    }, [descendingOrderMessages])

    return (
        <>
            <Chat descendingOrderMessages={descendingOrderMessages} Username={Username}
                  messagesEndRef={messagesEndRef}/>
            <ChatInput
                user={user}
                stompClient={stompClient}
                messageData={messageData}
                setMessageData={setMessageData}
                clickedUser={matchedUser} getUserMessages={getUsersMessages}
                getClickedUsersMessages={getClickedUsersMessages}/>
        </>
    )
}

export default ChatDisplay