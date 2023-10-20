import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';



// Your JSON data in the format of an array of objects
const data = [{"Cost":2,"Reason":"Food","count":5},{"Cost":3,"Reason":"Food","count":2},{"Cost":3,"Reason":"Obligatory","count":1},{"Cost":4,"Reason":"Food","count":1},{"Cost":4,"Reason":"Obligatory","count":1},{"Cost":5,"Reason":"Food","count":11},{"Cost":5,"Reason":"Homecare","count":1},{"Cost":6,"Reason":"Food","count":4},{"Cost":7,"Reason":"Food","count":8},{"Cost":7,"Reason":"Obligatory","count":1},{"Cost":8,"Reason":"Food","count":5},{"Cost":8,"Reason":"Travel","count":1},{"Cost":9,"Reason":"Food","count":3},{"Cost":10,"Reason":"Food","count":5},{"Cost":10,"Reason":"Obligatory","count":1},{"Cost":10,"Reason":"Travel","count":1},{"Cost":11,"Reason":"Food","count":1},{"Cost":11,"Reason":"Travel","count":1},{"Cost":12,"Reason":"Food","count":2},{"Cost":12,"Reason":"Travel","count":10},{"Cost":13,"Reason":"Food","count":1},{"Cost":13,"Reason":"Homecare","count":1},{"Cost":14,"Reason":"Food","count":1},{"Cost":15,"Reason":"Food","count":1},{"Cost":15,"Reason":"Obligatory","count":1},{"Cost":16,"Reason":"Health","count":1},{"Cost":18,"Reason":"Food","count":1},{"Cost":18,"Reason":"Homecare","count":1},{"Cost":20,"Reason":"Food","count":1},{"Cost":20,"Reason":"Homecare","count":3},{"Cost":20,"Reason":"Obligatory","count":1},{"Cost":22,"Reason":"Food","count":2},{"Cost":23,"Reason":"Travel","count":3},{"Cost":25,"Reason":"Travel","count":1},{"Cost":35,"Reason":"Obligatory","count":1},{"Cost":40,"Reason":"Food","count":1},{"Cost":50,"Reason":"Food","count":1},{"Cost":56,"Reason":"Travel","count":1},{"Cost":80,"Reason":"Travel","count":1},{"Cost":80,"Reason":"Travel ","count":1},{"Cost":185,"Reason":"Travel","count":1}];
  

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set( 5, 0, 20 );

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

//RENDERER
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setSize( window.innerWidth, window.innerHeight );

//ORBIT CONTROLS
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.enableZoom = true;
controls.target.set(4.5, 0, 4.5);
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


// Group the data by "Reason" and calculate the sum of "Cost" and "count"
const groupedData = data.reduce((result, item) => {
  if (!result[item.Reason]) {
    result[item.Reason] = { Cost: 0, count: 0 };
  }
  result[item.Reason].Cost += item.Cost * item.count;
  result[item.Reason].count += item.count;
  return result;
}, {});

// Sort the grouped data by the sum of costs in descending order
const sortedData = Object.keys(groupedData).sort((a, b) => groupedData[b].Cost - groupedData[a].Cost);

function getDaysBetweenDates(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  const diffDays = Math.round((endDate - startDate) / oneDay);
  return diffDays;
}

const totalcost = data.reduce((acc, item) => acc + item.Cost * item.count, 0);
console.log(`Total days between the two dates: ${totalcost}`);

const startDate = new Date('2023-09-12'); // Specify your start date
const endDate = new Date('2023-10-20');   // Specify your end date
const totalDays = getDaysBetweenDates(startDate, endDate);

// Now, 'totalDays' holds the total number of days between the two dates
console.log(`Total days between the two dates: ${totalDays}`);

// Define colors for the top 5 reasons
const topReasonColors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00];



const textLabels = [];
const textLabels2 = [];
const textLabels3 = [];
const yOffset = -5;
const xOffset = -0.25 * sortedData.length; // Adjust the initial xOffset


// Load the font
const fontLoader = new THREE.FontLoader();
fontLoader.load('https://cdn.skypack.dev/three@0.129.0/examples/fonts/helvetiker_regular.typeface.json', (font) => {
  const floatingParticles = [];
  const formedParticles = new THREE.Group();
  
  function createFloatingParticle(color) {
    const particleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: color });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
  
    particle.position.x = Math.random() * 20 - 5;
    particle.position.y = Math.random() * 20 - 5;
    particle.position.z = Math.random() * 20 - 5;
  
    particle.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
    );
  
    scene.add(particle);
    floatingParticles.push(particle);
  }
  
  function createParticleBar(cost, color, xOffset, label) {
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
  
    const numParticles = cost.Cost;
    const particleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: color });
  
    for (let i = 0; i < numParticles; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.x = xOffset + (i % 10) * 0.2;
      particle.position.y = yOffset + Math.floor(i / 10) * 0.2;
      particle.userData = { reason: label, cost: cost.Cost };
      particleGroup.add(particle);
    }
  
    const textGeometry = new THREE.TextGeometry(`${label}\nTotal Cost: ${cost.Cost}`, {
      font: font,
      size: 0.2,
      height: 0.02,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textLabel = new THREE.Mesh(textGeometry, textMaterial);
  
    textLabel.position.x = xOffset;
    textLabel.position.y = yOffset - 0.4;
    textLabel.position.z = 0;
  
    scene.add(textLabel);
    textLabels.push(textLabel);

    const textGeometry2 = new THREE.TextGeometry(`Total Days: ${totalDays}`, {
      font: font,
      size: 0.4,
      height: 0.02,
    });
    const textMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textLabel2 = new THREE.Mesh(textGeometry2, textMaterial2);
  
    textLabel2.position.x = 7;
    textLabel2.position.y = yOffset + 12;
    textLabel2.position.z = 0;
  
    scene.add(textLabel2);
    textLabels2.push(textLabel2);

    const textGeometry3 = new THREE.TextGeometry(`Total Cost: ${totalcost}`, {
      font: font,
      size: 0.4,
      height: 0.02,
    });
    const textMaterial3 = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textLabel3 = new THREE.Mesh(textGeometry3, textMaterial3);
  
    textLabel3.position.x = 7;
    textLabel3.position.y = yOffset + 11;
    textLabel3.position.z = 0;
  
    scene.add(textLabel3);
    textLabels3.push(textLabel3);
  }


  
  function slowDownFloatingParticles() {
    floatingParticles.forEach((particle) => {
      particle.velocity.x *= 200; // Adjust the multiplier for slower speed reduction
      particle.velocity.y *= 200;
      particle.velocity.z *= 200;
    });
  }
  
  function formParticlesIntoBars() {
    for (let i = 0; i < Math.min(5, sortedData.length); i++) {
      const reason = sortedData[i];
      const color = new THREE.Color(topReasonColors[i]);
      createParticleBar(groupedData[reason], color, i * 2, reason);
    }
  
    slowDownFloatingParticles(); // Gradually reduce the floating speed
  
    //floatingParticles.forEach((particle) => {
      //scene.remove(particle);
    //});
  
    scene.add(formedParticles);
  }
  
  let lastTouchTime = 0;
  const doubleTapDelay = 300; // You can adjust this value as needed
  
  let initialTouch = null;
  
  document.addEventListener("keydown", (event) => {
    if (event.key === "k" || event.key === "K") {
      formParticlesIntoBars();
    }
  });
  
  document.addEventListener("touchstart", (event) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTouchTime;
    
    if (tapLength < doubleTapDelay && tapLength > 0) {
      // This is a double-tap
      formParticlesIntoBars();
      event.preventDefault(); // Prevent the default behavior, like zooming or scrolling
    }
    
    lastTouchTime = currentTime;
    
    // Store the initial touch for pinch-to-zoom
    initialTouch = event.touches[0];
  });
  
  document.addEventListener("touchmove", (event) => {
    if (initialTouch && event.touches.length === 2) {
      // Detect a pinch gesture using two fingers
      const distance = Math.hypot(
        event.touches[0].clientX - event.touches[1].clientX,
        event.touches[0].clientY - event.touches[1].clientY
      );
  
      const initialDistance = Math.hypot(
        initialTouch.clientX - event.touches[0].clientX,
        initialTouch.clientY - event.touches[0].clientY
      );
  
      if (distance > initialDistance) {
        // Zoom in
        // You can implement your zooming logic here
      } else {
        // Zoom out
        // You can implement your zooming logic here
      }
  
      // Reset the initial touch
      initialTouch = null;
    }
  });
  
  
  for (let i = 0; i < 2000; i++) {
    const color = new THREE.Color(Math.random() * 0xffffff);
    createFloatingParticle(color);
  }

  
  const animate = function () {
    requestAnimationFrame(animate);

    floatingParticles.forEach((particle) => {
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.position.z += particle.velocity.z;
    });
  
    renderer.render(scene, camera);
    controls.update()

    //window.onresize = function () {
      //const width = window.innerWidth;
      //const height = window.innerHeight;
      //camera.aspect = width / height;
      //camera.updateProjectionMatrix();
      //renderer.setSize( width, height );
    //};
  };
  




  animate();

  // Event listener for mouse click
  document.addEventListener('click', onDocumentMouseClick, false);

  function onDocumentMouseClick(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      const reason = object.userData.reason;
      const cost = object.userData.cost;
      // Here you can display the information as you prefer
      console.log(`Reason: ${reason}, Total Cost: ${cost}`);
    }
  }
});