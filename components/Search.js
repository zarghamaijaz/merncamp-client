import React, { useState, useContext } from 'react'
import axios from 'axios';
import People from './cards/People';
import { toast } from 'react-toastify';

import { UserContext } from '../context'

function Search() {
    const [state, setState] = useContext(UserContext);
    const [query, setQuery] = useState("");
    const [result, setResult] = useState([]);
    const searchUser = async e => {
        e.preventDefault();
        // console.log(`Find "${query}" from DB`)
        try{
          const { data } = await axios.get(`/search-user/${query}`);
          // console.log("Search User response => ", data);
          setResult(data);
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
        let filtered = result.filter((p) => p._id !== user._id);
        setResult(filtered);
        toast.success(`Following ${user.name}`);
      }catch(err){
        console.log(err);
      }
    }
  const handleUnfollow = async (user) => {
    try{
        const { data } = await axios.put('/user-unfollow', {_id: user._id});
        let auth = JSON.parse(localStorage.getItem("auth"));
        auth.user = data;
        localStorage.setItem("auth", JSON.stringify(auth));
        setState({...state, user: data});
        let filtered = result.filter((p) => p._id !== user._id);
        setResult(filtered);
        toast.success(`Unfollowed ${user.name}`);
    }catch(err){
        console.log(err);
    }
  }
    
  return (
    <>
    <form className='form-inline row' onSubmit={searchUser}>
      <div className='col-8'>
        <input value={query} onChange={e => {
          setQuery(e.target.value);
          setResult([]);
        }} className="form-control" type="search" placeholder="Search" aria-label="Search" />
      </div>
      <div className='col-4'>
        <button className='btn btn-outline-primary btn-block w-100' type='submit'>Search</button>
      </div>
    </form>
    {result && (
      <People people={result} handleFollow={handleFollow} handleUnfollow={handleUnfollow} />
    )}
    </>
  )
}

export default Search