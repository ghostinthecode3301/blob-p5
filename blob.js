function setup() {
    createCanvas(1080, 2340)
    background(255)

        blob(20, 16, 200, width / 2, height / 2, random(360))

}

function blob(numberOfVertices, numberOfIterations, radius, x = 50, y = 50, hue = 120) {
    translate(x, y)

    let points = coordinates(numberOfVertices, radius);
    let lines = makingVectorLines(points)
    let newPoints = []

    for (let i = 0; i < numberOfIterations; i++) {
        // static deformation degree

        for (let i = 0; i < lines.length; i++) {

            let buffer = []
            buffer = lines[i].getPoints()  //recording coordinates of each line(deformed or not) inna buffer

            for (let i = 0; i < buffer.length; i++) {
                newPoints.push(buffer[i].x) // all the points gonna be here
                newPoints.push(buffer[i].y)
            }
        }

        blobDrawing(newPoints, hue)

        for (let i = 0; i < lines.length; i++) {
            lines[i].nextLevel()
        }

        newPoints = []
    }
}

function blobDrawing (coordinates, h, s = normalD(80, 100), b = normalD(50, 100)) {
    colorMode(HSB)

    beginShape()
    noStroke()
    fill(h, s, b, 0.03)

    for (let i = 0; i < coordinates.length; i += 2) {
        vertex(coordinates[i], coordinates[i + 1])
        //line(coordinates[i], coordinates[i + 1], coordinates[i + 2], coordinates[i + 3])
    }

    endShape()
}

function coordinates(numberOfVertices, radius) {
    let result = []
    for (let angle = 0; angle <= TWO_PI; angle += TWO_PI / numberOfVertices) {

        let r = radius * normalD(0, normalD(0, 2))
        let x = r * cos(angle)
        let y = r * sin(angle)

        result.push(x)
        result.push(y)
    }
    let lastX = result[0]
    let lastY = result[1]

    result.splice(result.length - 2, 2)

    result.push(lastX)
    result.push(lastY)

    return result;
}

class KochLine {
    constructor(a,b) {
        // Two p5.Vectors,
        // start is the "left" p5.Vector and
        // end is the right p5.Vector
        this.start = a.copy();
        this.end = b.copy();
    }

    kochA() {
        return this.start.copy();
    }

    kochB() {

        let a = this.start.copy(); // Start at the beginning
        let v = p5.Vector.sub(this.end, this.start);

        v.div(2 * normalD(0, 2));
        a.add(v);
        v.rotate(-PI/3 * normalD(0, normalD(0, 4)))
        v.mult(normalD(0, 1.8))

        a.add(v);
        return a;
    }

    kochC() {
        return this.end.copy();
    }
}

// A class to manage the list of line segments in the snowflake pattern

class KochFractal {
    constructor(x1, x2, x3, x4) {
        this.start = createVector(x1, x2); // A p5.Vector for the start
        this.end = createVector(x3, x4); // A p5.Vector for the end
        this.lines = []; // An array to keep track of all the lines
        this.restart();
    }
    nextLevel() {
        // Makes a new point with help of normal dispersion
        this.lines = this.iterate(this.lines);
        this.count++;
        //console.log(this.count)
    }
    getPoints() {
        let points = []
        for (let i = 0; i < this.lines.length; i++) {
            let l = this.lines[i]

            let a = l.kochA(); // start
            let b = l.kochB(); // point at the top
            let c = l.kochC(); // end

            points.push(a)
            points.push(b)
            points.push(c)
            //console.log(a, b, c)
        }
        return points
    }
    restart() {
        this.count = 0;      // Reset count
        this.lines = [];  // Empty the array list
        this.lines.push(new KochLine(this.start, this.end));  // Add the initial line (from one end p5.Vector to the other)
    }
    getCount() {
        return this.count;
    }
    render() {
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].display();
        }
    }
    iterate() {
        let now = [];    // Create emtpy list
        for (let i = 0; i < this.lines.length; i++) {
            let l = this.lines[i]; // so we have line

            let a = l.kochA(); // start
            let b = l.kochB(); // point at the top
            let c = l.kochC(); // end

            now.push(new KochLine(a, b));
            now.push(new KochLine(b, c));
        }
        return now;
    }
}


function normalD (min, max, skew = 1) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

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

function makingVectorLines(points) {
    let result = []

    for (let point = 0; point <= (points.length - 4); point += 2) {
        k = new KochFractal(points[point], points[point + 1], points[point + 2], points[point + 3]);
        result.push(k)
    }

    return result;
}

function randn_bm(min, max, skew) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )

    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0)
        num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range

    else{
        num = Math.pow(num, skew) // Skew
        num *= max - min // Stretch to fill range
        num += min // offset to min
    }
    return num
}