import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 20);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

let airplane;
let startX = -40;
let targetX = 40;
let animationStartTime = 0;
let animationDuration = 8000;
let animationComplete = false;

// Load the GLB model
const loader = new GLTFLoader();
loader.load(
    '/models/aeroplane.glb',
    function (gltf) {
        airplane = gltf.scene;
        airplane.scale.set(1, 1, 1);
        airplane.position.set(startX, 0, 0);
        airplane.rotation.y = Math.PI / 2;
        scene.add(airplane);
        animationStartTime = Date.now();
    }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const currentTime = Date.now();
    const elapsedTime = currentTime - animationStartTime;
    const progress = Math.min(elapsedTime / animationDuration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    if (airplane && !animationComplete) {
        const planeX = startX + (targetX - startX) * easedProgress;
        airplane.position.x = planeX;
        airplane.position.y = Math.sin(currentTime * 0.001) * 0.5;
        airplane.rotation.z = Math.sin(currentTime * 0.001) * 0.05;
        
        // When animation completes
        if (progress >= 1 && !animationComplete) {
            animationComplete = true;
            // Wait for 1 second before redirecting
            setTimeout(() => {
                window.location.href = 'landing.html';
            }, 1000);
        }
    }
    renderer.render(scene, camera);
}

animate();
