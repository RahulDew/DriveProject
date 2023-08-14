import React, { Component } from "react";
import { Route, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../context/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuthContext();
  const Navigate = useNavigate();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
};
// return (
//   <Route {...rest} render={
//     props => <Component {...rest} {...props} />
//   } />
// )
export default PrivateRoute;
