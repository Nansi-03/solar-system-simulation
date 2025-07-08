import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls;

const planetData = [];
const textureLoader = new THREE.TextureLoader();

const planets = [
  { name: "mercury", radius: 6, speed: 2 },
  { name: "venus", radius: 8, speed: 1.5 },
  { name: "earth", radius: 10, speed: 1 },
  { name: "mars", radius: 12, speed: 0.8 },
  { name: "jupiter", radius: 15, speed: 0.6 },
  { name: "saturn", radius: 18, speed: 0.4 },
  { name: "uranus", radius: 21, speed: 0.2 },
  { name: "neptune", radius: 24, speed: 0.1 },
];

function init() {
  // Scene setup
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 50, 60);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.enablePan = true;

  // Lighting
  const light = new THREE.PointLight(0xffffff, 2, 500);
  light.position.set(0, 0, 0);
  scene.add(light);

  // Sun
  const sunTexture = textureLoader.load("./img/sun_hd.jpg");
  const sunGeo = new THREE.SphereGeometry(3, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.name = "sun";
  scene.add(sun);

  // Planets
  planets.forEach((planet, i) => {
    const tex = textureLoader.load(`./img/${planet.name}_hd.jpg`);
    const geo = new THREE.SphereGeometry(0.5 + i * 0.2, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ map: tex });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = planet.name;
    planetData.push({
      mesh,
      angle: Math.random() * 360,
      radius: planet.radius,
      speed: planet.speed,
    });
    scene.add(mesh);

    // Orbit Ring (visible)
    const ringGeo = new THREE.RingGeometry(planet.radius - 0.05, planet.radius + 0.05, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
  });

  animate();
}

function animate(time = 0) {
  // Animate planets
  planetData.forEach((p) => {
    p.angle += p.speed * 0.001;
    p.mesh.position.x = Math.cos(p.angle) * p.radius;
    p.mesh.position.z = Math.sin(p.angle) * p.radius;
    p.mesh.rotation.y += 0.01;
  });

  // Spin the sun
  const sun = scene.getObjectByName("sun");
  sun.rotation.y += 0.005;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

init();
