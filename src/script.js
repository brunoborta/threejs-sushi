import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();
const bakedTexture = textureLoader.load("baked.jpg");

// After baking from a hdr and save as a render, we need to
//load the texture with the correct colors
bakedTexture.colorSpace = THREE.SRGBColorSpace;
// IMPORTANT
bakedTexture.flipY = false;

// GLTF loader
const gltfLoader = new GLTFLoader();

/**
 * Animation
 */
const timeline = gsap.timeline();

const animate = (target) => {
  timeline
    .to(target.scale, {
      duration: 2,
      x: 1,
      y: 1,
      z: 1,
    })
    .to(
      target.rotation,
      {
        y: Math.PI * 4,
        duration: 2,
      },
      "<"
    );
};

/**
 * Object
 */
const bakedMaterial = new THREE.MeshBasicMaterial({
  map: bakedTexture,
  side: THREE.DoubleSide,
});

gltfLoader.load("sushi.glb", (gltf) => {
  // Apply the baked texture to all elements in the scene
  gltf.scene.children.forEach((child) => (child.material = bakedMaterial));
  gltf.scene.scale.set(0.01, 0.01, 0.01);
  animate(gltf.scene);
  scene.add(gltf.scene);
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
