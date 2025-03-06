var canvas;
var ctx;
var w = 1000;
var h = 700;
var allFood = [];
var allCircles = [];
var allSquares = [];
var o = {};
var b = {};
var timer = counter(-1, 30);
var score = counter(1, 0);

foodData(20, allFood);
rectData(15, allSquares);

setInterval(function () {
    timer.increment();
    console.log(timer.getCount());
}, 1000);
setInterval(function () {
    updateCircleData(o);
    createDataWithXY(1, allCircles, o);
}, 20);

document.getElementById("myCanvas").onmousemove = function (e) {
    //set the x and y coordnates of the object (o) to the to the x and y coordinates of the cursor events. if e.offset is undefined, e.client is refferenced.
    o.x = e.offsetX || e.clientX;
    o.y = e.offsetY || e.clientY;
};

setUpCanvas();
animationLoop();

function animationLoop() {
    clear();
    drawtimer(timer.getCount());
    drawscore(score.getCount());

    //conditoinal statement for when game is animated to screen
    if (timer.getCount() > 0) {
        requestAnimationFrame(animationLoop);
    } else {
        clear();
        drawgameoverscore(score.getCount());
        drawgameover();
    }

    for (var i = 0; i < allCircles.length; i++) {
        circle_arc(allCircles[i]);
        updateCircleData(allCircles[i]);
    }

    //change anonymous variable "i" to "j" to avoid confusion
    for(var j=0; j<allFood.length; j++){
        circle_arc_food(allFood[j]);
        updateFoodData(allFood[j]);
        bounce(allFood[j]);
        collision_food(allCircles[j],allFood[j]); 
    }

    for (var l = 0; l < allSquares.length; l++) {
        //opperations to call bomb movements in outter for loop
        rectBomb(allSquares[l]);
        updateRectData(allSquares[l]);
        torus(allSquares[l]);

        // bomb & worm collision function within the inner for loop iterating over array of square bombs
        for (var i = 0; i < allCircles.length; i++) {
            // Check if both circle and square exist before calling collision_bomb function
            if (allCircles[i] && allSquares[l]) {
                if (collision_bomb(allCircles[i], allSquares[l])) {
                } //If a collision is detected, it executes the block inside the if statement
            }
        }
    }

}

// BOMB & WORM COLLISION
function collision_bomb(circle, square) {
    var differenceX = Math.abs(circle.x - square.x);
    var differenceY = Math.abs(circle.y - square.y);

    if (differenceX > square.w / 2 + circle.r || differenceY > square.h / 2 + circle.r) {
        // No collision
        return false;
    }

    if (differenceX <= square.w / 2 || differenceY <= square.h / 2) {
        // Collision detected
        var index = allSquares.indexOf(square);
        square.c += 250;
        square.h += randn(1);
        square.change.y +=0.01
        // square.x = rand(w);
        circle.c += 250;
        circle.change.r +=0.001;
        console.log("Collision between circle and square!");
        return true; // Return true to indicate a collision
    }

    return false;
}



//BOMBS
function rectBomb(b){
    var x =b.x;
    var y =b.y;
    b.x=b.x-b.w/2;
    b.y=b.y-b.h/2
    ctx.beginPath();
    ctx.moveTo(b.x+rand(b.random),b.y+rand(b.random))
    ctx.lineTo(b.x+b.w+rand(b.random),b.y+rand(b.random))
    ctx.lineTo(b.x+b.w+rand(b.random),b.y+b.h+rand(b.random))
    ctx.lineTo(b.x+rand(b.random),b.y+b.h+rand(b.random))
    ctx.closePath();
    ctx.fillStyle="hsla("+b.c+",100%,50%,"+b.a+")";
    ctx.fill();
    b.x = x;
    b.y = y;
}
function rectData(num, array){
    for(var i=0; i<num; i++){
        //push to allShapes array
        array.push({
            x: rand(w),
            y: rand(h),
            w: rand(5)+2,
            h: rand(50)+10,
            c: 260,
            a: 0.75,
            lw: 0,
            random: 0,
            change: {
                x: 0, 
                y: 1,
                w: 0,
                h:0,
                c: randn(0.1),
                a: 0,
                lw: 0,
                random:0,
                },
        })
    }
}
function updateRectData(b){
    b.x+=b.change.x;
    b.y+=b.change.y;
    b.w+=b.change.w;
    b.h+=b.change.h;
    b.c+=b.change.c;
    b.a+=b.change.a;
    b.lw+=b.change.lw;
}

//FOOD & WORM COLLISION
//collision method checks for colision between circles of worm array and circles of food array. if collision is detected, a response is excecuted.
function collision_food(o,o1){
    //nested for loop iterates through each combination of array items
    for (var i = 0; i < allCircles.length; i++) {
        for (var j = 0; j < allFood.length; j++) {
            //variables o and o1 assigned to index of each array
            var o = allCircles[i];
            var o1 = allFood[j];

            var differenceX = Math.abs(o.x - o1.x);
            var differencyY = Math.abs(o.y - o1.y);
    var hdif = Math.sqrt((differenceX*differenceX)+differencyY*differencyY); 
    //if the hypotenuse difference is < both radii
    if(hdif < o.r+o1.r){
        if(differenceX < differencyY){
            //change food disappearing method from subtracting radius to array(slice) method 
            index = allFood.indexOf(o1); 
            allFood.splice(index,1); 
            o.r += 10;
            //add score increment
            score.increment(); 
        }else{
            //leaving this function in so that some food annoyingly bounces off worm upon contact...
            o.x -= o.change.x; 
            o1.x -= o1.change.x; 
            o.change.x *= -1; 
            o1.change.x *= -1; 
        }
        console.log("collision?")
        }
     }
    }
}

//FOOD
function circle_arc_food(o) {
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, 2 * Math.PI);
    ctx.lineWidth = o.lw;
    ctx.strokeStyle = "hsla(" + o.c + ", 100%, 50%, " + o.a + ")";
    ctx.stroke(); 
}
function foodData(num, array){
    for(var i=0; i<num; i++){
        //push to allShapes array
        array.push({
            x: w/2,
            y: h/2,
            r: rand(20),
            c: 260,
            a: 0.75,
            lw: rand(10),
            change: {
                x: randn(5), 
                y: randn(5),
                r: 0,
                c: randn(0.1),
                a: 0,
                lw: 0,
                },
        })
    }
}
function updateFoodData(o){
    o.x+=o.change.x;
    o.y+=o.change.y;
    o.r+=o.change.r;
    o.c+=o.change.c;
    o.a+=o.change.a;
    o.lw+=o.change.lw;
}

// WORM
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
            change: { x: 0, y: 0, r: 0, c: 1, a: -0.0025},
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
    ctx.fillText("GAME OVER!", (w / 2) - 300, h / 2);
}
function drawgameoverscore(s) {
    ctx.beginPath()
    ctx.font = "70px Helvetica";
    ctx.fillStyle = "blue";
    ctx.fillText("SCORE:", (w / 2) - 200, 3*(h/4));
    ctx.fillText(s, (w / 2)+100 , 3*(h/4));
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
