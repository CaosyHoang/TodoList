var listApi = "http://localhost:3000/list";
function start(){
    getList(renderQuest);
}
start();
function getList(callback){
    fetch(listApi)
        .then((response) => response.json())
        .then(callback)
}
function renderQuest(list){
    var quest = document.querySelector("div[name=quest]");
    var answer = document.querySelector("input[name=answer]");
    var noKnow = document.querySelector(".options button:nth-child(1)");
    var confirm = document.querySelector(".options button:nth-child(2)");
    var rightAnswer = document.querySelector("div[name=right-answer]");
    var next = document.querySelector("button[name=next-to]");
    var options = document.querySelector(".options");
    var notification = document.querySelector(".notification");
    var close = document.querySelector("#close");
    var order = 0;
    quest.innerText = list[order].define;
    confirm.onclick = () => {
        var regex = new RegExp(`${list[order].define}`, "i");
        if(regex.test(answer.value)){
            options.style.display = "none";
            notification.style.display = "block";
            rightAnswer.innerText = list[order].terms;
        }else{
            order++;
            if(order == list.length) document.location = "./finish.html";
            quest.innerText = list[order].define;
            answer.value = "";
        }
    }
    noKnow.onclick = () => {
        options.style.display = "none";
        notification.style.display = "block";
        rightAnswer.innerText = list[order].terms;
    }
    next.onclick = () => {
        order++;
        if(order == list.length) document.location = "./finish.html";
        options.style.display = "block";
        notification.style.display = "none";
        quest.innerText = list[order].define;
        answer.value = "";
    }
    close.onclick = () => document.location = "./editting.html";
}