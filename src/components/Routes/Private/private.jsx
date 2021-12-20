import React, { useContext, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import StoreContext from '../../../components/Store/Context';
import Portas from '../../../portas';

const RoutesPrivate = ({ component: Component, user, ...rest}) => {
  const { token } = useContext(StoreContext);
  const [currentUser, setCurrentUser] = useState("");

  const getUserType = async () => {
        try {
            const response = await fetch(Portas().serverHost + "/verify/" + token,
              {
                method: "GET",
              }
            );

        const resJSON = await response.json();
        return resJSON;

        } catch (err) {
            return "";
        }
    }

    getUserType().then(resJSON => {
      setCurrentUser(resJSON);
    });

  return (
  <div>
    {currentUser === user?
    <Route
      {...rest}
      render={() => token
        ? <Component {...rest} />
        : <Redirect to="/" />
      }
    />
    : <div></div>}
    </div>
  )
}

export default RoutesPrivate;