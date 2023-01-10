import {useState} from 'react'
import axios from 'axios'

const ChatInput = ({
                       user,
                       stompClient,
                       messageData,
                       setMessageData,
                       clickedUser,
                       getUserMessages,
                       getClickedUsersMessages
                   }) => {
    const [textArea, setTextArea] = useState("")
    const Username = user?.username
    const clickedUsername = clickedUser?.username

    const handleMessage = (event) => {
        const {value} = event.target;
        setMessageData({...messageData, "message": value});
    }
    const keyPress = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            addMessage(e.target.value)
        }
    }
    const addMessage = async () => {
        const message = {
            fromUsername: Username,
            toUsername: clickedUsername,
            message: textArea
        }
        if (textArea === "") {
            return
        }
        if (stompClient) {
            stompClient.send("/app/message", {}, JSON.stringify(message));
            setMessageData({...messageData, "message": ""});
        }
        try {
            const response = await axios.post('https://uwo2besei9.execute-api.us-east-1.amazonaws.com/prod/messages/newMessage', message, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            getUserMessages()
            getClickedUsersMessages()
            setTextArea("")
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="chat-input">
                <textarea onKeyDown={keyPress} value={textArea} onChange={(e) => {
                    handleMessage(e)
                    setTextArea(e.target.value)
                }}/>
            <button className="secondary-button" type="submit" onClick={addMessage}>Submit</button>
        </div>
    )
}

export default ChatInput