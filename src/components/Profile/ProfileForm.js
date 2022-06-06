import classes from './ProfileForm.module.css';
import { useHistory } from 'react-router';
import AuthContext from '../../store/auth-context';
import { useRef, useContext } from 'react';

const ProfileForm = () => {
  const newPasswordRef = useRef();
  const Authctx = useContext(AuthContext);
  const History = useHistory()
  

  const submitHandler =(e)=>{
    e.preventDefault()

    const newPassword = newPasswordRef.current.value;
    console.log(newPassword)
    console.log(Authctx.token)
    
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAoN-ssiuWLLw_jL0KRU3AzjBZr4PQnwIM',{
    method:'POST',
    body:JSON.stringify({
      idToken: Authctx.token,
      password: newPassword,
      returnSecureToken: false
    }),
    headers:{
      'Content-Type':'application/json'
    }
  }).then(res =>{
    const data =res.json()
   console.log(data)
   History.replace('/')
  })
  }
  
  return (
    <form className={classes.form} onSubmit ={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password'  ref={newPasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
