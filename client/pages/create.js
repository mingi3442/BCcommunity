// import erc721Abi from "../src/erc721Abi";
import { useState } from "react";
import styles from "../styles/create.module.css";
import { Input, Icon, TextArea, Button, Divider } from "semantic-ui-react";
import { useRouter } from "next/router";
import { create } from "ipfs-http-client";
import axios from "axios";

export default function createNFT({ userInfo }) {
  const [fileUrl, updateFileUrl] = useState(``);

  const [nftDesc, setNftDesc] = useState("");
  const [nftName, setNftName] = useState("");
  const [isMint, setIsMint] = useState(false);
  const [image, setImage] = useState(null);
  const router = useRouter();

  const client = create("https://ipfs.infura.io:5001/api/v0");

  const moveToHome = () => {
    router.push("/");
  };
  const onChange = async (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      updateFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };
  const createNft = () => {
    // console.log(fileUrl);
    axios
      .post("http://localhost:8000/nft", {
        userId: userInfo._id,
        img: fileUrl,
        title: nftName,
        desc: nftDesc,
      })
      .then((res) => {
        // router.push("/");
      })
      .catch((err) => {
        console.log(err.respnse.data);
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.createContainer}>
        <div className={styles.mainContainer}>
          <div>
            <h1>NFT 생성</h1>
            <span className={styles.grayFont}>
              <span style={{ fontSize: "10px" }} className={styles.require}>
                *
              </span>{" "}
              필수 작성
            </span>
          </div>
          <Divider />
          <div>
            <p className={styles.contentFont}>
              이미지{" "}
              <span style={{ fontSize: "16px" }} className={styles.require}>
                *
              </span>
            </p>
            <p className={styles.grayFont}>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB</p>
            <div className={styles.selectFile}>
              <label for="fileInput">
                {image ? <img for="fileInput" src={image} alt="preview image" className={styles.selectedImage} /> : <Icon name="file image outline" size="huge" />}
              </label>
              <input type="file" name="file" onChange={onChange} id="fileInput" />
            </div>
            <br></br>
            {/* <div>{fileUrl ? <div>IPFS Link: {fileUrl}</div> : ""}</div> */}
          </div>
          <br></br>
          <div className={styles.contentContainer}>
            <p className={styles.contentFont}>
              NFT 이름{" "}
              <span style={{ fontSize: "16px" }} className={styles.require}>
                *
              </span>
            </p>
            <Input
              placeholder="Item name"
              fluid
              size="big"
              onChange={(e) => {
                setNftName(e.target.value);
              }}
            />
          </div>
          <div className={styles.contentContainer}>
            <p className={styles.contentFont}>설명</p>
            <TextArea
              placeholder="내용을 입력하세요"
              style={{ minHeight: 100, width: "100%", borderColor: " rgba(0,0,0,0.6)" }}
              onChange={(e) => {
                setNftDesc(e.target.value);
              }}
            />
          </div>

          <div className={styles.buttonContainer}>
            <Button size="big" icon labelPosition="left" onClick={moveToHome}>
              <Icon name="arrow left" />
              돌아가기
            </Button>
            <Button size="big" content="생성하기" primary onClick={createNft} />
          </div>
        </div>
      </div>
    </div>
  );
}
