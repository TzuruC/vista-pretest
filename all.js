import './assets/scss/all.scss';
import 'bootstrap/dist/js/bootstrap.min.js';

console.log("Hello world!");

//取得前台景點列表
const getVistas = "http://localhost:3000/vistas/";
axios.get(getVistas)
    .then(
        function(res){
            let ary = res.data;
            const name = document.querySelector('#vistaLi');   
            for(let i=0; i<ary.length; i++){
                name.innerHTML +=`
            <li class="col-sm-3 mb-4">
                <div class="card">
                <div class="card-body">
                    <h5 class="card-title fw-bold">`+
                    ary[i].name
                    + `</h5>
                    <p class="card-text">` +
                    ary[i].description.substring(0,16)
                    + `...</p>
                    <a href="vista-detail.html" class="btn btn-primary">看詳細</a>
                </div>
                </div>
            </li> 
            `;
            }            
    })
    

//取得前台單一景點


//取得後台景點列表

axios.get(getVistas)
    .then(
        function(res){
            let ary = res.data;
            const name = document.querySelector('#vistaTd');   
            for(let i=0; i<ary.length; i++){                
                name.innerHTML +=`
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
                  <a href="" class="link-primary">編輯</a><br>
                  <a href="" class="link-danger">刪除</a>                
                </td>
              </tr>  
            `;
            }            
    })
