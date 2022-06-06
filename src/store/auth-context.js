/* eslint-disable react/prop-types */
import react, { useState, useEffect, useCallback } from "react";
import React from "react";

let logOutTimer;

const AuthContext = react.createContext({
  token: "",
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  console.log(remainingDuration);
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  console.log(remainingTime);
  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;

  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const logOutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logOutTimer) {
      clearTimeout(logOutTimer);
    }
  }, []);

  const logInHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logOutTimer = setTimeout(logOutHandler, remainingTime);
    console.log(remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logOutTimer = setTimeout(logOutHandler, tokenData.duration);
    }
  }, [logOutHandler, tokenData]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: logInHandler,
    logout: logOutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
