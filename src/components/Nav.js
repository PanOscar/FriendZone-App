import whiteLogo from "../images/Friendzone150.png";
import colorLogo from "../images/Friendzone150.png";

const Nav = ({authToken, minimal, setShowModal, showModal, setIsSignUp}) => {


    return (
        <nav>
            <div className="logo-container" style={{margin: '15px 15px 15px auto'}}>
                <img
                    className="logo"
                    src={minimal ? colorLogo : whiteLogo}
                    alt="logo"
                />
            </div>
            {minimal ?
                <div style={{marginLeft: 'auto', marginRight: '15px', cursor: 'pointer'}}>
                    <a href='/'>Go back</a>
                </div>
                : <div style={{marginLeft: 'auto'}}>

                </div>
            }
        </nav>
    );
};
export default Nav;
