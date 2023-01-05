import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'


const ChatHeader = ({user}) => {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    let navigate = useNavigate()

    const handleClick = () => {
        if (cookies.AuthToken) {
            navigate('/onboarding', {state: user})
        }
    }

    const logout = () => {
        removeCookie('UserId', cookies.Username)
        removeCookie('AuthToken', cookies.AuthToken)
        navigate('/')
        window.location.reload()
    }

    return (
        <div className="chat-container-header">
            <div className="profile" onClick={handleClick}>
                <div className="img-container">
                    <img src={user.photo} alt={"photo of " + user.first_name}/>
                </div>
                <h3>{user.first_name}</h3>
            </div>
            <i className="log-out-icon" onClick={logout}>Logout</i>
        </div>
    )
}

export default ChatHeader