import axios from "axios";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";

const MatchesDisplay = ({ matches, setClickedUser }) => {
  const [matchedProfiles, setMatchedProfiles] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const matchedUsernames = matches;
  const username = cookies.Username;

  const getMatches = async () => {
    try {
      const response = await axios.get("https://fza-auth-laravel.herokuapp.com/user/usernames", {
        params: {usernames: matchedUsernames},
      });
      setMatchedProfiles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMatches();
  }, [matches]);

  const filteredMatchedProfiles = matchedProfiles?.filter(
      (matchedProfile) =>
          JSON.parse(matchedProfile?.users_id_match)
              ?.filter((profile) => profile.username !== username)
              .length > 0
  );

  return (
    <div className="matches-display">
      {filteredMatchedProfiles?.map((match, _index) => (
        <div
          key={_index}
          className="match-card"
          onClick={() => setClickedUser(match)}
        >
          <div className="img-container">
            <img src={match?.photo} alt={match?.first_name + " profile"}/>
          </div>
          <h3>{match?.first_name}</h3>
        </div>
      ))}
    </div>
  );
};

export default MatchesDisplay;
