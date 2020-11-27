const FPS=35; //frames per second
const vitezaIntoarcere=260;//in grade pe secunda
var canvas=document.getElementById("jocAsteroizi");
var ctx=canvas.getContext("2d");
const fortaFrecare=0.8; //coeficientul de frecare al spatiului 0=nu avem forta de frecare

const dimensiuneNava=25;
const acceleratieNava=5; //pixeli pe secunde

var nava={
    x:canvas.width/2,
    y:canvas.height/2,
    //sa apara la mijloc
    r: dimensiuneNava/2,
    a: 90/180*Math.PI, //conversie in radius; angle - directia navei
    rotire: 0,
    //pentru mers:
    inainteaza:false,
    inaintare:{
        x:0,
        y:0
    }
    
}

//event handlers ca sa rotesc nava
document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);
function keyDown(/** @type {keyboardEvent}*/ eveniment){
    switch(eveniment.keyCode){
            //pentru rotit la stanga folosind z si Z
        case 122: 
        nava.rotire=vitezaIntoarcere/180*Math.PI/FPS;
        case 90: 
        nava.rotire=vitezaIntoarcere/180*Math.PI/FPS;

            break;
            //sus -> merge drept
        case 38: 
            nava.inainteaza=true;
            break;
            //dreapta c/C
        case 99: 
        nava.rotire=-vitezaIntoarcere/180*Math.PI/FPS;
            break;
        case 67: 
        nava.rotire=-vitezaIntoarcere/180*Math.PI/FPS;
            break;
    }
}
function keyUp(/** @type {keyboardEvent}*/ eveniment){
    switch(eveniment.keyCode){
        //stop rotit la stanga
    case 122: 
        nava.rotire=0;
            break;
    case 90: 
        nava.rotire=0;
             break;
        //stop  mers drept
    case 38: 
            nava.inainteaza=false;
            break;
        //dreapta
    case 99: 
        nava.rotire=0;
            break;
    case 67: 
        nava.rotire=0;
            break;
}

}
//set up the game loop
setInterval(update,1000/FPS);

function update(){
    //desenez fundalul(spatiul)
    ctx.fillStyle = "#071425";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    //desenez nava in forma de triunghi
    ctx.strokeStyle="yellow";
    ctx.lineWidth=dimensiuneNava/20;
    //incep sa desenez triunghiul
    ctx.beginPath();
    ctx.moveTo(nava.x+4/3*nava.r*Math.cos(nava.a),nava.y-4/3*nava.r*Math.sin(nava.a));
    //nava.x reprezinta centrul navei la care adaugam raza * cosinus care reprezinta orizontalul unghiului navei
    ctx.lineTo(nava.x-nava.r*(2/3*Math.cos(nava.a)-Math.sin(nava.a)),nava.y+nava.r*(Math.sin(nava.a)+Math.cos(nava.a))); //partea din spate din dreapta
    ctx.lineTo(nava.x-nava.r*(2/3*Math.cos(nava.a)+Math.sin(nava.a)),nava.y+nava.r*(Math.sin(nava.a)-Math.cos(nava.a))); //partea din spate din stanga
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle="yellow";
    ctx.fillRect(nava.x-1,nava.y-1,2,2); //cercul galben din interiorul navei


    //mut nava
    if(nava.inainteaza)
    {
        nava.inaintare.x=nava.inaintare.x + acceleratieNava*Math.cos(nava.a)/FPS;
        nava.inaintare.y=nava.inaintare.x - acceleratieNava*Math.sin(nava.a)/FPS;
    }
    else
    {
        nava.inaintare.x= nava.inaintare.x-fortaFrecare*nava.inaintare.x/FPS;
        nava.inaintare.y= nava.inaintare.y+fortaFrecare*nava.inaintare.y/FPS;
    }
    nava.x=nava.x+nava.inaintare.x;
    nava.y=nava.y+nava.inaintare.y;

    //rotesc nava
    nava.a+=nava.rotire;


}