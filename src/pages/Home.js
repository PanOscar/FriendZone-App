import Nav from '../components/Nav'
import AuthModal from "../components/AuthModal"
import {useEffect, useState} from 'react'
import {useCookies} from "react-cookie"
import {useNavigate} from 'react-router-dom'


const Home = () => {
    const [showModal, setShowModal] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const authToken = cookies.AuthToken

    let navigate = useNavigate()

    const handleLogin = () => {
        setShowModal(true);
        setIsSignUp(false);
    };

    const handleRegister = () => {
        if (authToken) {
            removeCookie('Username', cookies.Username)
            removeCookie('AuthToken', cookies.AuthToken)
            window.location.reload()
            return
        }
        setShowModal(true)
        setIsSignUp(true)
    }

    useEffect(() => {
        if (authToken) {
            navigate('/dashboard')
        }
    })


    return (
        <div className="overlay">
            <Nav
                authToken={authToken}
                minimal={false}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp}
            />
            <div className="home">
                <h1 className="primary-title">Welcome to <br/><span className="primary-company">FriendZone</span></h1>
                {!authToken && (
                    <button
                        className="login-button"
                        onClick={handleLogin}
                        disabled={showModal}
                    >
                        Log in
                    </button>
                )}
                <button className="primary-button" onClick={handleRegister}>
                    {authToken ? 'Signout' : 'Create Account'}
                </button>


                {showModal && (
                    <AuthModal setShowModal={setShowModal} isSignUp={isSignUp}/>
                )}
            </div>
        </div>
    )
}
export default Home
