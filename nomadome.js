var  COMMANDS    =  undefined;
var  MODEL       =  undefined;
var  ModelMoving =  false;
var  PAGE = 0;
var  SUSPECT = false;
var  BACKGROUNDCOLOR = "#644653";
var  TELLER = 0;

// PLATO       = localStorage.getItem('PLATO');
DEBUG       = localStorage.getItem('DEBUG');
modelMoving(localStorage.getItem('bewegend'));

var  TETRA  =  4;
var  CUBE   =  6;
var  OKTO   =  8;
var  DODEKA =  12;
var  ICOSI  =  20;

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

if (canvas = document.getElementById('canvas')){
    canvas.width  = 600;                                    // canvas
    canvas.height = 600;
    var ctx = canvas.getContext('2d');
}

var d = new Date();

function doDome(rando, plato, frequency){
    cleanCanvas();
    if (!plato) return error('doDome: geen veelvlak gekozen');
    if (!MODEL) model = kiesHetModel(plato);
    if (rando)  model = kiesHetModel(plato);

    if (!frequency)frequency = 1;
    else setValue('freq',frequency);

    divideFaces(); 
}

function divideFaces(){
    pl      = getV('plato'); 
    freq    = getV('freq'); 
    if (freq > 1){
        model.faces.forEach((face => {
            face.subfaces = [];        
            if (pl == 4 | pl == 6 | pl == 8 | pl == 12 | pl == 20){
                if (pl == 12){
                    if (!underground(face))doDividePentagon(face, freq);
                } else if (pl == 6){
                    if (!underground(face))squareFace(face, freq);
                } else if (pl == 4 | pl == 8 | pl == 20){
                    if (!underground(face))triangulateFace(face, freq);
                } 
            } else return error('geen veelvlak met '+pl+' vlakken')
        }));
        return true;
    } else return error('geen veelvlak om te delen');
}

function underground(face){
    z = getV('maaiveld');
    if (face[0][2] < z && face[1][2] < z && face[2][2] < z  ) return true;
    return false;
}

function doDividePentagon(face, freq){
    m = pOoB(middelPuntVlak3d(face));
    for (let i = 0; i < face.length; i++) {
        const p1 = face[i];
        if (i == face.length - 1) p2 = face[0];
        else p2 = face[i+1];
        v = tria(p1, p2, m);
        if (v){
            v.subfaces = [];        
            v = triangulateFace(v, freq-1);
            for (let i = 0; i < v.subfaces.length; i++) {
                face.subfaces.push(v.subfaces[i]);
            }
        }
    }
}

function pOoB(point) {      // projecteer punt op omgeschreven bol 
    q       = r2P(point);
    q[0]    = getRadius();
    r       = p2R(q);
    return r;
}

function r2P(p){
    x = p[0], y = p[1], z = p[2];
    ro    = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
    theta = Math.atan2(y,x);
    fi    = Math.acos(z/ro);
    return [ro, theta, fi];
}

function p2R(polar) {
    var a = [];
    ro= polar[0], theta = polar[1], fi = polar[2];
    a[0] = ro * Math.sin(fi) * Math.cos(theta); // x
    a[1] = ro * Math.sin(fi) * Math.sin(theta); // y
    a[2] = ro * Math.cos(fi);                   // z
    return a;
}

function triangulateFace(vlak, freq){ // vult de subvlakken van het vlak
    points1 = [], points2 = [], row = [];

    const r = pijlTussen2Punten(vlak[0], vlak[1]);
    const p = pijlTussen2Punten(vlak[1], vlak[2]);
    
    for (let i = 0; i < freq; i++) row[i]         = puntOpVector(r,i/freq);
    for (let i = 0; i < freq+1; i++) points1[i]   = puntOpVector(p,i/freq);
    p2 = pijlTussen2Punten(vlak[1], vlak[2]);
    for (let i = 0; i < freq; i++){
        p2 = transleerVector(p2, row[freq -(i+1)]);
        oneLower = freq - i;
        for (let j = 0; j < oneLower; j++)  points2[j]   = puntOpVector(p2,j/freq);
        oL = oneLower-1;
        for (let j = 0; j < oL; j++) {
            v = tria(points2[j],points1[j],  points1[j+1]);
            if (v) vlak.subfaces.push(v);
            v = tria(points2[j],points1[j+1],points2[j+1]);
            if (v) vlak.subfaces.push(v);
        }
        v = tria(points2[oL],points1[oL],  points1[oL+1]);
        if (v) vlak.subfaces.push(v);

        for (let k = 0; k < freq; k++) points1[k]   = points2[k];   
    }
    return vlak;
}

function tria(p1,p2,p3){
    v = [];
    
    if (undergroundP(p1) | undergroundP(p2) | undergroundP(p3)) return false;

    v.push(pOoB(p1,0));
    v.push(pOoB(p2,0));
    v.push(pOoB(p3,0));

    return v;
}

function undergroundP(point){
    if (point[2] < getV('maaiveld'))return true;
    else return false;
}

function squareFace(vlak, freq){
    points1 = [], points2 = [], row = [];
    row[freq]       = vlak[1];
    points1[freq]   = vlak[2]
    const r = pijlTussen2Punten(vlak[0], vlak[1]);
    const p = pijlTussen2Punten(vlak[0], vlak[3]);

    for (let i = 0; i < freq;   i++) row[i]         = puntOpVector(r,i/freq);
    for (let i = 0; i < freq+1; i++) points1[i]   = puntOpVector(p,i/freq);

    p2 = pijlTussen2Punten(vlak[0], vlak[3]);
    for (let i = 1; i < freq+1; i++){
        p2 = transleerVector(p2, row[i]);

        for (let j = 0; j < freq+1; j++)  points2[j]   = puntOpVector(p2,j/freq);
        for (let j = 0; j < freq; j++) {
            v = squa(points1[j],points2[j],points2[j+1],points1[j+1]);
            if (v) vlak.subfaces.push(v);
        }
        for (let k = 0; k < freq+1; k++) points1[k]   = points2[k];
    }
}

function squa(p1,p2,p3,p4){
    v = [];

    if (undergroundP(p1) | undergroundP(p2) | undergroundP(p3) | undergroundP(p4)) return false;

    v.push(pOoB(p1,0));
    v.push(pOoB(p2,0));
    v.push(pOoB(p3,0));
    v.push(pOoB(p4,0));

    return v;
}

function transleerVector(b, a){   // plaatst de richtingsvector van b vanuit punt a
    for (let i = 0; i < 3; i++) b.steun[i] = a[i];
    return b;
}

function copyVector(v) {
    a = new Object;
    a.steun = [], a.richting = [];
    for (let i = 0; i < 3; i++) {
        a.steun[i]      = v.steun[i];
        a.richting[i]   = v.richting[i];
    }
    return a;
}

// 2d & interactie **********************************
 
function berekenDeStaafMaten(maa1){         // berekent de staafmaten op basis van de afstand tussen de assen
    ab1tb2 = maa1/Math.tan(toRadians(21.5));
    verplaatsing = ab1tb2/Math.tan(toRadians(36));
    setV('verplaatsing', verplaatsing);
    turn(MODEL.strut,MODEL.strut.verplaatsingsvector);
    render();
}

function deMuur(){
    cleanCanvas();
    showWall();
    // toggleAnimation()
}

function cleanCanvas(){
    ctx.fillStyle = BACKGROUNDCOLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// menu & commando's **********menu***********************

function toDegrees(angle) {
    return 180*angle/Math.PI ;  
}

function toRadians(angle) {
    return (Math.PI/180)*angle;  
}

function pan(){
    lx = getV('minX');
    ly = getV('minY');
    hx = getV('maxX');
    hy = getV('maxY');

    fx = (hx - lx)/ canvas.width;
    fy = (hy - ly)/canvas.height;
    fac = fx;
    if (fy > fx) fac = fy;
    z = getV('zoom');
    setV('zoom', z/fac);
    setV('panPointX',   canvas.width/2);   
    setV('panPointY',   canvas.height/2);
}

// 3d & initialisatie ********************************

function hoekTussenTweeVectoren(v1, v2){
    i = inProdukt(v1.richting,v2.richting);
    if (i == 0) return 90;
    lv1 = lengtePijl(v1);
    lv2 = lengtePijl(v2);
    cosFi = i/(lv1*lv2);
    if (cosFi < -1 || cosFi > 1) error('hoekTussenTweeVectoren fout. Waarde is :' + cosFi);
    fi = Math.acos(cosFi);      
    deg = toDegrees(fi);
    if (deg > 90) deg = 180 - deg;
    deHoek = deg;
    return deHoek;
}

function inProdukt(v,n){
    a = v[0]*n[0];
    b = v[1]*n[1];
    c = v[2]*n[2];
    return a+b+c;
}

function loodlijnTussenPijlen(from, to) {
    bolt = perp2skewLines(from, to); 
    return pijlTussen2Punten(bolt.beginpunt, bolt.eindpunt)
}

function perp2skewLines(from, to) {
    var Pva =[], Qvb =[], lambda = [];
    var bolt = [];
    
    lambda = lambdasVanBout(from,to);
    t = lambda[0];
    s = lambda[1];
    for (let i = 0; i < 3; i++) {
        Pva[i] = from.steun[i] + t*from.richting[i];  // P op from
        Qvb[i] = to.steun[i] + s*to.richting[i];// Q op to        
    }    
    
    bolt.lambda     = t;
    bolt.beginpunt  = Pva; 
    bolt.eindpunt   = Qvb; 
    bolt.lengte     = afstandPunten(Pva, Qvb); 

    return bolt;
}

function lambdasVanBout(v1, v2) {     // De lambda's van de bout:geeft de lambda van het punt op v1 het dichtst bij v2 en omgekeerd

    matrix = matrixVanLijnstuk(v1, v2);             // Matrix van PQ (loodrecht op v1 en v2)
    vgl1 = lijnLoodrechtLijn(matrix, v1.richting);
    vgl2 = lijnLoodrechtLijn(matrix, v2.richting); 
    nvgl = eliminate(vgl1,vgl2);                    // los op 2 variabelen met 2 onbekenden
    s = nvgl[0];
    t = nvgl[1];

    return [t,s];
  }
    
function matrixVanLijnstuk(a1,a2){   // 2 onbekende punten op 2 vectoren
    col1 = [], col2 = [], col0 = [], row1 = [], row2 = [], row0 = [];
    for (let i = 0; i < 3; i++) {
        col0[i] = a2.richting[i];   // richting a2
        col1[i] = - a1.richting[i]; // richting a1 er van afgetrokken
        col2[i] = a2.steun[i] - a1.steun[i];
    }
    row0 = [col0[0], col1[0], col2[0]]; // matrix voor het herleiden van 
    row1 = [col0[1], col1[1], col2[1]]; // onbekenden in kolom 0 en 1
    row2 = [col0[2], col1[2], col2[2]];
    return [ row0, row1, row2];
}

function lijnLoodrechtLijn(matrix,vector){ // lijnstuk met 2 onbekenden loodrecht lijnstuk
    vgl = [];
    r1 = matrix[0], r2 = matrix[1], r3 = matrix[2];
    s = vector[0]*row0[0] + vector[1]*row1[0] + vector[2]*row2[0];
    t = vector[0]*row0[1] + vector[1]*row1[1] + vector[2]*row2[1];
    n = vector[0]*row0[2] + vector[1]*row1[2] + vector[2]*row2[2];
    return vgl = [s,t,n];
}

function eliminate(v1,v2) {
    nv = [], sv = [];
    fac1 = v2[0];
    fac2 = v1[0];
    for (let i = 0; i < v1.length; i++) {
        sv[i] = v1[i];          // copieer de eerste vergelijking
        v1[i] = fac1*v1[i];     // vermenigvuldig 1ste waarden zodat ze gelijk worden
        v2[i] = fac2*v2[i];
    }
    nv[0] = v1[0]-v2[0];        // s
    nv[1] = v1[1]-v2[1];        // t
    nv[2] = v1[2]-v2[2];
    t =     -nv[2]/nv[1];      
    s =     -((sv[1]*t)+sv[2])/sv[0];
    return [s,t];
}

function turn(s, middelpuntBol){               // draait de staaf 
    if (s && middelpuntBol){
        deVectoren = [];
        for (let i = 0; i < s.edges.length; i++) {  // en de verbonden staven
            deVectoren.push(draaiEnVerleng(s.edges[i], middelpuntBol));
        } 
        return storeNomaData(s, deVectoren);      // slaat de verdraaide staven op    
    } return false;
}

function snijdVL(vlak, lijn){
    vlakFormule = [], snijpunt = [];
    v1  = pijlTussen2Punten(vlak[0], vlak[1]);
    v2  = pijlTussen2Punten(vlak[1], vlak[2]);
    p   = vlak[1];
    vlakFormule = normaal(v1.richting, v2.richting);
    vlakFormule[3] = vlakFormule[0]*p[0]+vlakFormule[1]*p[1]+vlakFormule[2]*p[2];
    // if (DEBUG)error('vlakformule: A: '+vlakFormule[0]+' B: '+vlakFormule[1]+' C: '+vlakFormule[2]+' D: '+vlakFormule[3]);
    teller = vlakFormule[3]-vlakFormule[0]*lijn.steun[0]-vlakFormule[1]*lijn.steun[1]-vlakFormule[2]*lijn.steun[2];
    noemer = vlakFormule[0]*lijn.richting[0]+vlakFormule[1]*lijn.richting[1]+vlakFormule[2]*lijn.richting[2];
    lambda = teller/noemer;
    for (let i = 0; i < 3; i++) {
        snijpunt[i] = lijn.steun[i] + lambda*lijn.richting[i];  
    }  
    return snijpunt;
}

function isVlak(bl, vlak){
    b = bl[0];
    v = b[vlak];
    return v;
}

function isLijn(bl, vlak, lijn){
    
    b = bl[0];
    v = b[vlak];
    l = pijlTussen2Punten(v[lijn], v[lijn+1]);
    return l;
}

function makeSolid(as, boven, zijde){
    origin = [0,0,0], randen0 = [], randen1 = [], randen3 = [], vlakken = [], blok = [];
    m   = middelPuntPijl(as);
    mo  = pijlTussen2Punten(m, origin);
    ev1 = eenheidsVector(mo.richting);
    nv  = normaal(mo.richting, as.richting);
    ev2 = eenheidsVector(nv);
    p = as.steun;

    randen0 = tralala(p, boven, zijde, ev1, ev2);
    vlakken.push(steunPuntenVanRanden(randen0));

    p  = puntWaarPijlNaarWijst(as);     // de andere zijde van de staaf
    randen1 = tralala(p, boven, zijde, ev1, ev2);
    vlakken.push(steunPuntenVanRanden(randen1));

    for (let i = 0; i < 4; i++){     // de randen tussen de hoekpunten van de einden
        j = i+1;
        if (j == 4)j = 0;
        p0 = randen0[i].steun;
        p1 = randen1[i].steun;
        p2 = randen1[j].steun;
        p3 = randen0[j].steun;
        vlakken.push([p0,p1,p2,p3]);
    }
    blok.push(vlakken);
    return blok;
}

function steunPuntenVanRanden(randen){
    p = [];
    for (let i = 0; i < 4; i++){     
        p.push(randen[i].steun);
    }
    return p;
}

function tralala(p, boven, zijde, ev1, ev2){
    h1 = [],h2 = [],h3 = [],h4 = [], e = [];
    for (let i = 0; i < 3; i++) {      
        h1[i] =   (zijde/2)*ev1[i] + (boven/2)*ev2[i] + p[i];       
        h2[i] = - (zijde/2)*ev1[i] + (boven/2)*ev2[i] + p[i];       
        h3[i] = - (zijde/2)*ev1[i] - (boven/2)*ev2[i] + p[i];       
        h4[i] =   (zijde/2)*ev1[i] - (boven/2)*ev2[i] + p[i];       
    } 
    e.push(pijlTussen2Punten(h1, h2)); 
    e.push(pijlTussen2Punten(h2, h3)); 
    e.push(pijlTussen2Punten(h3, h4)); 
    e.push(pijlTussen2Punten(h4, h1)); 
    return e;
}

function storeNomaData(s,vp){ // slaat de vectoren van de verdraaide staven op
    if (s.noma)delete s.noma;
    if (vp){
        s.noma = [];
        for (let i = 0; i < vp.length; i++) {
            s.noma.push(vp[i]); 
        } return true;   
    } return error('storeNomaData: no data');
} 

function verbondenStaven(edge, vp){ // zoekt en retourneert de staven uit vp die met edge verbonden zijn
    v = [];
    for (let i = 0; i < vp.length; i++) {
        const elm = vp[i];
        if (elm != edge){
            b = perp2skewLines(edge,elm);
            g = getV('verplaatsing');
            g *= 1.5;
            if (b.lambda > 0    && b.lambda < g ||
                b.lambda > 1-g  && b.lambda < 1){
                if (b.lengte < g) {
                    v.push(elm);
                }
            }
        }
    }        
    return v;
}

function hoekMetStaafVlak(as, st){
    origin = [0,0,0], m = [], v = [];
    m = middelPuntPijl(as);
    p = puntVerstWeg(m, st);
    mo = pijlTussen2Punten(m, origin);
    mv = pijlTussen2Punten(m, p);
    h = 90 - hoekTussenTweeVectoren(mo, mv);
    return h;
}

function puntVerstWeg(p, pijl){
    p1 = pijl.steun;
    p2 = puntWaarPijlNaarWijst(pijl);
    a1 = afstandPunten(p,p1);
    a2 = afstandPunten(p,p2);
    if (a1 > a2) return p1;
    return p2;
}

function lengteStaafdeel(from, to){
    return afstandPunten(from, to);
}

function vanEindpuntNaarEersteBoorgat(as,bg){
    ep = [];
    l   = lengtePijl(as);
    lsd = lengteStaafdeel(as.steun, bg.steun);
    if (lsd > l/2){
        ep = puntWaarPijlNaarWijst(as);
        return lengteStaafdeel(ep, bg.steun);
    } return lsd;
}

function afstandAssen(conn){
    return lengtePijl(conn);
}

function straalDome(as){
    origin = [0,0,0], m = [];
    m = middelPuntPijl(as);
    return pijlTussen2Punten(origin, m);
}

function bereken(st, c, what){  // bereken alle variabelen van staaf st
    as = st, sD = [];

    st1   = c[0];
    st3   = c[1];
    st2   = c[2];
    st4   = c[3];

    sD = straalDome(as);

    conn1 = loodlijnTussenPijlen(as, st1);
    conn2 = loodlijnTussenPijlen(as, st2);
    conn3 = loodlijnTussenPijlen(as, st3);
    conn4 = loodlijnTussenPijlen(as, st4);

                                           //  hoek in het vlak
    if (what == 'maf1') return  round(hoekTussenTweeVectoren(as, st1),1);
    if (what == 'maf2') return  round(hoekTussenTweeVectoren(as, st2),1);
    if (what == 'maf3') return  round(hoekTussenTweeVectoren(as, st3),1);
    if (what == 'maf4') return  round(hoekTussenTweeVectoren(as, st4),1);
                                            //  hoek van boorgat met boorgat 1
    if (what == 'max1') return  round(hoekTussenTweeVectoren(conn1, sD),1);
    if (what == 'max2') return  round(hoekTussenTweeVectoren(sD, conn2),1);
    if (what == 'max3') return  round(hoekTussenTweeVectoren(conn1, sD),1);
    if (what == 'max4') return  round(hoekTussenTweeVectoren(sD, conn4),1);
                                           //   afstand tussen de boorgaten  
    if (what == 'mab1') return  round(vanEindpuntNaarEersteBoorgat(as,conn1),2);
    if (what == 'mab2') return  round(lengteStaafdeel(conn1.steun,conn2.steun),2);
    if (what == 'mab3') return  round(lengteStaafdeel(conn2.steun,conn3.steun),2);
    if (what == 'mab4') return  round(lengteStaafdeel(conn3.steun,conn4.steun),2);
                                            //  afstand tussen de staafassen 
    if (what == 'maa1') return  round(afstandAssen(conn1),2);
    if (what == 'maa2') return  round(afstandAssen(conn2),2);
    if (what == 'maa3') return  round(afstandAssen(conn3),2);
    if (what == 'maa4') return  round(afstandAssen(conn4),2);

}

function round(number, decimals){
    if (!decimals) divider = 1;
    else divider = Math.pow(10, decimals);
    return Math.round(number*divider)/divider;
}

function rV(vector, decimals){
    v = [], r = '[';
    for (let i = 0; i < vector.length; i++) {
        v[i] = round(vector[i], decimals);
        r = ' '+r+' '+v[i];
    }  
    return r + ' ]';
}

function afstandPunten(p1,p2){
    p = [];
    for (let i = 0; i < 3; i++) p[i]= p1[i]-p2[i];
    var length = Math.sqrt(Math.pow(p[0],2) + Math.pow(p[1],2) + Math.pow(p[2],2));
    return length;
}

function draaiEnVerleng(as, mpb){       // verleng de staafAs en draai loodrecht op straal bol
    vp = [], pp = [], v = [], w = [];

    ep = as[0];                         // eindpunt staafas
    m  = middelPuntEdge(as);
    v = pijlTussen2Punten(m, ep);       // vector middelpunt staaf -> eindpunt
    m  = middelPuntEdge(as);

    r = pijlTussen2Punten(mpb,m);       // vector middelpunt bol -> middelpunt staaf 
    g = getV('verplaatsing');

    ev = eenheidsVector(normaal(v.richting, r.richting));
    for (let i = 0; i < 3; i++) {       // bereken het verplaatste eindpunt
        pp[i] = g * ev[i];
        vp[i] = ep[i] + pp[i];
    } 
    v = pijlTussen2Punten(m, vp);       // vector middelpunt staaf naar verplaatst punt
    v = verLengEnVerdubbelVector(v, verlengingsFactor());       // verleng met factor en verdubbel de vector

    return v;
}

function verlengingsFactor(){
    return 1.3;
}
function middelPuntEdge(v){
    var b = v[0], e = v[1], m =[];
    for (let i = 0; i < 3; i++) {
        m[i] = (b[i] + e[i])/2;    
    }
    return m;
}

function verLengEnVerdubbelVector(v,fac){     // verlengt en verdubbelt de vector
    v = lambdaVector(v, fac);
    v = keerPijlOm(v);
    return lambdaVector(v,2);
}

function keerPijlOm(v){
    p = [];
    p = puntWaarPijlNaarWijst(v);
    for (let i = 0; i < v.richting.length; i++) {
        v.richting[i] = -v.richting[i];
        v.steun[i]    = p[i];
    }
    return v;
}

// Deel 2    3d punten, lijnen en vectoren ******************************

function pijlTussen2Punten(a,b) {
    var vector      = new Object;
    if (!a)return error('pijlTussen2Punten: A BESTAAT NIET');
    if (!b)
    return error('pijlTussen2Punten: b BESTAAT NIET');
    if (a[0] == b[0] && a[1] == b[1] && a[2] == b[2]){
        return error('pijlTussen2Punten: de punten a en b zijn gelijk');
    } else {
        vector.steun    = [a[0], a[1], a[2]];
        vector.richting = [b[0]- a[0], b[1]- a[1], b[2]- a[2]];    
    }
    return vector;
}

function pijlMetRichting(a,r){
    var vector      = new Object;
    vector.steun    = [a[0], a[1], a[2]];
    vector.richting = [r[0], r[1], r[2]];;
    return vector;
}

function puntWaarPijlNaarWijst(vector) {
    var point = [];
    for (let i = 0; i < 3; i++)  point[i]  = vector.steun[i] + vector.richting[i];        
    return point;
}

function eindPunt(vector) {
    if (vector.length != 0)error('dit is geen vector');
    var endPoint = [], startPoint = vector[0], increment = vector[1];
    for (let i = 0; i < 3; i++)  endPoint[i]  = startPoint[i] + increment[i];        
    return endPoint;
}

function beginPunt(vector) {
    var startPoint = vector[0];
    return startPoint;
}

function middelPuntPijl(vector) {       
    return puntOpVector(vector, 0.5);
}

function middelPuntRand(r) { 
    p0 = r[0];p1 = r[1];
    vector = pijlTussen2Punten(p0, p1); 
    return middelPuntPijl(vector);
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

function middelPuntVlak3d(a) {
    m = [0,0,0];       
    for (let i = 0; i < a.length; i++) {
        mm   =  a[i];
        m[0] += mm[0];
        m[1] += mm[1];
        m[2] += mm[2];
    }
    m[0] = m[0]/a.length;
    m[1] = m[1]/a.length;
    m[2] = m[2]/a.length;
    return m;
}

function middelPuntSolid(a) {
    m = [0,0], aantalPunten = 0, b = a[0];
    for (let i = 0; i < b.length; i++) {        // voor de vlakken
        v = b[i];
        for (let i = 0; i < v.length; i++) {    // voor de punten per vlak
            aantalPunten++;
            p3d  = v[i];
            mm   = project3d2d(p3d);
            m[0] += mm[0];
            m[1] += mm[1];
        }
    }
    l = aantalPunten;
    m[0] = m[0]/l;
    m[1] = m[1]/l;
    m[2] = 0;
    return m;
}

function lambdaVector(a,lambda){    // vergroot of verklein de vector met lambda
    for (let i = 0; i < 3; i++) a.richting[i] = a.richting[i] * lambda;
    return a;
}

function puntOpVector(a,lambda){    // geeft het punt met waarde lambda op de vector 
    p = [];
    for (let i = 0; i < 3; i++) p[i] = a.steun[i] + a.richting[i] * lambda;
    return p;
}

function eenheidsVector(v) { // retourneert de eenheidsvector van v
    var l = lengteRichtingsVector(v);
    if (l){
        for (let i = 0; i < 3; i++) {
            v[i] = v[i]/l;
        }    
    }
    return v;
}

function normaal(v2,v1) {       
    return  kruisProduct(v2,v1);
}

function  lengteRichtingsVector(v) {
    return Math.sqrt(Math.pow(v[0],2)+Math.pow(v[1],2)+Math.pow(v[2],2));
}

function kruisProduct(vector1, vector2){
    var loodrecht = [];
    ax = vector1[0];
    ay = vector1[1];
    az = vector1[2];

    bx = vector2[0];
    by = vector2[1];
    bz = vector2[2];

    loodrecht[0] = ay*bz-az*by;
    loodrecht[1] = az*bx-ax*bz;
    loodrecht[2] = ax*by-ay*bx;
    return loodrecht
}


// visualisatie & 3d projectie ******************************

function pakIndicesVanRanden(vlakIndex) {
    randen = [];
    for (let j = 0; j < MODEL.edges.length; j++) {      // voor alle randen van het model
        if (randVanVlak(vlakIndex,j)){randen.push(j);}
    } 
    return randen;
}

function randVanVlak(vlakIndex,lijnIndex) {
    l = MODEL.edges[lijnIndex];
    p0 = l[0];
    p1 = l[1];
    if (puntVanVlak(vlakIndex, p0) && puntVanVlak(vlakIndex, p1))return true;
    return false;
}

function randenMetTop(top) {
    randen = [];
    for (let i = 0; i < MODEL.edges.length; i++) { 
        if (puntVanLijn(i,top))randen.push(i);              
    }
    return randen;
}

function puntVanVlak(vlakIndex,punt) {
    vlak = MODEL.faces[vlakIndex];
    for (let i = 0; i < vlak.length; i++) {                 // voor de punten van het vlak
        p = vlak[i];
        if (p == punt)return true;
    }
    return false;
}

function puntVanLijn(lijnIndex,punt) {
    lijn = MODEL.edges[lijnIndex];
    p0 = lijn[0];               // voor de punten van de lijn
    if (p0 == punt)return true;
    p1 = lijn[1];
    if (p1 == punt)return true;
    return false;
}

function initStrut(){
    r = [];
   
    r = pakStaafMetVerbondenStaven(0);      // 0, dat is de eerste staaf in het model
    myStrut = neemZeApart(r);

    r = myStrut.edges[0];
    p = r[0];
    v = pijlTussen2Punten(p,[0,0,0]);       // verplaatsingsvector

    myStrut.origin = copyPoint(v.richting);
    for (let i = 0; i < myStrut.points.length; i++) {
        p = myStrut.points[i];
        q = movePoint(p,v);                 // bereken de waarde van het verplaatste punt
        fillPoint(p,q);                     // sla de waarde op
    }
    MODEL.strut = myStrut;                  // hang het boeltje aan het MODEL
    return myStrut;
}

function pakStaafMetVerbondenStaven(s){  // pakt de staven uit het model die verbonden zijn met staaf nummer s
    r0 = [], r1 = [], r2 = [], r = MODEL.edges[s];

    p0 = r[0];
    r0 = randenMetTop(p0);
    p1 = r[1];
    r1 = randenMetTop(p1);

    r2.push(s);
    for (let i = 0; i < r0.length; i++) { if (r0[i] != s) r2.push(r0[i]);}
    for (let i = 0; i < r1.length; i++) { if (r1[i] != s) r2.push(r1[i]);}
    return r2;
}

function neemZeApart(staven){ // copieert staven uit het model naar strut
    var myStrut = new Object;
    myStrut.points = [];    
    myStrut.edges  = [];

    for (let i = 0; i < staven.length; i++) {
        staafIndex = staven[i];
        st = MODEL.edges[staafIndex];
        myStrut = copieerStaaf(st, myStrut);  // staaf gecopieerd  naar myStrut
    }
    return myStrut;
}

function copieerStaaf(s, strut){
    pts = [];
    for (let i = 0; i < 2; i++) {                       // voor de eindpunten
        p = s[i];
        plaats = elementInArray(p, strut.points);
        if (plaats == -1) {                             // punt is nieuw
            pn = copyPoint(p);                          // copieer het punt van de staaf
            strut.points.push([pn[0], pn[1], pn[2]]);
            pts[i]      = strut.points[strut.points.length-1];
        } else pts[i]   = strut.points[plaats];         // punt is bekend
    }
    strut.edges.push([pts[0], pts[1]]);                 // staaf gecopieerd
    return strut;
}

function elementInArray(e,a){
    for (let j = 0; j < a.length; j++) {
        const p = a[j];
        if (e[0] == p[0] && e[1] == p[1] && e[2] == p[2]) return j;   
    }
    return -1;
}

function copyPoint(point){ // retourneert een copie van het punt
    p = [];
    for (let i = 0; i < 3; i++) {
        p[i] = point[i];
    }
    return p;
}


function movePoint(point, vector) { // verplaats het punt over de vector
    var p = [];
    for (let i = 0; i < 3; i++) p[i] = point[i]+ vector.richting[i];
    return p;
}    

function fillPoint(point1, point2) { // plaats de waarden van punt 2 in de plaatsen van punt 1 
    for (let i = 0; i < 3; i++){
        if (Math.abs(point2[i]) < 0.00001) point1[i] = 0;
        else point1[i] = point2[i];
    } 
    return point1;
}    

function lengtePijl(a) {
    return Math.sqrt(Math.pow(a.richting[0],2) + Math.pow(a.richting[1],2) + Math.pow(a.richting[2],2));    
}

function kiesHetModel(plato){
    if (plato){
        if      (plato == 4) {model = initTetrahedron();}
        else if (plato == 6) {model = initHexahedron();}
        else if (plato == 8) {model = initOktahedron();}
        else if (plato == 12){model = initDodekahedron();}
        else if (plato == 20){model = initIcosahedron();}
        setValue('plato',plato);
    } else error('Je hebt nog geen veelvlak model gekozen');
    setV('persp',0);
    return model;
}

