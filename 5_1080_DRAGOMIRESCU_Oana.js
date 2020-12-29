var canvas = document.getElementById("jocAsteroizi");
var ctx = canvas.getContext("2d");



// ---------------------------------------------------------------------- NAVA

const dimensiuneNava = 25;
const acceleratieNava = 2; //pixeli pe secunde
const FPS = 30; //frames per second
const vitezaIntoarcere = 360;//in grade pe secunda
const fortaFrecare = 0.7; //coeficientul de frecare al spatiului 0=nu avem forta de frecare
const durataExplozieNava = 0.5;//cat dureaza explozia navei
const imunitateNava = 2;//cat timp nava nu poate fi omorata de asteroizi cand se reseteaza
const durataLicaritNava = 0.1;//cat licareste nava cat e imuna
const nrMaximRachete = 2;//nr maxim de rachete care pot fi lansate  simultan pe ecran
const vitezaRachete = 450;//in pixeli pe secunde
const distantaRachete = 0.4;//1=canvas.width;

var nava = navaNoua();//{
// x: canvas.width / 2,
// y: canvas.height / 2,
// //sa apara la mijloc
// r: dimensiuneNava / 2,
// a: 90 / 180 * Math.PI, //conversie in radius; angle - directia navei
// rotire: 0,
// timpExplozie:0,
// //pentru mers:
// inainteaza: false,
// inaintare: {
//     x: 0,
//     y: 0
// }

//}


// ---------------------------------------------------------------------- NAVA
// ---------------------------------------------------------------------- ASTEROID
var asteroizi = [];
var nrAsteroizi = 4; //nr de asteroizi initial
var vitezaAsteriozi = 50;//viteza maxima initiala in pixeli pe secunde
var dimensiuneAsteroizi = 120;//dimensiunea initiala a asteroizilor
var varfuriAsteroizi = 12;//nr mediu de varfuri ale asteroizilor




function asteroidNou(x, y, r) {
    var asteroid = {
        x: x,
        y: y,
        xv: Math.random() * vitezaAsteriozi / FPS * (Math.random() < 0.5 ? 1 : -1), //viteza aseroid pe ox
        yv: Math.random() * vitezaAsteriozi / FPS * (Math.random() < 0.5 ? 1 : -1), //viteza aseroid pe oy
        r: r,
        a: Math.random() * 2 * Math.PI, //in radiani
        varf: Math.floor(Math.random() * (varfuriAsteroizi + 1) + varfuriAsteroizi / 2) //+1 ca sa nu fie 0
    };
    return asteroid;
}


function creeazaAsteroizi() {
    asteroizi = [];
    var x;
    var y;
    var r;
    for (var i = 0; i < nrAsteroizi; i++) {
        do {
            x = Math.floor(Math.random() * canvas.width); //round down
            y = Math.floor(Math.random() * canvas.height);
            r = Math.floor(Math.random()*60)+40;
        }
        while (distantaDintrePuncte(nava.x, nava.y, x, y) < dimensiuneAsteroizi * 2 + nava.r);

        asteroizi.push(asteroidNou(x, y, r ));
    }

}

function distantaDintrePuncte(xn, yn, xa, ya) {
    return Math.sqrt(Math.pow(xa - xn, 2) + Math.pow(ya - yn, 2));
}

function distrugeAsteroid(index) {
    console.log(index)
    var x = asteroizi[index].x;
    var y = asteroizi[index].y;
    var r = asteroizi[index].r;

    //impartim asteroidul in 2
    if (r > 70) {
        asteroizi.push(asteroidNou(x, y, 51));
        //asteroizi.push(asteroidNou(x, y, Math.ceil(dimensiuneAsteroizi / 4)));
    }
    else
        if (r >58 && r<=70) {
            asteroizi.push(asteroidNou(x, y, 50));
            //asteroizi.push(asteroidNou(x, y, Math.ceil(dimensiuneAsteroizi / 8)));
        }
        else
            if(r>40 && r<=58)
                asteroizi.push(asteroidNou(x, y, 35));
                


    //distrug asteroidul
    asteroizi.splice(index, 1);
}

creeazaAsteroizi();

// ---------------------------------------------------------------------- ASTEROID

// ---------------------------------------------------------------------- COLIZIUNI
const margini = false; //margini pentru coliziune folosind cerc
// ---------------------------------------------------------------------- COLIZIUNI


// ---------------------------------------------------------------------- NAVA

function navaNoua() {
    return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        //sa apara la mijloc
        r: dimensiuneNava / 2,
        a: 90 / 180 * Math.PI, //conversie in radius; angle - directia navei
        rotire: 0,
        timpExplozie: 0,
        timpLicarit: Math.ceil(durataLicaritNava * FPS),
        nrLicarit: Math.ceil(imunitateNava / durataLicaritNava),
        //pentru mers:
        inainteaza: false,
        inaintare: {
            x: 0,
            y: 0
        },
        poateDeclansaRachete: true,
        rachete: [],
    }
}
const keyDown = (eveniment) => {
    switch (eveniment.keyCode) {
        //pentru rotit la stanga folosind z si Z
        case 122:
            nava.rotire = vitezaIntoarcere / 180 * Math.PI / FPS;
        case 90:
            nava.rotire = vitezaIntoarcere / 180 * Math.PI / FPS;
            break;
        //sagetica stanga
        case 37:
            nava.rotire = vitezaIntoarcere / 180 * Math.PI / FPS;
            break;
        //sus -> merge drept
        case 38:
            nava.inainteaza = true;
            break;

        //dreapta c/C
        case 99:
            nava.rotire = -vitezaIntoarcere / 180 * Math.PI / FPS;
            break;
        case 67:
            nava.rotire = -vitezaIntoarcere / 180 * Math.PI / FPS;
            break;
        //sageata dreapta
        case 39:
            nava.rotire = -vitezaIntoarcere / 180 * Math.PI / FPS;
            break;

        //pentru rachete: (x)
        case 88:
            aruncaRachete();
            break;
    }
}
const keyUp = (eveniment) => {
    switch (eveniment.keyCode) {
        //stop rotit la stanga
        case 122:
            nava.rotire = 0;
            break;
        case 90:
            nava.rotire = 0;
            break;
        case 37:
            nava.rotire = 0;
            break;

        //stop  mers drept
        case 38:
            nava.inainteaza = false;
            break;
        //dreapta
        case 99:
            nava.rotire = 0;
            break;
        case 67:
            nava.rotire = 0;
            break;
        case 39:
            nava.rotire = 0;
            break;

        //pentru rachete: (x)
        case 88:
            nava.poateDeclansaRachete = true;
            break;
    }
}

function aruncaRachete() {
    //
    if (nava.poateDeclansaRachete && nava.rachete.length <= nrMaximRachete) {
        nava.rachete.push({
            //de la varful navei
            x: nava.x + 4 / 3 * nava.r * Math.cos(nava.a),
            y: nava.y - 4 / 3 * nava.r * Math.sin(nava.a),
            xv: vitezaRachete * Math.cos(nava.a) / FPS,
            yv: -vitezaRachete * Math.sin(nava.a) / FPS,
            distRachete: 0
        })
    }
    nava.poateDeclansaRachete = false;
}
//event handlers ca sa rotesc nava
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
// ---------------------------------------------------------------------- NAVA
//set up the game loop
setInterval(update, 1000 / FPS);


function explodeazaNava() {
    // ctx.fillStyle="#B20000";
    // ctx.strokeStyle="#B20000";
    // ctx.beginPath();
    // ctx.arc(nava.x,nava.y,nava.r,0,2*Math.PI,false);
    // ctx.fill();
    // ctx.stroke();
    nava.timpExplozie = Math.ceil(durataExplozieNava * FPS);
}


function update() {
    // ---------------------------------------------------------------------- EXPLOZIE
    var explozieNava = nava.timpExplozie > 0;
    var licarit = nava.nrLicarit % 2 == 0;
    // ---------------------------------------------------------------------- EXPLOZIE

    //desenez fundalul(spatiul)
    ctx.fillStyle = "#071425";
    ctx.fillRect(0, 0, canvas.width, canvas.height); //700,700

    // ---------------------------------------------------------------------- NAVA
    if (!explozieNava) {
        if (licarit) {
            //desenez nava in forma de triunghi
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = dimensiuneNava / 20;

            //incep sa desenez triunghiul
            ctx.beginPath();
            ctx.moveTo(nava.x + 4 / 3 * nava.r * Math.cos(nava.a), nava.y - 4 / 3 * nava.r * Math.sin(nava.a));
            //nava.x reprezinta centrul navei la care adaugam raza * cosinus care reprezinta orizontalul unghiului navei
            ctx.lineTo(
                nava.x - nava.r * (2 / 3 * Math.cos(nava.a) - Math.sin(nava.a)),
                nava.y + nava.r * (2 / 3 * Math.sin(nava.a) + Math.cos(nava.a))); //partea din spate din dreapta
            ctx.lineTo(nava.x - nava.r * (2 / 3 * Math.cos(nava.a) + Math.sin(nava.a)), nava.y + nava.r * (2 / 3 * Math.sin(nava.a) - Math.cos(nava.a))); //partea din spate din stanga
            ctx.closePath();
            ctx.stroke();

            ctx.fillStyle = "yellow";
            ctx.fillRect(nava.x - 1, nava.y - 1, 2, 2); //cercul galben din interiorul navei
        }
        //ma ocup de licarit
        if (nava.nrLicarit > 0) {
            //scad trimpul de licarit
            nava.timpLicarit--;

            // scad nr de licariri
            if (nava.timpLicarit == 0) {
                nava.timpLicarit = Math.ceil(durataLicaritNava * FPS);
                nava.nrLicarit--;
            }
        }
    }
    else {
        //desenez explozia

        ctx.fillStyle = "#7F0000";
        ctx.beginPath();
        ctx.arc(nava.x, nava.y, nava.r * 1.9, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(nava.x, nava.y, nava.r * 1.4, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.fillStyle = "#f2af0f";
        ctx.beginPath();
        ctx.arc(nava.x, nava.y, nava.r * 1.1, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.fillStyle = "#f5f63d";
        ctx.beginPath();
        ctx.arc(nava.x, nava.y, nava.r * 0.8, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.fillStyle = "#fdfdfd";
        ctx.beginPath();
        ctx.arc(nava.x, nava.y, nava.r * 0.4, 0, 2 * Math.PI, false);
        ctx.fill();


    }

    // ---------------------------------------------------------------------- COLIZIUNI
    if (margini) {
        ctx.strokeStyle = "pink";
        ctx.beginPath();
        ctx.arc(nava.x, nava.y, nava.r, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    // ---------------------------------------------------------------------- ACOLIZIUNI
    // ---------------------------------------------------------------------- NAVA - RACHETE    
    //desenez rachetele
    for (var i = 0; i < nava.rachete.length; i++) {

        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(nava.rachete[i].x, nava.rachete[i].y, dimensiuneNava / 15, 0, 2 * Math.PI, false);
        //x,             y,                   raza,            ungi inceput, unghi final;  
        ctx.fill();

        ctx.fillStyle = "#f5f63d";
        ctx.beginPath();
        ctx.arc(nava.rachete[i].x, nava.rachete[i].y, dimensiuneNava / 30, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    //cand rachetele ating un asteroid:
    var xAsteroid;
    var yAsteroid;
    var rAsteroid;
    var xRacheta;
    var yRacheta;
    for (var i = asteroizi.length - 1; i >= 0; i--) {
        xAsteroid = asteroizi[i].x;
        yAsteroid = asteroizi[i].y;
        rAsteroid = asteroizi[i].r;

        for (var j = nava.rachete.length - 1; j >= 0; j--) {
            xRacheta = nava.rachete[j].x;
            yRacheta = nava.rachete[j].y;

            //verificam daca atinge asteroizii
            if (distantaDintrePuncte(xAsteroid, yAsteroid, xRacheta, yRacheta) < rAsteroid) {
                //stergem racheta
               // nava.rachete.splice(j, i);

                //stergem astertoidul
                distrugeAsteroid(i);

                break;
            }
        }

    }
    // ---------------------------------------------------------------------- NAVA - RACHETE
    // ---------------------------------------------------------------------- NAVA 
    //mut nava
    if (nava.inainteaza) {
        nava.inaintare.x = nava.inaintare.x + 0.8 * acceleratieNava * Math.cos(nava.a) / FPS;
        nava.inaintare.y = nava.inaintare.y - 0.8 * acceleratieNava * Math.sin(nava.a) / FPS;

        if (!explozieNava && licarit) {
            //ii desenez "focul"
            ctx.fillStype = "yellow"
            ctx.strokeStyle = dimensiuneNava / 10;
            ctx.strokeStyle = "red";
            //incep sa desenez triunghiul
            ctx.beginPath();
            //spate stanga
            ctx.moveTo(
                nava.x - nava.r * (2 / 3 * Math.cos(nava.a) - 0.5 * Math.sin(nava.a)),
                nava.y + nava.r * (2 / 3 * Math.sin(nava.a) + 0.5 * Math.cos(nava.a)));
            //centru(in spatele navei)
            ctx.lineTo(
                nava.x - nava.r * 5 / 3 * Math.cos(nava.a),
                nava.y + nava.r * 5 / 3 * Math.sin(nava.a)); //partea din spate din dreapta
            ctx.lineTo(
                nava.x - nava.r * (2 / 3 * Math.cos(nava.a) + 0.5 * Math.sin(nava.a)),
                nava.y + nava.r * (2 / 3 * Math.sin(nava.a) - 0.5 * Math.cos(nava.a))); //partea din spate din stanga
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

    }
    else {
        nava.inaintare.x = nava.inaintare.x - fortaFrecare * nava.inaintare.x / FPS;
        nava.inaintare.y = nava.inaintare.y - fortaFrecare * nava.inaintare.y / FPS;
    }
    // ---------------------------------------------------------------------- NAVA - RACHETE
    //mut rachetele
    for (var i = nava.rachete.length - 1; i >= 0; i--) {
        //verific distanta parcursa de rachete
        if (nava.rachete[i].distRachete > distantaRachete * canvas.width) {
            //le ffacem sa dispara(stergem)
            nava.rachete.splice(i, 1); //ne va schimba marimea vectorului asa ca for-ul trebuie parcurs invers
            continue; //pentru a nu se opri la randul anterior si a merge mai departe in for
        }

        //mut rachetele
        nava.rachete[i].x = nava.rachete[i].x + nava.rachete[i].xv;
        nava.rachete[i].y = nava.rachete[i].y + nava.rachete[i].yv;

        //calculez distanta parcursa de rachete
        nava.rachete[i].distRachete = nava.rachete[i].distRachete + Math.sqrt(Math.pow(nava.rachete[i].xv, 2) + Math.pow(nava.rachete[i].yv, 2));

        //penru marginea canvasului
        if (nava.rachete[i].x < 0)
            nava.rachete[i].x = canvas.width;
        else
            if (nava.rachete[i].x > canvas.width)
                nava.rachete[i].x = 0;

        if (nava.rachete[i].y < 0)
            nava.rachete[i].y = canvas.height;
        else
            if (nava.rachete[i].y > canvas.height)
                nava.rachete[i].y = 0;

    }
    // ---------------------------------------------------------------------- NAVA - RACHETE
    // ---------------------------------------------------------------------- NAVA
    if (!explozieNava) {
        //mut nava 
        nava.x = nava.x + nava.inaintare.x;
        nava.y = nava.y + nava.inaintare.y;
        //rotesc nava
        nava.a += nava.rotire;
    }
    else {
        nava.timpExplozie--;
        if (nava.timpExplozie == 0) {
            nava = navaNoua();
        }
    }

    //pentru a nu iesi din ecran:
    if (nava.x < 0 - nava.r)
        nava.x = canvas.width + nava.r;
    else
        if (nava.x > canvas.width + nava.r)
            nava.x = 0 - nava.r;
    if (nava.y < 0 - nava.r)
        nava.y = canvas.height + nava.r;
    else
        if (nava.y > canvas.height + nava.r)
            nava.y = 0 - nava.r;

    // ---------------------------------------------------------------------- NAVA


    // ---------------------------------------------------------------------- ASTEROID

    //desenez asterorizii

    var x;
    var y;
    var r;
    var a;
    var varf;
    ctx.lineWidth = dimensiuneNava / 20;
    for (var i = 0; i < asteroizi.length; i++) {
        ctx.strokeStyle = "#D3D3D3";
      
        //ia proprietatile asteroizilor
        x = asteroizi[i].x;
        y = asteroizi[i].y;
        r = asteroizi[i].r;
        a = asteroizi[i].a;
        varf = asteroizi[i].varf;

        ctx.save()
        //desenez un drum
        ctx.beginPath();
        // ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));

        //forma de cerc/poligon

        ctx.translate(x, y);
        ctx.arc(0, 0, r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
        if(asteroizi[i].r>70){
            ctx.stokeStyle="#CAC9C5";
            ctx.stroke();
            }
            else
                if(asteroizi[i].r>58)
                {
                    ctx.stokeStyle="#ABA8A3";
                    ctx.stroke();
                }
                else
                if(asteroizi[i].r>40)
                {
                    ctx.stokeStyle="#F8F0ED";
                    ctx.stroke();
                }
                else    
                if(asteroizi[i].r>0)
                {
                    ctx.stokeStyle="#797B7A";
                    ctx.stroke();
                }
        ctx.textAlign='center';
        ctx.fillStyle='white';
        ctx.font='25px Courier New';
        ctx.beginPath();
        if(asteroizi[i].r>70){
            ctx.fillText("4",x,y);
           // ctx.strokeStyle='yellow';
            //ctx.fill();
            }
            else
                if(asteroizi[i].r>58)
                {
                    ctx.fillText("3",x,y);
                   // ctx.strokeStyle='green';
                    //ctx.fill();
                }
                else
                if(asteroizi[i].r>40)
                {
                    ctx.fillText("2",x,y);
                }
                else    
                if(asteroizi[i].r>0)
                {
                    ctx.fillText("1",x,y);
                }
                
               

        // ---------------------------------------------------------------------- COLIZIUNI
        if (margini) {
            ctx.strokeStyle = "pink";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI, false);
            ctx.stroke();
        }

        // ---------------------------------------------------------------------- ACOLIZIUNI


    }
    //mut asteroidul
    for (var i = 0; i < asteroizi.length; i++) {
        asteroizi[i].x = asteroizi[i].x + asteroizi[i].xv;
        asteroizi[i].y = asteroizi[i].y + asteroizi[i].yv;

        //pentru a nu iesi din ecran
        if (asteroizi[i].x < 0 - asteroizi[i].r) {
            //stanga
            asteroizi[i].x = canvas.width + asteroizi[i].r;
        }
        else
            if (asteroizi[i].x > canvas.width + asteroizi[i].r) {
                asteroizi[i].x = 0 - asteroizi[i].r;
            }

        if (asteroizi[i].y < 0 - asteroizi[i].r) {
            asteroizi[i].y = canvas.height + asteroizi[i].r;
        }
        else
            if (asteroizi[i].y > canvas.height + asteroizi[i].r) {
                asteroizi[i].y = 0 - asteroizi[i].r;
            }
    }

    // ---------------------------------------------------------------------- ASTEROID


    // ---------------------------------------------------------------------- COLIZIUNI
    if (!explozieNava) {
        //verific daca exista coliziuni cu asteroizii
        if (nava.nrLicarit == 0) {
            for (var i = 0; i < asteroizi.length; i++) {
                if (distantaDintrePuncte(nava.x, nava.y, asteroizi[i].x, asteroizi[i].y) < nava.r + asteroizi[i].r){
                    explodeazaNava();
                    distrugeAsteroid(i);}
               
            }
        }
    }
     //coliziune intre asteroizi
     for (var i=0;i<asteroizi.length;i++){
        for(var j=i+1; j<asteroizi.length;j++)
        {
            if(distantaDintrePuncte(asteroizi[i].x, asteroizi[i].y, asteroizi[j].x, asteroizi[j].y)<asteroizi[i].r+asteroizi[j].r){
                asteroizi[i].xv=-1*asteroizi[i].xv;
                asteroizi[i].yv=-1*asteroizi[i].yv;
                asteroizi[j].xv=-1*asteroizi[j].xv;
                asteroizi[j].yv=-1*asteroizi[j].yv;
                asteroizi[j].x=asteroizi[j].x-5;
                asteroizi[j].y=asteroizi[j].y-5;
                asteroizi[i].x=asteroizi[i].x+3;
                asteroizi[i].y=asteroizi[i].y+3;
            }
        }
    }
   
    // ---------------------------------------------------------------------- COLIZIUNI
}
