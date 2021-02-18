function fun(){
    
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');

    cleanCanvas();

    parts = randI(10);
    for (let i = 0; i < parts; i++) {
        up = randI(canvas.height);
        u1 = randI(up);
        u2 = randI(up);
        v  = u1 - u2;
        if (v < 0){
            v = -v;
            l = u1;
        } else { l = u2}
        error('part '+ i + ' lower = ' + l + ' reach = ' + v);
        part(l,v,randI(100))}
}

function moreOrLess(getal){
    getal = randI(getal);
    if (coin())getal = -getal;
    return getal;
}

function inDeel(a,b){
    if (coin()){
        r = a + moreOrLess(b)
    } else {
        r = b + moreOrLess(a)
    }
    if (r <= 0) return inDeel(a,b);
    return r;
}


function part(lower, reach, times){
    for (let i = 0; i < times; i++) {
        up = reach;
        tools = 8;
        go = Math.floor(randI(tools));
        ctx.fillStyle =  getRandomColor();
        // wait(60);
        // r =dice(up)
        radius  = randI(up);
        r1 = inDeel(lower,up);
        r2 = inDeel(lower,up);
        r3 = inDeel(lower,up);
        r4 = inDeel(lower,up);
        r5 = inDeel(lower,up);
        r6 = inDeel(lower,up);
        r7 = inDeel(lower,up);
        pensize = randI(40);
        if (coin())pensize = 1;
        kleur = getRandomColor();

        if (go ==0)       {
            ctx.fillRect(r1,r2,r3,r4);
        } else if (go ==1) {
            from = 0;
            to   = 2*Math.PI; 
            if (coin()){
                from = randI(30);
                to = randI(30);
            }
            ctx.beginPath();
            ctx.arc(r1,r2,radius,from, to);
            if (coin()) ctx.fill();
            ctx.stroke();   
        } else if (go ==2) {
            ctx.moveTo(r1,r2);
            ctx.lineTo(r3,r4);
            ctx.lineWidth = pensize;
            ctx.strokeStyle = kleur;
            ctx.stroke();
       } else if (go ==3) {            
            // Create gradient
            r1 = randI(200);
            r2 = randI(200);
            r3 = randI(200);
            r4 = randI(200);
            var grd = ctx.createLinearGradient(r1,r2,r3,r4);
            grd.addColorStop(0, getRandomColor());
            grd.addColorStop(1, getRandomColor());
            // Fill with gradient
            ctx.fillStyle = grd;
            r1 = inDeel(lower,up);
            r2 = inDeel(lower,up);
            r3 = inDeel(lower,up);
            r4 = inDeel(lower,up);
            ctx.fillRect(r1,r2,r3,r4);
        } else if (go ==4) {
            ctx.beginPath();
            ctx.ellipse(r1, r2, r3, r4, r5, r6, r7);
            if (coin()) ctx.fill();
            ctx.stroke();
        } else if (go ==5) {
            r1 = inDeel(lower,up);
            r2 = inDeel(lower,up);
            for (let j = 0; j < randI(10); j++) {
                ctx.moveTo(r1,r2);
                r3 = inDeel(lower,up);
                r4 = inDeel(lower,up);
                ctx.lineTo(r3,r4);
                ctx.lineWidth = pensize;
                ctx.strokeStyle = kleur;
                ctx.stroke();
                r1 = r3;
                r2 = r4;                    
            }
        } else if (go ==6) {     // dots
            from = 0;
            to   = 2*Math.PI; 
            ctx.beginPath();
            ctx.arc(r1,r2,randI(50),from, to);
            ctx.fill();
            ctx.stroke();
        } else if (go ==7) {     // kaders
            ctx.beginPath();
            ctx.rect(r1,r2,r3,r4);
            ctx.stroke();
        }
    }
}

function dice(nr){
    if (coin()) { up = randI(nr);
        error(' 1: '+up);
        if (coin() && up > 0) {up = randI(up);
            error(' 1: '+up);
            if (coin() && up > 0) { up = randI(up);
                error('  2: '+up);
                if (coin() && up > 0) { up = randI(up);
                    error('   3: '+up);
                    if (coin() && up > 0) {up = randI(up);
                        error('    4: '+up);
                        if (coin() && up > 0) { up = randI(up);
                            error('     5: '+up);
                        }
                    }
                }            
            }
        }
    }
    if (up == 0)up =1;
    return up;
}

function randI(nr){
    return Math.floor(nr*Math.random());
}

function coin(){
    return randI(2);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function dist(y){
    d = y/600;  // canvas?
    d = 50 + 2000*d
    return d;
}

function wait(ms){
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while(d2-d < ms);  }

    r1 = 0;
    r2 = 0;
    r3 = 0;
    r4 = 0;
    r5 = 0;
    r6 = 0;
    r7 = 0;
    r0 = 0;

function showBrick() {
    var logoImg = new Image();
    var dir = 0, size = 400, firstTime = true;

    logoImg.onload = function () {
        logoImg.width = 200;
        logoImg.height= 200;
        var p = [200, 200], xx = 1, y = 200, yy = 1;
        var logo = {
            img: logoImg,
            x: (canvas.width / 2) - (logoImg.width / 2),
            y: (canvas.height / 2) - (logoImg.height / 2)
        }
        ctx.fillStyle = "#644653";
        window.requestAnimationFrame(function loop(){
        if (firstTime){
                p = [100,100]; firstTime = false;
            }
            wait(60); 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(logo.img, p[0], p[1],size,size);
            p = place(p, size);
            size = Math.floor(dist(p[1])) ;
            // error('size '+ size +' '+r0+' '+r1+' '+r2+' '+r3+' '+r4+' '+r5+' '+r6+' '+r7, ' x '+ x +' y '+ y);
            window.requestAnimationFrame(loop)
        })
    }
    logoImg.src = "images/brick.png";
}

function showConn() {
    var logoImg = new Image();
    var dir = 0, size = 600, firstTime = true;

    logoImg.onload = function () {
        logoImg.width = 200
        logoImg.height= 135;
        var x = 100, y = 100;
        var logo = {
            img: logoImg,
            x: (canvas.width  / 2) - (logoImg.width  / 2),
            y: (canvas.height * 2/3) - (logoImg.height / 2)
        }

        ctx.fillStyle = "#644653";
        window.requestAnimationFrame(function loop(){
            size = size+2,x--,y--;

            if (size >= 1200){showBrick();}
            wait(60); 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(logo.img, x, y,size,size);
            window.requestAnimationFrame(loop);
            // error(x+' '+y+' '+size+' '+size+' ');            
       })
    }
    logoImg.src = "code/images/verbinding.jpg";
}

function showWall() {
    var logoImg = new Image();
    var dir = 0, size = 600, firstTime = true;  // canvas

    logoImg.onload = function () {
        logoImg.width = 1000
        logoImg.height= 1000;
        var x = 100, y = 100;
        var logo = {
            img: logoImg,
            x: (canvas.width  / 2) - (logoImg.width  / 2),
            y: (canvas.height / 2) - (logoImg.height / 2)
        }

        ctx.fillStyle = "#644653";
        window.requestAnimationFrame(function loop(){
            size = size+2,x--,y--;

            if (size >= 1200){showBrick();}
            wait(60); 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(logo.img, x, y,size,size);
            window.requestAnimationFrame(loop);
            // error(x+' '+y+' '+size+' '+size+' ');            
       })
    }
    logoImg.src = "code/images/muur.png";
}

function showffNiePict(name) {
    var logoImg = new Image();
    var dir = 0, size = 200, firstTime = true;

    logoImg.onload = function () {
        logoImg.width = 200
        logoImg.height= 135;
        var x = 200, y = 300;
        var logo = {
            img: logoImg,
            x: 200,
            y: 135
        }

        ctx.fillStyle = "#644653";
        window.requestAnimationFrame(function loop(){
            // size = size+2,x--,y--;

            // if (size >= 1200){showBrick();}
            wait(60); 
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(logo.img, x, y,logo.x,logo.y);
            // window.requestAnimationFrame(loop);
            // error(x+' '+y+' '+size+' '+size+' ');            
       })
    }
    getPict = 'code/images/'+name+'.jpg';
    logoImg.src = getPict;
}

function place(p, size){
    x = p[0];
    y = p[1];
    dir = 0;
    dir = Math.floor(8*Math.random());

    if (dir == 0)       { y++;r0++
    } else if (dir == 1) {x--;y++; r1++;
    } else if (dir == 2) {x--; r2++;
    } else if (dir == 3) {x--;y--; r3++;
    } else if (dir == 4) {    y--; r4++;
    } else if (dir == 5) {x++;y-- ;r5++;
    } else if (dir == 6) {x++; r6++;
    } else if (dir == 7) {x++;y++; r7++;
    }
    // error('dir: '+ dir);
    if (x >= 400) xx *= -1;
    if (y >= 400) yy *= -1;
    if (x <= 0) xx *= -1;
    if (y <= 0) yy *= -1;

    if (x <= 0)x = 0;
    if (y <= 0)y = 0;             
    if (x >= 600-size)x = 600-size;  // canvas
    if (y >= 600-size)y = 600-size;
    p[0] = x;
    p[1] = y;
    // error(x + ' '+y);
    return p;
}
