var canvas;
var ctx;
var w = 1000;
var h = 700;
var allCircles = [];
// delete eventStates so that the worm does not become false after the mouse moves off the canvas
// var eventStates = {
//     onmouseover: false
// };
var o = [];

var timer = counter(-1, 30);
var score = counter(1, 0);

setInterval(function () {
    timer.increment();
    console.log(timer.getCount());
}, 1000);

setInterval(function () {
    updateCircleData(o);
    createDataWithXY(1, allCircles, o);
}, 30);

// document.getElementById("myCanvas").onmouseover = function () {
//     eventStates.onmouseover = !eventStates.onmouseover;
// };

document.getElementById("myCanvas").onmousemove = function (e) {
    // if (eventStates.onmouseover) {
        //set the x and y coordnates of the object (o) to the to the x and y coordinates of the cursor events. if e.offset is undefined, e.client is refferenced.
        o.x = e.offsetX || e.clientX;
        o.y = e.offsetY || e.clientY;
    // }
};

setUpCanvas();
animationLoop();

function animationLoop() {
    clear();
    drawtimer(timer.getCount());
    drawscore(score.getCount());

    if (timer.getCount() > 0) {
        requestAnimationFrame(animationLoop);
    } else {
        clear();
        drawtimer(timer.getCount());
        drawscore(score.getCount());
        drawgameover();
    }

    for (var i = 0; i < allCircles.length; i++) {
        circle_arc(allCircles[i]);
        updateCircleData(allCircles[i]);
    }
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
            a: 1,
            randomness: 0,
            change: { x: 0, y: 0, r: 0, c: 1, a: -0.003, randomness: 0 },
        });
    }
}

// update properties of each circle in the allCircles array
function updateCircleData(o) {
    // for loop iterates changes of properties over each element in the allCircles array
    for (var i = 0; i < allCircles.length; i++) {
        allCircles[i].x += allCircles[i].change.x;
        allCircles[i].y += allCircles[i].change.y;
        allCircles[i].r += allCircles[i].change.r;
        allCircles[i].c += allCircles[i].change.c;
        allCircles[i].a += allCircles[i].change.a;
        allCircles[i].randomness += allCircles[i].change.randomness;
    }

    // Filters and removes circles with a less than 0 in the allCircles array
    allCircles = allCircles.filter(function (circle) {
        return circle.a >= 0;
    });
}

// SET DATA
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
