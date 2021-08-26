import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import WebVRPolyfill from "webvr-polyfill";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";

// // WebVR
// let vrdisplay;
// let frameData; // To hold the orientation info, amongst other things.

// // Check that WebVR is supported
// if ("getVRDisplays" in navigator) {
//   console.log("Inside VR support loop");
//   // Now we know that VR is supported, we can initialise the frame data object
//   frameData = new VRFrameData();

//   // Get an array of all available VR displays
//   navigator.getVRDisplays().then((displays) => {
//     // Filter out any (hypothetical) display that doesn't support orientation
//     displays = displays.filter((d) => d.capabilities.hasOrientation);

//     // If we have suitable displays, pick the first one. Otherwise, we will
//     // leave vrdisplay as undefined.
//     if (displays.length > 0) {
//       vrdisplay = displays[0];
//     }
//   });
// }

// console.log("vrdisplay = ", vrdisplay);
// console.log("frameData = ", frameData);

// if (vrdisplay) {
//   // Update framedata. This object holds the current position and orientation of
//   // the VR display, among other things.
//   vrdisplay.getFrameData(frameData);

//   // Do a bit of a dance with the Three.JS camera object to use our own view matrix

//   // We don't want our camera matrix to be overwritten by Three
//   camera.matrixAutoUpdate = false;

//   // Set the camera's view matrix to the device view matrix
//   camera.matrix.fromArray(frameData.leftViewMatrix);

//   // Three actually needs the inverse of the view matrix that WebVR gives us
//   camera.matrix.getInverse(camera.matrix);

//   // Now update the camera's world matrix, which applies its own matrix to the
//   // matrix of its parent.
//   camera.updateMatrixWorld(true);

//   // Finally, tell the display that we are done with this frame. This is more
//   // relevant when we are presenting to the device, but it signals to the
//   // display that the next time we call getFrameData we want fresh values.
//   vrdisplay.submitFrame();
// }

// // Polyfill always provides us with `navigator.getVRDisplays`
// if ("getVRDisplays" in navigator) {
//   navigator.getVRDisplays().then((displays) => {
//     // If we have a native VRDisplay, or if the polyfill
//     // provided us with a CardboardVRDisplay, use it
//     if (displays.length) {
//       vrDisplay = displays[0];
//       controls = new THREE.VRControls(camera);
//       vrDisplay.requestAnimationFrame(animate);
//     }
//   });
// }

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");

// Particles
// Geometry
const particlesGeometry = new THREE.BufferGeometry(1, 32, 32);
const count = 5000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: particleTexture,
  //   alphaTest: 0.001,
  //   depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});
// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

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
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
// // Magic window retrieve orientation and update camera in render loop
// if (vrDisplay) {
//   // update framData. This object holds current position and orientation of VR display
//   vrDisplay.getFrameData(frameData);

//   camera.matrixAutoUpdate = false;

//   camera.matrix.fromArray(frameData.leftViewMatrix);

//   camera.matrix(camera.matrix);

//   camera.updateMatrixWorld(true);

//   vrDisplay.submitFrame();
// }
// scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.xr.enabled = true;

// VR Button
document.body.appendChild(VRButton.createButton(renderer));

/**
 * Animate
 */
const clock = new THREE.Clock();

renderer.setAnimationLoop(function () {
  renderer.render(scene, camera);
});

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();

//   //   Update Particles
//   //   particles.rotation.y = elapsedTime * 0.1;
//   //   particles.position.y = -elapsedTime * 0.1;

//   // Update controls
//   controls.update();

//   scene.add(camera);

//   // Render
//   renderer.render(scene, camera);

//   // Call tick again on the next frame
//   window.requestAnimationFrame(tick);
// };

// tick();
