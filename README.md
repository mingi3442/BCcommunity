# Blockmunity

### ERC20 토큰 기반 커뮤니티

## **Stack**

> <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white"> <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=Solidity&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"> <img src="https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=IPFS&logoColor=white"> <img src="https://img.shields.io/badge/Web3.js-F16822?style=for-the-badge&logo=Web3.js&logoColor=white"> <img src="https://img.shields.io/badge/Semantic UI React-35BDB2?style=for-the-badge&logo=Semantic UI React&logoColor=white"> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white"> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"> <img src="https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=Passport&logoColor=white">

### Description

---

ERC20토큰을 통한 인센티브 기반 커뮤니티이며 토큰은 서로 주고받거나 NFT를 만든데에도 사용된다

## Get Started

### Prerequisites

> **_실행전 수정해야 하는 부분_**

```
/client/pages/_app.js

function MyApp({ Component, pageProps }) {
  ...
  const [newErc721addr, setNewErc721Addr] = useState("자신이 발행한 이더리움 컨트랙트 주소");
  const [newKip17addr, setNewKip17Addr] = useState("자신이 발행한 클레이튼 컨트랙트 주소");
  ...
}
```

> **_설치된 modules_**

```
npm i semantic-ui-react semantic-ui-css
```

```
npm i caver-js
```

```
npm i web3
```

```
npm i ipfs-http-client
```

```
npm i assert
```

### Installation

```
cd client/
```

```
npm install
```

### Run Start

---

```
cd client/
```

```
npm run dev
```

## Built With

- [이민기](https://github.com/mingi3442)
