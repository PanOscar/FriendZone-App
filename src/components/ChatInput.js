import {useState} from 'react'
import axios from 'axios'

const ChatInput = ({user, clickedUser, getUserMessages, getClickedUsersMessages}) => {
    const [textArea, setTextArea] = useState("")
    const Username = user?.username
    const clickedUsername = clickedUser?.username

    const addMessage = async () => {
        const message = {
            fromUsername: Username,
            toUsername: clickedUsername,
            message: textArea
        }
        try {
            await axios.post('https://uwo2besei9.execute-api.us-east-1.amazonaws.com/prod/messages/newMessage', message, {
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
            <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)}/>
            <button className="secondary-button" onClick={addMessage}>Submit</button>
        </div>
    )
}

export default ChatInput