import "./style.css"
const container = document.getElementById("app")

function on_user_click(viewerID:string,x:number,y:number){
    if(!container)return
    const pimouki = document.createElement("div")
    pimouki.className = "pimouki"
    //permet de changer de taille le curseur
    const width = 25;
    const height = 25;
    pimouki.style.left = (x-width/2)+"px"   
    pimouki.style.top = (y-height/2)+"px"
    pimouki.style.width =width+"px"   
    pimouki.style.height =height+"px"
    container.appendChild(pimouki)
    
    console.log(x,y,viewerID)}
window.addEventListener("click",function(event:MouseEvent){on_user_click("test",event.x,event.y)})
export function init() {
    const ws = new WebSocket("wss://heat-api.j38.net/channel/464119722")
    ws.addEventListener("open", function () {
        console.log("connection open with heat")
    }, { once: true })
    function onMessage(message: any) {
        console.log(message)
        if (message.type !== "message") return
        const data = JSON.parse(message.data)
        if (data.type !== "click") return
        on_user_click(data.id,window.innerWidth*data.x,window.innerHeight*data.y)
    }
    ws.addEventListener("message",onMessage)



    ws.addEventListener("close", function () {
        console.log("connection closed with heat we will reopen nearly soon")
        ws.removeEventListener("message",onMessage)
        window.setTimeout(function(){init()},10000)


    }, { once: true })
}
init()