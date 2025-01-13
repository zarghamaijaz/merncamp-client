import React, {useContext, useState, useEffect} from 'react'
import { UserContext } from '../../context'
import AdminRoute from '../../components/routes/AdminRoute';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import renderHTML from 'react-render-html';


function Admin() {
    const [state, setState] = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const router = useRouter();


    useEffect(()=>{
      // 
      if(state && state.token) {
        newsFeed();
        console.log("STATE => ", state);
      }
    },[state && state.token]);

    const newsFeed = async () => {
      try{
        const {data} = await axios.get(`/posts`);
        setPosts(data);
      }catch(err){
        console.log(err);
      }
    }

    const handleDelete = async (post) => {
      try{
        const answer = window.confirm("Are you sure you want to delete this post?");
        if(!answer) return;
        const {data} = await axios.delete(`/admin/delete-post/${post._id}`);
        toast.success("Post deleted");
        newsFeed();
      }catch(err){
        console.log(err);
      }
    }
  return (
    <AdminRoute>
      <div className='container-fluid'>
          <div className='row py-5 text-light bg-default-image'>
            <div className='col text-center'>
              <h1>Admin</h1>
            </div>
          </div>
          <div className='py-4'>
            <div className='col-md-8 offset-md-2'>
                {posts && posts.map(post => (
                    <div key={post._id} className='d-flex justify-content-between'>
                        <div>
                            {renderHTML(post.content)}
                        </div>
                         <div onClick={()=>handleDelete(post)} className='text-danger'>Delete</div>
                    </div>
                ))}
            </div>
          </div>
      </div>
    </AdminRoute>
  )
}

export default Admin;