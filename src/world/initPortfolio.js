// world/initPortfolio.js
import * as THREE from 'three';

export function initPortfolio(scene, curve) {
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
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 16),
      new THREE.MeshBasicMaterial({ color: 0x3498db, wireframe: true })
    );

    const position = curve.getPointAt(item.progress).add(item.offset);
    sphere.position.copy(position);
    sphere.userData = item;
    sphere.name = 'a glowing portfolio sphere';

    const light = new THREE.PointLight(0x3498db, 2, 8);
    light.position.copy(position);

    scene.add(sphere);
    scene.add(light);
    interactiveSpheres.push(sphere);
  });

  return interactiveSpheres;
}
