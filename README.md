# ExpositionVR

**ExpositionVR** est un projet d'exposition 3D virtuelle construit avec [Three.js](https://threejs.org/) et `JavaScript` standard. Ce projet permet de visualiser une galerie immersive avec des objets 3D et des fichiers audio intégrés, conçue pour une expérience en réalité virtuelle ou augmentée.

## Installation

### Prérequis
- **Node.js** (version recommandée : 14.x ou plus)
- **npm** (inclus avec Node.js)

### Étapes d'installation

1. **Cloner le dépôt**  
   Cloner le dépôt en local avec :

   ```bash
   git clone https://github.com/votre-utilisateur/ExpositionVR.git
   ```

2. **Naviguer dans le dossier du projet**  
   Une fois le dépôt cloné, ouvrez le dossier du projet :

   ```bash
   cd ExpositionVR
   ```

3. **Installer les dépendances**  
   Installez toutes les dépendances du projet avec la commande suivante :

   ```bash
   npm install
   ```

4. **Lancer le serveur de développement**  
   Pour lancer le serveur local en mode développement, exécutez :

   ```bash
   npm run start
   ```

   Cette commande lance Vite, un outil de développement rapide qui permet de visualiser le projet en local sur [http://localhost:5173](http://localhost:5173).

5. **Aperçu du projet en production**  
   Pour tester la version de production après la construction du projet, vous pouvez exécuter :

   ```bash
   npm run build
   npm run preview
   ```

   Cela créera un dossier `dist` et servira le contenu pour un aperçu final.

## Notes spéciales

- **Lecture des fichiers audio en local**  
  En local, les fichiers audio devraient se lancer automatiquement lors de l'interaction avec des objets spécifiques dans la scène 3D. Pour une bonne expérience, assurez-vous que les permissions pour l'audio dans votre navigateur sont activées.
