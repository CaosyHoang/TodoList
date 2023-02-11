/* EDITTING */
var listApi = "http://localhost:3000/list";
function start(){
    getList(renderList);
    handleCreateForm();
    handleFinishForm();
}
start();
function getList(callback){
    fetch(listApi)
        .then((response) => response.json())
        .then(callback)
}
function renderList(list){
    var listWordBlock = document.querySelector("#list-word");
    var htmls = list.map((item) => {
        return `
            <li class="word-${item.id}">
                <p class="after">${item.id}</p>
                <span contenteditable="" name="terms">${item.terms}</span>
                <span contenteditable="" name="define">${item.define}</span>
                <span class="word-setup">
                    <button class="btn-small" onclick="deleteWord(${item.id})">Xóa</button>  
                </span>
            </li>`;
    });
    listWordBlock.innerHTML = htmls.join("");
}
function insertHtml(item){
    var listWordBlock = document.querySelector("#list-word");
    var html = `
            <li class="word-${item.id}">
                <p class="after">${item.id}</p>
                <span contenteditable="" name="terms">${item.terms}</span>
                <span contenteditable="" name="define">${item.define}</span>
                <span class="word-setup">
                    <button class="btn-small" onclick="deleteWord(${item.id})">Xóa</button>
                </span>
            </li>`;
    listWordBlock.insertAdjacentHTML("beforeend", html);
}
function createItem(data, callback){
    var options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch(listApi, options)
        .then((response) => response.json())
        .then(callback)
}
function handleCreateForm(){
    var createBtn = document.querySelector("#create");
    createBtn.onclick = function(){
        var data = {
            terms: "",
            define: ""
        };
        createItem(data, function(item){
            insertHtml(item);
        });
    }
}
function deleteWord(id){
    var options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch(listApi+"/"+id, options)
        .then(function(){
            var temp = document.querySelector(".word-"+id);
            temp.remove();
        });
}
function fixWord(id){
    var terms = document.querySelector(".word-"+id+" span[name=terms]").innerText;
    var define = document.querySelector(".word-"+id+" span[name=define]").innerText;
    var options = {
        method: "PATCH",
        body: JSON.stringify({
            terms: terms,
            define: define
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch(listApi+"/"+id, options)
}
function handleFinishForm(){
    var finishBtn = document.querySelector("#finish");
    finishBtn.onclick = () =>{
        var nodeList = document.querySelectorAll("#list-word li");
        nodeList.forEach(nodeItem => {
            fixWord(nodeItem.classList.value.slice(5));
        })  
        document.location = "./learn.html";
    }
}
