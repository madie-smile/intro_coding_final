var canvas;
var ctx;
var w = 1000;
var h = 700;
var allCircles = [];
var o = {x:0, y:0, change: {x: 0, y: 0}}

var eventStates = {
    onmouseover: false
}
var cursor = {
    x: 0,
    y: 0,
    r: 1,
}
var timer = counter(-1, 10);
var score = counter(1, 0);

setInterval(function () {
    timer.increment();
    console.log(timer.getCount());
}, 1000);
// setInterval(function(){
//     mouseover(o);
// }, 45)

document.getElementById("myCanvas").onmouseover = mouseover;
document.getElementById("myCanvas").onmousemove = mousemove;

setUpCanvas();
animationLoop();

function animationLoop() {
    clear();
    drawtimer(timer.getCount());
    drawscore(score.getCount());
    if (timer.getCount() > 0) {
        requestAnimationFrame(animationLoop);
    } else {
        clear()
        drawtimer(timer.getCount());
        drawscore(score.getCount());
        drawgameover();
    }

    for (var i = 0; i < allCircles.length; i++) {
        circle_arc(allCircles[i]);
        updateCircleData(allCircles[i]);
    }
}

// USER INTERACTION
function mousemove(e) {
    if (eventStates.onmouseover) {
        o.x = e.offsetX;
        o.y = e.offsetY;
        o.c += 0.2;
        // circle_arc(o);
        setInterval(function(){
            updateCircleData(o);
            createDataWithXY(1,allCircles,o);
        }, 45)
        // updateCircleData(o);
        // createDataWithXY(1, allCircles, o);
        console.log("mousemove", e.offsetX, e.offsetY);

        // Update allCircles based on mouse movement
        for (var i = 0; i < allCircles.length; i++) {
            allCircles[i].x = e.offsetX;
            allCircles[i].y = e.offsetY;
        }
    }
}
function mouseover(event) {
    if (eventStates.onmouseover) {
        eventStates.onmouseover = false
    } else {
        eventStates.onmouseover = true
    }
    console.log(eventStates);
}

// SHAPES
function circle_arc(o) {
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, 2 * Math.PI);
    ctx.fillStyle = "hsla(" + o.c + ", 100%, 50%, " + o.a + ")";
    ctx.fill();
}
// create circle data
function createDataWithXY(num, array, oxy) {
    for (var i = 0; i < num; i++) {
        array.push({
            x: oxy.x,
            y: oxy.y,
            r: 10,
            c: 260,
            a: 0.9,
            randomness: 0,
            change: {x: 0, y: 0, h: 0, w: 0, c: 5, a: -0.003, randomness: 0}
        })
    }
}
// update circle data
function updateCircleData(o) {
    var index;
    if (o.a < 0) {
        index = allCircles.indexOf(o);
        allCircles.splice(index, 1);
    } else {
        o.x += o.change.x;
        o.y += o.change.y;
        o.r += o.change.r;
        o.c += o.change.c;
        o.a += o.change.a;
        o.random += o.change.random;
    }
}

// SET DATA
function updateData(o) {
    o.x += o.change.x;
    o.y += o.change.y;
    o.w += o.change.w;
    o.h += o.change.h;
    o.r += o.change.r;
    o.c += o.change.c;
    o.a += o.change.a;
}
function rand(range) {
    var result = Math.random() * range;
    return result;
}
function randn(range) {
    var result = Math.random() * range - range / 2;
    return result
}
function clear() {
    ctx.clearRect(0, 0, w, h);
}
function setUpCanvas() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = w;
    canvas.height = h;
    canvas.style.border = "3px solid blue";
}
// OBJECT INTERACTION
function torus(o) {
    if (o.x > w) {
        o.x = 0;
    }
    if (o.x < 0) {
        o.x = w;
    }
    if (o.y > h) {
        o.y = 0;
    }
    if (o.y < 0) {
        o.y = h;
    }
}
function bounce(o) {
    if (o) {
        if (o.x > w || o.x < 0) {
            console.log("bounce");
            o.change.x *= -1;
        }
        if (o.y > h || o.y < 0) {
            o.change.y *= -1;
        }
    }
}

// SCOREBOARD, TIMER & GAME OVER
function drawscore(s) {
    ctx.beginPath()
    ctx.font = "40px Helvetica";
    ctx.fillStyle = "blue";
    ctx.fillText(s, 100, 100);
}
function drawtimer(c) {
    ctx.beginPath()
    ctx.font = "40px Helvetica";
    ctx.fillStyle = "blue";
    ctx.fillText(c, w - 100, 100);
}
function drawgameover() {
    ctx.beginPath()
    ctx.font = "100px Helvetica";
    ctx.fillStyle = "blue";
    ctx.fillText("GAME OVER", (w / 2) - 300, h / 2);
}
function counter(incrementValue, startValue) {
    var count = startValue;
    return {
        increment: increment,
        getCount: getCount
    }

    function increment() {
        count += incrementValue;
    }

    function getCount() {
        return count
    }
}

console.log("final");
