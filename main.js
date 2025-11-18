// 🎃 Escena Halloween en VR
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

// --- ESCENA Y CÁMARA ----------------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 20); // Altura de persona en VR

// --- RENDERER -----------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.xr.enabled = true; // 🔹 Activar VR
renderer.xr.setReferenceSpaceType('local');
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer)); // 🔹 Botón VR

// --- SKYBOX --------------------------------------------------------------
const loader = new THREE.CubeTextureLoader();
loader.setPath('./UV/');
const textureCube = loader.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
scene.background = textureCube;

// --- LUCES ---------------------------------------------------------------
const light = new THREE.AmbientLight(0x400040);
scene.add(light);

const light2 = new THREE.PointLight(0xE1AB00, 3, 70);
light2.position.set(0, 20, -30);
light2.castShadow = true;
scene.add(light2);

const light3 = new THREE.PointLight(0xE1D24A, 3, 70);
light3.position.set(0, 0.1, 5);
light3.castShadow = true;
scene.add(light3);

const light4 = new THREE.PointLight(0xE1D24A, 5, 50);
light4.position.set(0, 1, 0);
light4.castShadow = true;
scene.add(light4);

scene.fog = new THREE.Fog(0x111111, 10, 80);

// --- MATERIALES Y PISO ---------------------------------------------------
const piso_1 = new THREE.TextureLoader().load('assets/Grass003_1K-JPG_Color.jpg');
const piso_2 = new THREE.TextureLoader().load('assets/Grass003_1K-JPG_NormalDX.jpg');
const PISO = new THREE.MeshPhongMaterial({ map: piso_1, normalMap: piso_2 });

const geometry = new THREE.BoxGeometry(40, 0.1, 40);
const cube = new THREE.Mesh(geometry, PISO);
cube.receiveShadow = true;
scene.add(cube);

// --- FBX MANAGER ---------------------------------------------------------
const manager = new THREE.LoadingManager();
const loaderFBX = new FBXLoader(manager);

// --- MODELOS FBX ---------------------------------------------------------
loaderFBX.load('modelos/Castillo.fbx', (object0) => {
  object0.traverse((child) => {
    child.castShadow = true;
  });
  object0.scale.set(1, 1, 1);
  object0.position.set(0, 0.05, -5);
  scene.add(object0);
});

loaderFBX.load('modelos/Ventanas.fbx', (object) => {
  object.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.material.emissive = new THREE.Color(0xff8000);
      child.material.emissiveIntensity = 2;
    }
  });
  object.position.set(0, 0.05, -0.7);
  object.rotation.y = Math.PI;
  scene.add(object);
});

loaderFBX.load('modelos/Puertas.fbx', (object3) => {
  object3.traverse((child) => {
    child.castShadow = true;
  });
  object3.position.set(0, 0.05, -0.7);
  object3.rotation.y = Math.PI;
  scene.add(object3);
});

loaderFBX.load('modelos/Cerca.fbx', (object1) => {
  object1.traverse((child) => {
    child.castShadow = true;
  });
  object1.position.set(0, 0, 0);
  scene.add(object1);
});

// --- CALABAZAS (clonadas) -----------------------------------------------
loaderFBX.load('modelos/Calabaza.fbx', (object2) => {
  object2.traverse((child) => {
    child.castShadow = true;
  });
  object2.scale.set(0.8, 0.8, 0.8);
  object2.position.set(5, 0, 7);
  scene.add(object2);

  // Clones distribuidos
  const positions = [
    [-5, 0, 7], [-4, 0, 11], [4, 0, 11], [-8, 0, 11],
    [8, 0, 11], [12, 0, 5], [-12, 0, 5], [10, 0, -5],
    [-10, 0, -5], [6, 0, -10], [-6, 0, -10], [14, 0, 12],
    [-14, 0, 12]
  ];
  positions.forEach(p => {
    const clone = object2.clone();
    clone.position.set(...p);
    scene.add(clone);
  });
});

// --- NUBES ---------------------------------------------------------------
loaderFBX.load('modelos/Nubes.fbx', (object3) => {
  object3.traverse((child) => {
    if (child.isMesh) {
      child.material.emissive = new THREE.Color(0xff8000);
      child.material.emissiveIntensity = 0;
    }
  });
  object3.position.set(0, -1, -30);
  scene.add(object3);

  const clones = [
    [-30, -1, -20, Math.PI / 6],
    [30, -1, -20, -Math.PI / 6],
    [-20, 0, -35, Math.PI / 8],
    [20, 0, -35, -Math.PI / 8],
  ];
  clones.forEach(([x, y, z, r]) => {
    const c = object3.clone();
    c.position.set(x, y, z);
    c.rotation.y = r;
    scene.add(c);
  });
});

// --- PHANTOM -------------------------------------------------------------
loaderFBX.load('modelos/Phantom.fbx', (object4) => {
  object4.traverse((child) => {
    child.castShadow = true;
  });
  object4.scale.set(1.8, 1.8, 1.8);
  object4.position.set(-2, 6, 0);
  scene.add(object4);
});

// --- ÁRBOLES -------------------------------------------------------------
loaderFBX.load('modelos/Arbol.fbx', (object5) => {
  object5.traverse((child) => {
    child.castShadow = true;
  });
  object5.position.set(-5, 0.05, 2.5);
  scene.add(object5);

  const clones = [
    [5, 0.05, 2.5],
    [-7, 0.05, 0],
    [7, 0.05, 0],
  ];
  clones.forEach(([x, y, z]) => {
    const c = object5.clone();
    c.position.set(x, y, z);
    scene.add(c);
  });
});

// --- ÁRBOLES DE SUSTO ----------------------------------------------------
loaderFBX.load('modelos/ArbolSusto.fbx', (object6) => {
  object6.traverse((child) => {
    child.castShadow = true;
  });
  object6.scale.set(1.5, 1.5, 1.5);
  object6.position.set(-10, 0.05, 2.5);
  scene.add(object6);

  const clones = [
    [10, 0.05, 2.5],
    [8, 0.05, 9],
    [-8, 0.05, 9],
    [-12, 0.05, -5],
    [12, 0.05, -5],
    [-15, 0.05, 7],
    [15, 0.05, 7],
  ];
  clones.forEach(([x, y, z]) => {
    const c = object6.clone();
    c.position.set(x, y, z);
    scene.add(c);
  });
});

// --- ROCAS ---------------------------------------------------------------
loaderFBX.load('modelos/Rocas.fbx', (object7) => {
  object7.traverse((child) => {
    child.castShadow = true;
  });
  object7.scale.set(0.6, 0.6, 0.6);
  object7.position.set(0, 0, 10);
  scene.add(object7);
});

// --- LUNA / ESFERA LUMINOSA ---------------------------------------------
const geometryEsfera = new THREE.SphereGeometry(24, 32, 32);
const materialEsfera = new THREE.MeshPhongMaterial({
  color: 0xE0D016,
  emissive: 0xE0D016,
  emissiveIntensity: 1,
});
const esfera = new THREE.Mesh(geometryEsfera, materialEsfera);
esfera.position.set(0, 20, -60);
scene.add(esfera);

// --- LOOP DE ANIMACIÓN VR -----------------------------------------------
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});

// --- AJUSTE DE VENTANA ---------------------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
