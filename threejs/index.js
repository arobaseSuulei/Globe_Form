import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
console.log(THREE);

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera,renderer.domElement);

const loader=new THREE.TextureLoader();
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const geo = new THREE.IcosahedronGeometry(1.0, 22);
const mat = new THREE.MeshStandardMaterial({
    //color: 0xffffff,
    //flatShading: true,

    map: new THREE.TextureLoader().load("/threejs/textures/00_earthmap1k.jpg")





});

const mesh = new THREE.Mesh(geo, mat);

scene.add(mesh);

const wireMat=new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
})

//const wireMesh= new THREE.Mesh(geo,wireMat);
//wireMesh.scale.setScalar(1.001);
//scene.add(wireMesh);


const hemiLight = new THREE.HemisphereLight(0xffffff,0x444444);
scene.add(hemiLight);

// Fonction d'animation
function animate(t=0) {
    requestAnimationFrame(animate);
    //mesh.scale.setScalar(Math.cos(t*0.001)+1.0);
    mesh.rotation.y=t*0.0001;
    //wireMesh.rotation.y = t * 0.0001;
    renderer.render(scene, camera);

    controls.update();
}

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

// Démarrer l'animation
animate();
