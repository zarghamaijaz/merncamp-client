import axios from "axios";
import ParallaxBG from "../../../components/cards/ParallaxBG";
import Head from "next/head";
import PostPublic from "../../../components/cards/PostPublic";

const SinglePost = ({ post }) => {

    const head = () => (
        <Head>
            <title>MERNCAMP - A socail media project created using next.js</title>
            <meta name="description" content={post.content}/>
            <meta property="og:description" content={post.content} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="MERNCAMP" />
            <meta property="og:url" content={`https://merncamp.com/post/view/${post._id}`} />
            <meta property="og:image:secure_url" content={(post.image && post.image.url) ? post.image.url : "https://merncamp.com/images/default.jpg"} />
        </Head>
    )

    return (
        <>
            {head()}
            <ParallaxBG url="/images/default.jpg">MERNCAMP</ParallaxBG>
            <div className="container">
                <div className="row pt-5">
                    <div className="col-md-8 offset-md-2">
                        <PostPublic key={post._id} post={post} />
                    </div>
                </div>
            </div>
        </>
    )
}


export async function getServerSideProps(ctx) {
    const { data } = await axios.get(`/post/${ctx.params._id}`);
    // console.log(data);
    return {
        props: {post: data},
    }
}

export default SinglePost;