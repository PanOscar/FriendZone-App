import TinderCard from 'react-tinder-card'
import {useEffect, useState} from 'react'
import ChatContainer from '../components/ChatContainer'
import {useCookies} from 'react-cookie'
import axios from 'axios'
import {useNavigate} from "react-router-dom";

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
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
    const username = cookies.Username
    let navigate = useNavigate()

    if (!username) {
        navigate("/")
    }

    const getUser = async () => {
        try {
            const response = await axios.get('https://uwo2besei9.execute-api.us-east-1.amazonaws.com/prod/user/get/' + username)
            setUser(response.data[0])
        } catch (error) {
            console.log(error)
        }
    }
    const getGenderedUsers = async () => {
        try {
            const response = await axios.get('https://uwo2besei9.execute-api.us-east-1.amazonaws.com/prod/user/gender_group', {
                params: {gender: user?.gender_interest}
            })
            setGenderedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()

    }, [])

    useEffect(() => {
        if (user) {
            getGenderedUsers()
        }
    }, [user])

    const updateMatches = async (matchedUsernames) => {
        try {
            await axios.put('https://uwo2besei9.execute-api.us-east-1.amazonaws.com/prod/user/add_match', null, {
                params: {username, match_id: matchedUsernames}
            })
            getUser()
        } catch (err) {
            console.log(err)
        }
    }


    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    const matchedUsernames = user?.users_id_match
    const filteredGenderedUsers = genderedUsers?.filter(genderedUser => !JSON.parse(matchedUsernames)?.includes(genderedUser.username))


    return (
        <>
            {user &&
                <div className="dashboard">
                    <ChatContainer user={user} filteredGenderedUsers={filteredGenderedUsers}
                                   lastDirection={lastDirection} swiped={swiped} outOfFrame={outOfFrame}/>
                    {windowSize[0] > 479 &&
                        <div className="swipe-container">
                            <div className="card-container">
                                {filteredGenderedUsers?.length === 0 &&
                                    <TinderCard
                                        className="swipe"
                                        key="tak"
                                        onCardLeftScreen={() => console.log("No matches")}>
                                        <div
                                            style={{backgroundImage: "url(" + filteredGenderedUsers.photo + ")"}}
                                            className="card">
                                            <div
                                                className="half-background">
                                                <h3>No more users to match</h3>
                                            </div>
                                        </div>
                                    </TinderCard>
                                }
                                {filteredGenderedUsers?.map((genderedUser) =>
                                    <TinderCard
                                        className="swipe"
                                        key={genderedUser.username}
                                        onCardLeftScreen={(dir) => swiped(dir, genderedUser.username)}>
                                        <div
                                            style={{backgroundImage: "url(" + genderedUser.photo + ")"}}
                                            className="card clearfix">
                                            <div
                                                className="half-background">
                                                <h3>{genderedUser.first_name} {genderedUser.last_name}</h3>
                                                <span><b>About:</b> {genderedUser.about}</span>
                                                {genderedUser?.gender_reveal &&
                                                    <span><b>Gender:</b> {genderedUser?.gender}</span>
                                                }
                                            </div>
                                        </div>
                                    </TinderCard>
                                )}
                                <div className="swipe-info">
                                    {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
                                </div>
                            </div>
                        </div>
                    }
                </div>}
        </>
    )
}
export default Dashboard
