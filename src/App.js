import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import OnBoarding from './pages/OnBoarding'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {useCookies} from 'react-cookie'
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const authToken = cookies.AuthToken

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                {authToken && <Route path="/dashboard" element={<Dashboard/>}/>}
                {authToken && <Route path="/onboarding" element={<OnBoarding/>}/>}
                {!authToken && <Route path="/forgot" element={<Forgot/>}/>}
                {!authToken && <Route path="/reset" element={<Reset/>}/>}
            </Routes>
        </BrowserRouter>
    )
}

export default App
