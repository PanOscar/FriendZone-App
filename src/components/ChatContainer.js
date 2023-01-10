import ChatHeader from './ChatHeader'
import MatchesDisplay from './MatchesDisplay'
import ChatDisplay from './ChatDisplay'
import {useEffect, useState} from 'react'
import TinderCard from "react-tinder-card";

const ChatContainer = ({user, filteredGenderedUsers, swiped, outOfFrame, lastDirection}) => {
    const [matchedUser, setMatchedUser] = useState(null)
    const [card, setCard] = useState(null)
    const [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight,
    ]);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    });
    return (
        <div className="chat-container">
            <ChatHeader user={user}/>

            <div className="multi-button">
                <button className="option" onClick={() => {
                    setMatchedUser(null);
                    setCard(null)
                }}>Matches
                </button>
                <button className="option" disabled={!matchedUser}>Chat</button>
                {windowSize[0] <= 479 &&
                    <button className="option" onClick={() => {
                        setMatchedUser(null);
                        setCard(true)
                    }}>Card</button>
                }
            </div>
            {card && !matchedUser && windowSize[0] <= 479 &&
                <div className="swipe-container">
                    <div className="card-container">
                        {filteredGenderedUsers?.length === 0 &&
                            <TinderCard
                                className="swipe"
                                key="tak"
                                onSwipe={() => console.log("No matches")}
                                onCardLeftScreen={() => console.log("No matches")}>
                                <div
                                    style={{backgroundImage: "url(" + filteredGenderedUsers.photo + ")"}}
                                    className="card">
                                    <h3>No matches</h3>
                                </div>
                            </TinderCard>
                        }
                        {filteredGenderedUsers?.map((genderedUser) =>
                            <TinderCard
                                className="swipe"
                                key={genderedUser.username}
                                onSwipe={(dir) => swiped(dir, genderedUser.username)}
                                onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>
                                <div
                                    style={{backgroundImage: "url(" + genderedUser.photo + ")"}}
                                    className="card">
                                    <h3>{genderedUser.first_name} {genderedUser.last_name}</h3>
                                </div>
                            </TinderCard>
                        )}
                        <div className="swipe-info">
                            {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
                        </div>
                    </div>
                </div>

            }
            {!matchedUser && !card &&
                <MatchesDisplay matches={JSON.parse(user?.users_id_match)} setClickedUser={setMatchedUser}/>}

            {matchedUser && !card && <ChatDisplay user={user} matchedUser={matchedUser}/>}
        </div>
    )
}

export default ChatContainer