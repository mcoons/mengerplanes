// This is used to generate the initial planes used for the sponge script
// It currently calculates the planes needed for an L4 sponge

var res = [ 3, 9, 27, 81, 243, 729, 2187, 6561, 19683, 59049 ];
var maxInterval = 4;
var width = res[maxInterval-1];  //  L4 needs 55 pixels
var scale = 5;

// the layers repeat and some layers are not needed
var neededPlanes = [0,3,9,12,27,30,36,39]

canvas1 = document.createElement("canvas");
canvas1.width = canvas1.height = width;
document.body.appendChild(canvas1);

ctx1 = canvas1.getContext("2d");
ctx1.fillStyle = "#FF0000";

pokeHoles(0, 0, width, width, 1);
calculateSpongePlanes();

canvas1.remove();
delete canvas1;
delete ctx1;

// recursively build a Sierpinski carpet
// x1,y1 - top left
// x2,y2 - bottom right
// interval - current recursive interval
function pokeHoles(x1,y1,x2,y2,interval){
    var w = x2-x1;
    var w3 = w/3;
    
    ctx1.fillRect(x1+w3, y1+w3, w3, w3);
    
    if (interval >= maxInterval) {
        return;
    } else {
        // setTimeout( function(){
            pokeHoles(x1, y1, x1+w3, y1+w3, interval+1);
            pokeHoles(x1+w3, y1, x1+2*w3, y1+w3, interval+1);
            pokeHoles(x1+2*w3, y1, x2, y1+w3, interval+1);
            
            pokeHoles(x1+2*w3, y1+w3, x2, y1+2*w3, interval+1);
            
            pokeHoles(x1+2*w3, y1+2*w3, x2, y2, interval+1);
            pokeHoles(x1+w3, y1+2*w3, x1+2*w3, y2, interval+1);
            pokeHoles(x1, y1+2*w3, x1+w3, y2, interval+1);
            
            pokeHoles(x1, y1+w3, x1+w3, y1+2*w3, interval+1);
        // } ,1);
    }
}

// use the 2D Sierpinski carpet to generate the 3D layers of a Menger sponge
// only calculating the necessary layers
function calculateSpongePlanes(){
    for (let zindex = 0; zindex < neededPlanes.length; zindex++) {
        let currentCanvas = document.createElement("canvas");
        currentCanvas.width = currentCanvas.height = width*scale;
        currentCanvas.id = "canvas"+neededPlanes[zindex];

        document.body.appendChild(currentCanvas);

        let currentCtx = currentCanvas.getContext("2d");
        currentCtx.fillStyle = "#FFFFFF";
        currentCtx.globalAlpha = 0.0;
        currentCtx.fillRect( 0, 0, width*scale, width*scale );

        currentCtx.globalAlpha = 1.0;

        for (let x = 0; x < width; x++) 
        for (let y = 0; y < width; y++) {
            let pixelData1=ctx1.getImageData(x,y,1,1);
            let pixelData2=ctx1.getImageData(x,neededPlanes[zindex],1,1);
            let pixelData3=ctx1.getImageData(neededPlanes[zindex],y,1,1);
            if ( !(pixelData1.data[0] || pixelData2.data[0] || pixelData3.data[0]) ) {
                currentCtx.fillRect( x*scale, y*scale, scale, scale );
            }
        }
    }
}


