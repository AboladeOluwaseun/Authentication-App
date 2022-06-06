import react, {useState, useEffect} from 'react'

let logOutTimer

const AuthContext = react.createContext({
    token: '',
    isLoggedIn: false,
    login: (token)=>{},
    logout: ()=>{}
})

const calculateRemainingTime =(expirationTime) =>{
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingDuration = adjExpirationTime -currentTime;

    return remainingDuration;
}

const retrieveStoredToken = ()=>{
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate =localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationDate);
    console.log(remainingTime)
    if (remainingTime <= 60000 ){
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime')
        return null;
    }
    return {
        token:storedToken,
        duration: remainingTime
    };
    
}

export const AuthContextProvider = (props)=>{
    const tokenData = retrieveStoredToken();
    let initialToken;
    if(tokenData){
        initialToken = tokenData.token;
    }
   
    const [token, setToken] = useState(initialToken)
    const userIsLoggedIn = !!token; 
 
    

    const logOutHandler = ()=>{
        setToken(null);
        localStorage.removeItem('token')

        if(logOutTimer){
            clearTimeout(logOutTimer);
        }
    }

    const logInHandler = (token, expirationTime)=>{
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirattionTime', expirationTime)

        const remainingTime = calculateRemainingTime(expirationTime)   
        logOutTimer = setTimeout(logOutHandler, remainingTime);
        console.log(remainingTime)
    }

    useEffect(()=>{
        if(tokenData){
            console.log(tokenData.duration)
            logOutTimer = setTimeout(logOutHandler, tokenData.duration)
        }
    }, [tokenData] )

    const contextValue ={
        token:token,
        isLoggedIn: userIsLoggedIn,
        login:logInHandler,
        logout:logOutHandler
    }

    return <AuthContext.Provider value ={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext;