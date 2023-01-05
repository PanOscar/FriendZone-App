const Chat = ({descendingOrderMessages, Username}) => {

    return (
        <>
            <div className="chat-display">
                {descendingOrderMessages.map((message, _index) => (
                    <div key={_index} className={message.username === Username ? 'me' : 'from'}>
                        <div className="chat-message-header">
                            <div className="img-container">
                                <img src={message.img} alt={message.name + ' profile'}/>
                            </div>
                            <p>{message.name}</p>
                        </div>
                        <div className="chat-context">
                            <div className="chat-bubble">
                                <span>{message.message}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Chat