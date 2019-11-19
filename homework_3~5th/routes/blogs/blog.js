var express = require('express');
var router = express.Router();

const defaultRes = require('../../module/util/utils');
const resMessage = require('../../module/util/responseMessage');
const statusCode = require('../../module/util/statusCode');
const db = require('../../module/pool');
const authUtil = require("../../module/util/authUtils");

// blogIdx host name
router.get('/', async(req, res) => { // 블로그 조회
    const selectQuery ='SELECT * FROM blog';
    const selectResult = await db.queryParam_None(selectQuery);

    if(!selectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR(message)
        return ;
    };

    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_READ_BLOG, selectResult));  // 블로그 조회 성공
});




router.post('/', authUtil.LoggedIn ,async(req, res) => {    // 블로그 등록
    let host = req.body.host;
    let name = req.body.name;
    let userIdx = req.decoded.idx;

    if(!host || !name){ // 입력에 널값
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }
    const insertQuery ='INSERT INTO blog (host, name) VALUES (?, ?)';
    const insertResult = await db.queryParam_Arr(insertQuery, [host, name]);

    if(!insertResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };
    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_CREATE_BLOG));  // 블로그 등록 성공
});




router.put('/', authUtil.LoggedIn, async(req, res) => { // 블로그 수정
    let host = req.body.host;
    let name = req.body.name;
    let blogIdx = req.body.blogIdx;
    let userIdx = req.decoded.idx;

    if(!host || !name || !blogIdx){ // 입력에 널값
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }
    const selectQuery = 'SELECT * FROM blog WHERE blogIdx = ?';
    const selectResult = await db.queryParam_Arr(selectQuery, [blogIdx]);

    if(!selectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };

    if(selectResult.length == 0){   // 블로그 idx가 존재하지 않을 경우
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const updateQuery ='UPDATE blog SET host = ?, name = ? WHERE blogIdx = ?';
    const updateResult = await db.queryParam_Arr(updateQuery, [host, name, blogIdx]);

    if(!updateResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };
    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_UPDATE_BLOG));  // 블로그 수정 성공
});

router.delete('/', authUtil.LoggedIn, async(req, res) => {  // 블로그 삭제
    let blogIdx = req.body.blogIdx;
    let userIdx = req.decoded.idx;

    if(!blogIdx){ // 입력에 널값
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }
    const selectQuery = 'SELECT * FROM blog WHERE blogIdx = ?';
    const selectResult = await db.queryParam_Arr(selectQuery, [blogIdx]);

    if(!selectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };

    if(selectResult.length == 0){
        res.status(400).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));    // 필요한 값이 없습니다.
        return ;
    }

    const deleteQuery ='DELETE FROM blog WHERE blogIdx = ?';
    const deleteResult = await db.queryParam_Arr(deleteQuery, [blogIdx]);

    if(!deleteResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        return ;
    };

    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_DELETE_BLOG));  // 블로그 삭제 성공
});

module.exports = router;