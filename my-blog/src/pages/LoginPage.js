import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';


const LoginPage =() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // eslint-disable-next-line
    const logIn = async() => {
        try {
        await signInWithEmailAndPassword(getAuth(), email, password);
        navigate('/articles');
        } catch (e) {
            setError(e.message);
        }
    }
    
    return (
        <>
        <h1>Log In</h1>
        {error && <p className="error">{error}</p>}
        <input placeholder="Your Email Address" value={email} onChange={e => setEmail(e.target.value)}></input>
        <input type="password" placeholder="Your Password" value={password} onChange={e => setPassword(e.target.value)}/>
        <button onClick={logIn}>Log In</button><p></p>
        <Link to="/create-account">Create Account</Link>
        </>
    );

}
export default LoginPage;