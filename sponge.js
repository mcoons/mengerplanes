
        // var maxInterval;  // not to exceed 6
        // const remove = [22, 16, 14, 13, 12, 10, 4];
        // const scales = [243, 81, 27, 9, 3 ,1, 1/3, 1/9];
        // const planeMap = [
        //     1,2,1,3,4,3,1,2,1,
        //     5,6,5,7,8,7,5,6,5,
        //     1,2,1,3,4,3,1,2,1,
        //     9,10,9,11,12,11,9,10,9,
        //     13,14,13,15,16,15,13,14,13,
        //     9,10,9,11,12,11,9,10,9,
        //     1,2,1,3,4,3,1,2,1,
        //     5,6,5,7,8,7,5,6,5,
        //     1,2,1,3,4,3,1,2,1        
        // ]
        // var template;
        var camera;

        window.addEventListener('DOMContentLoaded', function(){
            // get the canvas DOM element
            var canvas = document.getElementById('renderCanvas');

            // load the 3D engine
            var engine = new BABYLON.Engine(canvas, true);

            // createScene function that creates and return the scene
            var createScene = function(){
                // create a basic BJS Scene object
                var scene = new BABYLON.Scene(engine);

                // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
                camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, -600), scene);

                // target the camera to scene origin
                camera.setTarget(new BABYLON.Vector3(0,-100,0));

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

                var greenMat = new BABYLON.StandardMaterial("green", scene);
                greenMat.diffuseColor = BABYLON.Color3.Blue();

                var mat1 = new BABYLON.StandardMaterial("mat1", scene);

                buildSpongePlanes(scene);

                var convertToFlat = function () {
                    for (var index = 0; index < scene.textures.length; index++) {
                        scene.textures[index].updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
                    }
                }
            
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
            });

            // the canvas/window resize event handler
            window.addEventListener('resize', function(){
                engine.resize();
            });
        });

function buildSpongePlanes(scene){

    for (let i = 0; i <= 81; i++){

        let myMaterial = new BABYLON.StandardMaterial("myMaterial"+i, scene);
        if (i <= 40)    myMaterial.diffuseTexture = new BABYLON.Texture(`./${i+1}.png`, scene);
        else            myMaterial.diffuseTexture = new BABYLON.Texture(`./${81-i+1}.png`, scene);
        myMaterial.backFaceCulling = false;
        myMaterial.diffuseTexture.hasAlpha = true;
        

        let myXPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 810, height: 810}, scene);
        myXPlane.material = myMaterial;        
        myXPlane.rotation.y = Math.PI/2;
        myXPlane.position = new BABYLON.Vector3(i*10-405, 0, 405);

        let myXPlane2 = myXPlane.clone("myPlane2");
        if (i <= 41)    myXPlane2. position = new BABYLON.Vector3(i*10-405+9.9999, 0, 405);
        else            myXPlane2. position = new BABYLON.Vector3(i*10-405-9.9999, 0, 405);
        

        let myYPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 810, height: 810}, scene);
        myYPlane.material = myMaterial;        
        myYPlane.rotation.x = Math.PI/2;
        myYPlane.position = new BABYLON.Vector3(0, i*10-405, 405);

        let myYPlane2 = myYPlane.clone("myPlane2");
        if (i <= 41)    myYPlane2. position = new BABYLON.Vector3(0, i*10-405+9.9999, 405);
        else            myYPlane2. position = new BABYLON.Vector3(0, i*10-405-9.9999, 405);
    

        let myZPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 810, height: 810}, scene);
        myZPlane.material = myMaterial;
        myZPlane.position = new BABYLON.Vector3(0, 0, i*10);

        let myZPlane2 = myZPlane.clone("myPlane2");
        if (i <= 41)    myZPlane2. position = new BABYLON.Vector3(0, 0, i*10+9.9999);
        else            myZPlane2. position = new BABYLON.Vector3(0, 0, i*10-9.9999);

    }

}