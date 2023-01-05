import Nav from '../components/Nav'
import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import "react-datepicker/dist/react-datepicker.css";

const Forgot = () => {
    const [email, setEmail] = useState(null)
    const [error, setError] = useState(null)

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.get('https://uwo2besei9.execute-api.us-east-1.amazonaws.com/prod/user/forgot/' + email)

            if (response.status === 201) {
                navigate('/')
            } else if (response.status > 400) {
                setError('E-Mail address is wrong!')
            }

        } catch (err) {
            console.log(err)
            setError('E-Mail address is wrong!')
        }

    }

    return (
        <>
            <Nav
                minimal={true}
                setShowModal={() => {
                }}
                showModal={false}
            />

            <div className="onboarding">
                <h2>FORGOT YOUR PASSWORD?</h2>

                <form onSubmit={handleSubmit}>
                    <section>
                        {error != null &&
                            <div className="alert">
                                {error}
                            </div>
                        }

                        <label htmlFor="email">E-Mail</label>
                        <input
                            id="email"
                            type='text'
                            name="email"
                            placeholder="E-Mail"
                            required={true}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input type="submit"/>
                    </section>


                </form>
            </div>
        </>
    )
}
export default Forgot
