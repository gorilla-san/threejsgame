// import three
import * as THREE from 'three';
// import GLTFLoader
import { OrbitControls } from 'OrbitControls';

//
import {GLTFLoader} from './node_modules/three/examples/jsm/loaders/GLTFLoader.js'

// import dracoloader
import { DRACOLoader } from './node_modules/three/examples/jsm/loaders/DRACOLoader.js'

// import texture loader
import { TextureLoader } from 'three';

// initialize texture loader
const textureLoader = new THREE.TextureLoader();





// Scene
const scene = new THREE.Scene();


var camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 50, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var car



const loader = new GLTFLoader();
loader.load(
    // resource URL
    'car.gltf',
    // called when the resource is loaded
    function ( gltf ) {
        car = gltf.scene;
        scene.add( car );
    }
);

// // console.log car after 2 seconds
// setTimeout(function(){
//     console.log(car);
// }, 2000);




// dracoloader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( './node_modules/three/examples/js/libs/draco/' );
loader.setDRACOLoader( dracoLoader );

// add light
const light = new THREE.DirectionalLight( 0xffffff, 5.0 );
light.position.set( 10, 10, 10 );
scene.add( light );

// move light 2 meters above the gltf model
light.position.set( 0, 2, 0 );

// camera controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// zoom out camera
// camera.position.z = 5;wd

// camera fov 45
camera.fov = 45;
camera.updateProjectionMatrix();


// camera position 100 100 100
// camera.position.set( -30, 80, 100 );

const cameraOffset = new THREE.Vector3(0, 80.0, 100.0); // NOTE Constant offset between the camera and the target

// NOTE Assuming the camera is direct child of the Scene

// after 2 seconds









// load wood.jpg texture from tesktop to the plane
const woodTexture = textureLoader.load('wood.jpg');

// add a horizontal plane under the model and set texture to "wood.jpg"
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry( 10, 10, 10, 10 ),
    // muse woodTexture as texture
    new THREE.MeshBasicMaterial( { map: woodTexture } )
);

//set repeat to 2 times
woodTexture.wrapS = THREE.RepeatWrapping;
woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set( 5, 5 );

// show shadows from light in the scene
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// traverse light objects and gltf model
scene.traverse( function ( object ) {
    if ( object.isMesh ) {
        object.castShadow = true;
        object.receiveShadow = true;
    }
} );




plane.rotation.x = - Math.PI / 2;
plane.position.y = - 0.5;
scene.add( plane );


// make it 10x bigger
plane.scale.set( 100, 100, 10 );

// show texture on both sides of plane
plane.material.side = THREE.DoubleSide;





const selectedObject = [];

// function to get mouse position
// function onDocumentMouseDown( event ) {
//     event.preventDefault();
//     var mouse = new THREE.Vector2();
//     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//     var raycaster = new THREE.Raycaster();
//     raycaster.setFromCamera( mouse, camera );
//     var intersects = raycaster.intersectObjects( scene.children, true );
//     if ( intersects.length > 0 ) {
//         console.log( intersects[ 0 ].object );
//         selectedObject.pop();
//         selectedObject.push(intersects[ 0 ].object.name);
//     }
// }



// // when car is clicked, change light color to random color
// function changeColor() {
//     if (selectedObject[0] == "Mesh005_2") {
//     light.color.setHex( Math.random() * 0xffffff );
//     }
// }

// // run changeColor() function when car gltf is clicked
// document.addEventListener( 'mousedown', (e) => {
//     onDocumentMouseDown(e);
//     if (selectedObject[0] === "Mesh005_2") {
//         changeColor();
//     }    
//     console.log(selectedObject);
// });


// add driving controls for the gltf model to move like a car on wasd keys
// document.addEventListener( 'keydown', (e) => {
//         if (e.key === "w") {
//             console.log(car);
//             // car.position.z += 1;
//             car.translateZ(3);
//         }
//         if (e.key === "s") {
//             // car.position.z -= 1;
//             car.translateZ(-3);

//         }

// });


// document.addEventListener( 'keydown', (e) => {
//     if (e.key === "a") {
//         // car.rotation.y += 1;
//         car.rotateY(0.1);
//     }
//     if (e.key === "d") {
//         // car.rotation.y -= 1;
//         car.rotateY(-0.1);
//     }
//     });





    const controller = {
        w: {pressed: false, func: function() { return car.translateZ(3);}},
        s: {pressed: false, func: function() { return car.translateZ(-3);}},
        a: {pressed: false, func: function() { return car.rotateY(0.05);}},
        d: {pressed: false, func: function() { return car.rotateY(-0.05);}},

    }
    
    document.addEventListener("keydown", (e) => {
        if(controller[e.key]){
            controller[e.key].pressed = true;
        }
    })

    document.addEventListener("keyup", (e) => {
        if(controller[e.key]){
            controller[e.key].pressed = false
        }
    })
        
    function drive() {
        for(let key in controller){
            if(controller[key].pressed){
                controller[key].func();
            }
        }
    }



    



    // render
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    drive();
    setTimeout(function(){
        // camera poitioned 50 directly behind the car, two car heights above the car
        camera.position.set( car.position.x - 200, car.position.y + 100, car.position.z );
        // camera looks at the car
        camera.lookAt( car.position );



    }, 1000);
}
animate();

   



















