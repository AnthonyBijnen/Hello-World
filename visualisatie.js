function render(){
    a = true;
    if (COMMANDS){
        aantalCommandos = COMMANDS.length;
        for (let i = 0; i < aantalCommandos; i++){
            if (i == 0) cleanCanvas();
            if (a) { a = voerHetCommandoUit(COMMANDS[i])};
            if (!a) return error('render: ik kan het commando ('+COMMANDS[i]+') niet uitvoeren');
        } 
        if (ModelMoving) requestAnimationFrame(render); 
        return true;   
    } else error('render, ik heb geen model om te laten zien');
}

function voerHetCommandoUit(cmd){
    a = cmd3d(cmd);
    b = cmd2d(cmd);
    c = cmdText(cmd);
    d = cmdPict(cmd);
    if (a|b|c|d)  return true;
    else          return false;
}

function cmd3d(cmd){
    if (cmd[0] != '3d') return false;
    if (ModelMoving)setNewView();
    array       = cmd[2];
    instance    = cmd[3];
    kleur       = cmd[4];
    // kleur    = cmd[5];
    pendikte    = cmd[6];
    identifier  = cmd[7];
    wvttk       = cmd[8];
    hidden      = cmd[9];

    if        (cmd[1] == 'plato'){ return laatDePlatoZien();
    } else if (cmd[1] == 'staaf'){ return laatDeStaafZien(array,instance,kleur,pendikte,identifier,wvttk);
    } else if (cmd[1] == 'vlak') { return laatHetVlakZien(array,instance,kleur,pendikte,identifier,wvttk);
    } else if (cmd[1] == 'dome') { return laatDeDomeZien(kleur,pendikte,identifier,wvttk,hidden);
    } else if (cmd[1] == 'lijn') { return laatLijnenZien(array,instance,kleur,pendikte,identifier,wvttk);  
    } else if (cmd[1] == 'punt') { return laatHetPuntZien(array,kleur,pendikte,identifier);
    } else if (cmd[1] == 'groep'){ return laatDeGroepZien(instance,kleur,identifier);
    } else if (cmd[1] == 'test') { return doTest();
    } else if (cmd[1] == 'snij') { return doSnij();
    } else if (cmd[1] == 'assen'){ return showOrigin();
    } else error('cmd3d: wat wil je laten zien? '+cmd[1]+' ken ik niet');
}

function setNewView(){
    var theta, dtheta, gamma, dgamma;
    theta = getV('theta'); dtheta = getV('dtheta'); theta += dtheta;
    if (theta > 360) theta = theta % 360; setV('theta', theta);
    gamma = getV('gamma'); dgamma = getV('dgamma'); gamma += dgamma; 
    if (gamma > 360) gamma = gamma % 360; setV('gamma', gamma);
}

function cmd2d(cmd){
    if (cmd[0] != '2d') return false;
    form        = cmd[1];
    if        (form == 'cirkel'){ 
        middelpunt = cmd[2];
        straal     = cmd[3];
        kleur      = cmd[4];
        pen        = cmd[5];
        if (!straal) straal = straalIn2d();
        return tekenCirkel(middelpunt,straal,kleur,pen);
    } else error('cmd2d: wat wil je laten zien? '+cmd[1]+' ken ik niet');
}


function cmdText(cmd){
    if (cmd[0] != 'tekst') return false;
    tekst       = cmd[1];
    waar        = cmd[2];
    style       = cmd[3];
    
    return plaatsTekst(tekst, waar, style);
}

function showOrigin(){
    var o = [0,0,0], x = [200,0,0], y = [0,200,0], z = [0,0,200];
    lijnTussen2PuntenIn3d(o, x, 'white', 1, 0); 
    lijnTussen2PuntenIn3d(o, y, 'white', 1, 0); 
    lijnTussen2PuntenIn3d(o, z, 'white', 1, 0); 
    plaatsTekst('x', project3d2d(x), 'idS');
    plaatsTekst('y', project3d2d(y), 'idS');
    plaatsTekst('z', project3d2d(z), 'idS');
    return true;
}

function plaatsTekst(tekst, waar, style){
    if (style == 'sLarge' | style == 'sSmall'){
        if      (style == 'sLarge'){fontsize = '60';}
        else if (style == 'sSmall'){fontsize = '30';}
        type = 'Times New Roman';   kleur = 'cyan';     align = 'centre';    
    } else if (style == 'airLarge' | style == 'airSmall'){
        if      (style == 'airLarge'){fontsize = '60';}
        else if (style == 'airSmall'){fontsize = '30';}
        type = 'Times New Roman';   kleur = 'blue';     align = 'centre';
    } else if (style == 'idS'  | style == 'idG'){
        if      (style == 'idS'){fontsize = '12';         kleur = 'white'}
        else if (style == 'idG'){fontsize = '24';         kleur = 'GhostWhite'}
        type = 'arial';             align = 'left';
    } else return error('plaatstekst: deze stijl ken ik niet');
    ctx.font = fontsize + 'px '+type;
    ctx.fillStyle = kleur;
    ctx.textAlign = align;
    ctx.fillText(tekst, waar[0], waar[1]);
    return true;
}

function cmdPict(cmd){
    if (cmd[0] != 'pict') return false;
    name        = cmd[1];
    waar        = cmd[2];
    beweging    = cmd[3];

    return showPict(name,waar); 
}

function showPict(name, waar) {
    var img = document.getElementById(name);
    ctx.drawImage(img, waar[0], waar[1]);
    return true;
}

function laatHetPuntZien(a, kleur, pensize, id){
    teken3dPunt(a, kleur, pensize);
    if (id != 0){    // is identificatie gewenst?
        if (pensize>9) style = 'idG';
        else style = 'idS';
        plaatsTekst(id,project3d2d(a),style);
    }
    return true;    
}

function teken3dPunt(point, kleur, pensize){
    var p = project3d2d(point);
    teken2dPunt(p, kleur, pensize);
}

function teken2dPunt(point, kleur, straal){
    var x = point[0], y = point[1], z = point[2];
    
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+straal,y+straal);
    ctx.lineWidth = straal;
    ctx.strokeStyle = kleur;
    ctx.stroke();

}

function project3d2d(point){
    if (point == undefined) return undefined;
    point = rotate3d(point);
    var zm = getV('zoom');
    var perspectivePoint = perspectiveProjection(point);
    var x = perspectivePoint[0],    y = perspectivePoint[1], z = perspectivePoint[2],
    xfac = -canvas.width*zm, 
    yfac = canvas.height*zm,
    zfac = canvas.height*zm;
    return [getV('panPointY') + yfac * y,   getV('panPointX') - xfac * x,  zfac * z];
}

function rotate3d(point){
    point = rotateY(point);
    point = rotateX(point);
    return point;
}

function rotateY(point){
    var x = point[0], y = point[1], z = point[2], g = getV('gamma');

    return [
        Math.cos(toRadians(g)) * x - Math.sin(toRadians(g)) * z,
        y, 
        Math.sin(toRadians(g)) * x + Math.cos(toRadians(g)) * z
    ]
}

function rotateX(point){
    var x = point[0], y = point[1], z = point[2], g = getV('theta');

    return [
        x, 
        Math.cos(toRadians(g)) * y - Math.sin(toRadians(g)) * z,
        Math.sin(toRadians(g)) * y + Math.cos(toRadians(g)) * z
    ]
}


function perspectiveProjection(point) {
    var x = point[0], y = point[1], z = point[2], d = getV('distance');

    if (getV('persp')){
        n = z + d; 
        if ( Math.abs(n) < 0.0001) 
            error('perspectiveProjection: n='+ n);
        return [x / n, y / n, z]
    } else {
        return [x, y, z];
    }
}

function laatLijnenZien(array,instance,kleur,pensize, id,wvttk){
    showId = false;
    if (array){
        if (!array.length)                                              return error('laatLijnenZien 4');
        if (id < 0) showId = true;
        if (instance == 'all'){
            for (let i = 0; i < array.length; i++) {
                if (showId) id = i;
                if (!laatDeLijnZien(array[i], kleur, pensize, id))         return error('laatDeLijnZien 1');            
            }    
        } else if (instance >= array.length){                           return error('laatLijnenZien 2'); 
        } else if (!laatDeLijnZien(array[instance], kleur, pensize, id))   return error('laatDeLijnZien 3');
        return true;    
    }   return error('laatLijnenZien: no such array')
} 

function laatDeLijnZien(a, kleur, pensize, id){
    l = a.length;
    if (!pensize)pensize = penDikte();
    if (a.length == undefined | a.length == 0){                       // het is een vector
        a2 = puntWaarPijlNaarWijst(a);
        return lijnTussen2PuntenIn3d(a.steun, a2, kleur, pensize, id);    
    } else if(a.length == 2){ return tekenRand(a, kleur, pensize, id); // het is de rand van een vlak
    } else error('laatDeLijnZien error');
}

function tekenRand(a, kleur, pensize, id) {
    point  = a[0];
    point2 = a[1];
    return lijnTussen2PuntenIn3d(point, point2, kleur, pensize, id);
}

function lijnTussen2PuntenIn3d(point1, point2, kleur, pensize, id){
    var p1 = project3d2d(point1), p2 = project3d2d(point2);
    success = lijnOpCanvas(p1, p2, kleur, pensize);
    if (!success){
        error('lijnTussen2PuntenIn3d:')
    }
    if(id) {
        m = [];
        for (let i = 0; i < 3; i++) m[i] = (point1[i] + point2[i])/2;
        plaatsTekst(id,project3d2d(m),'idS');       
    } 
    return success; 
}

function stippellijn(point1, point2, kleur, pensize){
    p1 = [], p2 = [];
    if (!checkDePunten(point1, point2))return false;
    a = afstand2dPunten(point1, point2);
    l = pijl2dPunten(point1, point2);
    st = round(a/30);
    for (let i = 0; i < st; i++) {
        lambdaStip = i/st;
        lambdaLeeg = lambdaStip + 1/(2*st);
        p1 = lambda2dVector(l, lambdaStip);
        p2 = lambda2dVector(l, lambdaLeeg);
        stippel(p1,p2, kleur, pensize);
    }
    return true;  
}

function stippel(point1, point2, kleur, pensize){
    var x1 = point1[0], y1 = point1[1], x2 = point2[0], y2 = point2[1];

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = pensize;
    ctx.strokeStyle = kleur;
    ctx.stroke(); 
}

function lambda2dVector(a,lambda){    // geeft punt lambda op vector
    r = [];
    for (let i = 0; i < 2; i++) r[i] = a.steun[i] + a.richting[i] * lambda;
    return r;
}

function afstand2dPunten(p1, p2) {
    p = [];
    for (let i = 0; i < 3; i++) p[i]= p1[i]-p2[i];
    var afs = Math.sqrt(Math.pow(p[0],2) + Math.pow(p[1],2));
    return afs;
}

function pijl2dPunten(a,b) {
    var vector      = [];
    vector.steun    = [a[0], a[1]];
    vector.richting = [b[0]- a[0], b[1]- a[1]];
    return vector;
}


function lijnOpCanvas(point1, point2, kleur, pensize){
    var x1 = point1[0], y1 = point1[1], x2 = point2[0], y2 = point2[1];
    if (!checkDePunten(point1, point2))return false;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = pensize;
    ctx.strokeStyle = kleur;
    ctx.stroke(); 
    return true;  
}

function checkDePunten(p1,p2){
    eTxt = 'checkDePunten: punt onbekend';
    if (errorNaN(p1[0],eTxt)){ return false;}
    if (errorNaN(p1[1],eTxt)){ return false;}
    if (errorNaN(p2[0],eTxt)){ return false;}
    if (errorNaN(p2[1],eTxt)){ return false;}
    return true;
}

function penDikte(){
    g = getV('gamma');
    t = getV('theta');
    setValue('gamma',0);
    setValue('theta',0);

    staaflengte = getV('randlengte');
    staafdikte  = getV('staafdikte');
    verlenging = 1;
    if (MODEL.noma)verlenging = verlengingsFactor();
    proportie = staafdikte/(staaflengte*verlenging);
    point1 = [0,0,0]; point2 = [0,staaflengte,0];
    var p1 = project3d2d(point1), p2 = project3d2d(point2);
    lengte = p2[0] - p1[0]; dikte = lengte*proportie;
    
    setValue('gamma',g);
    setValue('theta',t);
    return dikte;
}

function laatHetVlakZien(array, inst,kleur, pendikte,id,how){
    if (id >= array.length) return error('laatHetVlakZien 1');
    v = array[inst];
    return laatHetVlakZien2(v,kleur, pendikte,id,how);
}
 
function laatHetVlakZien2(v,kleur, pendikte,id,how){
    if (v) {
        if (how == 'surface')   return tekenVlak(v, kleur, id);  
        else if (how == 'wire') return tekenVlakRand(v, kleur, pendikte, id); 
        else return error('laatHetVlakZien2: hoe nu?');
    } else return error('laatHetVlakZien2: Vlak onbekend');
}
  
function tekenVlak(vlak, kleur, id){
    p = [];
    for (let i = 0; i < vlak.length; i++) {
        p2d = project3d2d(vlak[i]);
        if (p2d)p.push(p2d);
        else return false;
    }
    ctx.fillStyle   = kleur;
    ctx.beginPath();
    pp = p[0];
    ctx.moveTo(pp[0], pp[1]); 
    for (let i = 1; i < vlak.length; i++) {
        pp = p[i];
        ctx.lineTo(pp[0], pp[1]); 
    }
    pp = p[0];
    ctx.lineTo(pp[0], pp[1]); 
    ctx.closePath();                // go back to point 1
    ctx.fill();
    if (id != 0){                   // is identificatie gewenst?
        m = middelPuntVlak2d(vlak); // op de canvas in 2d
        plaatsTekst(id,m,'idG');
    } return true;     
}
  
function tekenVlakRand(vlak, kleur, pendikte, id){
    p = [];
    for (let i = 0; i < vlak.length; i++) {
        p2d = project3d2d(vlak[i]);
        if (p2d)p.push(p2d);
        else return false;
    }
    ctx.strokeStyle = kleur;
    ctx.lineWidth   = pendikte;
    ctx.beginPath();
    pp = p[0];
    ctx.moveTo(pp[0], pp[1]); 
    for (let i = 1; i < vlak.length; i++) {
        pp = p[i];
        ctx.lineTo(pp[0], pp[1]); 
    }

    pp = p[0];
    ctx.lineTo(pp[0], pp[1]); 
    ctx.closePath();                // go back to point 1
    ctx.stroke();
    if (id != 0){                   // is identificatie gewenst?
        m = middelPuntVlak2d(vlak); // op de canvas in 2d
        plaatsTekst(id,m,'idG');
    } return true;     
}

function middelPuntVlak2d(a) {
    m = [0,0];       
    for (let i = 0; i < a.length; i++) {
        p3d = a[i];
        mm   = project3d2d(p3d);
        m[0] += mm[0];
        m[1] += mm[1];
    }
    m[0] = m[0]/a.length;
    m[1] = m[1]/a.length;
    m[2] = 0;
    return m;
}

function laatDePlatoZien(){
    TELLER++;
    more = Math.floor(TELLER/10000);
    if (more > 90)more = 0;

    for (let i = 0; i < MODEL.faces.length; i++) { 
        kleur = MODEL.colors[i+more];
        vlak  = MODEL.faces[i];
        if (vlakMoetWordenGetoond(vlak)){
            doeVlakEnTekst(vlak, kleur, 0, 0, 'surface')
        } 
    }
    return true;  
}

function laatDeStaafZien(array,instance,kleur,pendikte,identifier,wvttk){
    TELLER++;
    more = Math.floor(TELLER/10000);
    if (more > 90)more = 0;

    for (let i = 0; i < MODEL.faces.length; i++) { 
        kleur = MODEL.colors[i+more];
        vlak  = MODEL.faces[i];
        if (vlakMoetWordenGetoond(vlak)){
            doeVlakEnTekst(vlak, kleur, 0, 0, 'surface')
        } 
    }
    return true;  
}


function laatDeDomeZien(kleur,pendikte, id,wvttk, hidden ){
    kl = false;
    if  (kleur == 'all'){
        kl = true;
        TELLER++;
        more = Math.floor(TELLER/10000);
        if (more > 90)more = 0;
    } 

    for (let j = 0; j < model.faces.length; j++) {
        const hetVlak = model.faces[j];
        tonen = true;
        if (hidden > 0){
            tonen =  vlakMoetWordenGetoond(hetVlak);
        }
        if (hidden < 0) tonen = !vlakMoetWordenGetoond(hetVlak);
        if (tonen){
            if (hetVlak.subfaces){
                for (let i = 0; i < hetVlak.subfaces.length; i++) {
                    v = hetVlak.subfaces[i];
                    if      (kl)                    kleur = MODEL.colors[i+more];
                    if      (wvttk == 'surface')    tekenVlak(v, kleur, id);  
                    else if (wvttk == 'wire')       tekenVlakRand(v, kleur, pendikte, id);
                    else return error('laatDeDomeZien: wat voor wvttk?');
                }    
            }    
        }        
    }
    return true;
}


function vlakMoetWordenGetoond(vlak){
    m = middelPuntVlak3d(vlak);
    v1  = pijlTussen2Punten(vlak[0], vlak[1]);
    v2  = pijlTussen2Punten(vlak[1], vlak[2]);
    r   = normaal(v1.richting, v2.richting);
    ri  = eenheidsVector(r);
    v   = pijlMetRichting(m,ri);
    v   = lambdaVector(v,5);
    var p = project3d2d(v.richting);
    z = p[2];
    if (z>0){
        return true;
    } else {
        return false;
    }
}

function doeVlakEnTekst(v, kleur, pendikte, id, how) {
    return   laatHetVlakZien2(v, kleur, pendikte, id, how);   
}

function tekenCirkel(middelpunt,straal,kleur,pen){
    ctx.lineWidth = pen;
    ctx.strokeStyle = kleur;
    from = 0;
    to   = 2*Math.PI; 
    ctx.beginPath();
    ctx.arc(middelpunt[0],middelpunt[1],straal,from, to);
    ctx.stroke(); 
    return true;  
}

function tekenBol(middelpunt,straal,kleur){
    fillStyle = kleur;
    from = 0;
    to   = 2*Math.PI; 
    ctx.beginPath();
    ctx.arc(middelpunt[0],middelpunt[1],straal,from, to);
    ctx.fill(); 
    return true;  
}

function straalIn2d(){
    g = getV('gamma');
    t = getV('theta');
    setValue('gamma',0);
    setValue('theta',0);

    r =  getRadius()
    point1 = [0,0,0];
    point2 = [0,r,0];
    var p1 = project3d2d(point1), p2 = project3d2d(point2);
    lengte = Math.abs(p2[0] - p1[0]);

    setValue('gamma',g);
    setValue('theta',t);
    return lengte;
}

function getRadius(){
    point1 = [0,0,0]; point2 = MODEL.points[0];
    return afstandPunten(point1,point2);
}

function laatDeGroepZien(instance,kleur,identifier){

}
function firstCommand(cmd1, cmd2, cmd3, cmd4, cmd5,cmd6, cmd7, cmd8, cmd9, cmd10){                   
    if(!initCommandList(model))return error('firstCommand: foutje');
    if(!setCommand(cmd1, cmd2, cmd3, cmd4, cmd5,cmd6, cmd7, cmd8, cmd9, cmd10))return error('firstCommand: tweede foutje');;
    return true;
}

function setCommand(cmd1, cmd2, cmd3, cmd4, cmd5,cmd6, cmd7, cmd8, cmd9, cmd10){
    return COMMANDS.push([cmd1, cmd2, cmd3, cmd4, cmd5,cmd6, cmd7, cmd8, cmd9, cmd10]);
}

function lastCommand(cmd1, cmd2, cmd3, cmd4, cmd5,cmd6, cmd7, cmd8, cmd9, cmd10){
    if (cmd1){
        if(!setCommand(cmd1, cmd2, cmd3, cmd4, cmd5,cmd6, cmd7, cmd8, cmd9, cmd10))return error('lastCommand: tweede foutje');;
    } 
    return render();
}

function      fC(cmd1, cmd2, cmd3, cmd4, cmd5, cmd6, cmd7, cmd8, cmd9, cmd10){
    firstCommand(cmd1, cmd2, cmd3, cmd4, cmd5, cmd6, cmd7, cmd8, cmd9, cmd10)
}

function      sC(cmd1, cmd2, cmd3, cmd4, cmd5, cmd6, cmd7, cmd8, cmd9, cmd10){
      setCommand(cmd1, cmd2, cmd3, cmd4, cmd5, cmd6, cmd7, cmd8, cmd9, cmd10)
}

function      lC(cmd1, cmd2, cmd3, cmd4, cmd5, cmd6, cmd7, cmd8, cmd9, cmd10){
     lastCommand(cmd1, cmd2, cmd3, cmd4, cmd5, cmd6, cmd7, cmd8, cmd9, cmd10)
}

function lengteLijn(a){
    if (a.length == undefined | a.length == 0){ return lengtePijl(a);    
    } else if(a.length == 2){                   return afstandPunten(a[0], a[1]); 
    } else error('lengteLijn: error');
}