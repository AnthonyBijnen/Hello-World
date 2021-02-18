
// function doDi() { doe('distance',1);}
function doDB() { doe('distance',0);}       // dichterbij
function doVW() { doe('distance',1);}       // verderweg
function doFr() { doe('freq',1);}
function doZI() { doe('zoom',1);}           // zoom in
function doZO() { doe('zoom',0);}           // zoom uit
function doZV() { doe('zoomFac',0);}
function doZV() { doe('plato',0);}
function doT()  { doe('top',1);}            // gamma = theta = 0
function doF()  { doe('front',1);}          // gamma = 90, theta = 0
function doPU() { doe('pan',2);}
function doPD() { doe('pan',3);}
function doPL() { doe('pan',4);}
function doPR() { doe('pan',5);}
function doNL() { doe('theta',1);}          // naar links  theta  +=chTheta
function doNR() { doe('theta',0);}          // naar rechts  theta -=chTheta
function doNV() { doe('chGamma',0);}
function doNB() { doe('gamma',1);}          // naar boven  gamma  +=chGamma
function doNO() { doe('gamma',0);}          // naar onder  gagetV(mma  -=chGamma
function doBV() { doe('chTheta',0);}
function doS()  { doe('speed',1);}
function doL()  { doe('speed',0);}
function doSV() { doe('speedFac',0);}
function doPp() { doe('persp',1);}
function doPa() { doe('persp',0);}      

function doe(t, up){

    if (t=='distance'){ if (up) { setV('distance',getV('distance')*1.5);
                      } else      setV('distance',getV('distance')/1.5); render();
} else if(t=='zoom')  { if (up)  {setV('zoom',   getV('zoom')*getV('zoomFac'));
                      } else     {setV('zoom',   getV('zoom')/getV('zoomFac')); 
                      } render();      
} else if(t=='plato'){vraag('plato');
} else if(t=='freq')  { if (up) { setV('freq',   getV('freq')+1);
                      } else      setV('freq',   getV('freq')-1); render();
} else if(t=='top')   {           setV('gamma', 0);  setV('theta', 0);  
                                  ModelMoving  =  modelMoving(false); render();   
} else if(t=='front') {           setV('gamma', 90); setV('theta', 0);     
                                  ModelMoving  =  modelMoving(false); render(); 
} else if(t=='chTheta'){vraag('chTheta');  
} else if(t=='theta') { if (up) { setV('theta',  getV('theta')+getV('chTheta'));       
                      } else      setV('theta',  getV('theta')-getV('chTheta')); render();
} else if(t=='chGamma'){vraag('chGamma');  
} else if(t=='gamma') { if (up) { setV('gamma',  getV('gamma')+getV('chGamma'));       
                      } else      setV('gamma',  getV('gamma')-getV('chGamma')); render();   
} else if(t=='speedFac')  {vraag('speedFac');
} else if(t=='speed') { if (up) { setV('dgamma', getV('dgamma')*getV('speedFac')); 
                                  setV('dtheta', getV('dtheta')*getV('speedFac')); render();      
                      } else    { setV('dgamma', getV('dgamma')/getV('speedFac'));
                                  setV('dtheta', getV('dtheta')/getV('speedFac')); render(); }
} else if(t=='pan')   { pM = 100;
                             if (up == 1) {;
                      } else if (up == 2 || up == 3){ p = getV('panPointX'); 
                             if (up == 2) p = p - pM; else p = p + pM; setV('panPointX', p);
                      } else if (up == 4 || up ==5){  p = getV('panPointY'); 
                             if (up == 4) p = p - pM; else p = p + pM; setV('panPointY', p);
                      } else console.log('pan fout');      
                            render();  
} else if(t=='persp') {     setV('persp',up); render();  
} else if(t=='verplaatsing') { setV('verplaatsing',up);turnOn20(getV('verplaatsing'));} 
}

function setValue(type, value){
    if (MODEL){
        if (MODEL.view){
            return MODEL.view[type] = Number(value);
        }return error('setValue: geen MODEL.view');
    } return error('setValue: geen MODEL');
}

function getValue(type){
    if (MODEL){
        if (MODEL.view){
            return MODEL.view[type];
        }return error('getValue: geen MODEL.view');
    } return error('getValue: geen MODEL');
}


function setV(type, value)  {return setValue(type, value);}
 
function getV(type)         {return getValue(type);}

function showV(){      // laat de projectvariabelen zien
    var txt =
    'chTheta'+ ' = ' +     getV('chTheta') + ' \n ' +        
    'chGamma' + ' ='+      getV('chGamma') + ' \n ' +        
    'distance' + ' = ' +   getV('distance') + ' \n ' +              
    'dtheta' + ' = ' +     getV('dtheta') + ' \n ' +        
    'dgamma' + ' = ' +     getV('dgamma') + ' \n ' +   
    'freq' + ' = ' +       getV('freq') + ' \n ' +        
    'gamma' + ' = ' +      getV('gamma') + ' \n ' +        
    'maaiveld' + ' = ' +   getV('maaiveld') + ' \n ' +                  
    'panPointX' + ' = ' +  getV('panPointX') + ' \n ' +        
    'panPointY' + ' = ' +  getV('panPointY') + ' \n ' +  
    'verplaatsing' + ' = '+getV('verplaatsing') + ' \n ' +  
    'staafkleur'   + ' = '+getV('staafkleur') + ' \n ' +  
    'randlengte'   + ' = '+getV('randlengte') + ' \n ' +  
    'staafdikte'   + ' = '+getV('staafdikte') + ' \n ' +  
    'persp' + ' = ' +      getV('persp') + ' \n ' +        
    'speedFac' + ' = ' +   getV('speedFac') + ' \n ' +        
    'straal' + ' = ' +     getV('straal') + ' \n ' +        
    'theta' + ' = ' +      getV('theta') + ' \n ' +        
    'zoom' + ' = ' +       getV('zoom') + ' \n ' +
    'zoomFac' + ' = ' +    getV('zoomFac') + ' \n '   ;
    'plato' + ' = ' +      getV('plato') + ' \n '   ;
    console.log(txt);
} 

function staafData(){
    maf1 = localStorage.getItem("maf1");
    maf2 = localStorage.getItem("maf2");
    maf3 = localStorage.getItem("maf3");
    maf4 = localStorage.getItem("maf4");
    mab1 = localStorage.getItem("mab1");
    mab2 = localStorage.getItem("mab2");
    mab3 = localStorage.getItem("mab3");
    mab4 = localStorage.getItem("mab4");
    max1 = localStorage.getItem("max1");
    max2 = localStorage.getItem("max2");
    max3 = localStorage.getItem("max3");
    max4 = localStorage.getItem("max4");
    maa1 = localStorage.getItem("maa1");
    maa2 = localStorage.getItem("maa2");
    maa3 = localStorage.getItem("maa3");
    maa4 = localStorage.getItem("maa4");
}

function printStaaf() {
    st = staafData()
    staaf = [];
    staaf.bout1 = [];
    staaf.bout2 = [];
    staaf.bout3 = [];
    staaf.bout4 = [];
   
    ab1tb2 = Math.abs(Math.round((mab2 - mab1)*100))/100;
    ab2tb3 = Math.abs(Math.round((mab3 - mab2)*100))/100;
    ab3tb4 = Math.abs(Math.round((mab4 - mab3)*100))/100;
    ls  = Number(mab1) + Number(mab2) + Number(mab3) + Number(mab4) + Number(mab1);
    ls  = Math.round(ls*100)/100;
    

    var txt =
    'verplaatsing' + ' = ' +  Math.round(MODEL.view.verplaatsing[0] * 100)/100 + ' cm  \n \n' +
             
    'boorgat 1' + ':' +  ' \n ' +        
    '    hoek in het vlak' + '                       = ' +   maf1 + '  deg \n ' +        
    '    hoek van boorgat 1 met straal dome' + '     = ' +   max1 + '  deg \n ' +        
    '    afstand tussen de staafassen    ' + '       = ' +   maa1 + '   cm \n ' +        
    '    afstand eind tot boorgat1           ' + '   = ' +   mab1 + '   cm \n ' +
    'boorgat 2' + ':' +  ' \n ' +        
    '    hoek in het vlak' + '                       = ' +   maf2 + '  deg \n ' +        
    '    hoek van boorgat 2 met straal dome' + '     = ' +   max2 + '  deg \n ' +        
    '    afstand tussen de staafassen' + '           = ' +   maa2 + '   cm \n ' +        
    '    afstand boorgat 1 tot boorgat 2       ' + ' = ' +   mab2 +'   cm \n ' +
    'boorgat 3' + ':' +  ' \n ' +        
    '    hoek in het vlak    ' +     '               = ' +   maf3 + '  deg \n ' +        
    '    hoek van boorgat 3 met straal dome' + '     = ' +   max3 + '  deg \n ' +        
    '    afstand tussen de staafassen    ' + '       = ' +   maa3 +  '   cm \n ' +        
    '    afstand boorgat 2 tot boorgat 3    ' + '    = ' +   mab3 + '  cm \n ' +
    'boorgat 4' + ':' +  ' \n ' +        
    '    hoek in het vlak    ' + '                   = ' +   maf4 + '  deg \n ' +        
    '    hoek van boorgat 4 met straal dome' + '     = ' +   max4 + '  deg \n ' +        
    '    afstand tussen de staafassen    ' + '       = ' +   maa4 +   '   cm \n ' +        
    '    afstand boorgat 3 tot boorgat 4    ' + '    = ' +   mab4 + '   cm \n \n' +
      
    '     totale lengte staaf:                 ' + ls + '  cm \n \n'
    console.log(txt);
    return staaf;
}   
function setToggles(){
    toggleAnimation();
    toggleAnimation();
    toggleDebug();
    toggleDebug();
}

function toggleAnimation(){
    if (!ModelMoving ) {
        ModelMoving = true;
        document.getElementById("animation").innerHTML = "zet stil";
    } else {
        ModelMoving = false;
        document.getElementById("animation").innerHTML = "beweeg";
    }
    localStorage.setItem('bewegend',ModelMoving);
    render();
}

function modelMoving(bool){
    if (bool != ModelMoving)toggleAnimation();
}

function toggleDebug(){
    if (DEBUG) {
        DEBUG = false;
        document.getElementById("debug").innerHTML = "debug aan";
    } else {
        DEBUG = true;
        document.getElementById("debug").innerHTML = "debug uit";
    }
    render();
    localStorage.setItem('debug',DEBUG);   
}

function showStaafData(){
    st = staafData()
    staaf = [];
    staaf.bout1 = [];
    staaf.bout2 = [];
    staaf.bout3 = [];
    staaf.bout4 = [];

    ab1tb2 = Math.abs(Math.round((mab2 - mab1)*100))/100;
    ab2tb3 = Math.abs(Math.round((mab3 - mab2)*100))/100;
    ab3tb4 = Math.abs(Math.round((mab4 - mab3)*100))/100;

    ls  = Number(mab4) + Number(mab1);
    ls  = Math.round(ls*100)/100;   t     = 

    staaf.bout1.angleInFace       = Number(maf1);
    staaf.bout1.angleWithBolt     = Number(max1);
    staaf.bout1.distanceAxes      = Number(maa1);
    staaf.bout1.distanceFromStart = Number(mab1);
    staaf.bout2.angleInFace       = Number(maf2);
    staaf.bout2.angleWithBolt     = Number(max2);
    staaf.bout2.distanceAxes      = Number(maa2);
    staaf.bout2.distanceFromStart = Number(mab2);
    staaf.bout3.angleInFace       = Number(maf3);
    staaf.bout3.angleWithBolt     = Number(max3);
    staaf.bout3.distanceAxes      = Number(maa3);
    staaf.bout3.distanceFromStart = Number(mab3);
    staaf.bout4.angleInFace       = Number(maf4);
    staaf.bout4.angleWithBolt     = Number(max4);
    staaf.bout4.distanceAxes      = Number(maa4);
    staaf.bout4.distanceFromStart = Number(mab4);
    staaf.verplaatsing            = MODEL.view.verplaatsing[0];
    staaf.lengte                  = ls;
    staaf.breedte                 = 2.0;
    staaf.hoogte                  = 2.0;    
    return staaf;
}   
    
function storeStrutData(s, c){  
    DEBUG = true;
    localStorage.clear();
    localStorage.setItem("maf1", bereken(s, c, "maf1"));
    localStorage.setItem("maf2", bereken(s, c, "maf2"));
    localStorage.setItem("maf3", bereken(s, c, "maf3"));
    localStorage.setItem("maf4", bereken(s, c, "maf4"));
    localStorage.setItem("mab1", bereken(s, c, "mab1"));
    localStorage.setItem("mab2", bereken(s, c, "mab2"));
    localStorage.setItem("mab3", bereken(s, c, "mab3"));
    localStorage.setItem("mab4", bereken(s, c, "mab4"));
    localStorage.setItem("max1", bereken(s, c, "max1"));
    localStorage.setItem("max2", bereken(s, c, "max2"));
    localStorage.setItem("max3", bereken(s, c, "max3"));
    localStorage.setItem("max4", bereken(s, c, "max4"));
    localStorage.setItem("maa1", bereken(s, c, "maa1"));
    localStorage.setItem("maa2", bereken(s, c, "maa2"));
    localStorage.setItem("maa3", bereken(s, c, "maa3"));
    localStorage.setItem("maa4", bereken(s, c, "maa4"));
    localStorage.setItem("MODEL", MODEL);
    DEBUG = false;

    printStaaf();
}

function error(txt){
    console.log(txt);
    return undefined;
};

function errorNaN(x,etxt){
    if (Number.isNaN(x)){
        error(etxt); return true;
    } return false;
}

function berror(txt){
    if (DEBUG)error(txt);
}


function bugLijn(a,kleur,pensize, id){
    if (DEBUG)laatDeLijnZien(a,kleur,pensize,id)
}
function bugPunt(a,kleur,pensize, id){
    if (DEBUG)laatHetPuntZien(a,kleur,pensize,id)
}
function bugLijn2Punten(p1,p2,kleur,pensize, id){
    if (DEBUG){
        lijnTussen2PuntenIn3d(p1,p2, kleur, pensize, id);
    }
}
function bugLijn2dPunten(p1,p2,kleur,pensize, id){
    if (DEBUG){
        lijnOpCanvas(p1,p2, kleur, pensize);
    }
}

function bugVlak(v,kleur, id){
    if (DEBUG){
        tekenVlak(v, kleur, id); 
    }
}