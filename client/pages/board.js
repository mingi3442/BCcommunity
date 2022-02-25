import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Divider } from "semantic-ui-react";
import Link from "next/link";

export default function board() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8000/getposts").then((res) => {
      console.log(res.data);
      setPosts(res.data);
    });
  }, []);
  return (
    <div>
      <div>board</div>
      <Divider />
      {posts.map((post) => {
        return (
          <div key={post._id}>
            <Link href={`/post/${post._id}`}>
              <div>
                <div>{post.title}</div>
                <div>{post.desc}</div>
                <div>{post.ownerName}</div>
                <div>{post.createAt}</div>
              </div>
            </Link>
            <Divider />
          </div>
        );
      })}
    </div>
  );
}
