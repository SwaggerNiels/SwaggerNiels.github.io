import * as THREE from /*'three'*/'blob:https://threejs.org/518a5936-4f01-4791-a841-afcd7443b6b5';

import Stats from /*'three/addons/libs/stats.module.js'*/'blob:https://threejs.org/ab724d51-f8af-4313-a4e2-0d616b68e707';
import { GUI } from /*'three/addons/libs/lil-gui.module.min.js'*/'blob:https://threejs.org/bc335347-7785-41c3-afb5-272cdb9ea93c';
import { OrbitControls } from /*'three/addons/controls/OrbitControls.js'*/'blob:https://threejs.org/8f874417-0485-437c-b5a9-366f9f4f5d89';
import { OBJLoader } from /*'three/addons/loaders/OBJLoader.js'*/'blob:https://threejs.org/091d6c43-2557-4d96-822c-daf85c94ba37';
let stats;

let camera, scene, renderer, controls;
const settings = {
    metalness: 1.0,
    roughness: 0.4,
    ambientIntensity: 0.2,
    aoMapIntensity: 1.0,
    envMapIntensity: 1.0,
    displacementScale: 2.436143, // from original model
    normalScale: 1.0
};

let mesh, material;

let pointLight, ambientLight;

const height = 500; // of camera frustum

let r = 0.0;

init();
animate();
initGui();

// Init gui
function initGui() {

    const gui = new GUI();
    //let gui = gui.addFolder( "Material" );
    gui.add( settings, 'metalness' ).min( 0 ).max( 1 ).onChange( function ( value ) {

        material.metalness = value;

    } );

    gui.add( settings, 'roughness' ).min( 0 ).max( 1 ).onChange( function ( value ) {

        material.roughness = value;

    } );

    gui.add( settings, 'aoMapIntensity' ).min( 0 ).max( 1 ).onChange( function ( value ) {

        material.aoMapIntensity = value;

    } );

    gui.add( settings, 'ambientIntensity' ).min( 0 ).max( 1 ).onChange( function ( value ) {

        ambientLight.intensity = value;

    } );

    gui.add( settings, 'envMapIntensity' ).min( 0 ).max( 3 ).onChange( function ( value ) {

        material.envMapIntensity = value;

    } );

    gui.add( settings, 'displacementScale' ).min( 0 ).max( 3.0 ).onChange( function ( value ) {

        material.displacementScale = value;

    } );

    gui.add( settings, 'normalScale' ).min( - 1 ).max( 1 ).onChange( function ( value ) {

        material.normalScale.set( 1, - 1 ).multiplyScalar( value );

    } );

}

function init() {

    const container = document.createElement( 'div' );
    document.body.appendChild( container );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    renderer.outputEncoding = THREE.sRGBEncoding;

    //

    scene = new THREE.Scene();

    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera( - height * aspect, height * aspect, height, - height, 1, 10000 );
    camera.position.z = 1500;
    scene.add( camera );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableZoom = false;
    controls.enableDamping = true;

    // lights

    ambientLight = new THREE.AmbientLight( 0xffffff, settings.ambientIntensity );
    scene.add( ambientLight );

    pointLight = new THREE.PointLight( 0xff0000, 0.5 );
    pointLight.position.z = 2500;
    scene.add( pointLight );

    const pointLight2 = new THREE.PointLight( 0xff6666, 1 );
    camera.add( pointLight2 );

    const pointLight3 = new THREE.PointLight( 0x0000ff, 0.5 );
    pointLight3.position.x = - 1000;
    pointLight3.position.z = 1000;
    scene.add( pointLight3 );

    // env map

    const path = 'textures/cube/SwedishRoyalCastle/';
    const format = '.jpg';
    const urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    const reflectionCube = new THREE.CubeTextureLoader().load( urls );
    reflectionCube.encoding = THREE.sRGBEncoding;

    // textures

    const textureLoader = new THREE.TextureLoader();
    const normalMap = textureLoader.load( 'models/obj/ninja/normal.png' );
    const aoMap = textureLoader.load( 'models/obj/ninja/ao.jpg' );
    const displacementMap = textureLoader.load( 'models/obj/ninja/displacement.jpg' );

    // material

    material = new THREE.MeshStandardMaterial( {

        color: 0x888888,
        roughness: settings.roughness,
        metalness: settings.metalness,

        normalMap: normalMap,
        normalScale: new THREE.Vector2( 1, - 1 ), // why does the normal map require negation in this case?

        aoMap: aoMap,
        aoMapIntensity: 1,

        displacementMap: displacementMap,
        displacementScale: settings.displacementScale,
        displacementBias: - 0.428408, // from original model

        envMap: reflectionCube,
        envMapIntensity: settings.envMapIntensity,

        side: THREE.DoubleSide

    } );

    //

    const loader = new OBJLoader();
    loader.load( 'models/obj/ninja/ninjaHead_Low.obj', function ( group ) {

        const geometry = group.children[ 0 ].geometry;
        geometry.attributes.uv2 = geometry.attributes.uv;
        geometry.center();

        mesh = new THREE.Mesh( geometry, material );
        mesh.scale.multiplyScalar( 25 );
        scene.add( mesh );

    } );

    //

    stats = new Stats();
    container.appendChild( stats.dom );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    const aspect = window.innerWidth / window.innerHeight;

    camera.left = - height * aspect;
    camera.right = height * aspect;
    camera.top = height;
    camera.bottom = - height;

    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    controls.update();

    stats.begin();
    render();
    stats.end();

}

function render() {

    pointLight.position.x = 2500 * Math.cos( r );
    pointLight.position.z = 2500 * Math.sin( r );

    r += 0.01;

    renderer.render( scene, camera );

}
