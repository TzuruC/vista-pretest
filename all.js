// import { forEach } from 'json-server-auth';
import './assets/scss/all.scss';
import 'bootstrap/dist/js/bootstrap.min.js';

const renderUrl = 'http://localhost:3000/vistas';

if (window.location.href.includes('index.html')) {
    //取得前台景點列表
    axios.get(renderUrl)
    .then(
        function(res){
            let ary = res.data;
            const dataContainer = document.getElementById("vistaLi");   
            for(let i=0; i<ary.length; i++){
                dataContainer.innerHTML +=`
            <li class="col-sm-3 mb-4">
                <div class="card">
                <div class="card-body">
                    <h5 class="card-title fw-bold">`+
                    ary[i].name
                    + `</h5>
                    <p class="card-text">` +
                    ary[i].description.substring(0,16)
                    + `...</p>
                    <a href="vista-detail.html?id=` +
                    i
                    + `" class="btn btn-primary">看詳細</a>
                </div>
                </div>
            </li> 
            `;
            }            
    })
}


if (window.location.href.includes('vista-detail.html')) {
    //取得前台單一景點
    axios.get('http://localhost:3000/vistas/')    
    .then(        
        function(res){
            const urlParams = new URLSearchParams(window.location.search);
            const vistaId = urlParams.get('id');
            let ary = res.data;
            const dataContainer = document.getElementById('vistaContainer');
            dataContainer.innerHTML = `
            <h2>`+
            ary[vistaId].name
            +`</h2>
            <p>`+
            ary[vistaId].description
            +`</p>
            `;
        }
    )    
    .catch(error => {
        console.error('Error loading data:', error);
    });
}

if (window.location.href.includes('admin-list.html')) {
//取得後台景點列表  //刪除景點功能
axios.get('http://localhost:3000/vistas/')
    .then(
        function(res){
            let ary = res.data;
            const dataContainer = document.getElementById('vistaTd');   
            for(let i=0; i<ary.length; i++){                
                dataContainer.innerHTML +=`
                <tr>
                <th scope="row">`+
                ary[i].id
                +`</th>
                <td>`+
                ary[i].name
                +`</td>
                <td>`+
                ary[i].description
                +`</td>
                <td>
                <a href="admin-edit.html?id=` +
                i
                + `" class="link-primary">編輯</a><br>
                <a class="deleteButton link-danger" data-id="`+
                ary[i].id
                +`" href="" data-bs-target="#exampleModal">刪除</a>                
                </td>
            </tr>  
            `;
            }     
        
            //html 渲染完成後加上刪除功能
            const deleteButton = document.querySelectorAll(".deleteButton");   
            console.log(deleteButton); 
            deleteButton.forEach(deleteButton => {
                deleteButton.addEventListener('click', function(e){
                    e.preventDefault();        
                    let deleteId = this.getAttribute('data-id');
                    axios.delete(`http://localhost:3000/vistas/${deleteId}`)              
                    .then(function(res){                    
                        alert('刪除成功');
                        location.reload();
                    })              
                    .catch(error => {
                        console.error('刪除失敗︰', error);
                    });  
            })
            });
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });
}

if (window.location.href.includes('admin-edit.html')) {
   //編輯後台單一景點
    axios.get('http://localhost:3000/vistas/')    
    .then(        
        function(res){
            const urlParams = new URLSearchParams(window.location.search);
            const vistaId = urlParams.get('id');
            let ary = res.data;
            const name = document.getElementById('edit-container');
            name.innerHTML = `
            <label class="mt-3 mb-1" for="title">標題</label>
            <input id="editName" class="form-control" name="title" type="text" value="`+
            ary[vistaId].name
            +`">
            <label class="mt-3 mb-1" for="content">內文</label>
            <textarea id="editDescription" class="form-control" name="content" type="text">`+
            ary[vistaId].description
            +`</textarea>
            <a id="editButton" type="button" class="me-2 my-3 btn btn-outline-primary" href="" edit-id="`+
            ary[vistaId].id
            +`">修改資料</a> 
            <a type="button" class="me-2 my-3 btn btn-outline-primary" href="admin-list.html">返回列表</a>`;   

            //將value存回該筆資料中
            const editButton = document.getElementById('editButton');
            editButton.addEventListener('click', function(e){
                e.preventDefault();   
                //抓到最新的 value
                const editName = document.getElementById('editName').value;
                const editDescription = document.getElementById('editDescription').value;
                const editData = {
                    "name":editName,
                    "description":editDescription,
                }
                console.log(editData);
                // patch 請求
                axios.patch(`http://localhost:3000/vistas/${ary[vistaId].id}`, editData)
                .then(function (response) {
                    alert("資料儲存成功");
                    location.reload();
                })
                .catch(function (error) {
                    console.error("创建数据时发生错误:", error);
                });  
            })
        }
    )       
    .catch(error => {
        console.error('Error loading data:', error);
    });
}


if (window.location.href.includes('admin-add.html')) {
   //新增後台單一景點
    const addForm = document.getElementById('addForm');
    addForm.addEventListener('submit', function(e){
        e.preventDefault(); //阻止默認提交
        // 取得表單內容
        const newName = document.getElementById('name').value;
        const newDescription = document.getElementById('description').value;
        //內容空白的話不能新增
        if (!newName.trim() && !newDescription.trim()) {
            alert("標題和內文不能為空白");
            return; // 阻止表單送出
        } else if(!newName.trim()) {
            alert("標題不能為空白");
            return; // 阻止表單送出
        } else if(!newDescription.trim()) {
            alert("內文不能為空白");
            return; // 阻止表單送出
        }
        // 要送出的組裝內容
        const newData = {
            "name":newName,
            "description":newDescription,
        }
        // POST 請求
        axios.post('http://localhost:3000/vistas', newData)
        .then(function (response) {
            alert("新增成功");
            window.location.href = 'admin-list.html';
        })
        .catch(function (error) {
            console.error("创建数据时发生错误:", error);
        });  
    });
}




function checkEmailAddress(mail) {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (mail.match(mailformat)){
        console.log(true);
    } else{
        console.log(false);
    }
};




//登入
if (window.location.href.includes('login.html')) {
let token="";
const loginBtn = document.querySelector("#loginBtn");
//點擊送出btn
loginBtn.addEventListener('click', function(e){
    e.preventDefault();

    //取得使用者輸入帳號密碼
    const loginMail = document.getElementById('loginMail').value;
    const loginPsw = document.getElementById('loginPsw').value;

    //發送login請求
    axios.post('http://localhost:3000/login',{
        "email": loginMail,
        "password": loginPsw
    })
    .then(function(res){
        //取得token並存在localstorage
        token = res.data.accessToken;     
        if(token){
            console.log("登入成功");
            localStorage.setItem("vistaLoginToken",token);
            alert("登入成功!");
            window.location.href = 'index.html';
        } else {
            console.log("帳號或密碼錯誤");   
        }
        // localStorage.getItem("test"); 值是saved
    })
    .catch(function(err){
        console.log(err.response);
    })
})
}

// 判斷是否有登入

let islogin = localStorage.getItem("vistaLoginToken"); // null
let logUI;
let saveVistaUI;
let adminUI;
// const logoutState = document.querySelectorAll(".logoutState");
document.addEventListener("DOMContentLoaded", function () { 
    
    if (islogin) { // 使用者已經登入        
        if (window.location.href.includes('login.html')) {
        // 前台判斷
        logUI = document.querySelector("#logUI");    
        saveVistaUI = document.querySelector("#saveVista");
        // 顯示收藏、登出按鈕
        logUI.innerHTML = `
        <a class="mx-2" href="">收藏</a>
        <a class="logoutBtn ml-2" href="">登出</a>`;
        // 在景點頁加入已收藏、未收藏介面
        if (window.location.href.includes('vista-detail.html')) {
        saveVistaUI.innerHTML = `
        <a href="">已收藏</a>
        <a href="">未收藏 </a>`;    
        }    
        } 
            // // 後台判斷
            // adminUI = documten.querySelector("#adminUI");
            // // 顯示管理員介面
            // adminUI.innerHTML = `
            // <a class="btn btn-outline-primary mx-1" href="admin-log.html">回到後台</a>
            // <a class="btn btn-outline-primary mx-1" href="index.html">回到首頁</a>
            // <a class="btn btn-outline-primary mx-1" href="admin-add.html">新增景點</a>
            // <a id="adminLogout" class="btn btn-outline-primary ml-2" href="admin-log.html">登出</a>`;                
        
    } else {
        if (window.location.href.includes('login.html')) {
        logUI.innerHTML = `
        <a class="btn btn-outline-primary mx-2" href="login.html">登入</a>
        <a class="btn btn-outline-primary" href="register.html">註冊</a>`;
        }
    }
});




//登出
let logoutBtn;
// 判斷是否有登入再執行，以免沒事跳錯
document.addEventListener("DOMContentLoaded", function () { 
    logoutBtn = document.querySelectorAll(".logoutBtn"); 
    if (islogin) {
        console.log(logoutBtn);
        // 點擊登出按鈕
        logoutBtn.forEach(logoutBtn => {
            logoutBtn.addEventListener('click', function(e){
                e.preventDefault();
                // 清空token
                localStorage.removeItem("vistaLoginToken");
                // reload 或 跳轉畫面
                alert("已登出");
                window.location.href = 'index.html';
            })   
        });
    }
});


