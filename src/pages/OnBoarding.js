import Nav from '../components/Nav'
import React, {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import {useLocation, useNavigate} from 'react-router-dom'
import DatePicker from "react-datepicker";
import axios from 'axios'
import "react-datepicker/dist/react-datepicker.css";

const OnBoarding = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [formData, setFormData] = useState({
        username: cookies.Username,
        newPassword: '',
        first_name: "",
        last_name: "",
        birthday: "",
        gender_reveal: false,
        gender: "man",
        gender_interest: "woman",
        photo: "",
        about: ""

    })
    const location = useLocation();

    useEffect(() => {
        if (location.state != null) {
            setFormData(location.state)
        }
    }, [])

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        console.log('submitted')
        e.preventDefault()
        try {
            const response = await axios.put('https://uwo2besei9.execute-api.us-east-1.amazonaws.com/prod/user/update/' + cookies.Username,
                null, {
                    params: {
                        first_name: formData?.first_name,
                        last_name: formData?.last_name,
                        birthday: formData?.birthday,
                        gender: formData?.gender,
                        gender_reveal: formData?.gender_reveal,
                        gender_interest: formData?.gender_interest,
                        about: formData?.about,
                        photo: formData?.photo,
                        newPassword: formData?.newPassword
                    }
                })
            console.log(response)
            const success = response.status === 201
            if (success) navigate('/dashboard')
        } catch (err) {
            console.log(err)
        }

    }

    const handleChange = (e) => {
        console.log('e', e)
        const value = e.target?.type ? e.target.type === "checkbox" ? e.target.checked : e.target.value : e
        const name = e.target?.name ? e.target.name : 'birthday'
        if (name === 'birthday') {
            setStartDate(`${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`)
        }

        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
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
                <h2>EDIT ACCOUNT</h2>

                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            type='text'
                            name="first_name"
                            placeholder="First Name"
                            required={true}
                            value={formData?.first_name}
                            onChange={handleChange}
                        />
                        <label htmlFor="last_name">Last Name</label>
                        <input
                            id="last_name"
                            type='text'
                            name="last_name"
                            placeholder="Last Name"
                            required={true}
                            value={formData?.last_name}
                            onChange={handleChange}
                        />
                        <label>Birthday</label>
                        <div className="multiple-input-container">
                            <DatePicker selected={formData?.birthday ? new Date(formData.birthday) : startDate}
                                        name="birthday"
                                        onChange={handleChange}
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        maxDate={new Date()}
                                        dropdownMode="select"
                                        dateFormat="yyyy-MM-dd"/>
                        </div>

                        <label>Gender</label>
                        <div className="multiple-input-container">
                            <input
                                id="man-gender-identity"
                                type="radio"
                                name="gender"
                                value="man"
                                onChange={handleChange}
                                checked={formData?.gender === "man"}
                            />
                            <label htmlFor="man-gender-identity">Man</label>
                            <input
                                id="woman-gender-identity"
                                type="radio"
                                name="gender"
                                value="woman"
                                onChange={handleChange}
                                checked={formData?.gender === "woman"}
                            />
                            <label htmlFor="woman-gender-identity">Woman</label>
                            <input
                                id="more-gender-identity"
                                type="radio"
                                name="gender"
                                value="more"
                                onChange={handleChange}
                                checked={formData?.gender === "more"}
                            />
                            <label htmlFor="more-gender-identity">More</label>
                        </div>

                        <label htmlFor="gender_reveal">Show Gender on my Profile</label>

                        <input
                            id="gender_reveal"
                            type="checkbox"
                            name="gender_reveal"
                            onChange={handleChange}
                            checked={formData?.gender_reveal}
                        />

                        <label>Show Me</label>

                        <div className="multiple-input-container">
                            <input
                                id="man-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="man"
                                onChange={handleChange}
                                checked={formData?.gender_interest === "man"}
                            />
                            <label htmlFor="man-gender-interest">Man</label>
                            <input
                                id="woman-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="woman"
                                onChange={handleChange}
                                checked={formData?.gender_interest === "woman"}
                            />
                            <label htmlFor="woman-gender-interest">Woman</label>
                            <input
                                id="everyone-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="everyone"
                                onChange={handleChange}
                                checked={formData?.gender_interest === "everyone"}
                            />
                            <label htmlFor="everyone-gender-interest">Everyone</label>

                        </div>

                        <label htmlFor="about">About me</label>
                        <input
                            id="about"
                            type="text"
                            name="about"
                            required={true}
                            placeholder="I like long walks..."
                            value={formData?.about}
                            onChange={handleChange}
                        />

                        <input type="submit"/>
                    </section>

                    <section>
                        <label htmlFor="newPassword">New password</label>
                        <input
                            id="newPassword"
                            type='password'
                            name="newPassword"
                            placeholder="New password"
                            value={formData?.newPassword}
                            onChange={handleChange}
                        />
                        <label htmlFor="photo">Profile Photo</label>
                        <input
                            type="photo"
                            name="photo"
                            id="photo"
                            placeholder="Profile photo Url"
                            value={formData?.photo}
                            onChange={handleChange}
                            required={true}
                        />
                        <div className="photo-container">
                            {formData?.photo && <img src={formData?.photo} alt="profile pic preview"/>}
                        </div>


                    </section>

                </form>
            </div>
        </>
    )
}
export default OnBoarding
