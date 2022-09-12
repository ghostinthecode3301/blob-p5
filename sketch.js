function setup() {

    createCanvas(1000, 1000)
    blobby(200, 200)

}

function draw() {

}

function blobby(xCoordinate, yCoordinate) {
    push()

    noStroke()
    translate(xCoordinate, yCoordinate)

    beginShape()

    fill(120, 75, 100, 200)

    for (let angle = 0; angle <= TWO_PI; angle += TWO_PI / 10) {
        let r = 100
        let x = r * cos(angle)
        let y = r * sin(angle)

        vertex(x, -y)
    }

    endShape()
    pop()
}