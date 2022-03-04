import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Divider, Icon, Image, Label, Comment, Form, Button } from "semantic-ui-react";
import Header from "../../src/components/Header";
import styles from "../../styles/id.module.css";
// import styles from "../../styles/id.module.css";

const Post = ({ userInfo }) => {
  const [post, setPost] = useState({});
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    axios
      .post("http://localhost:8000/getpost", {
        postId: id,
      })
      .then((res) => {
        console.log(res.data);
        setPost(res.data);
      });
  }, []);

  const onClickDelete = () => {
    axios
      .delete("http://localhost:8000/delete", {
        data: { postId: id },
      })
      .then(() => {
        router.push("/");
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <Container textAlign="justified">
          {/* <div className={styles.titleContainer}> */}
          <b className={styles.titleFont}>{post.title}</b>

          {userInfo.username == post.ownerName ? (
            <div className={styles.labelContainer}>
              <div>
                <Label size="mini" as="a" content="수정" icon="write" />
              </div>
              <div onClick={onClickDelete}>
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
        </Container>
        <br />
        <br />
        <br />
        <br />
      </div>
      <div className={styles.bottomContainer}>
        {/* <Comment.Group size="large">
          <Divider />
          <h3>댓글</h3>

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

          <Comment>
            <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/joe.jpg" />
            <Comment.Content>
              <Comment.Author as="a">Joe Henderson</Comment.Author>
              <Comment.Metadata>
                <div>5 days ago</div>
              </Comment.Metadata>
              <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
              <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment>

          <Form reply>
            <Form.TextArea />
            <Button content="Add Reply" labelPosition="left" icon="edit" primary />
          </Form>
        </Comment.Group> */}
      </div>
    </div>
  );
};

export default Post;
