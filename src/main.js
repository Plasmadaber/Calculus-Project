
const graphWidth = 1000;
const graphHeight = 600;
const graphOffset = 2;
const amountOfVertLines = 10;
const amountOfHorzLines = 6;
const tolerance = .2;
const rectFillColor = "rgb(65 163 255 / 0.85)";
const rectLineColor = "#005cff";
const graphCanvas = new fabric.Canvas('graphCanvas',{
    width: graphWidth,
    height: graphHeight+(2*graphOffset)
});

graphCanvas.freeDrawingBrush.width = 4;

let lines = [];
for (let i = 0; i < amountOfVertLines; i++) {
    if (i === 0){
        let line = new fabric.Line([(graphWidth/amountOfVertLines)*i + graphOffset, graphHeight, (graphWidth/amountOfVertLines)*i + graphOffset, graphOffset],{
            stroke: 'black',
            strokeWidth: 4,
            selectable: false
        })
        lines.splice(0,0, line);
    }
    else{
        let line = new fabric.Line([(graphWidth/amountOfVertLines)*i + graphOffset, graphHeight, (graphWidth/amountOfVertLines)*i + graphOffset, graphOffset],{
            stroke: 'grey',
            strokeWidth: 2,
            selectable: false
        })
        lines.push(line);
    }
}

for (let i = 1; i <= amountOfHorzLines; i++) {
    if (i === amountOfHorzLines){
        let line = new fabric.Line([graphOffset, (graphHeight/amountOfHorzLines)*i, graphWidth, (graphHeight/amountOfHorzLines)*i],{
            stroke: 'black',
            strokeWidth: 4,
            selectable: false
        })
        lines.splice(1, 0, line);
    }
    else{
        let line = new fabric.Line([graphOffset, (graphHeight/amountOfHorzLines)*i, graphWidth, (graphHeight/amountOfHorzLines)*i],{
            stroke: 'grey',
            strokeWidth: 2,
            selectable: false
        })
        lines.push(line);
    }


}


const graph = new fabric.Group(lines)
lines.at(0).bringToFront();
graphCanvas.add(graph);


const clearBtn = document.getElementById("clearBtn");
const calcBtn = document.getElementById("calcBtn");
const rectSlider = document.getElementById("rectSlider");
const rectLabel = document.getElementById("rectCount");
const outputText = document.getElementById("output");


clearBtn.addEventListener("click", () => {
    graphCanvas.clear();
    rawPoints = [];
    graphCanvas.add(graph);
    visuals = null;
    rects = [];
    riemRect = [];
});

let visuals = null;
calcBtn.addEventListener("click", () => {
    if(visuals !== null){
        graphCanvas.remove(visuals);
        rects = [];
        riemRect = [];
    }
    graphCanvas.remove(visuals);
    if (isFunction(rawPoints, 5)) {
        let sum = calcRiemannSums()
        outputText.textContent = sum;
        visuals = drawRects();
        graphCanvas.add(visuals);
    }
    else{
        outputText.textContent = "Error not function";
    }

})

rectSlider.addEventListener("input", () => {
    rectLabel.textContent = rectSlider.value;
})



graphCanvas.interactive = false;
graphCanvas.selection = false;
graphCanvas.isDrawingMode = true;

let rawPoints = [];
graphCanvas.on('mouse:move', function (e) {
    if (graphCanvas.isDrawingMode && e.e.buttons === 1) {
        let pointer = graphCanvas.getPointer(e.e);
        rawPoints.push({ x: pointer.x, y: pointer.y });
    }
})

function isFunction(points, yTolerance = 20) {
    let xMap = new Map();

    for (let p of points) {
        let xKey = Math.round(p.x);
        if (xMap.has(xKey)) {
            if (Math.abs(xMap.get(xKey) - p.y) > yTolerance) {
                return false;
            }
        } else {
            xMap.set(xKey, p.y);
        }
    }
    return true;
}

function pixelToGraph(pixel){
    let Px = pixel.x;
    let Py = graphHeight - pixel.y +4;
    //console.log({gX: (Px/graphWidth)*amountOfVertLines, gY: (Py/graphHeight)*amountOfHorzLines});
    return {gX: (Px/graphWidth)*amountOfVertLines, gY: (Py/graphHeight)*amountOfHorzLines};
}

let riemRect = [];
function calcRiemannSums() {
    let graphPoints = [];
    let sum = 0;

    for (const point of rawPoints) {
        graphPoints.push(pixelToGraph(point));
    }

    graphPoints.sort((a, b) => a.gX - b.gX);

    const startPoint = graphPoints[0];
    const endPoint = graphPoints[graphPoints.length - 1];
    const stepSize = (endPoint.gX - startPoint.gX) / rectSlider.value;

    riemRect = [stepSize];
    rects = [];
    let searchStart = 0;

    for (let i = 0; i < rectSlider.value; i++) {
        let xPos = startPoint.gX + stepSize * i;

        for (let j = searchStart; j < graphPoints.length - 1; j++) {
            if (graphPoints[j].gX <= xPos && graphPoints[j + 1].gX >= xPos) {
                let yValue;
                if (graphPoints[j + 1].gX - graphPoints[j].gX === 0) {
                    yValue = graphPoints[j].gY;
                } else {
                    let t = (xPos - graphPoints[j].gX) / (graphPoints[j + 1].gX - graphPoints[j].gX);
                    yValue = graphPoints[j].gY + t * (graphPoints[j + 1].gY - graphPoints[j].gY);
                }
                sum += stepSize * yValue;
                riemRect.push({ x: xPos, y: yValue });
                searchStart = j;
                break;
            }
        }
    }

    return sum;
}

function graphToPixel(gX, gY) {
    return {
        x: (gX / amountOfVertLines) * graphWidth,
        y: graphHeight - (gY / amountOfHorzLines) * graphHeight
    };
}


let rects = [];
function drawRects() {
    let stepPixelWidth = (riemRect[0] / amountOfVertLines) * graphWidth;

    for (let i = 1; i < riemRect.length; i++) {
        let pos = graphToPixel(riemRect[i].x, riemRect[i].y);
        console.log(pos)
        let rect = new fabric.Rect({
            left: pos.x,
            top: pos.y,
            width: stepPixelWidth,
            height: (riemRect[i].y / amountOfHorzLines) * graphHeight,
            fill: rectFillColor,
            stroke: rectLineColor,
            originX: "left",
            originY: "top"
        });
        rects.push(rect);
    }
    return new fabric.Group(rects);
}






