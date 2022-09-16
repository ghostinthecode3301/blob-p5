let points = []
let vectors = []
let numbers = []
let keys = []

function setup() {

    createCanvas(1000, 1000);
    frameRate(1)
    coordinates(10, 100)
    translate(200, 200)
    background(0)

        for (let point = 0; point <= (points.length - 4); point += 2) {
            k = new KochFractal(points[point], points[point + 1], points[point + 2], points[point + 3]);
            keys.push(k)
        }
}

function draw() {
    translate(200, 200)
    background(0)


    for (let i = 0; i < keys.length; i++) {
        keys[i].render()
    }
    for (let i = 0; i < keys.length; i++) {
        keys[i].nextLevel()
    }

    for (let i = 0; i < keys.length; i++) {
        if (keys[i].getCount() > 10) {
            keys[i].restart();
        }
    }

}

function coordinates(pointsNumber, radius) {
    for (let angle = 0; angle <= TWO_PI; angle += TWO_PI / pointsNumber) {

        let r = radius
        let x = r * cos(angle)
        let y = r * sin(angle)
        // push()
        // strokeWeight(5)
        // //stroke(255)
        // point(x, y)
        // pop()
        points.push(x)
        points.push(y)
    }
}

function normalD (min, max, skew = 1) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )

    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) {
        num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
    } else {
        num = Math.pow(num, skew) // Skew
        num *= max - min // Stretch to fill range
        num += min // offset to min
    }
    return num
}

class KochLine {
    constructor(a,b) {
        // Two p5.Vectors,
        // start is the "left" p5.Vector and
        // end is the right p5.Vector
        this.start = a.copy();
        this.end = b.copy();
    }

    display() { // just drawing the line, not CSS bullshit!!!!!
        stroke(255);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    kochA() {
        return this.start.copy();
    }

    // More complicated, have to use a little trig to figure out where this p5.Vector is!
    kochC() {
        let a = this.start.copy(); // Start at the beginning
        let v = p5.Vector.sub(this.end, this.start);
        v.div(2);
        a.add(v);  // Move to point B
        v.rotate(-PI/3 * normalD(0, 2)); // Rotate 60 degrees
        v.mult(normalD(0, 2))
        let angle = a.angleBetween(v)

        console.log(angle)
        a.add(v);  // Move to point C
        return a;
    }

    kochE() {
        return this.end.copy();
    }
}

// A class to manage the list of line segments in the snowflake pattern

class KochFractal {
    constructor(x1, x2, x3, x4) {
        this.start = createVector(x1, x2); // A p5.Vector for the start
        this.end = createVector(x3, x4); // A p5.Vector for the end
        this.lines = []; // An array to keep track of all the lines
        this.count = 0;
        this.restart();
    }

    nextLevel() {
        // For every line that is in the arraylist
        // create 4 more lines in a new arraylist
        this.lines = this.iterate(this.lines);
        this.count++;
    }

    restart() {
        this.count = 0;      // Reset count
        this.lines = [];  // Empty the array list
        this.lines.push(new KochLine(this.start, this.end));  // Add the initial line (from one end p5.Vector to the other)
    }

    getCount() {
        return this.count;
    }

    // This is easy, just draw all the lines
    render() {
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].display();
        }
    }

    // This is where the **MAGIC** happens
    // Step 1: Create an empty arraylist
    // Step 2: For every line currently in the arraylist
    //   - calculate 4 line segments based on Koch algorithm
    //   - add all 4 line segments into the new arraylist
    // Step 3: Return the new arraylist and it becomes the list of line segments for the structure

    // As we do this over and over again, each line gets broken into 4 lines, which gets broken into 4 lines, and so on. . .
    iterate() {
        let now = [];    // Create emtpy list
        for (let i = 0; i < this.lines.length; i++) {
            let l = this.lines[i]; // so we have line
            // Calculate 5 koch p5.Vectors (done for us by the line object)
            let a = l.kochA(); // start
          //  let b = l.kochB(); // 1/3 of our line
            let c = l.kochC(); // point at the top
           // let d = l.kochD(); // 2/3 of our line
            let e = l.kochE(); // end
            // Make line segments between all the p5.Vectors and add them
            now.push(new KochLine(a, c));
            now.push(new KochLine(c, e));
        }
        return now;
    }
}