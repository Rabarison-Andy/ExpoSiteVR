import './style.css'
import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

const canvas = document.getElementById('canvas')
const sizes = { width: window.innerWidth, height: window.innerHeight }

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 1, 10000)
camera.position.y = 1.9
camera.position.z = -4.875094274388068
camera.position.x = -20.286630116254027
camera.rotation.y = -3.141592653589793
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

const controls = new PointerLockControls(camera, document.body);

let cameraYaw = camera.rotation.y;
let cameraPitch = camera.rotation.x;
let targetYaw = camera.rotation.y;
let targetPitch = camera.rotation.x;
const smoothFactor = 0.08; 
let controlsLocked = true;

canvas.addEventListener('click', () => {
    if (isExhibitionStarted && paintingInfoWrapper.classList.contains('hidden')) {
        controls.lock();
        targetPitch = 0;
        cameraPitch = 0;
    }
});

document.addEventListener('mousemove', (event) => {
    if (controls.isLocked) {
        const sensitivity = 0.002;
        targetYaw -= event.movementX * sensitivity;
        targetPitch -= event.movementY * sensitivity;

        const maxPolarAngle = Math.PI / 2 - 0.1; 
        targetPitch = Math.max(-maxPolarAngle, Math.min(maxPolarAngle, targetPitch));
    }
});

const subtitlesDiv = document.getElementById('subtitles');
const subtitlesData = [
    { time: 1, text: "Tu te sens observée ? " },
    { time: 2, text: "Vois-tu," },
    { time: 3, text: "sans cesse," },
    { time: 4, text: "et ce depuis toujours," },
    { time: 5, text: "les femmes sont observées et appréciées pour leur beauté," },
    { time: 7, text: "leur élégance et leur capacité à être une bonne épouse." },
    { time: 11, text: "Seulement," },
    { time: 12, text: "tu n’es pas sans savoir" },
    { time: 13, text: "que," },
    { time: 14, text: "tout comme les hommes," },
    { time: 15, text: "la femme est capable de faire de grandes choses," },
    { time: 17, text: "pas vrai ?" },
    { time: 18, text: "Tu le sais, hein ?" },
    { time: 20, text: "La femme n’est pas une œuvre pour sa beauté," },
    { time: 23, text: "mais pour son humanité et sa singularité. " },
    { time: 25, text: "La Vision Valadon se lit à travers ce que la société considère comme des imperfections." },
    { time: 29, text: "Si la femme parfaite devrait remplir les critères de beauté," },
    { time: 32, text: "si c’était elle qui était mise en lumière." },
    { time: 34, text: "Suzanne Valadon apportait son regard vers la femme imparfaite ;" },
    { time: 37, text: "par son art," },
    { time: 39, text: "elle a su valoriser et apporter une nouvelle vision de l’imperfection." },
    { time: 44, text: "" }
];

const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const paintingInfoWrapper = document.getElementById('paintingInfoWrapper');
let isExhibitionStarted = false;

const paintingArtistText = document.getElementById('paintingArtist');
const paintingTitleText = document.getElementById('paintingTitle');
const paintingYearText = document.getElementById('paintingYear');
const paintingDescText = document.getElementById('paintingDescription');
const paintingImageElem = document.getElementById('paintingImage');

function showPaintingInfo(painting) {
    paintingArtistText.textContent = painting.artiste;
    paintingTitleText.textContent = painting.nom;
    paintingYearText.textContent = painting.date;
    paintingDescText.textContent = painting.desc;
    paintingImageElem.src = painting.img;

    paintingInfoWrapper.classList.remove('hidden');
    controls.unlock();
}

function hidePaintingInfo() {
    paintingInfoWrapper.classList.add('hidden');

    if (isExhibitionStarted) {
        controls.lock();
    }

    setTimeout(() => {
        paintingArtistText.textContent = '';
        paintingTitleText.textContent = '';
        paintingYearText.textContent = '';
        paintingDescText.textContent = '';
        paintingImageElem.src = '';
    }, 600);
}

document.getElementById('returnButton').addEventListener('click', hidePaintingInfo)

const listener = new THREE.AudioListener()
const audio = new THREE.Audio(listener)
let audioBufferLoaded = false
let audioStarted = false

const audioLoader = new THREE.AudioLoader()
audioLoader.load('/assets/voices/Intro.ogg', (buffer) => {
    audio.setBuffer(buffer)
    audio.setLoop(false)
    audioBufferLoaded = true
})

const video = document.getElementById('video')
video.src = '/assets/videos/Eyes.mp4'
video.load()

let videoTexture
const setupVideoTexture = () => {
    videoTexture = new THREE.VideoTexture(video)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter
    material.map = videoTexture
    material.needsUpdate = true
}
if (video.readyState >= 2) {
    setupVideoTexture()
} else {
    video.addEventListener('loadeddata', setupVideoTexture, { once: true })
}

const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2
plane.position.set(0, 0.001, 0)
scene.add(plane)

const geometry = new THREE.SphereGeometry(4, 64, 32)
const material = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    transparent: true,
})

const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(-20.286630116254027, 0.257, -4.875094274388068)
scene.add(mesh)

const textureLoader = new THREE.TextureLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)

const bakedTexture = textureLoader.load('/assets/modeles/untitled.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding
const bakedMaterials = new THREE.MeshPhongMaterial({ map: bakedTexture })
bakedMaterials.map.wrapS = THREE.RepeatWrapping
bakedMaterials.map.wrapT = THREE.RepeatWrapping

const collisionMeshes = []
const objectNames = []

loader.load('/assets/modeles/scene.gltf', (gltf) => {
    gltf.scene.scale.set(0.5, 0.5, 0.5)

    gltf.scene.traverse((node) => {
        if (!node.isMesh) return
        node.castShadow = true
        node.receiveShadow = true
        if (node.name === 'Plane') {
            node.material = bakedMaterials
        } else if (node.name.startsWith('uploads_files')) {
            objectNames.push(node.name)
        } else {
            collisionMeshes.push(node)
        }
    })

    scene.add(gltf.scene)
})

const paintings = {
    7: { id: 1, nom: "Portrait de Suzanne Valadon", artiste: "Henri de Toulouse-Lautrec", date: "1885", desc: "Toulouse-Lautrec et l'artiste ainsi que le modèle Suzanne Valadon étaient amis à Montmartre à Paris. Henri de Toulouse était un artiste très renommé à l'époque, tout comme Suzanne Valadon. Lautrec a réalisé de nombreux portraits de Valadon et l'a soutenue dans son parcours dans l'industrie artistique. Ils étaient considérés comme des amants par la ville de Montmartre jusqu'à ce que leurs relations prennent fin en 1888.Toulouse-Lautrec a créé ce portrait de Suzanne alors qu'elle marchait directement vers le spectateur dans ce qui semble être l'automne, car Lautrec met l'accent sur la couleur derrière Valadon. Il présente Suzanne comme très à la mode avec sa robe et son chapeau violets. La façon dont Lautrec utilise la lumière dans cette pièce est intrigante alors que Valadon se distingue de son arrière-plan, même avec des couleurs similaires vues tout au long du portrait.", img: "/assets/modeles/peintures/automne.jpg" },
    5: { id: 2, nom: "Autoportrait", artiste: "Suzanne Valadon", date: "1918", desc: "Autoportait de Suzanne Valadon peint en 1918, il est possible de lire \"pendant la guerre\"", img: "/assets/modeles/peintures/autoportrait-1.png" },
    2: { id: 3, nom: "Autoportrait", artiste: "Suzanne Valadon", date: "1898", desc: "Autoportait de Suzanne Valadon peint en 1898", img: "/assets/modeles/peintures/autoportrait-2.png" },
    18: { id: 4, nom: "La Chambre bleue", artiste: "Suzanne Valadon", date: "1923", desc: "La Chambre bleue est un tableau réalisé en 1923 par la peintre française Suzanne Valadon. Cette huile sur toile représente une femme étendue dans une chambre à coucher à la literie bleue, une cigarette aux lèvres et des livres à ses pieds.", img: "/assets/modeles/peintures/chambre-bleue.png" },
    1: { id: 5, nom: "Portrait de Mauricia Coquiot", artiste: "Suzanne Valadon", date: "1915", desc: "Mauricia Coquiot était la fille du critique d'art Gustave Coquiot et était elle-même une modèle fréquente pour de nombreux artistes de l'époque, dont Valadon.Dans ce portrait, Valadon capture avec habileté l'essence et la personnalité de Mauricia Coquiot. Son style artistique distinctif se manifeste par des traits expressifs, une utilisation subtile de la lumière et de l'ombre, ainsi qu'une palette de couleurs riche et nuancée.", img: "/assets/modeles/peintures/fleurs.png" },
    8: { id: 6, nom: "Autoportrait", artiste: "Suzanne Valadon", date: "1916", desc: "Dans cet autoportrait, Valadon se représente avec une expression intense et introspective. Son regard direct et sérieux capte l'attention du spectateur, tandis que les nuances de lumière et d'ombre mettent en valeur les contours de son visage. La palette de couleurs utilisée par Valadon est subtile mais expressive, créant une atmosphère intimiste et émotionnelle.", img: "/assets/modeles/peintures/autoportrait3.png" },
    17: { id: 7, nom: "La Natte (Suzanne Valadon)", artiste: "Pierre-Auguste Renoir", date: "1887", desc: "Dans ce portrait, Renoir a capturé la beauté naturelle et la personnalité charismatique de Valadon. Le titre \"La natte\" fait référence à la tresse que Suzanne Valadon porte dans ses cheveux, qui est mise en valeur dans le tableau. Renoir a utilisé sa technique distinctive de peinture impressionniste pour créer une atmosphère douce et lumineuse autour de Valadon, en mettant l'accent sur les couleurs et les formes plutôt que sur les détails minutieux. Ce portrait témoigne de la relation professionnelle et amicale entre Renoir et Valadon. Valadon a été modèle pour de nombreux artistes de renom, dont Renoir.", img: "/assets/modeles/peintures/la-natte.png" },
    11: { id: 8, nom: "Portrait de Madame Maurice Utrillo", artiste: "Suzanne Valadon", date: "1937", desc: "Aussi nommé Portrait de Lucie Valore", img: "/assets/modeles/peintures/russe.png" },
    21: { id: 9, nom: "Portrait de Suzanne Valadon", artiste: "Pierre-Auguste Renoir", date: "1885", desc: "Dans ce portrait, Renoir capture l'essence de Valadon avec une grande sensibilité. Il la représente avec une expression douce et contemplative, mettant en valeur sa beauté naturelle et son charme. La palette de couleurs est caractéristique du style impressionniste de Renoir, avec des tons chauds et lumineux qui illuminent le tableau.", img: "/assets/modeles/peintures/Sdouce.png" },
    13: { id: 10, nom: "Portrait de Suzanne Valadon", artiste: "Suzanne Valadon", date: "1927", desc: "Dans cet autoportrait, Valadon se représente avec une expression sérieuse et introspective. Son regard est direct et pénétrant, captant l'attention du spectateur. Elle semble réfléchir profondément, ce qui confère à l'œuvre une dimension psychologique intéressante.", img: "/assets/modeles/peintures/SMiroir.png" },
    14: { id: 11, nom: "Victorine ou la tigresse", artiste: "Suzanne Valadon", date: "1919", desc: "Dans ce portrait, Valadon dépeint Victorine Meurent, un modèle bien connu et une artiste elle-même, dans une pose audacieuse et dominante. Victorine est représentée avec une expression confiante, presque provocante, regardant directement le spectateur avec défi. Son attitude fier et sa posture assurée mettent en évidence sa personnalité forte et indépendante. Le titre \"La Tigresse\" évoque l'image d'une femme puissante et sauvage, associée à la force et à la détermination.", img: "/assets/modeles/peintures/victorine.png" }
}

let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false

const onKeyDown = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveForward = true; break
        case 'ArrowLeft':
        case 'KeyA': moveLeft = true; break
        case 'ArrowDown':
        case 'KeyS': moveBackward = true; break
        case 'ArrowRight':
        case 'KeyD': moveRight = true; break
    }
}

const onKeyUp = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveForward = false; break
        case 'ArrowLeft':
        case 'KeyA': moveLeft = false; break
        case 'ArrowDown':
        case 'KeyS': moveBackward = false; break
        case 'ArrowRight':
        case 'KeyD': moveRight = false; break
    }
}

document.addEventListener('keydown', onKeyDown)
document.addEventListener('keyup', onKeyUp)

const raycaster = new THREE.Raycaster()

function onClick(event) {
    if (!controls.isLocked) return

    raycaster.setFromCamera({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
    }, camera)

    const intersects = raycaster.intersectObjects(scene.children, true)
        .filter(i => i.object.isMesh && objectNames.includes(i.object.name))

    if (intersects.length > 0) {
        const hit = intersects[0]
        if (camera.position.distanceTo(hit.point) <= 4) {
            const painting = paintings[objectNames.indexOf(hit.object.name)]
            if (painting) {
                showPaintingInfo(painting)
            } else {
                console.log("Aucune peinture associée pour", hit.object.name)
            }
        }
    }
}

globalThis.addEventListener('click', onClick)

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

let clock;

startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    controls.lock();
    
    clock = new THREE.Clock(); 
    isExhibitionStarted = true;

    targetPitch = 0;
    cameraPitch = 0;
    targetYaw = -Math.PI;
    cameraYaw = -Math.PI;

    video.play();

    if (audioBufferLoaded && !audioStarted) {
        audioStarted = true;
        
        setTimeout(() => {
            audio.play();
            
            subtitlesDiv.style.display = 'block';
            subtitlesData.forEach(sub => {
                setTimeout(() => {
                    if (sub.text === "") {
                        subtitlesDiv.style.display = 'none'; // Cache la bulle quand c'est fini
                    } else {
                        subtitlesDiv.innerText = sub.text;
                    }
                }, sub.time * 1000); // *1000 pour convertir les secondes en millisecondes
            });

        }, 4000);
    }
});

function triggerTitleReveal() {
    const container = document.getElementById('titleReveal');
    const text = "Vision Imperfection";
    const words = text.split(' ');
    container.innerHTML = '';

    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.className = 'title-word';
        span.textContent = word;
        span.style.transitionDelay = `${index * 200}ms`;
        container.appendChild(span);

        void span.offsetWidth;

        setTimeout(() => span.classList.add('visible'), 50);

        setTimeout(() => {
            span.classList.remove('visible');
            span.classList.add('fade-out');
        }, 7000 + (index * 200));
    });
}

const easeOutQuad = (t) => t * (2 - t);

let sphereRemoved = false

const updateOpacity = (scale) => {
    const maxScale = 2
    if (scale >= maxScale) {
        mesh.material.opacity = 1 - (scale - maxScale) / (maxScale / 2)
    }
}

const removeObject = () => {
    if (!sphereRemoved) {
        mesh.geometry.dispose()
        mesh.material.dispose()
        scene.remove(mesh)
        sphereRemoved = true
    }
}

// --- CONFIGURATION DÉPLACEMENT ET COLLISIONS ---
const walkSpeed = 2.5;
// CORRECTION ICI : 0.8 au lieu de 2.3 pour la taille de ta hitbox !
const collisionDistance = 0.8; 
const collisionRaycaster = new THREE.Raycaster();
let prevTime = performance.now();

const tick = () => {
    // Calcul constant du temps pour éviter un bond géant
    const time = performance.now();
    let deltaMove = (time - prevTime) / 1000;
    prevTime = time;

    // Arrêt de sécurité au démarrage si on n'a pas encore cliqué
    if (!clock) {
        renderer.render(scene, camera);
        globalThis.requestAnimationFrame(tick);
        return; 
    }

    // Sécurité au cas où on perd le focus (pour éviter de traverser les murs)
    deltaMove = Math.min(deltaMove, 0.1);

    const elapsedTime = clock.getElapsedTime()
    const waitingTime = 19
    const scaleSpeed = 0.15
    let scale = 1

    if (videoTexture) videoTexture.needsUpdate = true

    if (elapsedTime >= waitingTime) {
        const clampedTime = Math.min((elapsedTime - waitingTime) * scaleSpeed, 1)
        scale = 1 + easeOutQuad(clampedTime) * 5
        updateOpacity(scale)
        controlsLocked = false
    }

    if (mesh) {
        mesh.scale.set(scale, scale, scale)
        if (scale >= 5 && !sphereRemoved) {
            updateOpacity(scale)
            removeObject()
            triggerTitleReveal() 
        }
    }

    plane.visible = !sphereRemoved

    if (controls.isLocked) {
        cameraYaw += (targetYaw - cameraYaw) * smoothFactor;
        cameraPitch += (targetPitch - cameraPitch) * smoothFactor;
        camera.rotation.set(cameraPitch, cameraYaw, 0, 'YXZ');

        // On bloque UNIQUEMENT le déplacement physique pendant les 21 premières secondes
        if (elapsedTime >= 21) {
            let moveX = 0;
            let moveZ = 0;
            if (moveForward) moveZ -= 1;
            if (moveBackward) moveZ += 1;
            if (moveLeft) moveX -= 1;
            if (moveRight) moveX += 1;

            if (moveX !== 0 || moveZ !== 0) {
                const dirLocal = new THREE.Vector3(moveX, 0, moveZ).normalize();
                const moveMatrix = new THREE.Matrix4().makeRotationY(cameraYaw);
                const dirGlobal = dirLocal.applyMatrix4(moveMatrix);
                const distance = walkSpeed * deltaMove;

                // Test axe X - Sécurisation des vecteurs
                const dirGlobalX = new THREE.Vector3(dirGlobal.x, 0, 0);
                if (dirGlobalX.lengthSq() > 0.0001) {
                    dirGlobalX.normalize();
                    collisionRaycaster.set(camera.position, dirGlobalX);
                    const hitsX = collisionRaycaster.intersectObjects(collisionMeshes, false);
                    if (!(hitsX.length > 0 && hitsX[0].distance < collisionDistance)) {
                        camera.position.x += dirGlobal.x * distance;
                    }
                }

                // Test axe Z - Sécurisation des vecteurs
                const dirGlobalZ = new THREE.Vector3(0, 0, dirGlobal.z);
                if (dirGlobalZ.lengthSq() > 0.0001) {
                    dirGlobalZ.normalize();
                    collisionRaycaster.set(camera.position, dirGlobalZ);
                    const hitsZ = collisionRaycaster.intersectObjects(collisionMeshes, false);
                    if (!(hitsZ.length > 0 && hitsZ[0].distance < collisionDistance)) {
                        camera.position.z += dirGlobal.z * distance;
                    }
                }
            }
        }
    }

    renderer.render(scene, camera)
    globalThis.requestAnimationFrame(tick)
}

tick()