import React from 'react'
import { Avatar } from 'antd'
import {CameraOutlined, LoadingOutlined} from "@ant-design/icons"
import dynamic from 'next/dynamic';
// import ReactQuill from 'react-quill'
const ReactQuill = dynamic(() => import("react-quill"), {ssr: false});
// ssr false
import "react-quill/dist/quill.snow.css";

function PostForm({content, setContent, postSubmit, handleImage, uploading, image }) {
  return (
    <div className='card'>
        <div className='card-body pb-3'>
            <form className='form-group'>
              <ReactQuill 
                theme='snow'
                value={content}
                // onKeyDown={e => setContent(e)}
                onChange={e => {
                  console.log(e)
                  setContent(e)
                }}
                className='form-control'
                placeholder='Write something...'
              />
                {/* <textarea value={content} onChange={e => setContent(e.target.value)} className='form-control' placeholder='Write something...'></textarea> */}
            </form>
        </div>
        <div className='card-footer d-flex justify-content-between text-muted'>
            <button disabled={!content} onClick={postSubmit} className='btn btn-primary btn-sm mt-1'>Post</button>
            <label htmlFor='image-uploader'>
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
        </div>
    </div>
  )
}

export default PostForm