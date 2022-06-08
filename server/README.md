## API Docs

| Router | EndPoint          | Method | Desc                                        |
| ------ | ----------------- | ------ | ------------------------------------------- |
| /user  | /signup           | POST   | 회원가입                                    |
|        | /login            | POST   | 로그인                                      |
|        | /:userId          | GET    | 마이페이지 및 유저의 상세정보               |
|        | /:userId/post     | GET    | :id 유저의 게시글 정보                      |
|        | /:userId/nft      | GET    | :id 유저의 NFT 정보                         |
|        | /eth              | GET    | 무료로 이더 받기                            |
|        |                   |        |                                             |
| /post  | /                 | GET    | 전체 게시글 가져오기                        |
|        | /                 | POST   | 게시글 작성                                 |
|        | /:postId          | GET    | :id 게시글 정보 (해당 게시글의 댓글 정보도) |
|        | /:postId          | PUT    | :id 게시글 수정                             |
|        | /:postId          | DELETE | :id 게시글 삭제                             |
|        | /:postId/comments | GET    | 해당 게시글의 댓글 정보 조회                |
|        | /:postId/comments | POST   | 해당 게시글의 댓글 작성                     |
|        | /:postId/comments | PUT    | 해당 게시글의 댓글 수정                     |
|        | /:postId/comments | DELETE | 해당 게시글의 댓글 삭제                     |
|        |                   |        |                                             |
| /token | /                 | GET    | ERC20 토큰 조회                             |
|        | /userId           | POST   | ERC20 토큰 전송                             |
|        |                   |        |                                             |
| /nft   | /create           | POST   | NFT 생성                                    |
|        | /explore          | GET    | 판매 등록된 NFT 조회                        |
|        | /:nftId           | GET    | NFT 정보 조회                               |
|        | /:nftId/send      | POST   | NFT 전송                                    |
|        | /:nftId/buy       | POST   | NFT 구매                                    |
|        | /:nftId/register  | POST   | NFT 판매 등록                               |
|        | /:nftId/cancel    | POST   | NFT 판매 등록 취소                          |
|        |                   |        |                                             |
