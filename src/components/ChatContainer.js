import ChatHeader from './ChatHeader'
import MatchesDisplay from './MatchesDisplay'
import ChatDisplay from './ChatDisplay'
import {useState} from 'react'

const ChatContainer = ({ user }) => {
    const [matchedUser, setMatchedUser] = useState(null)

    return (
        <div className="chat-container">
            <ChatHeader user={user}/>

            <div>
                <button className="option" onClick={() => setMatchedUser(null)}>Matches</button>
                <button className="option" disabled={!matchedUser}>Chat</button>
            </div>

            {!matchedUser &&
                <MatchesDisplay matches={JSON.parse(user?.users_id_match)} setClickedUser={setMatchedUser}/>}

            {matchedUser && <ChatDisplay user={user} matchedUser={matchedUser}/>}
        </div>
    )
}

export default ChatContainer