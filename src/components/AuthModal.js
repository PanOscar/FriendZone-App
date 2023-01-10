import {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useCookies} from 'react-cookie'


const AuthModal = ({setShowModal, isSignUp}) => {
    const [email, setEmail] = useState(null)
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(null)

    let navigate = useNavigate()

    const handleClick = () => {
        setShowModal(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (isSignUp && (password !== confirmPassword)) {
                setError('Passwords need to match!')
                return
            }

            let response
            if (isSignUp) {
                response = await axios.post(` https://uwo2besei9.execute-api.us-east-1.amazonaws.com/prod/user/register`,
                    null,
                    {
                        mode: 'cors',
                        crossdomain: true,
                        withCredentials: false,
                        credentials: 'same-origin',
                        params: {
                            username: username,
                            email: email,
                            password: password,

                        }
                    }
                )
            } else {
                response = await axios.post(` https://uwo2besei9.execute-api.us-east-1.amazonaws.com/prod/user/${'login/' + email}`,
                    null,
                    {
                        mode: 'cors',
                        crossdomain: true,
                        withCredentials: false,
                        credentials: 'same-origin',
                        params: {password}
                    }
                )
            }

            const success = response.status === 201

            if (success) {
                setCookie('AuthToken', response.data.api_key)
                setCookie('Username', response.data.username)
            }

            if (success && isSignUp) navigate('/onboarding')
            if (success && !isSignUp) navigate('/dashboard')

            window.location.reload()

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="auth-modal">
            <svg className="close-icon" onClick={handleClick} height="20" width="20">
                <line x1="0" y1="0" x2="20" y2="20" style={{stroke: 'red', strokeWidth: '2px'}}/>
                <line x1="20" y1="0" x2="0" y2="20" style={{stroke: 'red', strokeWidth: '2px'}}/>
            </svg>

            <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>
            <p>By clicking Log In, you agree to our terms. Learn how we process your data in our Privacy Policy and
                Cookie Policy.</p>
            {isSignUp &&
                <div>
                    <h4>Password should contain:</h4>
                    <ul>
                        <li>Min 8 characters</li>
                        <li>At least 1 special character</li>
                        <li>At least 1 Uppercase</li>
                    </ul>
                </div>
            }
            <form onSubmit={handleSubmit}>
                {isSignUp && <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="username"
                    required={true}
                    onChange={(e) => setUsername(e.target.value)}
                />
                }
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp && <input
                    type="password"
                    id="password-check"
                    name="password-check"
                    pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}"
                    placeholder="confirm password"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}
                <input className="secondary-button" type="submit"/>
                <p>{error}</p>
                <div className="forgot">
                    <p>Forgot your password? <a href="/forgot">Reset Password</a></p>
                </div>
            </form>


        </div>
    )
}
export default AuthModal
