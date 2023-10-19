// import { forEach } from 'json-server-auth';
import './assets/scss/all.scss';
import 'bootstrap/dist/js/bootstrap.min.js';

// 資料庫網域
const renderUrl = 'http://localhost:3000/';


//取得前台景點列表
if (window.location.href.includes('index.html')) {    
    axios.get(renderUrl+'vistas')
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
//取得前台單一景點
if (window.location.href.includes('vista-detail.html')) {
    axios.get(renderUrl+'vistas')    
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
//取得後台景點列表  //刪除景點功能
if (window.location.href.includes('admin-list.html')) {
axios.get(renderUrl+'vistas')
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
                    axios.delete(renderUrl + `vistas/${deleteId}`)              
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
//編輯後台單一景點
if (window.location.href.includes('admin-edit.html')) {
    axios.get(renderUrl+'vistas')    
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
                axios.patch(renderUrl + `vistas/${ary[vistaId].id}`, editData)
                .then(function (response) {
                    alert("資料儲存成功");
                    location.reload();
                })
                .catch(function (error) {
                    console.error("發生錯誤:", error);
                });  
            })
        }
    )       
    .catch(error => {
        console.error('Error loading data:', error);
    });
}
//新增後台單一景點
if (window.location.href.includes('admin-add.html')) {
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
        axios.post(renderUrl+'vistas', newData)
        .then(function (response) {
            alert("新增成功");
            window.location.href = 'admin-list.html';
        })
        .catch(function (error) {
            console.error("發生錯誤:", error);
        });  
    });
}


// 註冊(只有前台)
if (window.location.href.includes('register.html')) {
    const registerBtn = document.querySelector('#registerBtn');    
    // 點擊按鈕按鈕 ︰註冊帳號
    registerBtn.addEventListener('click',function(e){
        e.preventDefault();
        
        const registerEmail = document.querySelector('#registerEmail');
        const alertEmail = document.querySelector('#alertEmail');
        const registerPsw = document.querySelector('#registerPsw');
        const alertPsw = document.querySelector('#alertPsw');
        // 輸入帳號
        
        //傳送post
        axios.post(renderUrl + 'register',{
            "email": registerEmail.value,
            "password": registerPsw.value,
            "role": "user",
            "vistaId":[]
        })
        .then(function(res){            
            alert("註冊成功");
            // 我想在這裡加入自動登入功能
            window.location.href = 'index.html';
        })
        .catch(function(err){
            if (err.response.data == 'Email and password are required'){
                alertEmail.textContent = '*請輸入註冊用信箱!';
                alertPsw.textContent = '*請輸入密碼！';
                registerPsw.value = '';
            }else if(err.response.data == 'Email format is invalid'){
                alertEmail.textContent = '*信箱格式錯誤！';
                registerPsw.value = '';
            }else if(err.response.data == 'Password is too short'){
                alertPsw.textContent = '*密碼過短！請輸入 4 個以上數字或字母組合';
                registerPsw.value = '';
            }
        })
    })   
}

//登入前台

if (window.location.href.includes('login.html')) {
let token="";
let userId="";
let userRole="";
let vistaSaved="";
const loginBtn = document.querySelector("#loginBtn");
//點擊送出btn
loginBtn.addEventListener('click', function(e){
    e.preventDefault();

    //取得使用者輸入帳號密碼
    const loginMail = document.getElementById('loginMail').value;
    const alertEmail = document.querySelector('#alertEmail');
    const loginPsw = document.getElementById('loginPsw').value;
    const alertPsw = document.querySelector('#alertPsw');

    //發送login請求
    axios.post(renderUrl + 'login',{
        "email": loginMail,
        "password": loginPsw,
        "role":"user"
    })
    .then(function(res){
        //取得token並存在localstorage
        token = res.data.accessToken;  
        userId = res.data.user.id;
        userRole = res.data.user.role;
        vistaSaved = res.data.user;
        console.log(vistaSaved);
        if(token){
            console.log("登入成功");
            localStorage.setItem("vistaLoginToken",token);
            localStorage.setItem("userRole",userRole);
            localStorage.setItem("vistaSaved",vistaSaved);
            localStorage.setItem("userId",userId);
            alert("登入成功!");
            window.location.href = 'index.html';
        } else {
            console.log("帳號或密碼錯誤");   
        }
    })
    .catch(function(err){
        console.log(err.response.data);
        if (err.response.data == 'Email and password are required'){
            alertEmail.textContent = '*請輸入註冊用信箱!';
            alertPsw.textContent = '*請輸入密碼！';
            loginPsw = '';
        }else if(err.response.data == 'Email format is invalid'){
            alertEmail.textContent = '*信箱格式錯誤！';
            loginPsw = '';
        }else if(err.response.data == 'Password is too short'){
            alertPsw.textContent = '*密碼過短！請輸入 4 個以上數字或字母組合';
            loginPsw = '';
        }else if(err.response.data == 'Cannot find user'){
            alertEmail.textContent = '*此信箱尚未註冊';
            loginPsw = ''; //想清空但是失敗了
        }
    })
})
}



// // 判斷是否有登入
let islogin = localStorage.getItem("vistaLoginToken"); // null
let logUI = document.querySelector("#logUI"); 

let adminUI;
// const logoutState = document.querySelectorAll(".logoutState");
document.addEventListener("DOMContentLoaded", function () {     
    if (islogin) { // 使用者已經登入    
        // 登入頁以外的頁面都要渲染介面   
        if (!window.location.href.includes('login.html') && !window.location.href.includes('register.html') && !window.location.href.includes('admin-signin.html') && !window.location.href.includes('admin-signin.html')) {
                
        // 前台判斷
        
        // 顯示收藏、登出按鈕
        logUI.innerHTML = `
        <a class="mx-2" href="vista-saved.html">收藏</a>
        <a class="logoutBtn ml-2" href="">登出</a>`;
        // 在景點頁加入已收藏、未收藏介面
        if (window.location.href.includes('vista-detail.html')) {       
            
                
        }         
        }else if (window.location.href.includes('admin-signin.html')) {
            // 後台判斷
            adminUI = document.querySelector("#adminUI");
            adminUI.innerHTML = '';
        }
    }else{        
        if (!window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
            logUI.innerHTML = `
            <a class="btn btn-outline-primary mx-2" href="login.html">登入</a>
            <a class="btn btn-outline-primary" href="register.html">註冊</a>`;     
        }else if(window.location.href.includes('login.html')){
            logUI.innerHTML = `
            <a class="btn btn-outline-primary" href="register.html">註冊</a>`;
        }else if(window.location.href.includes('register.html')){
            logUI.innerHTML = `
            <a class="btn btn-outline-primary mx-2" href="login.html">登入</a>`;
        }
    }
});

// admin 檢查權限
if (window.location.href.includes('admin')) {
    // 不知道為什麼 admin-signin.html 沒有被擋
    if (!islogin || userRole!='admin') {
        // 會快速閃過html內容
        document.querySelector('body').innerHTML='';
        alert('您沒有權限進入!');
        window.location.href = 'index.html';
    }else{
        //找到user的role
        axios.get(renderUrl+'users') 
        .then(
            function(res){
                console.log('滿足登入權限')
            }
        )
    };
};


//登出
let logoutBtn;
let adminLogout;
// 判斷是否有登入再執行，以免沒事跳錯
document.addEventListener("DOMContentLoaded", function () { 
    logoutBtn = document.querySelectorAll(".logoutBtn"); 
    
    if (islogin) {
        if (window.location.href.includes('admin')){
            adminLogout = document.querySelector('#adminLogout');
            logoutBtn.addEventListener('click', function(e){
                e.preventDefault();
                localStorage.removeItem("vistaLoginToken");
                window.location.href = 'admin-signin.html';
            })
        }else{
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
    }
});



// 收藏/未收藏
if (window.location.href.includes('vista-saved.html')) {
    let uservistaId = localStorage.getItem("userId");
    let saveVistaArr = [];
    let collectVista = document.querySelector('#collectVista');    
    axios.get(renderUrl+'collects?_expand=vista')
    .then(function(res){        
        saveVistaArr = res.data;
        saveVistaArr.forEach(function(obj){
            if(obj.userId == uservistaId){
                collectVista.innerHTML+=`
        <div class="col-sm-3">
            <div class="card">
            <div class="card-body">
                <h5 class="card-title fw-bold">${obj.vista.name}</h5>
                <p class="card-text">${obj.vista.description.substring(0,16)}...</p>
                <a href="vista-detail.html?id=${obj.vistaId-1}" class="btn btn-primary">看詳細</a>
            </div>
            </div>
        </div>
        `;
            }            
        });        
    })
    .catch(function (error) {
        console.error("發生錯誤:", error);
    });  
};
document.addEventListener("DOMContentLoaded", function () {
// 內頁顯示收藏/未收藏
if (window.location.href.includes('vista-detail.html')) {
    let uservistaId = localStorage.getItem("userId");
    let saveVistaUI;
    let saveVistaArr = [];
    
    saveVistaUI = document.querySelector("#saveVista");
    
    axios.get(renderUrl + 'collects?_expand=vista')
        .then(function (res) {       
            saveVistaArr = res.data;

            const urlParams = new URLSearchParams(window.location.search);
            const vistaId = urlParams.get('id');
            const vistaGetId = Number(vistaId)+1;
            // 檢查當前的 userId 和頁面的 vistaId 是否相同
            const isVistaSaved = saveVistaArr.some(
                // 檢視所有物件內容中屬性 userId 值等於 ls 裡存放 userId
                // 檢視所有物件內容中屬性 userId 值等於網址取道的 vistaId
                item => item.userId == uservistaId && item.vistaId == vistaGetId
            );
            
            // 根据结果设置按钮内容
            if (isVistaSaved) {
                saveVistaUI.innerHTML = `<a id="deleteThisCollect" class="btn-sm btn btn-primary  href="">已收藏</a>`;    
                // 點擊按鈕儲存景點
                const deleteThisCollect = document.querySelector('#deleteThisCollect');
                
                // 點擊按鈕刪除景點
                deleteThisCollect.addEventListener('click', function(e){
                    e.preventDefault();
                    console.log('deleteThisCollect');
                    axios.get(renderUrl + `collects?vistaId=${vistaGetId}`)              
                    .then(function(res){    
                        const deleteCollect = res.data.find(
                            item => item.userId == uservistaId
                        ).id;
                        console.log(deleteCollect);  
                        axios.delete(renderUrl + `collects/${deleteCollect}`)     
                        .then (function(res){  
                            location.reload();
                        })
                        .catch(error => {
                            console.error('刪除失敗︰', error);
                        });          
                    })              
                    .catch(error => {
                        console.error('刪除失敗︰', error);
                    });  
                })                            
            } else {                
                saveVistaUI.innerHTML = `<a id="saveThisCollect" class="btn-sm btn btn-outline-primary" href="">未收藏</a>`;     
                const saveThisCollect = document.querySelector('#saveThisCollect');
                saveThisCollect.addEventListener('click', function(e){
                e.preventDefault();
                console.log('saveThisCollect');
                const newCollect = {
                    "userId":uservistaId,
                    "vistaId":vistaGetId,
                }
                console.log(newCollect);
                axios.post(renderUrl+'collects',newCollect)
                .then(function(res){
                    console.log(res);
                    location.reload();
                })
                .catch(function (error) {
                    console.error("發生錯誤:", error);
                });  
                })           
            }              
        })
        .catch(function (error) {
            console.error("發生錯誤:", error);
        });  
};
})
