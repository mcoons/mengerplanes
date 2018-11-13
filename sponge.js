window.addEventListener('DOMContentLoaded', function(){
        
    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');
    
    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);
    
    // createScene function that creates and return the scene
    var createScene = function(){
        var meshes = [];
        // create a basic BJS Scene object
        var scene = new BABYLON.Scene(engine);

        var multimat = new BABYLON.MultiMaterial('multi', scene);

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 70, -100), scene);

        // target the camera to scene origin
        camera.setTarget(new BABYLON.Vector3(0,15,0));

        // attach the camera to the canvas
        camera.attachControl(canvas, false);

        // create basic lights, aiming 0,1,0 - meaning, to the sky
        var hlight3 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,1), scene);

        hlight3.intensity = .3;

        var plight1 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(5600, 600, 5600), scene);
        var plight2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(-5600, -5600, -5600), scene);
        var plight3 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(5600, 5600, 0), scene);

        plight1.intensity = .5;
        plight2.intensity = .4;
        plight3.intensity = .3;

        plight1.diffuse = new BABYLON.Color3(1, .5, .5);
        plight2.diffuse = new BABYLON.Color3(.5, 1, .5);
        plight3.diffuse = new BABYLON.Color3(.2, .2, 1);

        // var greenMat = new BABYLON.StandardMaterial("green", scene);
        // greenMat.diffuseColor = BABYLON.Color3.Blue();

        // var mat1 = new BABYLON.StandardMaterial("mat1", scene);

        buildMats(scene);
        buildSpongePlanes(scene, meshes, multimat);
        
        // finalSponge.material = multimat;
        // for (let index = 0; index < finalSponge.subMeshes.length/3; index++) {
        //     finalSponge.subMeshes[index].materialIndex = index;
        //     finalSponge.subMeshes[index+finalSponge.subMeshes.length/3].materialIndex = index;
        //     finalSponge.subMeshes[index+finalSponge.subMeshes.length/3+finalSponge.subMeshes.length/3].materialIndex = index;
        // }

        
        var convertToFlat = function () {
            for (var index = 0; index < scene.textures.length; index++) {
                scene.textures[index].updateSamplingMode(BABYLON.Texture.NEAREST_LINEAR);
            }
        }
        
        // console.log(scene);
        // console.log(finalSponge);

        scene.executeWhenReady(function() {
            convertToFlat();
        });
    
        // return the created scene
        return scene;
    }

    // call the createScene function
    var scene = createScene();

    // run the render loop
    engine.runRenderLoop(function(){
        scene.render();
        // console.log("indices:", scene.getActiveIndices())
        // console.log("meshes:", scene.getActiveMeshes())
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
});

let mats = [];

function buildMats(scene){
    for (let m = 0; m < 8; m++){
        let myMaterial = new BABYLON.StandardMaterial(`material${m}`, scene);
        myMaterial.diffuseTexture = new BABYLON.Texture(`./${m}.png`, scene);
        myMaterial.backFaceCulling = false;
        myMaterial.diffuseTexture.hasAlpha = true;    
        mats.push(myMaterial)
    }
    console.log(mats)
}


function buildSpongePlanes(scene, meshes, multimat){

    // map each plane to the correct texture
    planeMapping = [0,0,0,0,1,1,0,0,0,
                    0,2,2,2,3,3,2,2,2,
                    0,0,0,0,1,1,0,0,0,
                    0,4,4,4,5,5,4,4,4,
                    4,6,6,6,7]

    for (let i = 0; i <= 81; i++){

        var myMaterial;
        
        if (i <= 40)
            myMaterial = mats[planeMapping[i]];
        else
            myMaterial = mats[planeMapping[81-i]];
        
        let myXPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 81, height: 81}, scene);
        myXPlane.material = myMaterial;        
        myXPlane.rotation.y = Math.PI/2;
        myXPlane.position = new BABYLON.Vector3(i-40.5, 0, 40.5);
        myXPlane.name = `xPlane${i}`;
        meshes.push(myXPlane);  

        let myYPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 81, height: 81}, scene);
        myYPlane.material = myMaterial;        
        myYPlane.rotation.x = Math.PI/2;
        myYPlane.position = new BABYLON.Vector3(0, i-40.5, 40.5);
        myYPlane.name = `yPlane${i}`;
        meshes.push(myYPlane);  

        let myZPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 81, height: 81}, scene);
        myZPlane.material = myMaterial;
        myZPlane.position = new BABYLON.Vector3(0, 0, i);
        myZPlane.name = `zPlane${i}`;
        meshes.push(myZPlane);  

    }
}