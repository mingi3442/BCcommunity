import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Divider, Icon, Image, Label, Comment, Form, Button } from "semantic-ui-react";
import Header from "../../src/components/Header";
import styles from "../../styles/id.module.css";

const Post = ({ userInfo }) => {
  const [post, setPost] = useState({});
  const [replys, setReplys] = useState([]);
  const [reply, setReply] = useState("");
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    getPost();
    getReply();
  }, []);
  const getPost = () => {
    axios
      .post("http://localhost:8000/getpost", {
        postId: id,
      })
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getReply = () => {
    axios
      .post("http://localhost:8000/getreply", {
        postId: id,
      })
      .then((res) => {
        setReplys(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const addReply = () => {
    axios
      .post("http://localhost:8000/addreply", {
        postId: id,
        ownerId: userInfo._id,
        ownerName: userInfo.username,
        ownerAddress: userInfo.address,
        desc: reply,
      })
      .then((res) => {
        getReply();
        setReply("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = () => {
    axios
      .delete("http://localhost:8000/delete", {
        data: { postId: id },
      })
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteReply = () => {};
  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <Container textAlign="justified">
          <b className={styles.titleFont}>{post.title}</b>

          {userInfo.username == post.ownerName ? (
            <div className={styles.labelContainer}>
              <div>
                <Label size="mini" as="a" content="수정" icon="write" />
              </div>
              <div onClick={deletePost}>
                <Label size="mini" as="a" content="삭제" icon="delete" />
              </div>
            </div>
          ) : (
            ""
          )}

          <Divider />
          <Container textAlign="right">{post.createAt}</Container>
          <Container textAlign="right">{post.ownerName}</Container>
          {post.img == "" ? (
            ""
          ) : (
            <div style={{ marginBottom: "30px" }}>
              <Image size="medium" src={post.img} />
            </div>
          )}
          <div className={styles.contentContainer}>
            <p className={styles.contentFont}>{post.desc}</p>
          </div>
          <Divider />
          <h3>댓글</h3>
          <div className={styles.bottomContainer}>
            <Comment.Group size="large">
              <Comment>
                <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
                <Comment.Content>
                  <Comment.Author as="a">Matt</Comment.Author>
                  <Comment.Metadata>
                    <div>Today at 5:42PM</div>
                  </Comment.Metadata>
                  <Comment.Text>How artistic!</Comment.Text>
                  <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                  </Comment.Actions>
                </Comment.Content>
              </Comment>

              <Comment>
                <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
                <Comment.Content>
                  <Comment.Author as="a">Elliot Fu</Comment.Author>
                  <Comment.Metadata>
                    <div>Yesterday at 12:30AM</div>
                  </Comment.Metadata>
                  <Comment.Text>
                    <p>This has been very useful for my research. Thanks as well!</p>
                  </Comment.Text>
                  <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                  </Comment.Actions>
                </Comment.Content>
                <Comment.Group>
                  <Comment>
                    <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg" />
                    <Comment.Content>
                      <Comment.Author as="a">Jenny Hess</Comment.Author>
                      <Comment.Metadata>
                        <div>Just now</div>
                      </Comment.Metadata>
                      <Comment.Text>Elliot you are always so right :)</Comment.Text>
                      <Comment.Actions>
                        <Comment.Action>Reply</Comment.Action>
                      </Comment.Actions>
                    </Comment.Content>
                  </Comment>
                </Comment.Group>
              </Comment>
              {replys.length == 0
                ? ""
                : replys.map((e) => {
                    return (
                      <>
                        <Comment>
                          <Comment.Avatar src="/avatar_basic.png" />
                          <Comment.Content>
                            <Comment.Author as="a">{e.ownerName}</Comment.Author>
                            <Comment.Metadata>
                              <div>{e.createAt}</div>
                            </Comment.Metadata>
                            <Comment.Text>{e.desc}</Comment.Text>

                            <Comment.Actions>
                              <div onClick={deleteReply}>
                                <Label size="mini" as="a" content="삭제" icon="delete" />
                              </div>
                              {/* <Comment.Action>Reply</Comment.Action> */}
                            </Comment.Actions>
                          </Comment.Content>
                        </Comment>
                      </>
                    );
                  })}
            </Comment.Group>
            <div className={styles.replyContainer}>
              <Form reply>
                <Form.TextArea
                  onChange={(e) => {
                    setReply(e.target.value);
                  }}
                />
                <Button content="댓글 등록" labelPosition="right" icon="edit" primary onClick={addReply} />
              </Form>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Post;
