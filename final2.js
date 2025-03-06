var canvas;
var ctx;
var w = 1000;
var h = 700;
var o1 = {
    x: w/2,
    y: h/2,
    r: 10,
    c: 260,
    a: 0.75,
    speed: 50,
    change: {
        x: randn(w), 
        y: randn(h),
        r: 0,
        c: 0,
        a: 0,
        speed: 0,
    }
}
// var eventStates = {
//     onclick: false
// }
var cursor = {
    x: 0, 
    y: 0,
    r: 1
}
var timer = counter(-1, 10);
var score = counter(1, 0); 

setInterval(function(){
    timer.increment();
    console.log(timer.getCount()); 
}, 1000); 

document.getElementById("myCanvas").onclick= click;
document.getElementById("myCanvas").onmousemove= mousemove;

setUpCanvas();
animationLoop();

function animationLoop(){
    clear();  
    drawtimer(timer.getCount()); 
    drawscore(score.getCount());
    if(timer.getCount() > 0){
        requestAnimationFrame(animationLoop); 
    }else{
        clear()
        drawtimer(timer.getCount()); 
        drawscore(score.getCount());
        drawgameover(); 
    }
}
//game idea: worm made of trail of circles following mouse movement. grows as it eats circles. dies if it touches circles falling from the sky.

// SCOREBOARD, TIMER & GAME OVER
function drawscore(s){
    ctx.beginPath()
    ctx.font = "40px Helvetica";
    ctx.fillStyle = "blue"; 
    ctx.fillText(s, 100, 100); 
}
function drawtimer(c){
    ctx.beginPath()
    ctx.font = "40px Helvetica";
    ctx.fillStyle = "blue"; 
    ctx.fillText(c, w-100, 100); 
}
function drawgameover(){
    ctx.beginPath()
    ctx.font = "100px Helvetica";
    ctx.fillStyle = "blue"; 
    ctx.fillText("game over", (w/2)-250, h/2); 
}
function counter(incrementValue, startValue){
    var count = startValue; 
    return {
        increment: increment, 
        getCount: getCount
    }
    function increment(){
        count+=incrementValue; 
    }
    function getCount(){
        return count
    }

}

// //USER INTERACTION
// function mousemove(e){
//     if(eventStates.onclick){o1.x=e.offsetX;
//         o1.y=e.offsetY;
//         o1.c+=0.2;
//         circle_arc(o1);
//         console.log("mousemove",e.offsetX, e.offsetY);
//     }
// }
// function click(event){
//     if(eventStates.onclick){
//         eventStates.onclick = false
//     }else{
//         eventStates.onclick = true
//     }
//     console.log(eventStates);
//     // // o1.x=rand(w);
//     // // o1.y=rand(h);
//     // o1.x=event.offsetX;
//     // o1.y=event.offsetY;
//     // circle_arc(o1);
//     // console.log(typeof(event));
//     // console.log("click",event.offsetX, event.offsetY);
// }

// OBJECT INTERACTION
function torus (o){
    if(o.x>w){
        o.x=0;
    }
    if(o.x<0){
        o.x=w;
    }
    if(o.y>h){
        o.y=0;
    }
    if(o.y<0){
        o.y=h;
    }
}
function bounce(o){
    if(o){
    if(o.x>w || o.x<0){
        console.log("bounce");
        o.change.x *= -1;
    }
    if(o.y>h || o.y <0){
        o.change.y *= -1;
    }
    }
}

// SHAPES
function circle_arc(o){
    ctx.beginPath();
    ctx.arc(o.x,o.y,o.r,0, 2*Math.PI);
    ctx.fillStyle = "hsla("+o.c+", 100%, 50%, "+o.a+")";
    ctx.fill();

}
function rect(o){
    var x =o.x;
    var y =o.y;
    o.x=o.x-o.w/2;
    o.y=o.y-o.h/2
    ctx.beginPath();
    ctx.moveTo(o.x+rand(o.random),o.y+rand(o.random))
    ctx.lineTo(o.x+o.w+rand(o.random),o.y+rand(o.random))
    ctx.lineTo(o.x+o.w+rand(o.random),o.y+o.h+rand(o.random))
    ctx.lineTo(o.x+rand(o.random),o.y+o.h+rand(o.random))
    ctx.closePath();
    ctx.fillStyle="hsla("+o.c+",100%,50%,"+o.a+")";
    ctx.lineWidth=o.lw;
    ctx.fill();
    o.x = x;
    o.y = y;
}

// SET DATA
function updateData(o){
    o.x+=o.change.x;
    o.y+=o.change.y;
    o.w+=o.change.w;
    o.h+=o.change.h;
    o.r+=o.change.r;
    o.c+=o.change.c;
    o.a+=o.change.a;
    o.speed+=o.change.speed;
}
function rand(range){
    var result = Math.random()*range;
    return result;
}
function randn(range){
    var result = Math.random()*range-range/2;
    return result
}
function clear(){
    ctx.clearRect(0,0,w,h);
}
function setUpCanvas(){
    canvas=document.getElementById("myCanvas");
    ctx=canvas.getContext("2d");
    canvas.width=w;
    canvas.height=h;
    canvas.style.border="3px solid blue";
}

console.log("final") 