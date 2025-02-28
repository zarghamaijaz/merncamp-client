import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import UserRoute from '../../components/routes/UserRoute'
import { toast } from 'react-toastify'
import Post from '../../components/cards/Post'
import { RollbackOutlined } from '@ant-design/icons'
import Link from 'next/link'

function PostComments() {
    const [post, setPost] = useState({});
    const router = useRouter();
    const _id = router.query._id;

    const fetchPost = async () => {
        try{
            const {data} = await axios.get(`/user-post/${_id}`);
            setPost(data);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        if(_id) fetchPost();
    },[_id]);

    const removeComment = async (postId, comment) => {
        // console.log(postId, comment);
        const answer = window.confirm("Are you sure you want to remove this comment?");
        if(!answer) return;
        try{
            const {data} = await axios.put('/remove-comment', {postId, comment});
            console.log("Comment removed => ", data);
            fetchPost();
            toast.success("Comment removed");
        }catch(err){
            console.log(err);
        }

    }
  return (
    <div className='container-fluid'>
        <div className='row py-5 text-light bg-default-image'>
            <div className='col text-center'>
              <h1>MERNCAMP</h1>
            </div>
        </div>
        <div className='container col-md-8 offset-md-2 pt-5'>
            <Post post={post} commentsCount={100} removeComment={removeComment} />
        </div>
        <Link href="/user/dashboard">
            <a className='d-flex justify-content-center p-5'><RollbackOutlined/></a>
        </Link>
    </div>
  )
}

export default PostComments