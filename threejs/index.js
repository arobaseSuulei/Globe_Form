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

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new THREE.TextureLoader();
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const geo = new THREE.IcosahedronGeometry(1.0, 22);
const mat = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("/threejs/textures/00_earthmap1k.jpg")
});

const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
})

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

// SYSTÈME DE CLIC SUR LA PLANÈTE

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    // Convertir les coordonnées de la souris en coordonnées normalisées (-1 à +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Mettre à jour le raycaster avec la position de la souris
    raycaster.setFromCamera(mouse, camera);

    // Calculer les objets intersectés par le rayon
    const intersects = raycaster.intersectObject(mesh);

    if (intersects.length > 0) {
        // Si on a cliqué sur la Terre
        console.log("Clic sur la Terre détecté!");

        // Rediriger vers un autre site
        window.location.href = "https://global-form-4agb.vercel.app"; // Changez l'URL ici

        // OU ouvrir dans un nouvel onglet :
        // window.open("https://www.example.com", "_blank");
    }
}

// Ajouter l'écouteur d'événement
window.addEventListener('click', onMouseClick);

// FIN SYSTÈME DE CLIC

// Fonction d'animation
function animate(t = 0) {
    requestAnimationFrame(animate);
    mesh.rotation.y = t * 0.0001;
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