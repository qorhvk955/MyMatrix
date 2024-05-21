const indexDao = require("../dao/indexDao");

exports.createTodo = async (req, res) => {

    const { userIdx } = req.verifiedToken;
    const { contents, type } = req.body;

    if(!userIdx || !contents || !type) {
        return res.send({
            isSuccess : false,
            code : 400,
            message : "입력값이 누락됐습니다."
        })
    }

    if(contents.length > 20){
        return res.send({
            isSuccess : false,
            code : 400,
            message : "콘텐츠는 20글자 이하로 설정해주세요"
        })
    }

    const validTypes = ["do", "delete", "decide", "delegate"];
    if(!validTypes.includes(type)){
        return res.send({
            isSuccess : false,
            code : 400,
            message : "유효한 타입이 아닙니다."
        })
    }

    const insertTodoRow = await indexDao.insertTodo(userIdx, contents, type);  
    
    if(!insertTodoRow) {
        return res.send({
            isSuccess : false,
            code : 403,
            message : "요청에 실패했습니다. 관리자에게 문의해주세요."
        });
    }

    return res.send({
        isSuccess : true, 
        code : 200,
        message : "일정 생성 성공",
    });
};

exports.readTodo = async (req, res) => {
    const {userIdx} = req.verifiedToken; 

    const todos = {};
    const types = ["do", "delete", "decide", "delegate"];

    for (let type of types) {
        let selectTodoByTypeRows = await indexDao.selectTodoByType(userIdx, type);

        if(!selectTodoByTypeRows) {
            return res.send({
                isSuccess : false,
                code : 400,
                message : "일정 조회 실패. 관리자에게 문의해주세요."
            });
        }

        todos[type] = selectTodoByTypeRows;
    }

    return res.send({
        result : todos,
        isSuccess : true, 
        code : 200,
        message : "일정 조회 성공",
    });
};

exports.updateTodo = async (req, res) => {
    const { userIdx } = req.verifiedToken;
    let {todoIdx, contents, status} = req.body;

    if(!userIdx || !todoIdx){
        return res.send({
            isSuccess : false,
            code : 400,
            message : "userIdx, todoIdx 확인 필요"
        });
    }

    if(!contents) {
        contents = null; 
    }

    if(!status){
        status = null; 
    }

    const idsValidTodoRow = await indexDao.selectValidTodo(userIdx, todoIdx);

    if(idsValidTodoRow.length < 1) {
        return res.send({
            isSuccess : false,
            code : 400,
            message : "유효한 요청이 아닙니다.",
        });
    }

    const updateTodoRow = await indexDao.updateTodo(
        userIdx,
        todoIdx,
        contents,
        status
    );

    return res.send({
        isSuccess : true,
        code : 200,
        message : "성공!!",
    });
};

exports.deleteTodo = async (req, res) => {
    const { userIdx } = req.verifiedToken;
    const { todoIdx } = req.params;

    if(!userIdx || !todoIdx) {
        return res.send({
            isSuccess : false,
            code : 400,
            message : "userIdx, todoIdx를 입력해주세요",
        });
    }

    console.log(userIdx, todoIdx);

    const idsValidTodoRow = await indexDao.deleteTodo(userIdx, todoIdx);

    if(idsValidTodoRow.length < 1) {
        return res.send({
            isSuccess : false,
            code : 400,
            message : "유효한 요청이 아닙니다.",
        });
    }

    const deleteTodoRow = await indexDao.deleteTodo(userIdx, todoIdx);

    if(!deleteTodoRow) {
        return res.send({
            isSuccess : false,
            code : 400,
            message : "삭제 실패",
        });
    }

    return res.send({
        isSuccess : true,
        code : 200,
        message : "삭제 성공!!",
    });
}

