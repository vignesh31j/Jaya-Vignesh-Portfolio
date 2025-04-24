const cursor = document.getElementById("cursor");
const amount = 20;
const sineDots = Math.floor(amount * 0.3);
const width = 26;
const idleTimeout = 150;
let lastFrame = 0;
let mousePosition = { x: 0, y: 0 };
let dots = [];
let timeoutID;
let idle = false;

class Dot {
  constructor(index = 0) {
    this.index = index;
    this.anglespeed = 0.05;
    this.x = 0;
    this.y = 0;
    this.scale = 1 - 0.05 * index;
    this.range = width / 2 - width / 2 * this.scale + 2;
    this.limit = width * 0.75 * this.scale;
    this.element = document.createElement("span");
    TweenMax.set(this.element, { scale: this.scale });
    cursor.appendChild(this.element);
  }

  lock() {
    this.lockX = this.x;
    this.lockY = this.y;
    this.angleX = Math.PI * 2 * Math.random();
    this.angleY = Math.PI * 2 * Math.random();
  }

  draw(delta) {
    if (!idle || this.index <= sineDots) {
      TweenMax.set(this.element, { x: this.x, y: this.y });
    } else {
      this.angleX += this.anglespeed;
      this.angleY += this.anglespeed;
      this.y = this.lockY + Math.sin(this.angleY) * this.range;
      this.x = this.lockX + Math.sin(this.angleX) * this.range;
      TweenMax.set(this.element, { x: this.x, y: this.y });
    }
  }
}

function initCursor() {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("touchmove", onTouchMove);
  lastFrame += new Date();
  buildDots();
  render();
}

function startIdleTimer() {
  timeoutID = setTimeout(goInactive, idleTimeout);
  idle = false;
}

function resetIdleTimer() {
  clearTimeout(timeoutID);
  startIdleTimer();
}

function goInactive() {
  idle = true;
  for (let dot of dots) {
    dot.lock();
  }
}

function buildDots() {
  for (let i = 0; i < amount; i++) {
    let dot = new Dot(i);
    dots.push(dot);
  }
}

const onMouseMove = event => {
  mousePosition.x = event.clientX - width / 2;
  mousePosition.y = event.clientY - width / 2;
  resetIdleTimer();
};

const onTouchMove = event => {
  mousePosition.x = event.touches[0].clientX - width / 2;
  mousePosition.y = event.touches[0].clientY - width / 2;
  resetIdleTimer();
};

const render = timestamp => {
  const delta = timestamp - lastFrame;
  positionCursor(delta);
  lastFrame = timestamp;
  requestAnimationFrame(render);
};

const positionCursor = delta => {
  let x = mousePosition.x;
  let y = mousePosition.y;
  dots.forEach((dot, index, dots) => {
    let nextDot = dots[index + 1] || dots[0];
    dot.x = x;
    dot.y = y;
    dot.draw(delta);
    if (!idle || index <= sineDots) {
      const dx = (nextDot.x - dot.x) * 0.35;
      const dy = (nextDot.y - dot.y) * 0.35;
      x += dx;
      y += dy;
    }
  });
};

initCursor();





document.addEventListener('DOMContentLoaded', () => {
  const scrollAmount = 350; // Adjust based on your image + gap

  document.querySelectorAll('.servicecontainer').forEach(container => {
    const content = container.querySelector('.service_content');
    const leftBtn = container.querySelector('.arrowup');
    const rightBtn = container.querySelector('.arrowdown');

    // Clone elements for infinite effect
    const imgs = content.querySelectorAll('a');
    imgs.forEach(img => {
      const clone = img.cloneNode(true);
      content.appendChild(clone);
    });

    leftBtn.addEventListener('click', () => {
      content.scrollLeft -= scrollAmount;

      // Loop to end if scroll is near the start
      if (content.scrollLeft <= 0) {
        content.scrollLeft += content.scrollWidth / 2;
      }
    });

    rightBtn.addEventListener('click', () => {
      content.scrollLeft += scrollAmount;

      // Loop to start if scroll is near the end
      if (content.scrollLeft >= content.scrollWidth / 2) {
        content.scrollLeft -= content.scrollWidth / 2;
      }
    });
  });
});





// Partical animation for the banner page

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Modify the Particle class to handle movement towards the cursor
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
    this.speed = 1; // Speed of particle movement
    this.attractionStrength = 0.05; // How strongly the particle is attracted to the cursor
  }

  // Draw individual particle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  // Update particle position, with movement towards cursor if close enough
  update(mousePosition) {
    // Check distance between particle and cursor
    let dx = mousePosition.x - this.x;
    let dy = mousePosition.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // If within a certain distance, move particle towards the cursor
    if (distance < 150) { // 150px distance from the cursor to start attracting
      let angle = Math.atan2(dy, dx);
      this.directionX += Math.cos(angle) * this.attractionStrength;
      this.directionY += Math.sin(angle) * this.attractionStrength;
    }

    // Boundaries check and movement
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.directionY = -this.directionY;
    }
    this.x += this.directionX;
    this.y += this.directionY;

    this.draw();
  }
}

// Update the animate function to pass mouse position to the particles
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update(mousePosition); // Pass mousePosition to update function
  }
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init(); // Reinitialize particles
});

// Set canvas size dynamically
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init(); // Reinitialize particles with new canvas size
}

// Adjust particle count based on canvas size
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000; // Dynamically calculate based on screen size
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = Math.random() * (innerWidth - size * 2);
        let y = Math.random() * (innerHeight - size * 2);
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        let color = '#000000';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Resize event listener
window.addEventListener('resize', setCanvasSize);

// Initialize canvas size and start animation
setCanvasSize();
animate();

// Particle class and animation logic remains the same
