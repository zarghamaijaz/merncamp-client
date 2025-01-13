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

export default function Post({ post, handleDelete, handleLike, handleUnlike, handleComment, commentsCount = 2, removeComment }) {
    const [state] = useContext(UserContext)
    const router = useRouter();
    return post && post.postedBy && (
        <div key={post._id} className='card mb-5'>
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
                        <HeartFilled onClick={() => handleUnlike(post._id)} className='text-danger pt-2 h5' />
                    ) : (
                        <HeartOutlined onClick={() => handleLike(post._id)} className='text-danger pt-2 h5' />
                    )}
                    <div className='pl-3'>{post.likes.length} Likes</div>
                    <CommentOutlined onClick={() => handleComment(post)} className='text-danger pt-2 h5 pl-5' />
                    <div className='pl-3'>
                        <Link href={`/post/${post._id}`}><a>{post.comments.length} Comments</a></Link>
                    </div>
                    {state && state.user && state.user._id === post.postedBy._id && (
                        <>
                            <EditOutlined onClick={() => router.push(`/user/post/${post._id}`)} className='text-danger pt-2 h5 pl-5' />
                            <DeleteOutlined onClick={()=>handleDelete(post)} className='text-danger pt-2 h5 pl-5' />
                        </>
                    )}
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
                            {state && state.user && state.user._id === c.postedBy._id && (
                                <div className='ml-atuo mt-1'>
                                    <DeleteOutlined onClick={() => removeComment(post._id, c)} className='pl-2 text-danger' />
                                </div>
                            )}
                        </span>
                    </li>)}
                </ol>
            )}
        </div>
  )
}
