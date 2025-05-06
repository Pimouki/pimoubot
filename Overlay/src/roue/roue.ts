import { Scene2d, loadImage , ArrayUtils } from 'jcv-ts-utils';
import {Choice,Roue} from './object-roue';
const websocket = new WebSocket("ws://localhost:8001/");




const Choices: Choice[] = ArrayUtils.shuffle([
    { id: "relance", name: "Relance la roue",size:100 },
    { id: "horoscope", name: "Lis l'horoscope",size:100 },
    { id: "game", name: "PimouChoix du jeu",size:100 },
    { id: "tatoo", name: "PimouTatoo",size:100 },
    { id: "Cuisto", name: "PimouChef",size:100 },
    { id: "VIP", name: "PimouVIP",size:100 },
    { id: "ART", name: "PimouDessin",size:100 },
    { id: "cosplay", name: "PimouCosplay",size:100 },
    { id: "Quizz", name: "PimouQuizz",size:100 },
    { id: "blague", name: "PimouBlague",size:100 },
    { id: "artiste", name: "Pimoutistique",size:100 },
    { id: "RP", name: "PimouRP",size:100 },
    { id: "JACKPOT", name: "PimouJACKPOT",size:100 },
    { id: "abonnement", name: "PimouBonnement",size:100 },
    

])




const container = document.getElementById('container');
export async function init() {
    if (!container) return;
    const scene = new Scene2d(container);
    const imgRoue = await loadImage("/roue/roue_qui_bouge_.png")
    const imgPtiteRoue = await loadImage("/roue/roue_pitite_bouge__.png")
    const cursor = await loadImage("/roue/Pointeur.png")
    const fond = await loadImage("/roue/fond.png")
    const LaRoue = new Roue(scene.width/2, scene.height/2, imgRoue,imgPtiteRoue,cursor,fond,Choices);
    scene.addItem(LaRoue)


    LaRoue.onStop = (result: Choice)=>{
        websocket.send(JSON.stringify(result))
    }
}

websocket.addEventListener('open',()=>{
    init();
})
