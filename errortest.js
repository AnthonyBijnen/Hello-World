SUSPECT = false;
var blokken = initBlokken();
VLAK1 = undefined;  VLAK2 = undefined;  LIJN  = undefined;
STAAFnum = 0;       FREESnum = 0;       VLAK1num = 0;

function lZinit(){
    lZ(0,0,0,'','','');  
}

function doTestCubeInit(){
    kiesHetModel(6);        iSay('zoom', 1);            iSay('distance',    5);    
    iSay('persp', true);    iSay('panPointX', 300);     iSay('panPointY', 300);
    iSay('gamma', -74);     iSay('theta', 124);
}

function doSnijTest(){
    laatZien();
    lZinit();
    // return freesBlok(frees, staaf);;
}

function doTest(){
    return laatZien();
}

function doSnij(){
    return laatZien();
}

function laatZien(){
    cleanCanvas();
    staaf = blokken[0];
    frees = blokken[1];
    slice = blokken[2];

    for (let i = 0; i < staaf.faces.length;  i++) laatHetVlakZien2(staaf.faces[i],'green', 1,0,'wire');
    for (let i = 0; i < staaf.edges.length;  i++) tekenRand(staaf.edges[i],'green', 3,0);
    for (let i = 0; i < frees.edges.length;  i++) tekenRand(frees.edges[i],'cyan', 1,0);
    for (let i = 0; i < slice.faces.length;  i++) laatHetVlakZien2(slice.faces[i],'white', 1,0,'wire');
    for (let i = 0; i < slice.edges.length;  i++)
    lijnTussen2PuntenIn3d(slice.edges[i][0][0], slice.edges[i][1][0],'white', 3,0);
    for (let i = 0; i < slice.points.length; i++) fflaatHetPuntZien(slice.points[i][0],'', 3,0,'bol');
    return true;
}

function lZ(v1,v2,l1,vn1,vn2,ln){
    laatZien();
    if (v1) VLAK1 = v1;         if (v2) VLAK2 = v2;         if (l1) LIJN = l1;
    if (vn1) STAAFnum = vn1;    if (vn2) FREESnum = vn2;    if (ln) VLAK1num = ln;
    if (VLAK2) doeVlakEnTekst(VLAK2, 'white', 3, FREESnum, 'surface');
    if (VLAK1) doeVlakEnTekst(VLAK1, 'pink', 3, STAAFnum, 'wire');
    if (VLAK2) doeVlakEnTekst(VLAK2, 'orange', 3, FREESnum, 'wire');
    if (LIJN)  laatDeLijnZien(LIJN,'yellow',4,VLAK1num);
    if (STAAFnum == 4 && FREESnum == 2){
        taxi = 2;
    }
    txt = 'vlak '+STAAFnum+'   vlak '+FREESnum+'   lijn '+VLAK1num;
    console.log('---'+txt);
    plaatsTekst(txt,[50,50],'idG');  
    // for (let i = 0; i < slice.faces.length;  i++) laatHetVlakZien2(slice.faces[i],'white', 1,0,'wire');
    for (let i = 0; i < slice.edges.length;  i++)
    lijnTussen2PuntenIn3d(slice.edges[i][0][0], slice.edges[i][1][0],'black', 1,0);
    for (let i = 0; i < slice.points.length; i++) fflaatHetPuntZien(slice.points[i][0],'', 3,0,'bol');     
}

function storeFace(sl,blok1,blok2){
    console.log('storeFace:')
    if (sl){
        sl.push('lijnSnijdtVlakken');
        sl.push([blok1,blok2]);
        slice = blokken[2];
        slice.faces.push(sl);
    } 
    return sl;
}

function storeEdge(sl,vlak1,vlak2){
    console.log('storeEdge:')
    if (sl){
        sl.push('lijnSnijdtVlakken');
        sl.push([vlak1,vlak2]);
        slice = blokken[2];
        slice.edges.push(sl);
    } 
    return sl;
}

function storePoint(xyz, lijn){
    console.log('storePoint:')
    slice = blokken[2]; sp = [];
    p = pointOfSlice(xyz, slice);
    if (p){
        p.push(lijn)
    } else {
        sp.push(xyz);
        sp.push('puntSnijdtLijn');
        sp.push(lijn);
        slice.points.push(sp);
    } 
    return sp;
}

function pointOfSlice(xyz, slice){
    for (let i = 0; i < slice.points.length; i++) {
        const p = slice.points[i];
        if (equalXyz(p[0],xyz)) return p;
    } return undefined;
}

function equalXyz(p1,p2){
    for (let i = 0; i < 3; i++) {
        if (Math.abs(p1[i]-p2[i])>0.0001) return false;       
    } return true;
}

function freesBlok(frees,staaf){
    console.log('freesBlok:');
    for (let i = 2; i < frees.faces.length; i++) {
        const v = frees.faces[i];
        lZ(0,v,0,'',i,'');
        snijvlak = vlakSnijdBlok(v,staaf);
        if (snijvlak){
            storeFace(snijvlak,frees,staaf);
        }
    }
    return true;
}

function vlakSnijdBlok(vlak,staaf){
    console.log('vlakSnijdBlok:');
    snijvlak = [];
    for (let i = 0; i < staaf.faces.length; i++) {
        const v = staaf.faces[i];
        lZ(v,0,0,i,'','');
        snijlijn = vlakSnijdtVlak(v,vlak);
        if (snijlijn) snijvlak.push(snijlijn);
    } return snijvlak;
}

function vlakSnijdtVlak(vlak1,vlak2){
    console.log('vlakSnijdtVlak:');
    sl = [], l = [];
    sl = snijLijn(vlak1,vlak2);
    if (sl.length == 2){ 
        storeEdge(sl,vlak1,vlak2);
    }
    return sl;
}

function edgeOfFace(vlak,i){
    if (i == vlak.length - 1)  return [vlak[i], vlak[0]];
    else                       return [vlak[i], vlak[i+1]];        
}

function snijLijn(vlak1,vlak2){         // bepaalt de snijlijn van twee vlakken
    console.log('snijLijn:');
    sp = [];
    for (let i = 0; i < vlak1.length; i++) {        // voor de randen van vlak1
        sp =snijRand(sp,edgeOfFace(vlak1,i), vlak2);
    }
    for (let i = 0; i < vlak2.length; i++) {        // voor de lijnen van vlak2
        sp =snijRand(sp,edgeOfFace(vlak2,i), vlak1);
    }
    return sp;
}

function snijRand(sp,rand, vlak){
    console.log('snijRand:');
    if (rand){
        snijpunt = lijnSnijdtVlak(rand,vlak);
        lZ(vlak,0,rand,'','','');
        if (snijpunt) {
            sp.push(storePoint(snijpunt,rand));       
        }
    } return sp;
} 

function lijnSnijdtVlak(edge,vlak){
    console.log('lijnSnijdtVlak:');
    vF = [], snijpunt = [];
    lijn = pijlTussen2Punten(edge[0], edge[1]);
    lZ(0,0,lijn,'','','');
    v1   = pijlTussen2Punten(vlak[0], vlak[1]);
    v2   = pijlTussen2Punten(vlak[1], vlak[2]);
    p    = vlak[1];
    vF = normaal(v1.richting, v2.richting);
    vF[3] = vF[0]*p[0]+vF[1]*p[1]+vF[2]*p[2];               // de vlakformule
    teller = vF[3]-vF[0]*lijn.steun[0]-vF[1]*lijn.steun[1]-vF[2]*lijn.steun[2];
    noemer = vF[0]*lijn.richting[0]+vF[1]*lijn.richting[1]+vF[2]*lijn.richting[2];
    if (noemer == 0)                    return undefined;
    lambda = teller/noemer;
    for (let i = 0; i < 3; i++) { snijpunt[i] = lijn.steun[i] + lambda*lijn.richting[i];} 
    if (lambda == 0 | lambda == 1){
        console.log('lijnSnijdtVlak: lambda == '+ lambda);
    }
    if (lambda < 0 | lambda >1)         return undefined;
    if (!ffpuntInBoxV(vlak,snijpunt))   return undefined;
    // if (!ffpuntInVlak(vlak,snijpunt))   return undefined;
    return snijpunt;
}

function ffpuntInBoxV(vlak,punt){
    b = mkBox(vlak);
    if (punt[0] >= b[0] && punt[0] <= b[3]){
        if (punt[1] >= b[1] && punt[1] <= b[4]){
            if (punt[2] >= b[2] && punt[2] <= b[5])return true;
        } return false;
    } return false;
}

function mkBox(vlak){
    box = initBox(vlak[0]);
    for (let i = 0; i < vlak.length; i++) {
        const e = vlak[i];
        for (let j = 0; j < 3; j++) {
            const el = e[j];
            if (el < box[j])    box[j]   = el;
            if (el > box[j+3])  box[j+3] = el;
        }
    }
    return box;
}

function initBox(p){
    box = [];
    for (let i = 0; i < 3; i++) {
        box[i]      = p[i];
        box[i+3]    = p[i];        
    } return box;
}

function ffpuntInVlak(vlak, punt){
    m  = middelPuntVlak3d(vlak);
    pm = pijlTussen2Punten(m,punt);

    for (let i = 0; i < vlak.length; i++) {
        vv = edgeOfFace(vlak,i);
        if (vv){
            if (fflijnStukkenSnijden(pm,pijlTussen2Punten(vv[0],vv[1]))) return false;       // punt ligt buiten het vlak
        } 
    }
    return true;
}

function fflijnStukkenSnijden(l1,l2){
    lambda = lambdasVanBout(l1,l2);
    if (Math.abs(lambda[0] - lambda[1]) < 0.0001 ){
        if (0 < lambda[0]){
            if (lambda[0] < 1) return true;
        } return false;
    } return false
}

function ffsetValue(type, value){
    if (MODEL){
        if (MODEL.view){
            myValue =    localStorage.getItem(type);
            if (myValue != 'false') value = myValue;
            else         localStorage.setItem(type, value);
            return MODEL.view[type] = Number(value);
        }return error('ffsetValue: geen MODEL.view');
    } return error('ffsetValue: geen MODEL');
}

function iSay(type, value){
    localStorage.setItem(type, value);
    if (MODEL){
        if (MODEL.view){
            MODEL.view[type] = Number(value);
        }
    }
}

function ffgetValue(type){
    myValue =    localStorage.getItem(type);
    if (myValue) return myValue;
    else {
        if (MODEL){
            if (MODEL.view){
                return MODEL.view[type] = Number(value);
            }return error('ffgetValue: geen MODEL.view');
        } return error('ffgetValue: geen MODEL');
    }
}

function fflaatHetPuntZien(a, kleur, straal, id, hoe){
    var p = project3d2d(a);
    if      (hoe == 'bol')  tekenBol(p,straal,kleur);
    else if (hoe == 'x')    tekenX(p,straal,kleur);
    else if (hoe == 'sq')   tekenSq(p,straal,kleur);
    if (id != 0){    // is identificatie gewenst?
        if (straal>9)   style = 'idG';
        else            style = 'idS';
        plaatsTekst(id,project3d2d(a),style);
    }
  return true;  
} 

function tekenBol(middelpunt,straal,kleur){
    ctx.beginPath();
    fillStyle = 'white';

    from = 0;
    to   = 2*Math.PI; 
    ctx.lineWidth = 2;

    ttt(middelpunt[0],middelpunt[1],straal,'red');
    ctx.arc(middelpunt[0],middelpunt[1],straal,from, to);
    ctx.stroke();
    return true;  
}

function tekenX(middelpunt,straal,kleur){
    x1 = middelpunt[0]-straal, y1 = middelpunt[1]-straal;
    x2 = middelpunt[0]+straal, y2 = middelpunt[1]+straal;
    lijnOpCanvas([x1,y1], [x2,y2], kleur, 1)
    x1 = middelpunt[0]-straal, y1 = middelpunt[1]+straal;
    x2 = middelpunt[0]+straal, y2 = middelpunt[1]-straal;
    lijnOpCanvas([x1,y1], [x2,y2], kleur, 1)
    return true;  
}

function tekenSq(m,r,kleur){
    v = [];
    v.push([m[0]+r, m[1]+r]);
    v.push([m[0]+r, m[1]-r]);
    v.push([m[0]-r, m[1]-r]);
    v.push([m[0]-r, m[1]+r]);

    fftekenVlak2d(v, kleur, 0);
    return true;  
}

function fftekenVlak3d(vlak, kleur, id){
    p = [];
    for (let i = 0; i < vlak.length; i++) {
        p2d = project3d2d(vlak[i]);
        if (p2d)p.push(p2d);
        else return false;
    }
    return fftekenVlak2d(p, kleur, id);    
}
 
function fftekenVlak2d(p, kleur, id){
    ctx.fillStyle   = kleur;
    ctx.beginPath();
    pp = p[0];
    ctx.moveTo(pp[0], pp[1]); 
    for (let i = 1; i < p.length; i++) {
        pp = p[i];
        ctx.lineTo(pp[0], pp[1]); 
    }
    pp = p[0];
    ctx.lineTo(pp[0], pp[1]); 
    ctx.closePath();                // go back to point 1
    ctx.fill();
    if (id != 0){                   // is identificatie gewenst?
        m = middelPuntVlak2d(p); // op de canvas in 2d
        plaatsTekst(id,m,'idG');
    } return true;     
}
 
function ttt(x,y,straal,kleur){
    ctx.fillStyle =  kleur;
    from = 0;
    to   = 2*Math.PI; 
    ctx.beginPath();
    ctx.arc(x,y,straal,from, to);
    ctx.fill();
}

function initBlokken(){
    staaf = [], frees = [], slice = [];
   
    slice.points = [];
    slice.edges  = [];
    slice.faces  = [];   

    staaf.points =    [];
    staaf.points.push([-1, -1,  1]);                  //  1
    staaf.points.push([-1,  2,  1]);                  //  2
    staaf.points.push([-1,  2, -1]);                  //  3
    staaf.points.push([-1, -1, -1]);                  //  4
    staaf.points.push([ 1, -1,  1]);                  //  5
    staaf.points.push([ 1,  2,  1]);                  //  6
    staaf.points.push([ 1,  2, -1]);                  //  7
    staaf.points.push([ 1, -1, -1]);                  //  8
   
    staaf.edges = [];
    staaf.edges.push([staaf.points[0],staaf.points[1]]);     // 1:   
    staaf.edges.push([staaf.points[0],staaf.points[3]]);     // 2:   
    staaf.edges.push([staaf.points[0],staaf.points[4]]);     // 3:
    staaf.edges.push([staaf.points[1],staaf.points[5]]);     // 4:
    staaf.edges.push([staaf.points[1],staaf.points[2]]);     // 5:
    staaf.edges.push([staaf.points[2],staaf.points[3]]);     // 6:
    staaf.edges.push([staaf.points[2],staaf.points[6]]);     // 7:  
    staaf.edges.push([staaf.points[3],staaf.points[7]]);     // 8:  
    staaf.edges.push([staaf.points[4],staaf.points[5]]);     // 9
    staaf.edges.push([staaf.points[4],staaf.points[7]]);     // 10:   
    staaf.edges.push([staaf.points[6],staaf.points[5]]);     // 11:   
    staaf.edges.push([staaf.points[6],staaf.points[7]]);     // 12:   
   
    staaf.faces = [];   
    staaf.faces.push([staaf.points[1],staaf.points[2],staaf.points[3],staaf.points[0]]);
    staaf.faces.push([staaf.points[7],staaf.points[6],staaf.points[5],staaf.points[4]]);
    staaf.faces.push([staaf.points[5],staaf.points[6],staaf.points[2],staaf.points[1]]);
    staaf.faces.push([staaf.points[3],staaf.points[7],staaf.points[4],staaf.points[0]]);
    staaf.faces.push([staaf.points[4],staaf.points[5],staaf.points[1],staaf.points[0]]);
    staaf.faces.push([staaf.points[6],staaf.points[7],staaf.points[3],staaf.points[2]]);
   
    frees.points =    [];
    frees.points.push([-1.5, -.5,  1.5]);                  //  1
    frees.points.push([-1.5,  .5,  1.5]);                  //  2
    frees.points.push([-1.5,  .5,  -.5]);                  //  3
    frees.points.push([-1.5, -.5,  -.5]);                  //  4
    frees.points.push([2.5, -.5,  1.5]);                  //  5
    frees.points.push([2.5,  .5,  1.5]);                  //  6
    frees.points.push([2.5,  .5,  -.5]);                  //  7
    frees.points.push([2.5, -.5,  -.5]);                  //  8
   
    frees.edges = [];
    frees.edges.push([frees.points[0],frees.points[1]]);     // 1:   
    frees.edges.push([frees.points[0],frees.points[3]]);     // 2:   
    frees.edges.push([frees.points[0],frees.points[4]]);     // 3:
    frees.edges.push([frees.points[1],frees.points[5]]);     // 4:
    frees.edges.push([frees.points[1],frees.points[2]]);     // 5:
    frees.edges.push([frees.points[2],frees.points[3]]);     // 6:
    frees.edges.push([frees.points[2],frees.points[6]]);     // 7:  
    frees.edges.push([frees.points[3],frees.points[7]]);     // 8:  
    frees.edges.push([frees.points[4],frees.points[5]]);     // 9
    frees.edges.push([frees.points[4],frees.points[7]]);     // 10:   
    frees.edges.push([frees.points[6],frees.points[5]]);     // 11:   
    frees.edges.push([frees.points[6],frees.points[7]]);     // 12:   
   
    frees.faces = [];   
    frees.faces.push([frees.points[1],frees.points[2],frees.points[3],frees.points[0]]);
    frees.faces.push([frees.points[7],frees.points[6],frees.points[5],frees.points[4]]);
    frees.faces.push([frees.points[5],frees.points[6],frees.points[2],frees.points[1]]);
    frees.faces.push([frees.points[3],frees.points[7],frees.points[4],frees.points[0]]);
    frees.faces.push([frees.points[4],frees.points[5],frees.points[1],frees.points[0]]);
    frees.faces.push([frees.points[6],frees.points[7],frees.points[3],frees.points[2]]);
   

    return [staaf,frees,slice];
}
