# 🍀SNS Service
> **SNS 서비스**  
> 사용자는 서비스에 접속하여, 게시물을 업로드 하거나 다른 사람의 게시물을 확인하고 좋아요를 누를 수 있는 서비스입니다.
</br>

```
# 프로젝트 실행
$ npm run start:dev

# Swagger
localhost:3000/api-docs
```    

### [postman 바로가기](https://documenter.getpostman.com/view/21326072/2s83tJFqLB)  
</br>

## 📆개발 기간
2022.09.26 ~ 2022.10.01  
</br></br>

## ⚒️기술 스택
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)  
</br>
**ORM: TypeORM**  
</br></br>

## ✏️요구사항 및 분석
### **유저**
#### 1. 유저 회원가입 (Issues #1)
   * 이메일을 ID로 사용합니다. 
   </br>
   
#### 2. 유저 로그인 및 인증 (Issues #2)
   * JWT 토큰을 발급받으며, 이를 추후 사용자 인증으로 사용  
   * 로그아웃은 프론트엔드에서 처리  
</br>

### **게시글**
#### 1. 게시글 생성 (Issues #3)
   * 제목, 내용, 해시태그 등을 입력하여 생성 (필수입력사항)
   * 작성자 정보는 request body에 존재하지 않고 인증정보에서 추출하여 등록 
   * 해시태그는 #으로 시작/ ,로 구분되는 텍스트가 입력  
     * EX) { “hashtags”: “#맛집,#서울,#브런치 카페,#주말”, …}  
   </br>
   
#### 2. 게시글 수정 (Issues #4)
   * 작성자만 수정 가능  
   </br>
   
#### 3. 게시글 삭제 & 복구 (Issues #5)
   * 작성자만 삭제, 복구 가능  
   </br>
   
#### 4. 게시글 상세보기 (Issues #6)
   * 모든 사용자는 모든 게시물에 보기권한이 있음  
   * 게시글 상세보기하면 조회수가 1 증가  
   </br>
   
#### 5. 게시글 좋아요 (Issues #6)
   * 작성자 포함 사용자는 게시글에 좋아요를 누를 수 있음
   * 좋아요된 게시글에 다시 좋아요를 누르면 취소  
   </br>
   
#### 6. 게시글 전체목록 (Issues #7)
   * 게시글 목록에는 제목, 작성자, 해시태그, 작성일, 좋아요 수, 조회수가 포함
   * 아래 4가지 동작은 각각 동작 할 뿐만 아니라, 동시에 적용될 수 있음  
   
     **정렬(Order)**  
     * 오름차순, 내림차순 선택  
     * 작성일, 좋아요 수, 조회수 중 1개 선택가능 (default: 작성일)  
     
     **검색(Order)**  
     * 해당 키워드를 포함한 게시물 조회 가능 (제목, 내용)  
     * Like 검색(문자열 부분 일치)  
     
     **필터링(Order)**  
     * 해시태그에서 지정한 키워드로 해당 키워드를 포함한 게시물 필터링 가능  
       * [ex. “서울” 검색 시 > #서울(검색됨) / #서울맛집 (검색안됨)  / #서울,#맛집(검색됨)]  
       * [ex. “서울,맛집” 검색 시 > #서울(검색안됨) / #서울맛집 (검색안됨)  / #서울,#맛집(검색됨)]  
       
     **페이징(Order)**  
     * 사용자는 1페이지 당 게시글 수를 조정 가능 (default: 10건)  
   </br>
</br>
   
## 🧩ERD
![image](https://user-images.githubusercontent.com/33679560/193604146-6103f6c2-cbcc-48ae-bd8b-30c68dc42e50.png)  
</br></br>

## 📝API 명세서
![image](https://user-images.githubusercontent.com/33679560/193606385-2151acd8-f3eb-4624-b0da-754bdb750b11.png)  
</br>


### Response 예)
* success: true 인 경우
```
{
    "success": true,
    "statusCode": 201,
    "data": {
        "feed": {
            "userId": 1,
            "title": "게시글123",
            "content": "내용",
            "hashtags": "#처음 #맛집",
            "writer": "test",
            "viewCount": 0,
            "likeCount": 0,
            "deleteAt": null,
            "id": 5,
            "createdAt": "2022-10-01T09:35:53.530Z",
            "updateAt": "2022-10-01T09:35:53.530Z"
        }
    },
    "message": "게시글이 등록되었습니다.",
    "timestamp": "2022-10-01T09:35:53.547Z"
}
```   
* success: false 인 경우
```
{
    "success": false,
    "statusCode": 404,
    "error": "해당 게시글의 ID를 찾을 수 없습니다.",
    "timestamp": "2022-10-01T09:36:07.704Z"
}
```   
</br></br>

## 📌Convention
### Git Branch
* ``main``, ``develop``, ``feat``로 브랜치를 나눈다.
* 기능별로 ``feat/user``, ``feat/board`` 등으로 구분 짓는다.
* 브랜치는 삭제하지 않는다.
* 개발 과정에서는 ``devleop``브랜치에 merge 한다.
* ``mian``브랜치는 배포하기 전에 merge 한다.  
</br>

### Git Commit
* ``feat`` : 새로운 기능 추가 / 구현중
* ``fix`` : 이미 있는 코드를 수정 / 버그 수정
* ``refactor`` : 코드 리팩토링
* ``docs`` : 문서 수정(README, Swagger)
* ``test`` : 테스트 코드
* ``chore`` : 개발에 영향을 가지 않는 부분 수정(패키지 매니저, 주석)  
</br>

**example)**
```
git commit -m "feat: Create API 개발 (이슈번호)"
git commit -m "fix: Update 일부 수정 (이슈번호)"
git commit -m "chore: 주석 추가"
```  
</br>

