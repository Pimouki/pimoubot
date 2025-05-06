const websocket = new WebSocket("ws://localhost:8002/");
const main = document.querySelector('#main')
type QuestionReponse = {
    question: string;
    options: string[];
}



websocket.addEventListener('open',()=>{
    websocket.send(JSON.stringify({qs:'bonjour quizz pimous'}))


    websocket.addEventListener('message',(data: any)=>{
        // data j'ai une info qui permet d'afficher les questions
        buildQuestionReponse(data)
    
    })
})

function buildQuestionReponse(question: QuestionReponse): void{
    if(!main) return
    main.childNodes.forEach(item=>{
        main.removeChild(item)
    })

    const title = document.createElement('h1');
    title.textContent = question.question;
    main.appendChild(title);
    const bloc = document.createElement('div');
    bloc.className = "bloc"
    question.options.forEach(response=>{

        const responseTitle = document.createElement('h2');

        responseTitle.textContent = response

        bloc.appendChild(responseTitle);
        main.appendChild(bloc);
    })
}


