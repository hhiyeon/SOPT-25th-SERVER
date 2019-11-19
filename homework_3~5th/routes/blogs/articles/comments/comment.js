var express = require('express');
var router = express.Router();

const defaultRes = require('../../../../module/util/utils');
const resMessage = require('../../../../module/util/responseMessage');
const statusCode = require('../../../../module/util/statusCode');
const db = require('../../../../module/pool');
const authUtil = require("../../../../module/util/authUtils");

// commentIdx comment articleIdx
router.get('/', async(req, res) => { // 댓글 조회
    let articleIdx = req.body.articleIdx;

    if(!articleIdx){ // 입력에 널값
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }
    const selectQuery ='SELECT * FROM comment WHERE articleIdx = ?';
    const selectResult = await db.queryParam_Arr(selectQuery, [articleIdx]);

    if(!selectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };

    if(selectResult.length == null){   // 댓글 없는 경우
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.FAIL_READ_COMMENT));  // 댓글 조회 실패
        return ;
    }

    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_READ_COMMENT, selectResult));  // 댓글 조회 성공
});




router.post('/', authUtil.LoggedIn, async(req, res) => {    // 댓글 등록
    let comment = req.body.comment;
    let articleIdx = req.body.articleIdx;
    let userIdx = req.decoded.idx;

    if(!comment || !articleIdx){ // 입력에 널값
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const selectQuery = 'SELECT * FROM article WHERE articleIdx = ?';
    const selectResult = await db.queryParam_Arr(selectQuery, [articleIdx]);

    if(!selectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };

    if(selectResult.length == 0){   // articleIdx가 존재하지 않을 경우
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const insertQuery ='INSERT INTO comment (comment,articleIdx) VALUES (?, ?)';
    const insertResult = await db.queryParam_Arr(insertQuery, [comment, articleIdx]);

    if(!insertResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };
    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_CREATE_COMMENT));  // 댓글 등록 성공
});




router.put('/', authUtil.LoggedIn, async(req, res) => { // 댓글 수정
    let comment = req.body.comment;
    let commentIdx = req.body.commentIdx;
    let userIdx = req.decoded.idx;

    if(!comment || !commentId){ // 입력에 널값
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const selectQuery = 'SELECT * FROM comment WHERE commentIdx = ?';
    const selectResult = await db.queryParam_Arr(selectQuery, [commentIdx]);

    if(!selectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };

    if(selectResult.length == null){   // commentIdx가 존재하지 않을 경우
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const updateQuery ='UPDATE comment SET comment = ? WHERE commentIdx = ?';
    const updateResult = await db.queryParam_Arr(updateQuery, [comment, commentIdx]);

    if(!updateResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };
    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_UPDATE_COMMENT));  // 게시글 수정 성공
});




router.delete('/', authUtil.LoggedIn, async(req, res) => {  // 게시글 삭제
    let commentIdx = req.body.commentIdx;
    let userIdx = req.decoded.idx;

    if(!commentIdx){ // 입력에 널값
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const selectQuery = 'SELECT * FROM comment WHERE commentIdx = ?';
    const selectResult = await db.queryParam_Arr(selectQuery, [commentIdx]);

    if(!selectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };

    if(selectResult.length == 0){   // commentIdx가 존재하지 않을 경우
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const deleteQuery ='DELETE FROM comment WHERE commentIdx = ?';
    const deleteResult = await db.queryParam_Arr(deleteQuery, [commentIdx]);

    if(!deleteResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };
    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_DELETE_COMMENT));  // 게시글 수정 성공
});

module.exports = router;