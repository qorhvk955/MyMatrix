const {pool} = require("../../database");

exports.getUsersRows = async () => {
    try{
        const connection = await pool.getConnection(async (conn) => conn); 

        try {
            const selectUserQuery = "SELECT * FROM Users";
            const [row] = await connection.query(selectUserQuery);
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

exports.insertTodo = async (userIdx, contents, type) => {
    try{
        const connection = await pool.getConnection(async (conn) => conn); 

        try {
            const selectUserQuery = "insert into Todos (userIdx, contents, type) values (?, ?, ?);";
            const insertTodoParams = [userIdx, contents, type];

            const [row] = await connection.query(selectUserQuery, insertTodoParams);
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

exports.selectTodoByType = async (userIdx, type) => {
    try{
        const connection = await pool.getConnection(async (conn) => conn); 

        try {
            const selectTodoByTypeQuery = "SELECT todoIdx, contents, status type FROM Todos WHERE userIdx = ? AND type = ? AND NOT (status = 'D');";
            const selectTodoByTypeParams = [userIdx, type];

            const [row] = await connection.query(selectTodoByTypeQuery, selectTodoByTypeParams);
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

exports.selectValidTodo = async (userIdx, todoIdx) => {
    try{
        const connection = await pool.getConnection(async (conn) => conn); 

        try {
            const selectValidTodoQuery = "SELECT * FROM Todos WHERE userIdx = ? AND todoIdx = ? AND NOT (status = 'D');";
            const selectValidTodoParams = [userIdx, todoIdx];

            const [row] = await connection.query(selectValidTodoQuery, selectValidTodoParams);
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

exports.updateTodo = async (userIdx, todoIdx, contents, status) => { 
    try{
        const connection = await pool.getConnection(async (conn) => conn); 

        try {
            const updateTodoQuery = "update Todos set contents = ifnull(?, contents), status = ifnull(?, status)  where userIdx = ? and todoIdx = ?;";
            const updateTodoParams = [contents, status, userIdx, todoIdx];

            const [row] = await connection.query(updateTodoQuery, updateTodoParams);
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

exports.deleteTodo = async (userIdx, todoIdx) => {
    
    try{
        const connection = await pool.getConnection(async (conn) => conn); 

        try {
            const deleteTodoQuery = "update Todos set status ='D' where userIdx = ? and todoIdx = ?;";
            const deleteTodoParams = [userIdx, todoIdx];

            const [row] = await connection.query(deleteTodoQuery, deleteTodoParams);
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