"use strict"

const mouse = {
    x: null,
    y: null,
    click: false
}

const nodes = [];
const maxDepth = 3;
let depth = 0;
let rootNode;
let numOfContractions = 0;
let currSelected = null;
let z = true;

// let tree = [5, 6, 9, 10, 4, 12, 11, 3, 20, 2, 7, 2, 14, 9, 10, 12, 13];
// let tree = [5, 6, 9, 10, 4, 12, 11, 3, 20, 2, 7, 2, 14, 9, 10, 12, 13, 3, 5, 84, 6, 4, 12, 67, 7, 23, 15, 11, 16, 44, 22];
let tree = [8, 21, 17];

// let alignSlider, cohesionSlider, separationSlider, obsRadiSlider;
document.addEventListener("mousedown", function() {
    mouse.click = true;
    console.log(mouseX, mouseY);
    z = true;
    console.log(currSelected);
});
document.addEventListener('mouseup', function() {
    mouse.click = false;
});

async function setup() {
    createCanvas(window.innerWidth - 50, window.innerHeight - 50);
    let canvas = document.getElementById("defaultCanvas0");
    let canvasPosition = canvas.getBoundingClientRect();
    document.addEventListener('mousemove', function(event) {
        mouse.x = event.x - canvasPosition.left;
        mouse.y = event.y - canvasPosition.top;
    });


    background('lightblue');
    // textSize(30);
    textAlign(CENTER);

    // alignSlider = createSlider(0, 5, 1, 0.1);
    // cohesionSlider = createSlider(0, 5, 1, 0.1);
    // separationSlider = createSlider(0, 5, 1.2, 0.05);
    // obsRadiSlider = createSlider(10, 30, 1, 5);

    createTree(null, null, 30);
    drawTree(rootNode, 30);
    console.log(rootNode);
}

function draw() {
    background('lightblue');
    drawTree(rootNode, 30);

    if (currSelected === null) {
        z = 0;
    }
    textSize(30);
    fill('black');
    text(`Total number of contractions = ${numOfContractions}`, width / 2, height / 2);
    document.addEventListener('keypress', function(event) {
        if (z) {
            if (currSelected != null) {
                if (event.code === 'KeyA') {
                    let weight = prompt("Please enter node weight");
                    if (weight != null) {
                        currSelected.weight = parseInt(weight);
                    }
                    console.log(currSelected);
                    // }
                    z = false;
                }
                if (event.code === 'KeyL') {
                    if (currSelected.children.length == 0 || currSelected.children.length == 1) {
                        console.log(currSelected);
                        let newNode = new Node(currSelected.x - 100 / currSelected.depth, currSelected.y + 40, currSelected);
                        newNode.depth = currSelected.depth + 1;
                        currSelected.children.push(newNode);
                    }
                    z = false;
                }
                if (event.code === 'KeyR') {
                    if (currSelected.children.length == 0 || currSelected.children.length == 1) {
                        let newNode = new Node(currSelected.x + 100 / currSelected.depth, currSelected.y + 40, currSelected);
                        newNode.depth = currSelected.depth + 1;
                        currSelected.children.push(newNode);
                    }
                    z = false;
                }
                if (event.code === 'KeyD') {
                    if (currSelected.children.length != 0) {
                        currSelected.children.splice(0, 1);
                    }
                    z = false;
                }
                if (event.code === 'KeyC') {
                    for (let gc of currSelected.children) {
                        currSelected.parent.children.push(gc);
                        gc.parent = currSelected.parent;
                    }
                    let i = currSelected.parent.children.indexOf(currSelected);
                    console.log(i);
                    currSelected.parent.children.splice(i, 1);
                    numOfContractions++;
                    z = false;
                }
            }
        }
    })

    document.getElementById("solvebtn").onclick = function() {
        background('lightblue');
        numOfContractions = 0;
        createMinHeap(rootNode);
        // drawTree(rootNode, 30);
        // textSize(30);
        // fill('black');
        // text(`Total number of contractions = ${numOfContractions}`, width / 2, height / 2);
        console.log(rootNode);
    };
    document.getElementById("mkbinary").onclick = function() {
        console.log("make binary");
        makeBinary(rootNode);
    };
}

function createMinHeap(parent) {
    for (let c of parent.children) {
        if (c.weight < parent.weight) {
            for (let gc of c.children) {
                parent.children.push(gc);
            }
            let i = parent.children.indexOf(c);
            parent.children.splice(i, 1);
            numOfContractions++;

            createMinHeap(parent);
        } else {
            createMinHeap(c);
        }
    }
}
let n;

function countNodes(parent) {
    n += parent.children.length;
    console.log("kiki", n)
    for (let c of parent.children) {
        countNodes(c);
    }
    return n;
}


function makeBinary(parent) {
    if (parent.children.length > 2) {
        console.log(parent.children.length - 2);
        let node1, n1max = 0;
        let node2, n2max = 0;
        for (let i = 0; i < parent.children.length; i++) {
            n = 1;
            n = countNodes(parent.children[i]);
            console.log("num nodes", n)
            if (n > n1max && n > n2max) {
                n1max = n;
                node1 = parent.children[i];
            }
            if (n >= n2max && n <= n1max && parent.children[i] != node1) {
                n2max = n;
                node2 = parent.children[i];
            }
        }
        console.log(node1, n1max, node2, n2max);
        parent.children.splice(0, parent.children.length);
        parent.children.push(node1);
        parent.children.push(node2);

    } else {
        for (let c of parent.children) {
            makeBinary(c);
        }
    }
}

function createTree(parent, side, drawHeight) {
    if (parent === null) {
        rootNode = new Node(width / 2, drawHeight, null);
        rootNode.children.push(createTree(rootNode, "left"));
        rootNode.children.push(createTree(rootNode, "right"));
        rootNode.depth = 0;
        rootNode.weight = tree[0];
        nodes.push(rootNode);
    } else {
        // console.log("creating child");
        let newNode;
        if (side === "left") {
            newNode = new Node(parent.x - 100 / parent.depth, parent.y + 40, parent);
            newNode.index = (2 * parent.index) + 1;
        }
        if (side === "right") {
            newNode = new Node(parent.x + 100 / parent.depth, parent.y + 40, parent);
            newNode.index = (2 * parent.index) + 2;
        }
        // newNode = new Node(parent.x - 40, parent.y + 40, parent);
        nodes.push(newNode);
        newNode.depth = parent.depth + 1;
        newNode.weight = tree[newNode.index];
        // console.log(newNode.depth);

        if (((2 * newNode.index) + 1) < tree.length) {
            newNode.children.push(createTree(newNode, "left"));
        }
        if (((2 * newNode.index) + 2) < tree.length) {
            newNode.children.push(createTree(newNode, "right"));
        }
        return newNode;
    }
}

function drawTree(parent, ypos) {
    parent.checkSelected();
    parent.draw(ypos);
    for (let c of parent.children)
        drawTree(c, ypos);
}

class Node {
    constructor(x, y, p) {
        this.weight = Math.floor(random(100));
        this.x = x;
        this.y = y;
        this.radius = 20;
        // this.color = [random(255), random(255), random(255)];
        this.color = [0, 0, 0];
        this.selected = false;

        this.parent = p;
        this.children = [];

        this.index = 0;
        this.depth = 1;
    }
    draw(yPosition) {
        push();
        stroke(0);
        fill(this.color[0], this.color[1], this.color[2]);
        if (this.selected) {
            fill(255, 0, 0);
        }
        circle(this.x, this.y + yPosition, this.radius);
        pop();

        for (let c of this.children) {
            push();
            line(this.x, this.y + yPosition, c.x, c.y + yPosition);
            pop();
        }

        fill('white')
        textSize(12)
        text(this.weight, this.x, this.y + yPosition + 3);
    }
    checkSelected() {
        if (Math.sqrt((this.x - mouse.x) * (this.x - mouse.x) + (this.y - mouse.y + 30) * (this.y - mouse.y + 30)) < this.radius - 10) {
            this.selected = true;
            currSelected = this;
        } else {
            if (this.selected) {
                this.selected = false;
                // currSelected = null;
            }
        }
    }
}

function sleep(millisecondsDuration) {
    return new Promise((resolve) => {
        setTimeout(resolve, millisecondsDuration);
    })
}