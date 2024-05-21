readTodo();

async function readTodo(){

    console.log("readTodo실행");

    const token = localStorage.getItem("x-access-token");
    if(!token) {
        return
    }
    const config = {
        method: "get",
        url: url + "/todos",
        headers : {"x-access-token": token},
    };

    try {
        const res = await axios(config);
        if (res.data.code !== 200){
            alert(res.data.message);
            return false;
        }

        const todoDataSet = res.data.result;

        for( let section in todoDataSet) {
            const sectionUl = document.querySelector(`#${section} ul`);
            const arrayForEachSection = todoDataSet[section];

            let result = "";
            for ( let todo of arrayForEachSection) {
                let element = `
                <li class="list-item" id=${todo.todoIdx}>
                    <div class="done-text-container">
                        <input type="checkbox" class="todo-done" ${todo.type === 'C' ? "checked" : ""}/>
                        <p class="todo-text">${todo.contents}</p>
                    </div>    
    
                    <div class="update-delete-container">
                        <i class="todo-update fa-solid fa-pen"></i>
                        <i class="todo-delete fa-solid fa-trash"></i>
                    </div>
                </li>
                `;
    
                result += element;        
            }
            sectionUl.innerHTML = result;       
        }       
    } catch (err){
        console.error(err);
    }
}

const matrixContainer = document.querySelector(".matrix-container");
matrixContainer.addEventListener("keypress", cudController);
matrixContainer.addEventListener("click", cudController);



function cudController(event) {
    const token = localStorage.getItem("x-access-token");

    if(!token) {
        return;
    }

    const target = event.target;
    const targetTagNme = target.tagName;
    const eventType = event.type;
    const key = event.key;

    console.log(target, targetTagNme, eventType, key);


    if(targetTagNme === "INPUT" && key === "Enter"){
        createTodo(event, token);
        return;
    };

    if(target.className === "todo-done" && eventType === "click"){
        updateTodoDone(event, token);
        return;
    }

    const firstClassName = target.className.split(" ")[0];
    
    if(firstClassName === "todo-update" && eventType === "click") {
        updateTodoContents(event, token);
        return;
    }

    if(firstClassName === "todo-delete" && eventType === "click") {
        deleteTodo(event, token);
        return;
    }
}



async function createTodo(event, token) {

    console.log("createTodo실행");

    const contents = event.target.value;
    const type = event.target.closest(".matrix-item").id;
    
    if(!contents){
        alert("내용을 입력해주세요");
        return false;
    }

    const config = {
        method: "post",
        url: url + "/todo",
        headers: { "x-access-token" : token },
        data: {
            contents: contents,
            type: type,
        },
    };


    try{
        const res = await axios(config);            

        if(res.data.code !==200){
            alert(res.data.message);
            return false            
        }

        readTodo();
        event.target.value = "";
        return true; 

    }catch(err){
        console.error(err);

    }
}

async function updateTodoDone(event, token) {
    const status = event.target.checked ? 'C' : 'A'
    const todoIdx = event.target.closest(".list-item").id;

    const config = {
        method: "patch",
        url: url + "/todo",
        headers : {"x-access-token": token},
        data: {
            todoIdx: todoIdx,
            status: status,
        },
    };

    try {
        const res = await axios(config);
        if (res.data.code !== 200){
            alert(res.data.message);
            console.log("에러")
            return false;
        }
        readTodo();
    }catch(err){
        console.error(err);
        return false;
    }
}

async function updateTodoContents(event, token){
    console.log("updateTodoContents 동작");

    const contents = prompt("내용을 입력해주세요.");
    const todoIdx = event.target.closest(".list-item").id;

    const config = {
        method: "patch",
        url: url + "/todo",
        headers : {"x-access-token": token},
        data: {
            todoIdx: todoIdx,
            contents: contents,
        },
    };

    try {
        const res = await axios(config);
        if (res.data.code !== 200){
            alert(res.data.message);
            console.log("에러")
            return false;
        }
        readTodo();
    }catch(err){
        console.error(err);
        return false;
    }
}

async function deleteTodo(event, token){

    const isValidReq = confirm("삭제하시겠습니까?\n삭제 후에는 복구가 어렵습니다.")

    if(!isValidReq) return;

    const todoIdx = event.target.closest(".list-item").id;

    const config = {
        method: "delete",
        url: url + `/todo/${todoIdx}`,
        headers : {"x-access-token": token},
    };

    try {
        const res = await axios(config);
        if (res.data.code !== 200){
            alert(res.data.message);
            console.log("에러")
            return false;
        }
        readTodo();
    }catch(err){
        console.error(err);
        return false;
    }}