import Nav from '../components/Nav'
import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'
import "react-datepicker/dist/react-datepicker.css";

const Reset = () => {
    const [newPassword, setNewPassword] = useState(null)
    const [confirmNewPassword, setConfirmNewPassword] = useState(null)
    const [Selector, setSelector] = useState(null)
    const [Validator, setValidator] = useState(null)

    const [error, setError] = useState(null)

    let navigate = useNavigate()
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    useEffect(() => {
        setSelector(params.get('selector'))
        setValidator(params.get('validator'))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (newPassword !== confirmNewPassword) {
                setError("Passwords are not the same")
                return
            }
            const response = await axios.put('https://uwo2besei9.execute-api.us-east-1.amazonaws.com/prod/user/reset', null,
                {
                    params: {
                        new_pass: newPassword,
                        new_pass_c: confirmNewPassword,
                        selector: Selector,
                        validator: Validator
                    }
                })

            if (response.status === 201) {
                navigate('/')
            }

        } catch (err) {
            console.log(err)
            setError('Error')
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
                <h2>RESET YOUR PASSWORD</h2>

                <form onSubmit={handleSubmit}>
                    <section>
                        {error != null &&
                            <div className="alert">
                                {error}
                            </div>
                        }

                        <label htmlFor="new_pass">New Password</label>
                        <input
                            id="new_pass"
                            type='password'
                            name="new_pass"
                            placeholder="New Password"
                            required={true}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <label htmlFor="new_pass_c">Confirm new password</label>
                        <input
                            id="new_pass_c"
                            type='password'
                            name="new_pass_c"
                            placeholder="Confirm new password"
                            required={true}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <label htmlFor="selector">Selector</label>
                        <input
                            id="selector"
                            type='text'
                            name="selector"
                            placeholder="Selector"
                            required={true}
                            value={Selector}
                            onChange={(e) => setSelector(e.target.value)}
                        />
                        <label htmlFor="validator">Validator</label>
                        <input
                            id="validator"
                            type='text'
                            name="validator"
                            placeholder="Validator"
                            required={true}
                            value={Validator}
                            onChange={(e) => setValidator(e.target.value)}
                        />

                        <input type="submit"/>
                    </section>


                </form>
            </div>
        </>
    )
}
export default Reset
