const userDao = require("../dao/userDao");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../secret");

exports.signup = async (req, res) => {
    const { email, password, nickname } = req.body;

    if( !email || !password || !nickname) {
        return res.send({
            isSuccess: false,
            code: 400, 
            message: "회원가입 입력 값을 확인해주세요"
        })
    }

    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!isValidEmail.test(email)){
        return res.send({
            isSuccess: false, 
            code: 400,
            message: "이메일 형식을 확인해주세요.",
        });
    }

    const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // (비밀번호가 최소 8자 이상이며 대문자, 소문자, 숫자를 최소 하나 이상 포함)
    if (!isValidPassword.test(password)){
        return res.send({
            isSuccess: false, 
            code: 400,
            message: "비밀번호 형식을 확인해주세요.",
        });
    }

    if (nickname.length < 2 || nickname.length > 10) {
        return res.send({
            isSuccess: false, 
            code: 400,
            message: "닉네임 형식을 확인해주세요.2~10글자",
        });
    }

    const isDulpicatedEmail = await userDao.selectUserByEmail(email);
    if(isDulpicatedEmail.length > 0){
        return res.send({
            isSuccess: false, 
            code: 400,
            message: "이미 가입된 회원입니다.",
        });
    }

    const insertUserRow = await userDao.insertUser(email, password, nickname);
    if(!insertUserRow){
        return res.send({
            isSuccess: false, 
            code: 400,
            message: "회원가입실패",
        });
    }

    return res.send({
        isSuccess: true, 
        code: 200,
        message: "회원가입 성공",
    });
};

exports.signin = async (req, res) => {
    const {email, password} = req.body;

    if( !email || !password) {

        return res.send({
            isSuccess: false, 
            code: 400,
            message: "회원정보를 입력해주세요",
        });
    }

    // 회원여부 검사
    const isValidUser = await userDao.selectUser(email, password);

    if(!isValidUser) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "db에러"
        })
    }

    if(isValidUser.length < 1) {
        console.log("isValidUser.length" + isValidUser.length);

        return res.send({
            isSuccess: false,
            code: 400,
            message: "존재하지 않는 회원"
        })
    }

    // jwt 토근 발급

    const [userInfo] = isValidUser;
    const userIdx = userInfo.userIdx;

    const token = jwt.sign(
        {userIdx: userIdx}, // 페이로드
        jwtSecret, // 시크릿 키
    );

    return res.send({
        result: {token: token},
        isSuccess: true,
        code: 200,
        message: "로그인 성공"
    })
 

}

exports.getNicknameByToken = async (req, res) => {
    const { userIdx } = req.verifiedToken;
    const [ userInfo ] = await userDao.selectNicknameByUserIdx(userIdx);
    const nickname = userInfo.nickname;

    console.log(nickname);
    return res.send({
        result: {nickname : nickname},
        isSuccess: true, 
        code: 200,
        message: "토큰 검증 성공"
    })
   

};
