import React, {useContext, useState, useEffect} from 'react'
import { UserContext } from '../../context'
import UserRoute from '../../components/routes/UserRoute';
import PostForm from "../../components/forms/PostForm"
import PostList from '../../components/cards/PostList';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import People from '../../components/cards/People';
import Link from 'next/link';
import { Modal, Pagination } from 'antd';
import CommentForm from '../../components/forms/CommentForm';
import Search from '../../components/Search';

import io from "socket.io-client";
const socket = io("https://merncamp-server.vercel.app", {path: "/socket.io"}, {reconnection: true});

function dashboard() {
    const [state, setState] = useContext(UserContext);
    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [people, setPeople] = useState([]);

    const [comment, setComment] = useState("");
    const [currentPost, setCurrentPost] = useState({});
    const [visible, setVisible] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);
    const [page, setPage] = useState(1);

    const router = useRouter();

    useEffect(()=>{
      // 
      if(state && state.token) {
        newsFeed();
        findPeople();
        getTotalPosts();
        console.log("STATE => ", state);
      }
    },[state && state.token, page]);

    async function getTotalPosts() {
      try{
        const { data } = await axios.get("/total-posts");
        setTotalPosts(data);
      }catch(err){
        console.log(err);
      }
    }

    const newsFeed = async () => {
      try{
        const {data} = await axios.get(`/news-feed/${page}`);
        setPosts(data);
      }catch(err){
        console.log(err);
      }
    }
    const findPeople = async () => {
      try {
        const {data} = await axios.get("/find-people");
        setPeople(data);
      } catch(err){
        console.log(err);
      }
    }
    const postSubmit = async e => {
      e.preventDefault();
      try{
        const {data} = await axios.post("/create-post", { content, image });
        // console.log("Create post response => ", data);
        if(data.error){
          toast.error(data.error);
        }
        else {
          setPage(1);
          newsFeed();
          toast.success("Post created successfully!");
          setContent("");
          setImage({});
          socket.emit("new-post", data);
        }
      }catch(err){
        console.log(err)
      }
      // console.log("post => ", content);
    }

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
    const handleDelete = async (post) => {
      try{
        const answer = window.confirm("Are you sure you want to delete this post?");
        if(!answer) return;
        const {data} = await axios.delete(`/delete-post/${post._id}`);
        toast.success("Post deleted");
        newsFeed();
      }catch(err){
        console.log(err);
      }
    }
    const handleFollow = async (user) => {
      // console.log("Add this user to follow list => ", user);
      try{
        const { data } = await axios.put("/user-follow", {_id: user._id});
        let auth = JSON.parse(localStorage.getItem("auth"));
        auth.user = data;
        localStorage.setItem("auth", JSON.stringify(auth));
        setState({...state, user: data});
        let filtered = people.filter((p) => p._id !== user._id);
        setPeople(filtered);
        // rerender posts in news feed
        newsFeed();
        toast.success(`Following ${user.name}`);
      }catch(err){
        console.log(err);
      }
    }
    const handleLike = async (_id) => {
      // console.log("Like => ", _id);
      try{
        const { data } = await axios.put("/like-post", {_id: _id});
        console.log("Liked data => ", data);
        newsFeed();
      }catch(err){
        console.log(err);
      }
    }
    const handleUnlike = async (_id) => {
      // console.log("Unlike => ", _id);
      try{
        const { data } = await axios.put("/unlike-post", {_id: _id});
        console.log("Unliked data => ", data);
        newsFeed();
      }catch(err){
        console.log(err);
      }
    }
    const handleComment = (post) => {
      setCurrentPost(post);
      setVisible(true);
    }
    const addComment = async (e) => {
      e.preventDefault();
      // console.log("Adding comment to => ", currentPost);
      try{
        const { data } = await axios.put("/add-comment", {postId: currentPost._id, comment: comment});
        console.log("Comment added => ", data);
        setComment("");
        setVisible(false);
        setCurrentPost({});
        newsFeed();
      }catch(err){
        console.log(err);
      }
    }
    const removeComment = async (postId, comment) => {
       // console.log(postId, comment);
       const answer = window.confirm("Are you sure you want to remove this comment?");
       if(!answer) return;
       try{
          const {data} = await axios.put('/remove-comment', {postId, comment});
          console.log("Comment removed => ", data);
          newsFeed();
          toast.success("Comment removed");
       }catch(err){
          console.log(err);
      }
    }
  return (
    <UserRoute>
      <div className='container-fluid'>
          <div className='row py-5 text-light bg-default-image'>
            <div className='col text-center'>
              <h1>News feed</h1>
            </div>
          </div>
          <div className='row py-3'>
            <div className='col-md-8'>
              <PostForm content={content} setContent={setContent} postSubmit={postSubmit} handleImage={handleImage} uploading={uploading} image={image} />
              <br/>
              <PostList posts={posts} handleDelete={handleDelete} handleLike={handleLike} handleUnlike={handleUnlike} handleComment={handleComment} removeComment={removeComment} />
              <Pagination className='pb-5' current={page} total={parseInt((totalPosts / 3) * 10)} onChange={(value) => setPage(value)} />
            </div>
            {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}
            <div className='col-md-4'>
              <Search/>
              <br/>
              {state && state.user && state.user.following && (
                <Link href={`/user/following`}>
                  <a className='h6'>{state.user.following.length} Following</a>
                </Link>
              )}
              <People people={people} handleFollow={handleFollow} />
            </div>
          </div>
          <Modal
            title="Comment"
            open={visible}
            onCancel={() => setVisible(false)}
            footer={null}
          >
            <CommentForm addComment={addComment} setComment={setComment} comment={comment} />
          </Modal>
      </div>
    </UserRoute>
  )
}

export default dashboard