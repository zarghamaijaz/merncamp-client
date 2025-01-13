import React, {useContext} from 'react'
import renderHTML from 'react-render-html'
import moment from 'moment'
import { Avatar } from 'antd'
import PostImage from '../images/PostImage'
import {HeartOutlined, HeartFilled, CommentOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons"
import { UserContext } from '../../context'
import {useRouter} from "next/router"
import { imageSource } from '../../functions'
import Link from 'next/link'
import Post from './Post'

export default function PostList({ posts, handleDelete, handleLike, handleUnlike, handleComment, removeComment }) {
    const [state] = useContext(UserContext)
    const router = useRouter();
  return (
    <div>{posts && posts.map(post => 
        <Post key={post._id} post={post} handleDelete={handleDelete} handleLike={handleLike} handleUnlike={handleUnlike} handleComment={handleComment} removeComment={removeComment} />
     )}
    </div>
  )
}
