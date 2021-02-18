
function initIcosahedron(){
    var r   = 1;
    var w5  = Math.sqrt(5);
    var wmp = Math.sqrt(10 + 2 * w5);
    var wmm = Math.sqrt(10 - 2 * w5);
    var r4  = (r/4);

    var myIcosa = new Object;
    this.points =    [];
    this.points.push([0,           0,      -(w5*r)/2]);  // 0.0   :1
    this.points.push([-r,          0,      -r/2]);       // 1.0   :2
    this.points.push([ r4*(1-w5), -r4*wmp, -r/2]);       // 1.1   :3
    this.points.push([ r4*(1+w5), -r4*wmm, -r/2]);       // 1.2   :4
    this.points.push([ r4*(1+w5),  r4*wmm, -r/2]);       // 1.3   :5
    this.points.push([ r4*(1-w5),  r4*wmp, -r/2]);       // 1.4   :6
    this.points.push([ r,          0,       r/2]);       // 2.0   :7
    this.points.push([ r4*(w5-1),  r4*wmp,  r/2]);       // 2.1   :8
    this.points.push([-r4*(w5+1),  r4*wmm,  r/2]);       // 2.2   :9
    this.points.push([-r4*(w5+1), -r4*wmm,  r/2]);       // 2.3   :10
    this.points.push([ r4*(w5-1), -r4*wmp,  r/2]);       // 2.4   :11
    this.points.push([0,           0,       (w5*r)/2]);  // 3.0   :12

    this.edges = [];
    this.edges.push([this.points[0],this.points[1]]);     // 1:   0.0 -- 1.0
    this.edges.push([this.points[0],this.points[2]]);     // 2:   0.0 -- 1.1
    this.edges.push([this.points[0],this.points[3]]);     // 3:   0.0 -- 1.2
    this.edges.push([this.points[0],this.points[4]]);     // 4:   0.0 -- 1.3
    this.edges.push([this.points[0],this.points[5]]);     // 5:   0.0 -- 1.4
    this.edges.push([this.points[1],this.points[2]]);     // 6:   1.0 -- 1.1
    this.edges.push([this.points[2],this.points[3]]);     // 7:   1.1 -- 1.2
    this.edges.push([this.points[3],this.points[4]]);     // 8:   1.2 -- 1.3
    this.edges.push([this.points[4],this.points[5]]);     // 9:   1.3 -- 1.4
    this.edges.push([this.points[5],this.points[1]]);     // 10:   1.4 -- 1.0

    this.edges.push([this.points[1],this.points[9]]);     // 11:   1.0 -- 2.3
    this.edges.push([this.points[9],this.points[2]]);     // 12:   2.3 -- 1.1
    this.edges.push([this.points[2],this.points[10]]);    // 13:   1.1 -- 2.4
    this.edges.push([this.points[10],this.points[3]]);    // 14:   2.4 -- 1.2
    this.edges.push([this.points[3],this.points[6]]);     // 15:   1.2 -- 2.0
    this.edges.push([this.points[6],this.points[4]]);     // 16:   2.0 -- 1.3
    this.edges.push([this.points[4],this.points[7]]);     // 17:   1.3 -- 2.1
    this.edges.push([this.points[7],this.points[5]]);     // 18:   2.1 -- 1.4
    this.edges.push([this.points[5],this.points[8]]);     // 19:   1.4 -- 2.2
    this.edges.push([this.points[8],this.points[1]]);     // 20:   2.2 -- 1.0

    this.edges.push([this.points[6],this.points[7]]);     // 21:   2.0 -- 2.1
    this.edges.push([this.points[7],this.points[8]]);     // 22:   2.1 -- 2.2
    this.edges.push([this.points[8],this.points[9]]);     // 23:   2.2 -- 2.3
    this.edges.push([this.points[9],this.points[10]]);     // 24:   2.3 -- 2.4
    this.edges.push([this.points[10],this.points[6]]);     // 25:   2.4 -- 2.0
    this.edges.push([this.points[11],this.points[6]]);     // 26:   3.0 -- 2.1
    this.edges.push([this.points[11],this.points[7]]);     // 27:   3.0 -- 2.2
    this.edges.push([this.points[11],this.points[8]]);     // 28:   3.0 -- 2.3
    this.edges.push([this.points[11],this.points[9]]);     // 29:   3.0 -- 2.4
    this.edges.push([this.points[11],this.points[10]]);    // 30:   3.0 -- 2.0
   
  
    this.faces = [];
    this.faces.push([this.points[0],this.points[1],this.points[2]]);
    this.faces.push([this.points[0],this.points[2],this.points[3]]);
    this.faces.push([this.points[0],this.points[3],this.points[4]]);
    this.faces.push([this.points[0],this.points[4],this.points[5]]);
    this.faces.push([this.points[0],this.points[5],this.points[1]]);

    this.faces.push([this.points[9], this.points[2],this.points[1]]);
    this.faces.push([this.points[10],this.points[3],this.points[2]]);
    this.faces.push([this.points[6], this.points[4],this.points[3]]);
    this.faces.push([this.points[7], this.points[5],this.points[4]]);
    this.faces.push([this.points[8], this.points[1],this.points[5]]);

    this.faces.push([this.points[6], this.points[7], this.points[4]]);
    this.faces.push([this.points[7], this.points[8], this.points[5]]);
    this.faces.push([this.points[8], this.points[9], this.points[1]]);
    this.faces.push([this.points[9], this.points[10],this.points[2]]);
    this.faces.push([this.points[10],this.points[6], this.points[3]]);

    this.faces.push([this.points[7], this.points[6], this.points[11]]);
    this.faces.push([this.points[8], this.points[7], this.points[11]]);
    this.faces.push([this.points[9], this.points[8], this.points[11]]);
    this.faces.push([this.points[10],this.points[9], this.points[11]]);
    this.faces.push([this.points[6], this.points[10],this.points[11]]);


    MODEL = this;    size = 170;
    adaptSize(size);
    initViewValues(MODEL, size);
    return this;
}

function initHexahedron(){

    var myCube = new Object;
    this.points =    [];
    this.points.push([-1, -1,  1]);                  //  1
    this.points.push([-1,  1,  1]);                  //  2
    this.points.push([-1,  1, -1]);                  //  3
    this.points.push([-1, -1, -1]);                  //  4
    this.points.push([ 1, -1,  1]);                  //  5
    this.points.push([ 1,  1,  1]);                  //  6
    this.points.push([ 1,  1, -1]);                  //  7
    this.points.push([ 1, -1, -1]);                  //  8
   
    this.edges = [];
    this.edges.push([this.points[0],this.points[1]]);     // 1:   
    this.edges.push([this.points[0],this.points[3]]);     // 2:   
    this.edges.push([this.points[0],this.points[4]]);     // 3:
    this.edges.push([this.points[1],this.points[5]]);     // 4:
    this.edges.push([this.points[1],this.points[2]]);     // 5:
    this.edges.push([this.points[2],this.points[3]]);     // 6:
    this.edges.push([this.points[2],this.points[6]]);     // 7:  
    this.edges.push([this.points[3],this.points[7]]);     // 8:  
    this.edges.push([this.points[4],this.points[5]]);     // 9
    this.edges.push([this.points[4],this.points[7]]);     // 10:   
    this.edges.push([this.points[6],this.points[5]]);     // 11:   
    this.edges.push([this.points[6],this.points[7]]);     // 12:   
   
    this.faces = [];   
    this.faces.push([this.points[1],this.points[2],this.points[3],this.points[0]]);
    this.faces.push([this.points[7],this.points[6],this.points[5],this.points[4]]);
    this.faces.push([this.points[5],this.points[6],this.points[2],this.points[1]]);
    this.faces.push([this.points[3],this.points[7],this.points[4],this.points[0]]);
    this.faces.push([this.points[4],this.points[5],this.points[1],this.points[0]]);
    this.faces.push([this.points[6],this.points[7],this.points[3],this.points[2]]);
   
    MODEL = this;    size = 110;
    adaptSize(size);
    initViewValues(MODEL, size);
    return this;
}

function initOktahedron(){
    
    var myO = new Object;
    this.points =    [];
    this.points.push([-1, 0, 0]);
    this.points.push([1,  0, 0]);
    this.points.push([0,  1, 0]);
    this.points.push([0, -1, 0]);
    this.points.push([0,  0, 1]);
    this.points.push([0,  0,-1]);

    this.edges = [];
    this.edges.push([this.points[3],this.points[4]]);     // 1:   
    this.edges.push([this.points[3],this.points[0]]);     // 2:   
    this.edges.push([this.points[3],this.points[5]]);     // 3:
    this.edges.push([this.points[3],this.points[1]]);     // 4:
    this.edges.push([this.points[1],this.points[4]]);     // 5:
    this.edges.push([this.points[1],this.points[2]]);     // 6:
    this.edges.push([this.points[1],this.points[5]]);     // 7:  
    this.edges.push([this.points[5],this.points[2]]);     // 8:  
    this.edges.push([this.points[5],this.points[0]]);     // 9
    this.edges.push([this.points[0],this.points[4]]);     // 10:   
    this.edges.push([this.points[0],this.points[2]]);     // 11:   
    this.edges.push([this.points[2],this.points[4]]);     // 12:   


    this.faces = [];   
    this.faces.push([this.points[4],this.points[3],this.points[1]]);
    this.faces.push([this.points[5],this.points[2],this.points[1]]);
    this.faces.push([this.points[2],this.points[4],this.points[1]]);
    this.faces.push([this.points[1],this.points[3],this.points[5]]);
    this.faces.push([this.points[5],this.points[3],this.points[0]]);
    this.faces.push([this.points[3],this.points[4],this.points[0]]);
    this.faces.push([this.points[4],this.points[2],this.points[0]]);
    this.faces.push([this.points[2],this.points[5],this.points[0]]);
 
    MODEL = this;    size = 190;
    adaptSize(size);
    initViewValues(MODEL, size);
    return this;
}

function initDodekahedron(){

    this.points =    [];
    this.points.push([-0.399250183284359, -0.2900722374700218, -0.646000366568718]);
    this.points.push([0.15249999999999997, -0.4693467394192261, -0.646000366568718]);
    this.points.push([0.49350036656871793, 0, -0.646000366568718]);
    this.points.push([0.15249999999999997, 0.4693467394192261, -0.646000366568718]);
    this.points.push([-0.399250183284359, 0.2900722374700218, -0.646000366568718]);
    this.points.push([-0.646000366568718, -0.4693467394192261, -0.15250000000000002]);
    this.points.push([0.246750183284359, -0.759418976889248, -0.15250000000000002]);
    this.points.push([0.798500366568718, 0, -0.15250000000000002]);
    this.points.push([0.24675018328435896, 0.759418976889248, -0.15250000000000002]);
    this.points.push([-0.646000366568718, 0.4693467394192261, -0.15250000000000002]);
    this.points.push([0.646000366568718, 0.4693467394192261, 0.15250000000000002]);
    this.points.push([-0.24675018328435896, 0.759418976889248, 0.15250000000000002]);
    this.points.push([-0.798500366568718, 0, 0.15250000000000002]);
    this.points.push([-0.24675018328435896, -0.759418976889248, 0.15250000000000002]);
    this.points.push([0.646000366568718, -0.4693467394192261, 0.15250000000000002]);
    this.points.push([0.399250183284359, 0.2900722374700218, 0.646000366568718]);
    this.points.push([-0.15249999999999997, 0.4693467394192261, 0.646000366568718]);
    this.points.push([-0.49350036656871793, 0, 0.646000366568718]);
    this.points.push([-0.15249999999999997, -0.4693467394192261, 0.646000366568718]);
    this.points.push([0.399250183284359, -0.2900722374700218, 0.646000366568718]);
    this.points.push([-0.399250183284359, -0.2900722374700218, -0.646000366568718]);

    this.edges =    [];
    this.edges.push([this.points[0],this.points[1]]);       
    this.edges.push([this.points[1],this.points[2]]);       
    this.edges.push([this.points[2],this.points[3]]);       
    this.edges.push([this.points[3],this.points[4]]);       
    this.edges.push([this.points[4],this.points[0]]);       
    this.edges.push([this.points[1],this.points[6]]);       
    this.edges.push([this.points[6],this.points[14]]);       
    this.edges.push([this.points[7],this.points[14]]);       
    this.edges.push([this.points[7],this.points[10]]);       
    this.edges.push([this.points[8],this.points[10]]);       
    this.edges.push([this.points[8],this.points[3]]);       
    this.edges.push([this.points[8],this.points[11]]);       
    this.edges.push([this.points[11],this.points[9]]);       
    this.edges.push([this.points[9],this.points[12]]);       
    this.edges.push([this.points[11],this.points[16]]);       
    this.edges.push([this.points[16],this.points[17]]);       
    this.edges.push([this.points[16],this.points[15]]);       
    this.edges.push([this.points[15],this.points[10]]);       
    this.edges.push([this.points[17],this.points[18]]);       
    this.edges.push([this.points[18],this.points[19]]);       
    this.edges.push([this.points[19],this.points[14]]);       
    this.edges.push([this.points[18],this.points[13]]);       
    this.edges.push([this.points[13],this.points[6]]);       
    this.edges.push([this.points[5] ,this.points[12]]);       
    this.edges.push([this.points[5] ,this.points[0]]);       
    this.edges.push([this.points[5] ,this.points[13]]);       
    this.edges.push([this.points[12],this.points[17]]);       
    this.edges.push([this.points[19],this.points[15]]);       
    this.edges.push([this.points[7],this.points[2]]);       
    this.edges.push([this.points[4],this.points[9]]);    
    
    this.faces =    [];
    this.faces.push([this.points[15],this.points[16],this.points[11],this.points[8] ,this.points[10]]);
    this.faces.push([this.points[8], this.points[11],this.points[9] ,this.points[4] ,this.points[3]]);
    this.faces.push([this.points[16],this.points[17],this.points[12],this.points[9] ,this.points[11]]);
    this.faces.push([this.points[16],this.points[15],this.points[19],this.points[18],this.points[17]]);
    this.faces.push([this.points[15],this.points[10],this.points[7] ,this.points[14],this.points[19]]);
    this.faces.push([this.points[10],this.points[8] ,this.points[3] ,this.points[2] ,this.points[7]]);
    this.faces.push([this.points[18],this.points[13] ,this.points[5]  ,this.points[12] ,this.points[17]]);
    this.faces.push([this.points[18],this.points[19] ,this.points[14] ,this.points[6]  ,this.points[13]]);
    this.faces.push([this.points[13],this.points[6]  ,this.points[1]  ,this.points[20] ,this.points[5]]);
    this.faces.push([this.points[12],this.points[5]  ,this.points[20] ,this.points[4]  ,this.points[9]]);
    this.faces.push([this.points[6],this.points[14]  ,this.points[7] ,this.points[2]  ,this.points[1]]);
    this.faces.push([this.points[2],this.points[3]  ,this.points[4] ,this.points[20]  ,this.points[1]]);
 
    MODEL = this;    size = 234;
    adaptSize(size);
    initViewValues(MODEL, size);
    return this;
}

function initTetrahedron(){

    var myTetra = new Object;
    this.points =    [];
    this.points.push([ Math.sqrt(8/9),               0,     -1/3]);       // 0.0   :1
    this.points.push([-Math.sqrt(2/9),  Math.sqrt(2/3),     -1/3]);       // 1.0   :2
    this.points.push([-Math.sqrt(2/9), -Math.sqrt(2/3),     -1/3]);       // 1.1   :3
    this.points.push([ 0             ,               0,        1]);       // 1.2   :4
   
    this.edges =    [];
    this.edges.push([this.points[0],this.points[1]]);       
    this.edges.push([this.points[0],this.points[2]]);       
    this.edges.push([this.points[0],this.points[3]]);       
    this.edges.push([this.points[1],this.points[2]]);       
    this.edges.push([this.points[1],this.points[3]]);       
    this.edges.push([this.points[2],this.points[3]]);       
 
    this.faces =    [];
    this.faces.push([this.points[0],this.points[1],this.points[2]]);
    this.faces.push([this.points[3],this.points[1],this.points[0]]);
    this.faces.push([this.points[3],this.points[2],this.points[1]]);
    this.faces.push([this.points[3],this.points[0],this.points[2]]);

    MODEL = this;    size = 190;
    adaptSize(size);
    initViewValues(MODEL, size);
    return this;
 }

function adaptSize(size){
    for (let i = 0; i < MODEL.points.length; i++) {
        const ex = MODEL.points[i][0] * size;
        const ey = MODEL.points[i][1] * size;
        const ez = MODEL.points[i][2] * size;
        MODEL.points[i][0] = ex;
        MODEL.points[i][1] = ey;
        MODEL.points[i][2] = ez;
    }
    return size;
}

function initViewValues(MODEL, size){
    MODEL.view = [];
    emptyLocalStorage();
    ffsetValue('theta',       randI(360));
    ffsetValue('gamma',       randI(360));
    ffsetValue('chTheta',     7.5);
    ffsetValue('chGamma',     7.5);
    speed = randI(50)/1000;
    if (speed == 0) speed = 0.05;   
    if (coin()){ dtheta  = speed} else { dtheta  = - speed}
    ffsetValue('dtheta',      dtheta);
    speed = randI(50)/1000;
    if (coin()){ dgamma  = speed} else { dgamma  = - speed}
    ffsetValue('dgamma',      dgamma); 
    ffsetValue('freq',    1);
    ffsetValue('speedFac',    2);
    ffsetValue('zoom',        0.002);    
    ffsetValue('zoomFac',     1.5);    
    ffsetValue('distance',    1 * size);    
    ffsetValue('persp',       true);
    ffsetValue('panPointX',   300);   
    ffsetValue('panPointY',   300);   
    ffsetValue('maaiveld',    0.0);   
    ffsetValue('DIST2Dome',   (getV('straal') - 0.1) * size);
    ffsetValue('verplaatsing', 10);
    ffsetValue('staafkleur',  '#79df95');
    setV('factor',      size); 
    setV('straal',      getRadius());   
    setV('randlengte',  lengteLijn(MODEL.edges[0]));
    setV('staafdikte',  6);
    initColors(MODEL);
}

function emptyLocalStorage(){
    iSay('theta',       false);
    iSay('gamma',       false);
    iSay('chTheta',     false);
    iSay('chGamma',     false);
    iSay('dtheta',      false);
    iSay('dgamma',      false); 
    iSay('freq',        false);
    iSay('speedFac',    false);
    iSay('zoom',        false);    
    iSay('zoomFac',     false);    
    iSay('distance',    false);    
    iSay('persp',       false);
    iSay('panPointX',   false);   
    iSay('panPointY',   false);   
    iSay('maaiveld',    false);   
    iSay('DIST2Dome',   false);
    iSay('verplaatsing',false);
    iSay('staafkleur',  false);
}

function initColors(MODEL){
    MODEL.colors = [];
    for (let i = 0; i < 100; i++) {
        MODEL.colors.push(getRandomColor());   
    }
}

function initCommandList(MODEL){
    COMMANDS = []; return true; 
}

