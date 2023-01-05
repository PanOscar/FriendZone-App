import TinderCard from 'react-tinder-card'
import {useEffect, useState} from 'react'
import ChatContainer from '../components/ChatContainer'
import {useCookies} from 'react-cookie'
import axios from 'axios'

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const username = cookies.Username


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
                    <ChatContainer user={user}/>
                    <div className="swipe-container">
                        <div className="card-container">

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
            </div>}
        </>
    )
}
export default Dashboard
