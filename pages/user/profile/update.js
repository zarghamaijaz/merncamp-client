import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Avatar } from 'antd';
import Link from 'next/link';
import AuthForm from '../../../components/forms/AuthForm';
import { UserContext } from '../../../context';
import { useRouter } from 'next/router';
import { LoadingOutlined, CameraOutlined } from '@ant-design/icons';


const ProfileUpdate = () => {
    const [username, setUsername] = useState("");
    const [about, setAbout] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secret, setSecret] = useState("");
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useContext(UserContext);

    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);

    const router = useRouter();

    useEffect(()=>{
        if(state && state.user){
            // console.log("user from state => ", state.user )
            setUsername(state.user.username);
            setAbout(state.user.about);
            setName(state.user.name);
            setEmail(state.user.email);
            setImage(state.user.image)
        }
    }, [state && state.user])


    const handleImage = async (e) => {
        const file = e.target.files[0];
        let formData = new FormData();
        formData.append("image", file);
        console.log([...formData])
        setUploading(true);
        try{
            const {data} = await axios.post("/upload-image", formData)
            console.log("Uploaded image Data => ", data)
            setImage({
            url: data.url,
            public_id: data.public_id
            })
            setUploading(false);
        }catch(err){
            console.log(err);
            toast.error("Something went wrong!")
            setUploading(false);
        }
    }
    async function handleSubmit(e){
        e.preventDefault();
        console.log(name, email, password, secret)
        try{
            setLoading(true);
            const {data} = await axios.put(`/profile-update`, {
                username,
                about,
                name,
                email,
                password,
                secret,
                image,
            });
            console.log("Update response => ", data)
            if(data.error){
                toast.error(data.error);
                setLoading(false);
            }
            else{
                // Update local storage and update user
                let auth = JSON.parse(localStorage.getItem('auth'));
                auth.user = data;
                localStorage.setItem('auth', JSON.stringify(auth));
                // update context
                setState({...state, user: data});
                setOk(true);
                setLoading(false);
            }
        } catch(err){
            if(err.response){
                toast.error(err.response.data)
            }
            setLoading(false);
        }
    }
  return (
    <div className='container-fluid'>
        <div className='row py-5 text-light bg-default-image'>
            <div className='col text-center'>
                <h1>Profile Page</h1>
            </div>
        </div>
        <div className='row py-5'>
            <div className='col-md-6 offset-md-3'>
                <label className='d-flex justify-content-center h5' htmlFor='image-uploader'>
                {
                    image && image.url ? (
                    <Avatar size={30} src={image.url} className='mt-1' />
                    ) : uploading ? (
                    <LoadingOutlined className='mt-2' />
                    ) : (
                    <CameraOutlined className='mt-2' />
                    )
                }
                <input onChange={handleImage} id='image-uploader' type='file' accept='images/*' hidden/>
                </label>
                <AuthForm
                 profileUpdate={true}
                 handleSubmit={handleSubmit}
                 name={name}
                 setName={setName}
                 email={email}
                 setEmail={setEmail}
                 password={password}
                 setPassword={setPassword}
                 secret={secret}
                 setSecret={setSecret}
                 loading={loading}
                 username={username}
                 setUsername={setUsername}
                 about={about}
                 setAbout={setAbout}
                />
            </div>
        </div>
        <div className='row'>
            <div className='col'>
                <Modal title="Congratulations" open={ok} onCancel={()=>setOk(false)} footer={null}>
                    <p>You have successfully updated your profile.</p>
                </Modal>
            </div>
        </div>
        <div className='row'>
            <div className='col'>
                <p className='text-center'>Already registered? <Link href="/login" ><a>Login</a></Link></p>
            </div>
        </div>
    </div>
  )
}

export default ProfileUpdate