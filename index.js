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
  