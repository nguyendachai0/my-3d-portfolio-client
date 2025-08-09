import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
    import { Water } from 'three/addons/objects/Water.js';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    const gltfLoader = new GLTFLoader();
    let robot, mixer;

    gltfLoader.load('/models/marie_skullgirls.glb', (gltf) => {
      robot = gltf.scene;
      robot.scale.set(1.5, 1.5, 1.5);
      robot.position.set(0, 0, -100);
      scene.add(robot);

      // Animation setup
      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(robot);
        const walkAction = mixer.clipAction(gltf.animations[0]);
        walkAction.play();
      }
    });


    const scene = new THREE.Scene();
    const skyColor = 0x87ceeb;
    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.Fog(skyColor, 50, 200);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // GPT Chatbot orb (floating, glowing assistant)
    const chatbotGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const chatbotMaterial = new THREE.MeshStandardMaterial({
      color: 0x9933ff,
      emissive: 0x9933ff,
      emissiveIntensity: 1.2,
      metalness: 0.5,
      roughness: 0.2
    });
    const chatbotOrb = new THREE.Mesh(chatbotGeometry, chatbotMaterial);
    chatbotOrb.position.set(0, 3, -100); // Place far end of the path
    scene.add(chatbotOrb);

    const chatbotGlow = new THREE.PointLight(0x9933ff, 1.5, 10);
    chatbotGlow.position.copy(chatbotOrb.position);
    scene.add(chatbotGlow);


    const sun = new THREE.DirectionalLight(0xffffff, 4.0);
    sun.position.set(10, 20, 10);
    scene.add(sun);
    const ambient = new THREE.AmbientLight(0xcccccc, 1.0);
    scene.add(ambient);

    const pathPoints = [
      new THREE.Vector3(0, 0, 50),
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(20, 0, -10),
      new THREE.Vector3(-10, 0, -30),
      new THREE.Vector3(-30, 0, -50),
      new THREE.Vector3(-10, 0, -70),
      new THREE.Vector3(20, 0, -90)
    ];
    const curve = new THREE.CatmullRomCurve3(pathPoints);
    const textureLoader = new THREE.TextureLoader();
    const tileColorMap = textureLoader.load('assets/textures/Tiles107_2K-JPG_Color.jpg');
    tileColorMap.wrapS = tileColorMap.wrapT = THREE.RepeatWrapping;
    tileColorMap.repeat.set(120, 3);
    const pathMaterial = new THREE.MeshStandardMaterial({ map: tileColorMap, roughness: 0.5 });
    const pathGeometry = new THREE.TubeGeometry(curve, 200, 2, 12, false);
    const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
    scene.add(pathMesh);

    const waterGeometry = new THREE.PlaneGeometry(500, 500);
    const water = new Water(waterGeometry, {
      textureWidth: 512, textureHeight: 512,
      waterNormals: textureLoader.load('assets/textures/WaterNormal.png', t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; }),
      sunDirection: sun.position.clone().normalize(), sunColor: 0xffffff, waterColor: 0x00BFFF,
      distortionScale: 3.0, fog: true, transparent: true, opacity: 0.7
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.5;
    scene.add(water);

    const fallbackGround = new THREE.Mesh(
      new THREE.PlaneGeometry(500, 500),
      new THREE.MeshStandardMaterial({ visible: false })
    );
    fallbackGround.rotation.x = -Math.PI / 2;
    fallbackGround.position.y = -1;
    scene.add(fallbackGround);

    const portfolioItems = [
  {
    title: 'About Me',
    description: "I'm a fullstack developer with a backend focus, building scalable systems and modern UIs.",
    tags: ['Java', 'Node.js', 'PHP'],
    progress: 0.1,
    offset: new THREE.Vector3(4, 1.8, 0)
  },
  {
    title: 'Core Competencies',
    description: 'Experienced in RESTful APIs, Docker, Redis, CI/CD, and backend-heavy architecture.',
    tags: ['PostgreSQL', 'Redis', 'Docker', 'CI/CD'],
    progress: 0.2,
    offset: new THREE.Vector3(-4, 1.8, 0)
  },
  {
    title: 'Freelance Projects',
    description: 'Delivered full-cycle websites: backend APIs, authentication flows, and UI improvements.',
    tags: ['Laravel', 'Tailwind', 'Auth'],
    progress: 0.35,
    offset: new THREE.Vector3(4, 1.8, 0)
  },
  {
  title: 'FPT Software Experience',
  description: 'Worked as a Junior Software Engineer modernizing legacy enterprise systems in Java.',
  tags: ['Java', 'Struts', 'JUnit'],
  progress: 0.45,
  offset: new THREE.Vector3(-4, 1.8, 0)
  },
  {
    title: 'Chrome Extension: Content Gap Detector',
    description: 'Analyzed YouTube Shorts in real-time to find trending opportunities using YouTube API.',
    tags: ['JavaScript', 'Chrome Extension', 'YouTube API'],
    progress: 0.58,
    offset: new THREE.Vector3(4, 1.8, 0)
  },
  {
    title: 'BeePoly Social Platform',
    description: 'Built real-time features like chat, posts, and secure auth using Laravel and React.',
    tags: ['Laravel', 'React', 'Docker'],
    progress: 0.7,
    offset: new THREE.Vector3(-4, 1.8, 0)
  },
  {
    title: 'Education & Certifications',
    description: 'FPT Polytechnic, GPA: 3.67, TOEIC 825, JS/Data Structures, AWS, CCNA.',
    tags: ['GPA 3.67', 'TOEIC 825', 'AWS', 'CCNA'],
    progress: 0.85,
    offset: new THREE.Vector3(4, 1.8, 0)
  }
];

    const interactiveSpheres = [];
    portfolioItems.forEach(item => {
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16), new THREE.MeshBasicMaterial({ color: 0x3498db, wireframe: true }));
      const position = curve.getPointAt(item.progress).add(item.offset);
      sphere.position.copy(position);
      const pointLight = new THREE.PointLight(0x3498db, 2, 8);
      pointLight.position.copy(position);
      sphere.userData = item;
      scene.add(sphere);
      scene.add(pointLight);
      interactiveSpheres.push(sphere);
    });

    const controls = new PointerLockControls(camera, document.body);
    const infoOverlay = document.getElementById('info-overlay');
    const hud = document.getElementById('crosshair-hud');
    const projectPanel = document.getElementById('project-panel');
    document.body.addEventListener('click', () => {
        controls.lock() 

        const bgMusic = document.getElementById('bg-music');
        const waterSound = document.getElementById('water-sound');
        bgMusic.volume = 0.4;
        waterSound.volume = 0.3;

        bgMusic.play().catch(e => console.warn('BG Music blocked:', e));
        waterSound.play().catch(e => console.warn('Water sound blocked:', e));

    });
    controls.addEventListener('lock', () => { infoOverlay.classList.add('hidden'); hud.style.display = 'block'; });
    controls.addEventListener('unlock', () => { infoOverlay.classList.remove('hidden'); hud.style.display = 'none'; });

    const keys = {
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false
    };
    document.addEventListener('keydown', (event) => {
       console.log('Key down:', event.code);
      keys[event.code] = true
    });
    document.addEventListener('keyup', (event) => keys[event.code] = false);

    const playerHeight = 1.8;
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const clock = new THREE.Clock();
    const interactionDistance = 4;
    const raycaster = new THREE.Raycaster();

    const startPoint = curve.getPointAt(0);
    camera.position.set(startPoint.x, playerHeight + 0.5, startPoint.z);

    raycaster.set(camera.position.clone(), new THREE.Vector3(0, -1, 0));
    const initialHits = raycaster.intersectObjects([pathMesh, fallbackGround], true);
    if (initialHits.length > 0) {
    camera.position.y = initialHits[0].point.y + playerHeight;
    }

    const cycleDuration = 60; // 60 seconds for a full day
    const skyDayColor = new THREE.Color(0x87ceeb); // blue sky
    const skyNightColor = new THREE.Color(0x0a0a2a); // dark night

    const fogDayColor = new THREE.Color(0x87ceeb);
    const fogNightColor = new THREE.Color(0x0a0a2a);

    const moonLight = new THREE.DirectionalLight(0x9999ff, 0.5);
    moonLight.position.set(-10, -20, -10);
    scene.add(moonLight);

    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const starVertices = [];
    const starColors = [];

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 800;
      const y = Math.random() * 300 + 100;
      const z = (Math.random() - 0.5) * 800;
      starVertices.push(x, y, z);

      const brightness = Math.random() * 0.8 + 0.2; // subtle flicker
      starColors.push(brightness, brightness, brightness);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 1.2, // bigger stars
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // ✨ makes glow effect

    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);


    // Shooting Stars
    // 🌠 Define the trail points first
    const starTrailPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 0, 0.2),
      new THREE.Vector3(2, 0, 0.4)
    ];

    // 🌠 Then use them to create geometry
    const shootingStarGeometry = new THREE.BufferGeometry().setFromPoints(starTrailPoints);

    // 🌠 Define the glowing material
    const shootingStarMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      linewidth: 2, // Browsers ignore this unless using WebGL2 & special support
      blending: THREE.AdditiveBlending,
    });

    // 🌠 Array to hold shooting stars
    const shootingStars = [];

    // 🌠 Shooting star spawner
    function spawnShootingStar() {
      const star = new THREE.Line(shootingStarGeometry, shootingStarMaterial.clone());
      star.position.set(
        (Math.random() - 0.5) * 200,
        Math.random() * 100 + 100,
        (Math.random() - 0.5) * 200
      );
      star.material.opacity = 1;
      scene.add(star);
      shootingStars.push({ mesh: star, speed: Math.random() * 0.5 + 0.5 });
    }

      // Textures for sun/moon
    const sunTexture = textureLoader.load('assets/textures/sun.jpg');   // Replace with your path
    const moonTexture = textureLoader.load('assets/textures/moon.jpg'); // Replace with your path

    // Sun with emissive material
    const sunSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 32, 32),
      new THREE.MeshStandardMaterial({
        map: sunTexture,
        emissive: 0xffcc33,
        emissiveIntensity: 1,
        roughness: 0.5
      })
    );
    scene.add(sunSphere);

    // Moon as a 3D sphere with glow
    const moonSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshStandardMaterial({
        map: moonTexture,            // Reuse your loaded moon texture
        emissive: 0x8888ff,          // Soft blue glow
        emissiveIntensity: 0.4,
        roughness: 1,
        metalness: 0.1
      })
    );
    scene.add(moonSphere);



    const sunGlow = new THREE.PointLight(0xffaa33, 1.5, 100, 2); // warm orange glow
    scene.add(sunGlow);

    const moonGlow = new THREE.PointLight(0x8888ff, 0.4, 50, 2); // cool blue glow
    scene.add(moonGlow);

    let robotDirection = 1; // +1 or -1
    let patrolStart = -100;
    let patrolEnd = -90;

    
    

    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

          // Animate robot if loaded
      if (robot) {
        robot.position.z += delta * robotDirection * 2;

        // Flip direction at patrol boundaries
        if (robot.position.z > patrolEnd || robot.position.z < patrolStart) {
          robotDirection *= -1;
          robot.rotation.y += Math.PI; // turn around
        }
      }

      if (controls.isLocked === true) {
        raycaster.set(camera.position.clone(), new THREE.Vector3(0, -1, 0));
        const intersections = raycaster.intersectObjects([pathMesh, fallbackGround], true);
        const onGround = intersections.length > 0 && intersections[0].distance <= playerHeight + 0.2;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 30.0 * delta;

        direction.z = Number(keys['KeyW']) - Number(keys['KeyS']);
        direction.x = Number(keys['KeyD']) - Number(keys['KeyA']);
        
        if (direction.length() > 0) {
          direction.normalize();
          if (keys['KeyW'] || keys['KeyS']) velocity.z += direction.z * 100.0 * delta;
          if (keys['KeyA'] || keys['KeyD']) velocity.x += direction.x * 100.0 * delta;
        }

        controls.moveRight(velocity.x * delta);
        controls.moveForward(velocity.z * delta);
        camera.position.y += velocity.y * delta;

        if (onGround) {
          velocity.y = 0;
          camera.position.y = intersections[0].point.y + playerHeight;
        }

        if (camera.position.y < -20) {
          velocity.set(0, 0, 0);
          camera.position.set(startPoint.x, playerHeight + 0.5, startPoint.z);
        }
      }

      const chatBox = document.getElementById('chat-box');
      if (robot) {
      const distanceToRobot = camera.position.distanceTo(robot.position);
      if (distanceToRobot < 4) {
        chatBox.style.display = 'flex';
      } else {
        chatBox.style.display = 'none';
      }
    }



      water.material.uniforms['time'].value += delta;

      let isNearObject = false;

      // Simulate time of day
      const elapsedTime = clock.getElapsedTime();
      const cycleProgress = (elapsedTime % cycleDuration) / cycleDuration;
      const angle = cycleProgress * Math.PI * 2;

      // 👇 FIX: Declare isDay before using it
      const isDay = sun.position.y > 0;

      // Stars twinkle 
      const positions = starsGeometry.attributes.position;
      for (let i = 0; i < starColors.length; i += 3) {
        const flicker = 0.8 + Math.sin(elapsedTime * 5 + i) * 0.2;
        starsMaterial.opacity = isDay ? 0 : flicker * 0.8;
      }

      // Move sun
      const sunX = Math.sin(angle) * 30;
      const sunY = Math.cos(angle) * 30;
      sun.position.set(sunX, sunY, 10);
      sunSphere.position.copy(sun.position);
      sunGlow.position.copy(sun.position);

      // Move moon (opposite side)
      const moonX = -Math.sin(angle) * 30;
      const moonY = -Math.cos(angle) * 30;
      moonLight.position.set(moonX, moonY, -10);
      moonSphere.position.copy(moonLight.position);
      moonGlow.position.copy(moonLight.position);

      // Update glow intensity
      sunGlow.intensity = isDay ? 1.5 : 0;
      moonGlow.intensity = isDay ? 0 : 0.4;

            // Randomly spawn shooting stars
      if (Math.random() < 0.01 && isDay === false) {
        spawnShootingStar();
      }

      // Animate shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.mesh.position.x += star.speed * 2;
        star.mesh.position.y -= star.speed;
        star.mesh.material.opacity -= 0.01;

        if (star.mesh.material.opacity <= 0) {
          scene.remove(star.mesh);
          shootingStars.splice(i, 1);
        }
      }


      // Background & fog transitions
      const skyColor = isDay ? skyDayColor : skyNightColor;
      const fogColor = isDay ? fogDayColor : fogNightColor;
      const ambientIntensity = isDay ? 1.0 : 0.3;
      const starOpacity = isDay ? 0 : 0.8;

      scene.background.lerp(skyColor, 0.05);
      scene.fog.color.lerp(fogColor, 0.05);
      ambient.intensity += (ambientIntensity - ambient.intensity) * 0.05;
      starsMaterial.opacity += (starOpacity - starsMaterial.opacity) * 0.05;



      for (const sphere of interactiveSpheres) {
        
        sphere.rotation.y += 0.01;
        const distance = camera.position.distanceTo(sphere.position);
        if (distance < interactionDistance) {
          isNearObject = true;
          document.getElementById('panel-title').textContent = sphere.userData.title;
          document.getElementById('panel-description').textContent = sphere.userData.description;
          document.getElementById('panel-tags').innerHTML = sphere.userData.tags.map(tag => `<span>${tag}</span>`).join('');
          projectPanel.classList.add('visible');
          break;
        }
      }

      if (!isNearObject) {
        projectPanel.classList.remove('visible');
      }

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });