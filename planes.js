var res = [ 3, 9, 27, 81, 243, 729, 2187, 6561, 19683, 59049 ];
var maxInterval = 4;
var width = res[maxInterval-1];  //  L4 needs 55 pixels
var scale = 5;

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

// use the Sierpinski carpet to generate the 3D planes of a Menger sponge
function calculateSpongePlanes(){
    // for (let z = 0; z < Math.round(width/2); z++) {
    for (let z = 0; z < width; z++) {
        let currentCanvas = document.createElement("canvas");
        currentCanvas.width = currentCanvas.height = width*scale;
        currentCanvas.id = "canvas"+z;

        document.body.appendChild(currentCanvas);

        // "a", id: "saveButton", events:[{type: "click", fn: saveSprite}], innerText: "Download Sprite", classes: ["button"]}));

        let currentCtx = currentCanvas.getContext("2d");
        currentCtx.fillStyle = "#FFFFFF";

        for (let x = 0; x < width; x++) 
        for (let y = 0; y < width; y++) {
            let pixelData1=ctx1.getImageData(x,y,1,1);
            let pixelData2=ctx1.getImageData(x,z,1,1);
            let pixelData3=ctx1.getImageData(z,y,1,1);
            if ( !(pixelData1.data[0] || pixelData2.data[0] || pixelData3.data[0]) ) {
                currentCtx.fillRect( x*scale, y*scale, scale, scale );
            }
        }
    }
}


