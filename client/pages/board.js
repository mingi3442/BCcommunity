import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../styles/board.module.css";
import { useRouter } from "next/router";
import { Divider, Item } from "semantic-ui-react";
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
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.contentFont}>게시판 전체 글</div>
        <Divider />
        <Item.Group>
          {posts.map((post) => {
            return (
              <>
                <Link href={`/post/${post._id}`}>
                  <Item key={post._id}>
                    <Item.Image size="tiny" src={post.img === "" ? `/noImage.png` : `${post.img}`} />
                    <Item.Content>
                      <Item.Header>{post.title}</Item.Header>
                      <Item.Meta>
                        <span>{post.ownerName}</span>
                        {/* <span className="stay">1 Month</span> */}
                      </Item.Meta>
                      <Item.Description>{post.createAt}</Item.Description>
                    </Item.Content>
                  </Item>
                </Link>
                <Divider />
              </>
            );
          })}
        </Item.Group>
      </div>
    </div>
  );
}
