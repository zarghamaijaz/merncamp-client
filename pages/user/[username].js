import React, { useContext, useState, useEffect } from 'react'
import { Avatar, Card } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import { UserContext } from '../../context'
import axios from 'axios'
import { RollbackOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { toast } from 'react-toastify'


const { Meta } = Card;

function Username() {
    const [state, setState] = useContext(UserContext);
    const [user, setUser] = useState({});

    const router = useRouter();

    useEffect(() => {
        if(router.query.username){
            fetchUser();
        }
    },[router.query.username]);


    const fetchUser = async () => {
        try{
            const { data } = await axios.get(`/user/${router.query.username}`);
            setUser(data);
        }catch(err){
            console.log(err);
        }
    }

    const imageSource = (user) => {
        if(user.image){
            return user.image.url;
        }
        else {
            return '/images/user-placeholder.png'
        }
    }

  return (
    <div className='container col-md-6 offset-md-3'>
        {/* <pre>{JSON.stringify(user, null, 4)}</pre> */}
        <div className='py-5'>
            <Card hoverable cover={<img src={imageSource(user)} alt={user.name} />}>
                <Meta title={user.name} description={user.about} />
                <p className='pt-2 text-muted'>Joined {moment(user.createdAt).fromNow()}</p>
                <div className='d-flex justify-content-between'>
                    <div className='btn btn-sm'>
                        {user.followers && user.followers.length} Followers
                    </div>
                    <div className='btn btn-sm'>
                        {user.following && user.following.length} Following
                    </div>
                </div>
            </Card>
            <Link href='/user/dashboard'>
                <a className='d-flex justify-content-center pt-5'><RollbackOutlined/></a>
            </Link>
        </div>
    </div>
  )
}

export default Username