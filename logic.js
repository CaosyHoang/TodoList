const api = "http://localhost:3000/list";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const block = $(".list");
const input = $(".input");
const list = $(".list");

const App = {
    isError: false,
    getList(callback){
        try{
            fetch(api)
                .then(response => response.json())
                .then(callback)
                .catch(error=>{
                    this.isError = true;
                    callback();
                    console.warn("Fetch error: ", error);
                })
        }
        catch(error){
            console.warn("Other error: ", error);
        }
    },
    renderList(list){
        if(list){
            var htmls = list.map(item => `
                <li class="note-${item.id}">
                    <p ondblclick="App.allowInput(${item.id})">${item.content}</p>
                    <div>
                        <button onclick="App.patchContent(${item.id})"><i class="fa-solid fa-wrench"></i></button>
                        <button onclick="App.deleteContent(${item.id})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </li>
            `);
            block.innerHTML = htmls.join("");
        }
    },
    insertHtml(content){
        var html = `
            <li class="note-${content.id}">
                <p ondblclick="App.allowInput(${content.id})">${content.content}</p>
                <div>
                    <button onclick="App.patchContent(${content.id})"><i class="fa-solid fa-wrench"></i></button>
                    <button onclick="App.deleteContent(${content.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </li>
        `;
        block.insertAdjacentHTML("afterbegin", html);
    },
    pushContent(data, callback){
        var options = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }
        if(!this.isError){
            try{
                fetch(api, options)
                .then(response=>response.json())
                .then(callback)
                .catch(error=>{
                    this.isError = true;
                    callback();
                    console.warn("Fetch error: ", error);
                })
            }catch(error){
                console.warn("Other error: ", error);
            }
        }else{
            callback();
        }
       
    },
    patchContent(id){
        const text = block.querySelector(`.note-${id} p`);
        text.removeAttribute("contenteditable");
        text.parentNode.classList.remove("active");
        var options = {
            method: "PATCH",
            body: JSON.stringify({
                content: text.innerText
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
        if(this.isError){
            try{
                fetch(api+"/"+id, options)
                    .catch(error=>{
                        this.isError = true;
                        console.warn("Fetch error: ", error);
                    })
            }catch{
                console.warn("Other error: ", error);
            }
        }
    },
    deleteContent(id){
        const callback = ()=>{
            var note = block.querySelector(`.note-${id}`);
            note.remove();
        }
        var options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }
       if(this.error){
            try{
                fetch(api+"/"+id, options)
                    .then(callback)
                    .catch(error=>{
                        this.isError = true;
                        callback();
                        console.warn("Fetch error: ", error); 
                    })
            }catch{
                console.warn("Other error: ", error);
            }
       }else{
            callback();
       }
    },
    createForm(){
        var data = {
            content: input.value
        };
        this.pushContent(data, content=>{
            this.insertHtml(content||data);
            input.value="";
        })

    },
    allowInput(id){
        const text = block.querySelector(`.note-${id} p`);
        text.setAttribute("contenteditable","");
        text.parentNode.classList.add("active");
    },
    start(){
        this.getList((list)=>{
            this.renderList(list);
        });
    }
}
App.start();