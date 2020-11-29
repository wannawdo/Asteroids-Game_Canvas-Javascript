var canvas=document.getElementById("jocAsteroizi");
var ctx=canvas.getContext("2d");



// ---------------------------------------------------------------------- NAVA

const dimensiuneNava=25;
const acceleratieNava=2; //pixeli pe secunde
const FPS=30; //frames per second
const vitezaIntoarcere=360;//in grade pe secunda
const fortaFrecare=0.7; //coeficientul de frecare al spatiului 0=nu avem forta de frecare


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
// ---------------------------------------------------------------------- NAVA
// ---------------------------------------------------------------------- ASTEROID
var asteroizi=[];
var nrAsteroizi=4; //nr de asteroizi initial
var vitezaAsteriozi=50;//viteza maxima initiala in pixeli pe secunde
var dimensiuneAsteroizi=120;//dimensiunea initiala a asteroizilor
var varfuriAsteroizi=12;//nr mediu de varfuri ale asteroizilor


creeazaAsteroizi();


function creeazaAsteroizi()
{
    asteroizi = [];
    var x;
    var y;
    for(var i=0; i<nrAsteroizi;i++){
        do {
            x=Math.floor(Math.random()*canvas.width); //round down
            y=Math.floor(Math.random()*canvas.height);
        }
        while(distantaDintrePuncte(nava.x,nava.y,x,y) <dimensiuneAsteroizi*2+nava.r);
       
        asteroizi.push(asteroidNou(x,y));
    }

}

function distantaDintrePuncte(xn,yn,xa,ya){
    return Math.sqrt(Math.pow(xa-xn,2)+Math.pow(ya-yn,2));
}

function asteroidNou(x,y){
    var asteroid={
        x:x,
        y:y,
        xv:Math.random()*vitezaAsteriozi/FPS*(Math.random()<0.5?1:-1), //viteza aseroid pe ox
        yv:Math.random()*vitezaAsteriozi/FPS*(Math.random()<0.5?1:-1), //viteza aseroid pe oy
        r:dimensiuneAsteroizi/2,
        a:Math.random()*2*Math.PI, //in radiani
        varf:Math.floor(Math.random()*(varfuriAsteroizi+1)+varfuriAsteroizi/2) //+1 ca sa nu fie 0
    };
    return asteroid;
}


// ---------------------------------------------------------------------- ASTEROID
// ---------------------------------------------------------------------- NAVA
const keyDown=(eveniment)=>{
    switch(eveniment.keyCode){
            //pentru rotit la stanga folosind z si Z
        case 122: 
        nava.rotire=vitezaIntoarcere/180*Math.PI/FPS;
        case 90: 
        nava.rotire=vitezaIntoarcere/180*Math.PI/FPS;
            break;
            //sagetica stanga
        case 37: 
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
            //sageata dreapta
        case 39: 
        nava.rotire=-vitezaIntoarcere/180*Math.PI/FPS;
            break;
    }
}
const keyUp=(eveniment)=>{
    switch(eveniment.keyCode){
        //stop rotit la stanga
    case 122: 
        nava.rotire=0;
            break;
    case 90: 
        nava.rotire=0;
            break;
    case 37: 
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
    case 39: 
        nava.rotire=0;
             break;
}
}
//event handlers ca sa rotesc nava
document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);
// ---------------------------------------------------------------------- NAVA
//set up the game loop
setInterval(update,1000/FPS);




function update(){
    //desenez fundalul(spatiul)
    ctx.fillStyle = "#071425";
    ctx.fillRect(0,0,canvas.width,canvas.height); //700,700

    // ---------------------------------------------------------------------- NAVA
    //desenez nava in forma de triunghi
    ctx.strokeStyle="yellow";
    ctx.lineWidth=dimensiuneNava/20;
    
    //incep sa desenez triunghiul
    ctx.beginPath();
    ctx.moveTo(nava.x+4/3*nava.r*Math.cos(nava.a),nava.y-4/3*nava.r*Math.sin(nava.a));
    //nava.x reprezinta centrul navei la care adaugam raza * cosinus care reprezinta orizontalul unghiului navei
    ctx.lineTo(
        nava.x-nava.r*(2/3*Math.cos(nava.a)-Math.sin(nava.a)),
    nava.y+nava.r*(2/3*Math.sin(nava.a)+Math.cos(nava.a))); //partea din spate din dreapta
    ctx.lineTo(nava.x-nava.r*(2/3*Math.cos(nava.a)+Math.sin(nava.a)),nava.y+nava.r*(2/3*Math.sin(nava.a)-Math.cos(nava.a))); //partea din spate din stanga
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle="yellow";
    ctx.fillRect(nava.x-1,nava.y-1,2,2); //cercul galben din interiorul navei
    nava.x=nava.x+nava.inaintare.x;
    nava.y=nava.y+nava.inaintare.y;

    //mut nava
    if(nava.inainteaza)
    {
        nava.inaintare.x=nava.inaintare.x + 0.8*acceleratieNava*Math.cos(nava.a)/FPS;
        nava.inaintare.y=nava.inaintare.y - 0.8*acceleratieNava*Math.sin(nava.a)/FPS;
       
       
        //ii desenez "focul"
        ctx.fillStype="yellow"
        ctx.strokeStyle=dimensiuneNava/10;
        ctx.strokeStyle="red";
        //incep sa desenez triunghiul
        ctx.beginPath();
        //spate stanga
        ctx.moveTo(
            nava.x-nava.r*(2/3*Math.cos(nava.a)-0.5*Math.sin(nava.a)),
            nava.y+nava.r*(2/3*Math.sin(nava.a)+0.5*Math.cos(nava.a)));
        //centru(in spatele navei)
        ctx.lineTo(
            nava.x-nava.r*5/3*Math.cos(nava.a),
            nava.y+nava.r*5/3*Math.sin(nava.a)); //partea din spate din dreapta
        ctx.lineTo(
            nava.x-nava.r*(2/3*Math.cos(nava.a)+0.5*Math.sin(nava.a)),
            nava.y+nava.r*(2/3*Math.sin(nava.a)-0.5*Math.cos(nava.a))); //partea din spate din stanga
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    else
    {
        nava.inaintare.x= nava.inaintare.x-fortaFrecare*nava.inaintare.x/FPS;
        nava.inaintare.y= nava.inaintare.y-fortaFrecare*nava.inaintare.y/FPS;
    }


    //rotesc nava
    nava.a+=nava.rotire;

    //pentru a nu iesi din ecran:
    if(nava.x<0-nava.r)
        nava.x=canvas.width+nava.r;
    else
        if(nava.x>canvas.width+nava.r)
            nava.x=0-nava.r;
    if(nava.y<0-nava.r)
        nava.y=canvas.height+nava.r;
    else
        if(nava.y>canvas.height+nava.r)
            nava.y=0-nava.r;
    // ---------------------------------------------------------------------- NAVA
    
    // ---------------------------------------------------------------------- ASTEROID

    //desenez asterorizii
    ctx.strokeStyle="#D3D3D3";
    ctx.lineWidth=dimensiuneNava/20;
    var x;
    var y;
    var r;
    var a;
    var varf;
    for(var i=0; i<asteroizi.length;i++)
    {
        //ia proprietatile asteroizilor
        x=asteroizi[i].x;
        y=asteroizi[i].y;
        r=asteroizi[i].r;
        a=asteroizi[i].a;
        varf=asteroizi[i].varf;

        //desenez un drum
        ctx.beginPath();
        ctx.moveTo(x+r*Math.cos(a),y+r*Math.sin(a));


        //forma de cerc/poligon
            for(var k=0; k<varf;k++)
            {
                ctx.lineTo(x+r*Math.cos(a+k*2*Math.PI/varf),y+r*Math.sin(a+k*2*Math.PI/varf));
            }
            ctx.closePath();
            ctx.stroke();


        //mut asteroidul
            asteroizi[i].x=asteroizi[i].x+asteroizi[i].xv;
            asteroizi[i].y=asteroizi[i].y+asteroizi[i].yv;

        //pentru a nu iesi din ecran
        if(asteroizi[i].x<0-asteroizi[i].r)
        {
            //stanga
            asteroizi[i].x=canvas.width+asteroizi[i].r;
        }
        else
            if(asteroizi[i].x>canvas.width+asteroizi[i].r)
              {
                asteroizi[i].x=0-asteroizi[i].r;
              }

        if(asteroizi[i].y<0-asteroizi[i].r)
        {
            asteroizi[i].y=canvas.height+asteroizi[i].r;
        }
        else
            if(asteroizi[i].y>canvas.height+asteroizi[i].r)
                {
                    asteroizi[i].y=0-asteroizi[i].r;
                 }

    // ---------------------------------------------------------------------- ASTEROID

    }
}