import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import UserRoute from "../../../components/routes/UserRoute";
import PostForm from "../../../components/forms/PostForm";
import { toast } from "react-toastify";



const EditPost = () => {
    const [post, setPost] = useState({})
    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const {_id} = router.query;

    useEffect(()=>{
        if(_id) fetchPost();
    }, [_id])

    const fetchPost = async () => {
        try{
            const {data} = await axios.get(`/user-post/${_id}`);
            setContent(data.content);
            setImage(data.image)
            setPost(data);
        }catch(err){

        }
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
    const postSubmit = async (e) => {
        e.preventDefault();
        try{
            const {data} = await axios.put(`/update-post/${_id}`,{
                content, image
            });
            if(data.error){
                toast.error(data.error)
            }
            else{
                toast.success("Post updated successfully");
                router.push("/user/dashboard")
            }
        }catch(err){
            console.log(err)
        }
    }

    return(
        <UserRoute>
            <div className='container-fluid'>
                <div className='row py-5 text-light bg-default-image'>
                    <div className='col text-center'>
                    <h1>News feed</h1>
                    </div>
                </div>
                <div className='row py-3'>
                    <div className='col-md-8 offset-md-2'>
                        <PostForm content={content} setContent={setContent} postSubmit={postSubmit} handleImage={handleImage} uploading={uploading} image={image} />
                    </div>
                </div>
            </div>
        </UserRoute>
    );
}

export default EditPost;