/* eslint-disable consistent-return */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-empty */
import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router";
import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const Authctx = useContext(AuthContext);
  const History = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const entredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAoN-ssiuWLLw_jL0KRU3AzjBZr4PQnwIM";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAoN-ssiuWLLw_jL0KRU3AzjBZr4PQnwIM";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: entredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      header: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json().then((data) => {
            const expirationTime = new Date(
              new Date().getTime() + +data.expiresIn * 1000
            );
            Authctx.login(data.idToken, expirationTime.toString());
            History.replace("/");
          });
        } else {
          return res.json().then((data) => {
            let errorMessaage = "Authentication Failed";
            if (data && data.error && data.error.message) {
              errorMessaage = data.error.message;
            }
            throw new Error(errorMessaage);
          });
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {isLoading ? (
            <p>Signing up....</p>
          ) : (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
