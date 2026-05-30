
const graphWidth = 1000;
const graphHeight = 600;
const graphOffset = 2;
const amountOfVertLines = 10;
const amountOfHorzLines = 6;
const graphCanvas = new fabric.Canvas('graphCanvas',{
    width: graphWidth,
    height: graphHeight+(2*graphOffset)
});

graphCanvas.freeDrawingBrush.width = 4;

let lines = [];
for (let i = 0; i < amountOfVertLines; i++) {
    if (i == 0){
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
    if (i == amountOfHorzLines){
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


clearBtn.addEventListener("click", () => {
    graphCanvas.clear();
    rawPoints = [];
    graphCanvas.add(graph);
});

calcBtn.addEventListener("click", () => {


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

function isFucntion(){
    rawPoints.sort((a, b) => a.x - b.x);
    let seenPoints = [];
    for (const point of rawPoints){
        for(const p of seenPoints){
            if(point.x != p.x){
                seenPoints.push(point);
            }
            else{
                if(Math.abs(p.y-point.y) > 4){
                    return false;
                }
            }
        };
    };
    return true;
}

function pixelToGraph(pixel){
    let Px = pixel.x;
    let Py = graphHeight - pixel.y + 4;
    return {gX: (Px/graphWidth)*amountOfVertLines, gY: (Py/graphHeight)*amountOfHorzLines};
}

function calcRiemannSums(){
    let graphPoints = [];
    for (const point of rawPoints){
        graphPoints.push(pixelToGraph(point));
    }
    const size = graphPoints.length;
    const startPoint = graphPoints.at(0);
    const endPoint = graphPoints.at(size-1);

}





