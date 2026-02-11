let users = JSON.parse(localStorage.getItem("users")) || [{username:"admin", password:"123"}];
let products = JSON.parse(localStorage.getItem("products")) || [
    {name:"Товар A", quantity:5, price:50},
    {name:"Товар B", quantity:2, price:700},
    {name:"Товар C", quantity:10, price:120}
];

let sortColumn=null, sortAsc=true;

document.getElementById("loginBtn").onclick=login;
document.getElementById("registerBtn").onclick=register;
document.getElementById("logoutBtn").onclick=logout;
document.getElementById("addBtn").onclick=addProduct;
document.getElementById("clearBtn").onclick=clearAll;
document.getElementById("search").oninput=renderTable;
document.querySelectorAll("th[data-column]").forEach(th=>th.onclick=()=>sortTable(th));

function saveUsers(){ localStorage.setItem("users", JSON.stringify(users)); }
function saveData(){ localStorage.setItem("products", JSON.stringify(products)); }

function login(){
    const u=document.getElementById("loginUsername").value.trim();
    const p=document.getElementById("loginPassword").value.trim();
    const f=users.find(user=>user.username===u && user.password===p);
    if(f){ showProducts(); document.getElementById("loginError").innerText=""; }
    else document.getElementById("loginError").innerText="Невірний логін або пароль";
}

function register(){
    const u=document.getElementById("loginUsername").value.trim();
    const p=document.getElementById("loginPassword").value.trim();
    if(!u||!p){ document.getElementById("loginError").innerText="Заповніть логін і пароль"; return; }
    if(users.find(user=>user.username===u)){ document.getElementById("loginError").innerText="Такий користувач вже існує"; return; }
    users.push({username:u,password:p});
    saveUsers();
    document.getElementById("loginError").innerText="Користувач створений, увійдіть";
}

function logout(){ 
    document.getElementById("loginPage").style.display="block";
    document.getElementById("productsPage").style.display="none";
    document.getElementById("loginUsername").value="";
    document.getElementById("loginPassword").value="";
    document.getElementById("loginError").innerText="";
}

function showProducts(){
    document.getElementById("loginPage").style.display="none";
    document.getElementById("productsPage").style.display="block";
    renderTable();
}

function renderTable(){
    const tbody=document.getElementById("tableBody");
    tbody.innerHTML="";
    let total=0;
    const s=document.getElementById("search").value.toLowerCase();
    products.forEach((p,i)=>{
        if(!p.name.toLowerCase().includes(s)) return;
        const sum=p.quantity*p.price; total+=sum;
        const c=sum<100?'red':sum<1000?'yellow':'green';
        const tr=document.createElement('tr'); tr.className=c;
        tr.innerHTML=`<td>${p.name}</td><td>${p.quantity}</td><td>${p.price}</td><td>${sum}</td>
        <td><button class="deleteBtn" onclick="deleteProduct(${i})">Видалити</button></td>`;
        tbody.appendChild(tr);
    });
    document.getElementById("total").innerText=total;
    updateArrows();
}

function addProduct(){
    const name=document.getElementById("name").value.trim();
    const quantity=parseFloat(document.getElementById("quantity").value);
    const price=parseFloat(document.getElementById("price").value);
    if(!name||quantity<=0||price<=0) return;
    products.push({name,quantity,price});
    saveData();
    renderTable();
    document.getElementById("name").value=""; document.getElementById("quantity").value=""; document.getElementById("price").value="";
}

function deleteProduct(i){ products.splice(i,1); saveData(); renderTable(); }
function clearAll(){ products=[]; saveData(); renderTable(); }

function sortTable(th){
    const c=th.dataset.column;
    if(sortColumn===c) sortAsc=!sortAsc; else {sortColumn=c; sortAsc=true;}
    products.sort((a,b)=>{
        let vA=c==='sum'?a.quantity*a.price:a[c];
        let vB=c==='sum'?b.quantity*b.price:b[c];
        if(typeof vA==='string'){ vA=vA.toLowerCase(); vB=vB.toLowerCase(); }
        return (vA>vB?1:-1)*(sortAsc?1:-1);
    });
    renderTable();
}

function updateArrows(){
    document.querySelectorAll('th span.arrow').forEach(s=>s.innerText='');
    if(!sortColumn) return;
    document.querySelectorAll(`th[data-column="${sortColumn}"] span.arrow`).forEach(s=>s.innerText=sortAsc?'▲':'▼');
}
