import React, { useState, useContext } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal } from 'antd';
import Link from 'next/link';
import AuthForm from '../components/forms/AuthForm';
import { useRouter } from 'next/router';
import { UserContext } from '../context';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [state, setState] = useContext(UserContext);

    async function handleSubmit(e){
        e.preventDefault();
        try{
            setLoading(true);
            const {data} = await axios.post(`/login`, {
                email,
                password,
            });
            if(data.error){
                toast.error(data.error);
                setLoading(false);
            }
            else{
                setState({
                  user:data.user,
                  token:data.token
                });
                // Saving in localStorage
                window.localStorage.setItem('auth', JSON.stringify(data));
                router.push("/");
            }
        } catch(err){
            if(err.response){
                toast.error(err.response.data)
            }
            setLoading(false);
        }
    }


    if(state && state.token) router.push("/user/dashboard");
  return (
    <div className='container-fluid'>
        <div className='row py-5 text-light bg-default-image'>
            <div className='col text-center'>
                <h1>Login Page</h1>
            </div>
        </div>
        <div className='row py-5'>
            <div className='col-md-6 offset-md-3'>
                <AuthForm 
                 handleSubmit={handleSubmit}
                 email={email}
                 setEmail={setEmail}
                 password={password}
                 setPassword={setPassword}
                 loading={loading}
                 page="login"
                />
            </div>
        </div>
        <div className='row'>
            <div className='col'>
                <p className='text-center'>Not yet registered? <Link href="/register" ><a>Register</a></Link></p>
            </div>
        </div>
        <div className='row'>
            <div className='col'>
                <p className='text-center'><Link href="/forgot-password" ><a className='text-danger'>Forgot password</a></Link></p>
            </div>
        </div>
    </div>
  )
}

export default Login