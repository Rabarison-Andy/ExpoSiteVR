import './style.css'
//import paintings from './paintings'
import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

//import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js'


const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff);

const cursor = { x: 0, y: 0 }

const canvas = document.getElementById('canvas')
const sizes = { width: window.innerWidth, height: window.innerHeight }

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
})

const video = document.getElementById('video');
video.src = '/assets/videos/Eyes.mp4';
video.play();
let videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;

const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate the plane 90 degrees
plane.position.set(0, 0.001, 0); // Position above the existing plane
scene.add(plane);

const geometry = new THREE.SphereGeometry(4, 64, 32)
const material = new THREE.MeshBasicMaterial({
    map: videoTexture,
    side: THREE.BackSide,
    transparent: true,
});
const mesh = new THREE.Mesh(geometry, material)
mesh.position.z = -4.875094274388068;
mesh.position.x = -20.286630116254027;
mesh.position.y = 0.257;
scene.add(mesh)
videoTexture.needsUpdate = true;

const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const bakedTexture = textureLoader.load('/assets/modeles/untitled.jpg');
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding
const bakedMaterials = new THREE.MeshPhongMaterial({ map: bakedTexture });
bakedMaterials.map.wrapS = THREE.RepeatWrapping;
bakedMaterials.map.wrapT = THREE.RepeatWrapping;
bakedMaterials.map.repeat.set(1, 1);

let objectNames = [];
let paintingObjects = [];
loader.load('/assets/modeles/scene.gltf', (gltf) => {
    gltf.scene.scale.set(0.5, 0.5, 0.5);

    gltf.scene.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    gltf.scene.traverse((child) => {
        if (child.isMesh && child.name === "Plane") {
            child.material = bakedMaterials;
            child.receiveShadow = true;
            child.castShadow = true;
        }
    });

    gltf.scene.traverse((object) => {
        if (object.isMesh && object.name.startsWith('uploads_files')) {
            object.castShadow = true;
            object.receiveShadow = true;
            objectNames.push(object.name);
        }
    });

    gltf.scene.traverse((object) => {
        if (object.isMesh && object.name.startsWith('uploads_files')) {
            objectNames.push(object.name);
            Object.entries(paintingIds).forEach(([id, painting]) => {
                if (painting.includes(object.name)) {
                    paintingObjects[id] = object;
                    //console.log('paintingObjects', paintingObjects);
                }
            });
        }
    });

    scene.add(gltf.scene);
});
//Les tableaux ont une mauvaise attribution d'ID, donc je insérer les ID corrects manuellement
const paintings = {
    7: {
        id:1,//7
        nom:"Portrait de Suzanne Valadon",
        artiste:"Henri de Toulouse-Lautrec",
        date:"1885",
        desc:"Toulouse-Lautrec et l'artiste ainsi que le modèle Suzanne Valadon étaient amis à Montmartre à Paris. Henri de Toulouse était un artiste très renommé à l'époque, tout comme Suzanne Valadon. Lautrec a réalisé de nombreux portraits de Valadon et l'a soutenue dans son parcours dans l'industrie artistique. Ils étaient considérés comme des amants par la ville de Montmartre jusqu'à ce que leurs relations prennent fin en 1888.Toulouse-Lautrec a créé ce portrait de Suzanne alors qu'elle marchait directement vers le spectateur dans ce qui semble être l'automne, car Lautrec met l'accent sur la couleur derrière Valadon. Il présente Suzanne comme très à la mode avec sa robe et son chapeau violets. La façon dont Lautrec utilise la lumière dans cette pièce est intrigante alors que Valadon se distingue de son arrière-plan, même avec des couleurs similaires vues tout au long du portrait.",
        img:"/assets/modeles/peintures/automne.jpg", //uploads_files_939884_Abstract+wall+arts016
    },
    5: {
        id:2,//5
        nom:"Autoportrait",
        artiste:"Suzanne Valadon",
        date:"1918",
        desc:"Autoportait de Suzanne Valadon peint en 1918, il est possible de lire \"pendant la guerre\"",
        img:"/assets/modeles/peintures/autoportrait-1.png", //uploads_files_939884_Abstract+wall+arts015
    },
    2: {
        id:3,//2
        nom:"Autoportrait",
        artiste:"Suzanne Valadon",
        date:"1898",
        desc:"Autoportait de Suzanne Valadon peint en 1898",
        img:"/assets/modeles/peintures/autoportrait-2.png", //uploads_files_939884_Abstract+wall+arts013
    },
    18: {
        id:4,//18
        nom:"La Chambre bleue",
        artiste:"Suzanne Valadon",
        date:"1923",
        desc:"La Chambre bleue est un tableau réalisé en 1923 par la peintre française Suzanne Valadon. Cette huile sur toile représente une femme étendue dans une chambre à coucher à la literie bleue, une cigarette aux lèvres et des livres à ses pieds.",
        img:"/assets/modeles/peintures/chambre-bleue.png", //uploads_files_939884_Abstract+wall+arts007 + 008
    },
    1: {
        id:5,//1
        nom:"Portrait de Mauricia Coquiot",
        artiste:"Suzanne Valadon",
        date:"1915",
        desc:"Mauricia Coquiot était la fille du critique d'art Gustave Coquiot et était elle-même une modèle fréquente pour de nombreux artistes de l'époque, dont Valadon.Dans ce portrait, Valadon capture avec habileté l'essence et la personnalité de Mauricia Coquiot. Son style artistique distinctif se manifeste par des traits expressifs, une utilisation subtile de la lumière et de l\'ombre, ainsi qu\'une palette de couleurs riche et nuancée.",
        img:"/assets/modeles/peintures/fleurs.png", //uploads_files_939884_Abstract+wall+arts012
    },
    8: {
        id:6,//8
        nom:"Autoportrait",
        artiste:"Suzanne Valadon",
        date:"1916",
        desc:"Dans cet autoportrait, Valadon se représente avec une expression intense et introspective. Son regard direct et sérieux capte l'attention du spectateur, tandis que les nuances de lumière et d'ombre mettent en valeur les contours de son visage. La palette de couleurs utilisée par Valadon est subtile mais expressive, créant une atmosphère intimiste et émotionnelle.",
        img:"/assets/modeles/peintures/autoportrait3.png", //uploads_files_939884_Abstract+wall+arts017 + 009
    },
    17: {
        id:7,//17
        nom:"La Natte (Suzanne Valadon)",
        artiste:"Pierre-Auguste Renoir",
        date:"1887",
        desc:"Dans ce portrait, Renoir a capturé la beauté naturelle et la personnalité charismatique de Valadon. Le titre \"La natte\" fait référence à la tresse que Suzanne Valadon porte dans ses cheveux, qui est mise en valeur dans le tableau. Renoir a utilisé sa technique distinctive de peinture impressionniste pour créer une atmosphère douce et lumineuse autour de Valadon, en mettant l'accent sur les couleurs et les formes plutôt que sur les détails minutieux. Ce portrait témoigne de la relation professionnelle et amicale entre Renoir et Valadon. Valadon a été modèle pour de nombreux artistes de renom, dont Renoir.",
        img:"/assets/modeles/peintures/la-natte.png", //uploads_files_939884_Abstract+wall+arts022
    },
    11: {
        id:8,//11
        nom:"Portrait de Madame Maurice Utrillo",
        artiste:"Suzanne Valadon",
        date:"1937",
        desc:"Aussi nommé Portrait de Lucie Valore",
        img:"/assets/modeles/peintures/russe.png", //uploads_files_939884_Abstract+wall+arts018
    },
    21: {
        id:9,//21
        nom:"Portrait de Suzanne Valadon",
        artiste:"Pierre-Auguste Renoir",
        date:"1885",
        desc:"Dans ce portrait, Renoir capture l'essence de Valadon avec une grande sensibilité. Il la représente avec une expression douce et contemplative, mettant en valeur sa beauté naturelle et son charme. La palette de couleurs est caractéristique du style impressionniste de Renoir, avec des tons chauds et lumineux qui illuminent le tableau.",
        img:"/assets/modeles/peintures/Sdouce.png", //uploads_files_939884_Abstract+wall+arts019
    },
    13: {
        id:10,//13
        nom:"Portrait de Suzanne Valadon",
        artiste:"Suzanne Valadon",
        date:"1927",
        desc:"Dans cet autoportrait, Valadon se représente avec une expression sérieuse et introspective. Son regard est direct et pénétrant, captant l'attention du spectateur. Elle semble réfléchir profondément, ce qui confère à l'œuvre une dimension psychologique intéressante.",
        img:"/assets/modeles/peintures/SMiroir.png", //uploads_files_939884_Abstract+wall+arts020
    },
    14: {
        id:11,//14
        nom:"Victorine ou la tigresse",
        artiste:"Suzanne Valadon",
        date:"1919",
        desc:"Dans ce portrait, Valadon dépeint Victorine Meurent, un modèle bien connu et une artiste elle-même, dans une pose audacieuse et dominante. Victorine est représentée avec une expression confiante, presque provocante, regardant directement le spectateur avec défi. Son attitude fier et sa posture assurée mettent en évidence sa personnalité forte et indépendante. Le titre \"La Tigresse\" évoque l'image d'une femme puissante et sauvage, associée à la force et à la détermination.",
        img:"/assets/modeles/peintures/victorine.png", //uploads_files_939884_Abstract+wall+arts005
    }};


const paintingIds = {
    7: ['uploads_files_939884_Abstract+wall+arts016'],
    5: ['uploads_files_939884_Abstract+wall+arts015'],
    2: ['uploads_files_939884_Abstract+wall+arts013'],
    18: ['uploads_files_939884_Abstract+wall+arts007'],
    1: ['uploads_files_939884_Abstract+wall+arts012'],
    8: ['uploads_files_939884_Abstract+wall+arts017', 'uploads_files_939884_Abstract+wall+arts009'],
    17: ['uploads_files_939884_Abstract+wall+arts022'],
    11: ['uploads_files_939884_Abstract+wall+arts018'],
    21: ['uploads_files_939884_Abstract+wall+arts019'],
    13: ['uploads_files_939884_Abstract+wall+arts020'],
    14: ['uploads_files_939884_Abstract+wall+arts005']
};

const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 1, 10000)
camera.position.y = 1.90;
camera.position.z = -4.875094274388068;
camera.position.x = -20.286630116254027;
camera.rotation.y = -3.141592653589793;
scene.add(camera)

const controls = new PointerLockControls(camera, canvas);

const clock = new THREE.Clock()
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let controlsLocked = true;

const onKeyDown = function (event) {
    if (controlsLocked || clock.getElapsedTime() < 21) {
        return; // Ne rien faire si les contrôles sont verrouillés ou si moins de 23 secondes se sont écoulées
    }
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
    }
};

const onKeyUp = function (event) {
    if (controlsLocked || clock.getElapsedTime() < 21) {
        return; // Ne rien faire si les contrôles sont verrouillés ou si moins de 23 secondes se sont écoulées
    }
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);


const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const easeOutQuad = (t) => {
    return t * (2 - t);
}

let sphereRemoved = false;

const updateOpacity = (scale) => {
    const maxRadius = 4;
    const maxScale = maxRadius / 2;

    if (scale >= maxScale) {
        const opacity = 1 - (scale - maxScale) / (maxScale / 2);
        mesh.material.opacity = opacity;
    }
}

const removeObject = () => {
    if (!sphereRemoved) {
        mesh.geometry.dispose();
        mesh.material.dispose();
        scene.remove(mesh);
        sphereRemoved = true;
    }
}

const maxlimitCameraHeight = () => {
    if (camera.position.y > 1.90) {
        camera.position.y = 1.90;
    }
}

const minlimitCameraHeight = () => {
    if (camera.position.y < 1.90) {
        camera.position.y = 1.90;
    }
}

canvas.addEventListener('click', function () {
    controls.lock();
});
const paintingInfoDiv = document.getElementById('paintingInfoDiv');
const paintingImage = document.getElementById('paintingImage');
const paintingDetails = document.getElementById('paintingDetails');

function showPaintingInfo(painting) {
    paintingInfoDiv.classList.remove('hidden');
    paintingImage.src = painting.img;
    paintingDetails.innerHTML = `
        <h2>${painting.nom}</h2>
        <p class="artiste">Artiste: ${painting.artiste}</p>
        <p class="date">Année: ${painting.date}</p>
        <p>Description: ${painting.desc}</p>
    `;
}

function hidePaintingInfo() {
    paintingInfoDiv.classList.add('hidden');
    paintingImage.src = '';
    paintingDetails.innerHTML = '';
}

const returnButton = document.getElementById('returnButton');
returnButton.addEventListener('click', () => {
    hidePaintingInfo();
    paintingInfoDiv.classList.add('hidden');
    //controls.lock();
});



const raycaster = new THREE.Raycaster();
function onClick(event) {
    if (!controls.isLocked) {
        return;
    }

    // Coordonnées normalisées de la souris
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Mettre à jour le vecteur de rayonnement de la souris
    raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);

    // Filtrer les intersections pour ne récupérer que les objets ayant des noms présents dans objectNames
    const intersects = raycaster.intersectObjects(scene.children, true)
                    .filter(intersect => intersect.object.isMesh && objectNames.includes(intersect.object.name));

    // Vérifier si des intersections avec des objets de objectNames sont détectées
    if (intersects.length > 0) {
        // Récupérer la position de l'objet cliqué dans le système de coordonnées de la scène
        const intersectionPoint = intersects[0].point;
        //console.log('intersectionPoint', intersectionPoint);
        // Vérifier si la distance entre la caméra et le point d'intersection est inférieure à 4m
        const distanceToTable = camera.position.distanceTo(intersectionPoint);
        if (distanceToTable <= 4) {
            // Récupérer le nom de l'objet cliqué
            const clickedObjectName = intersects[0].object.name;
            //console.log('clickedObjectName', clickedObjectName);
            // Trouver l'ID associé à l'objet cliqué
            const objectId = objectNames.indexOf(clickedObjectName);
            //console.log(objectNames);
            //console.log('objectId', objectId);
            // Trouver la peinture correspondante dans la liste des peintures en utilisant l'ID
            const painting = paintings[objectId];
            //console.log('painting', painting);
            // Afficher les informations sur la peinture et charger son image
            if (painting) {
                showPaintingInfo(painting); // Afficher les informations sur la peinture
                controls.unlock(); // Déverrouiller les contrôles
            } else {
                console.log("Aucune peinture associée trouvée pour cet objet. Nom de l'objet:", clickedObjectName);
            }
        }
    }
}

// Fonction pour mettre à jour la visibilité du plan en fonction de la sphère
const updatePlaneVisibility = () => {
    plane.visible = !sphereRemoved; // Rendre le plan visible tant que la sphère n'est pas supprimée
};

window.addEventListener('click', onClick);

var fftSize = 2048;
var audioLoader = new THREE.AudioLoader();
var listener = new THREE.AudioListener();
var audio = new THREE.Audio(listener);
audio.crossOrigin = "anonymous";

var audioFile = '/assets/voices/Intro.ogg';

audioLoader.load(audioFile, function(buffer) {
    audio.setBuffer(buffer);
    audio.setLoop(false);
    audio.play();
});




const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const waitingTime = 19;
    const scaleSpeed = 0.15;
    let scale = 1;

    videoTexture.needsUpdate = true;

    if (elapsedTime >= waitingTime) {
        const scaledTime = (elapsedTime - waitingTime) * scaleSpeed;
        const clampedTime = Math.min(scaledTime, 1);
        scale = 1 + easeOutQuad(clampedTime) * 5;
        updateOpacity(scale);
        controlsLocked = false;
    }

    mesh.scale.set(scale, scale, scale);

    if (scale >= 5 && !sphereRemoved) {
        updateOpacity(scale);
        removeObject();
    }

    updatePlaneVisibility();

    if (controls.isLocked === true) {
        const moveSpeed = 0.06;
        minlimitCameraHeight();
        maxlimitCameraHeight();
        const moveDirection = new THREE.Vector3();
        camera.getWorldDirection(moveDirection);
        camera.pointerSpeed = 0;

        moveDirection.normalize();

        let movement = new THREE.Vector3(0, 0, 0);
        if (moveForward) {
            movement.add(moveDirection);
        }
        if (moveBackward) {
            movement.sub(moveDirection);
        }
        if (moveLeft) {
            const leftDirection = new THREE.Vector3();
            camera.getWorldDirection(leftDirection);
            leftDirection.cross(camera.up).normalize();
            movement.sub(leftDirection);
        }
        if (moveRight) {
            const rightDirection = new THREE.Vector3();
            camera.getWorldDirection(rightDirection);
            rightDirection.cross(camera.up).normalize();
            movement.add(rightDirection);
        }

        if (movement.length() > 0) {
            movement.normalize().multiplyScalar(moveSpeed);
        }

        camera.position.add(movement);
    }

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();