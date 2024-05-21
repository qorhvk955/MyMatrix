const userController = require("../controller/userController");
const { jwtMiddleware }  = require("../../jwtMiddleware");

exports.userRouter = (app) => {
    // 회원가입 api
    app.post("/user", userController.signup); 

    // 로그인 api 
    app.post("/sign-in", userController.signin); 

    app.get("/jwt", jwtMiddleware, userController.getNicknameByToken); 
};
