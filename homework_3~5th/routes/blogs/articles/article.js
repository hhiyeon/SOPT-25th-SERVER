var express = require('express');
var router = express.Router();

const defaultRes = require('../../../module/util/utils');
const resMessage = require('../../../module/util/responseMessage');
const statusCode = require('../../../module/util/statusCode');
const db = require('../../../module/pool');
const authUtil = require("../../../module/util/authUtils");

const upload = require('../../../config/multer');  //  image

// articleIdx image title blogIdx
router.get('/', async(req, res) => { // 게시글 조회
    let blogIdx = req.body.blogIdx;

    if(!blogIdx){ // 입력에 널값
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }
    const selectQuery ='SELECT * FROM article WHERE blogIdx = ?';
    const selectResult = await db.queryParam_Arr(selectQuery, [blogIdx]);

    if(!selectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };

    if(selectResult.length == null){   // 게시글 없는 경우
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.FAIL_READ_ARTICLE));  // 게시글 조회 실패
        return ;
    }
    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_READ_ARTICLE, selectResult));  // 게시글 조회 성공
});




router.post('/', authUtil.LoggedIn, upload.single('image'), async(req, res) => {    // 게시글 등록
    let title = req.body.title;
    let blogIdx = req.body.blogIdx;
    let image = req.file.location;  // image url
    let userIdx = req.decoded.idx;

    if(!title || !blogIdx || !image){ // 입력에 널값
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }
    const selectQuery = 'SELECT * FROM blog WHERE blogIdx = ?';
    const selectResult = await db.queryParam_Arr(selectQuery, [blogIdx]);

    if(!selectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };

    if(selectResult.length == 0){   // blogIdx가 존재하지 않을 경우
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const insertQuery ='INSERT INTO article (title, image, blogIdx) VALUES (?, ?, ?)';
    const insertResult = await db.queryParam_Arr(insertQuery, [title, image, blogIdx]);

    if(!insertResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };
    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_CREATE_ARTICLE));  // 게시글 등록 성공
});




router.put('/', authUtil.LoggedIn, async(req, res) => { // 게시글 수정
    let title = req.body.title;
    let articleIdx = req.body.articleIdx;
    let userIdx = req.decoded.idx;

    if(!title || !articleIdx){ // 입력에 널값
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const selectQuery = 'SELECT * FROM article WHERE articleIdx = ?';
    const selectResult = await db.queryParam_Arr(selectQuery, [articleIdx]);

    if(!selectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };

    if(selectResult.length == 0){   // blogIdx가 존재하지 않을 경우
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const updateQuery ='UPDATE article SET title = ? WHERE articleIdx = ?';
    const updateResult = await db.queryParam_Arr(updateQuery, [title, articleIdx]);

    if(!updateResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };
    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_UPDATE_ARTICLE));  // 게시글 수정 성공
});




router.delete('/', authUtil.LoggedIn, async(req, res) => {  // 게시글 삭제
    let articleIdx = req.body.articleIdx;
    let userIdx = req.decoded.idx;

    if(!articleIdx){ // 입력에 널값
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const selectQuery = 'SELECT * FROM article WHERE articleIdx = ?';
    const selectResult = await db.queryParam_Arr(selectQuery, [articleIdx]);

    if(!selectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };

    if(selectResult.length == null){   // articleIdx가 존재하지 않을 경우
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const deleteQuery ='DELETE FROM article WHERE articleIdx = ?';
    const deleteResult = await db.queryParam_Arr(deleteQuery, [articleIdx]);

    if(!deleteResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };
    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_DELETE_ARTICLE));  // 게시글 삭제 성공
});

module.exports = router;