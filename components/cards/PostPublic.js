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

export default function PostPublic({ post, handleDelete, handleLike, handleUnlike, handleComment, commentsCount = 2, removeComment }) {
    const [state] = useContext(UserContext)
    const router = useRouter();
    return post && post.postedBy && (
        <div className='card mb-5'>
            <div className='card-header'>
                {/* <Avatar size={40}>{post.postedBy.name[0]}</Avatar>{" "} */}
                <Avatar size={40} src={imageSource(post.postedBy)} />{" "}
                <span className='pt-2 ml-3 px-3'>{post.postedBy.name}</span>
                <span className='pt-2 ml-3'>{moment(post.createdAt).fromNow()}</span>
            </div>
            <div className='card-body'>
                {renderHTML(post.content)}
            </div>
            <div className='card-footer'>
                {post.image && (
                    <PostImage url={post.image.url} />
                )}
                <div className='d-flex align-items-center gap-2'>
                    {state && state.user && post.likes && post.likes.includes(state && state.user && state.user._id) ? (
                        <HeartFilled className='text-danger pt-2 h5' />
                    ) : (
                        <HeartOutlined className='text-danger pt-2 h5' />
                    )}
                    <div className='pl-3'>{post.likes.length} Likes</div>
                    <CommentOutlined className='text-danger pt-2 h5 pl-5' />
                    <div className='pl-3'>
                        <p className='m-0'>{post.comments.length} Comments</p>
                    </div>
                </div>
            </div>
            {post.comments && post.comments.length > 0 && (
                <ol className='list-group' style={{height: "125px", overflowY: "scroll"}}>
                    {post.comments.slice(0, commentsCount).map(c => <li key={c._id} className='list-group-item d-flex justify-content-between align-items-start'>
                        <div className='ms-2 me-auto'>
                            <div className=''><Avatar size={20} className='mb-1 mr-3' src={imageSource(c.postedBy)} /> {c.postedBy.name}</div>
                            <div className=''>{c.text}</div>
                        </div>
                        <span className='badge rounded-pill text-muted'>
                            {moment(c.created).fromNow()}
                        </span>
                    </li>)}
                </ol>
            )}
        </div>
  )
}
