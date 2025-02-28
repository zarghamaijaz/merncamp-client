import axios from "axios";
import ParallaxBG from "../components/cards/ParallaxBG";
import { UserContext } from "../context";
import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import PostPublic from "../components/cards/PostPublic";

import io from "socket.io-client";
const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {path: "/socket.io"}, {reconnection: true});

const Home = ({ posts }) => {
    const [state, setState] = useContext(UserContext);
    const [newsFeed, setNewsFeed] = useState([]);

    useEffect(()=>{
        socket.on("new-post", (newPost) => {
            console.log("Created a new post", newPost);
            setNewsFeed([newPost, ...posts]);
        })
    },[])

    const head = () => (
        <Head>
            <title>MERNCAMP - A socail media project created using next.js</title>
            <meta name="description" content="A project created using next.js."/>
            <meta property="og:description" content="A project created using next.js." />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="MERNCAMP" />
            <meta property="og:url" content="https://merncamp.com" />
            <meta property="og:image:secure_url" content="https://merncamp.com/images/default.jpg" />
        </Head>
    )

    const collection = newsFeed.length > 0 ? newsFeed : posts;

    return (
        <>
            {head()}
            <ParallaxBG url="/images/default.jpg">MERNCAMP</ParallaxBG>
            <div className="container">
                <div className="row pt-5">
                    {collection && collection.map(post => (
                        <div key={post._id} className="col-md-4">
                            <Link key={post._id} href={`/post/view/${post._id}`}>
                                <a className="text-decoration-none">
                                    <PostPublic key={post._id} post={post} />
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}


export async function getServerSideProps() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/posts`);
    // console.log(data);
    return {
        props: {posts: data},
    }
}

export default Home;