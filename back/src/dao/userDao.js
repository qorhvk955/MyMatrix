const { pool } = require("../../database");

exports.insertUser = async (email, password, nickname) => {
    try{
        const connection = await pool.getConnection(async (conn) => conn); 

        try {
            const insertUserQuery = "insert into Users(email, password, nickname) values(?,?,?);";
            const insertUserParams = [email, password, nickname]

            const [row] = await connection.query(insertUserQuery, insertUserParams);
            connection.release();
            return row;

        } catch (err) {
            console.error(err);
            connection.release();
            return false;
        }
        
    }catch(err){
        console.error(err);
        connection.release();
        return false;
    }
}

exports.selectUserByEmail = async (email) => {
    try{
        const connection = await pool.getConnection(async (conn) => conn); 

        try {
            const selectUserByEmailQuery = "select * from Users where email = ?";
            const selectUserByEmailParams = [email];

            const [row] = await connection.query(selectUserByEmailQuery, selectUserByEmailParams);
            connection.release();
            return row;

        } catch (err) {
            console.error(err);
            connection.release();
            return false;
        }
        
    }catch(err){
        console.error(err);
        connection.release();
        return false;
    }

}

exports.selectUser = async (email, password) => {
    try{
        const connection = await pool.getConnection(async (conn) => conn); 

        try {
            const selectUserQuery = "select * from Users where email = ? and password = ?";
            const selectUserParams = [email, password];

            const [row] = await connection.query(selectUserQuery, selectUserParams);
            connection.release();selectUserQuery
            return row;

        } catch (err) {
            console.error(err);
            connection.release();
            return false;
        }
        
    }catch(err){
        console.error(err);
        connection.release();
        return false;
    }
}

exports.selectNicknameByUserIdx = async (userIdx) => {
    try{
        const connection = await pool.getConnection(async (conn) => conn); 

        try {
            const selectNicknameByUserIdxQuery = "select * from Users where userIdx = ?;";
            const selectNicknameByUserIdxParams = [userIdx];

            const [row] = await connection.query(selectNicknameByUserIdxQuery, selectNicknameByUserIdxParams);
            connection.release();
            return row;

        } catch (err) {
            console.error(err);
            connection.release();
            return false;
        }
        
    }catch(err){
        console.error(err);
        connection.release();
        return false;
    }

}

