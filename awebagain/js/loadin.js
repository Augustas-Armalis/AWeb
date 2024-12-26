// load inwindow.onload = function () {
// Hiding the preloader after page load
window.addEventListener('load', function () {
  document.querySelector('.preloader').className += ' hidden';
});
// Your GSAP animations
gsap.fromTo(".title-container",
  { y: 100, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.1 }
);

gsap.fromTo(".alt-container",
  { y: 100, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 }
);

gsap.fromTo(".under-rectangle-layer",
  { y: 50, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
);

gsap.fromTo("nav",
  { y: -40, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 }
);

gsap.fromTo(".nav-lottie-drag",
  { y: 20, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 2 }
);

gsap.fromTo(".slider-hero-container",
  { x: 200, opacity: 0 },
  { x: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
);

gsap.fromTo(".bck-container",
  { y: -window.innerHeight * 0.5, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.6, ease: "expo.Out" }
);






gsap.registerPlugin(MotionPathPlugin);

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function moveBlob(blob, widthRange, heightRange) {
  const randomPath = [
    { x: random(-20, widthRange), y: random(-10, heightRange) },
    { x: random(-20, widthRange), y: random(-10, heightRange) },
    { x: random(-20, widthRange), y: random(-10, heightRange) },
    { x: random(-20, widthRange), y: random(-10, heightRange) }
  ];

  gsap.to(blob, {
    motionPath: {
      path: randomPath,
      curviness: 1.5,
      autoRotate: false
    },
    duration: random(12, 20),
    ease: 'power6.in',
    onComplete: () => moveBlob(blob, widthRange, heightRange),
    repeat: 0
  });
}

function initializeBlobs(rectangle) {
  const blobs = rectangle.querySelectorAll('.blob');
  const { width, height } = rectangle.getBoundingClientRect();

  blobs.forEach(blob => {
    const size = random(30, 45);
    blob.style.width = `${size}px`;
    blob.style.height = `${size}px`;

    gsap.set(blob, {
      x: random(-20, width - size),
      y: random(-10, height - size)
    });

    moveBlob(blob, width - size, height - size);
  });

  if (window.innerWidth >= 768) {
    rectangle.addEventListener('mouseenter', () => moveToCursor(blobs, rectangle));
    rectangle.addEventListener('mouseleave', () => continueAnimation(blobs, rectangle));
  }

  rectangle.addEventListener('touchend', () => {
    rectangle.classList.remove('active');
    continueAnimation(blobs, rectangle);
  });
}


function moveToCursor(blobs, rectangle) {
  rectangle.addEventListener('mousemove', (event) => {
    const { left, top } = rectangle.getBoundingClientRect();
    const cursorX = event.clientX - left;
    const cursorY = event.clientY - top;

    blobs.forEach(blob => {
      gsap.to(blob, {
        x: cursorX - parseInt(blob.style.width) / 2,
        y: cursorY - parseInt(blob.style.height) / 2,
        duration: 3.0,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  });
}

function continueAnimation(blobs, rectangle) {
  const { width, height } = rectangle.getBoundingClientRect();

  blobs.forEach(blob => {
    const size = parseInt(blob.style.width);

    gsap.to(blob, {
      duration: 2.0,
      motionPath: {
        path: [
          { x: random(-20, width - size), y: random(-10, height - size) },
          { x: random(-20, width - size), y: random(-10, height - size) },
          { x: random(-20, width - size), y: random(-10, height - size) },
          { x: random(-20, width - size), y: random(-10, height - size) }
        ],
        curviness: 1.5,
        autoRotate: false
      },
      onComplete: () => moveBlob(blob, width - size, height - size)
    });
  });
}

function init() {
  document.querySelectorAll('.rectangle').forEach(initializeBlobs);
}

const buttons = document.querySelectorAll('.under-rectangle-layer');

buttons.forEach(button => {
  button.addEventListener('mouseenter', () => {
    gsap.to(button, {
      border: '1px solid hsla(240, 4%, 13%, 1)',
      boxShadow: '0px 0px 8px 0px rgba(175, 175, 182, 0.20) inset',
      duration: 0.15,
      ease: 'power1.out'
    });
  });

  button.addEventListener('mouseleave', () => {
    gsap.to(button, {
      border: '1px solid var(--gray3)',
      boxShadow: '0px 0px 8px 3px rgba(175, 175, 182, 0.20) inset',
      duration: 0.15,
      ease: 'power1.out'
    });
  });

  button.addEventListener('mousedown', () => {
    gsap.to(button, {
      scale: 0.95,
      duration: 0.15,
      ease: 'power2.out'
    });

    gsap.to(button.querySelector('.rectangle'), {
      scale: 0.97,
      opacity: 0.7,
      duration: 0.15,
      ease: 'power2.out'
    });
  });

  button.addEventListener('touchstart', () => {
    gsap.to(button, {
      scale: 0.95,
      duration: 0.15,
      ease: 'power2.out'
    });
    gsap.to(button.querySelector('.rectangle'), {
      scale: 0.97,
      opacity: 0.7,
      duration: 0.15,
      ease: 'power2.out'
    });
  });

  const resetScale = () => {
    gsap.to(button, {
      scale: 1,
      duration: 0.15,
      ease: 'power2.out'
    });
    gsap.to(button.querySelector('.rectangle'), {
      scale: 1,
      opacity: 1,
      duration: 0.15,
      ease: 'power2.out'
    });
  };

  button.addEventListener('mouseup', resetScale);
  button.addEventListener('mouseleave', resetScale);
  button.addEventListener('touchend', resetScale);
});

init();




















function executeAbove1064px() {
  if (window.innerWidth > 1064) {
    console.clear();

    const circleDissapearTo = document.querySelectorAll('.under-rectangle-layer');
    const rectangleMorphTo = document.querySelectorAll('.slide-hero');

    const circleElement = document.querySelector('.circle');
    const mouse = { x: 0, y: 0 };
    const previousMouse = { x: 0, y: 0 };
    const circle = { x: 0, y: 0 };
    let currentScale = 0;
    let currentAngle = 0;
    let rotationEnabled = true;
    let rotationTimeout = null;
    let hoverTimeoutActive = false;

    const fadeInOnLoadDuration = 0.2;
    const fadeHoverDuration = 0.2;

    const fadeInCircleOnLoad = () => {
      circleElement.style.transition = `opacity ${fadeInOnLoadDuration}s ease-in-out`;
      circleElement.style.opacity = '1';
    };

    const fadeInCircle = () => {
      circleElement.style.transition = `opacity ${fadeHoverDuration}s ease-in-out`;
      circleElement.style.opacity = '1';
    };

    const fadeOutCircle = () => {
      circleElement.style.transition = `opacity ${fadeHoverDuration}s ease-in-out`;
      circleElement.style.opacity = '0';
    };

    let mouseMoved = false;

    window.addEventListener('mousemove', (e) => {
      if (!mouseMoved) {
        fadeInCircle();
        mouseMoved = true;
      }

      mouse.x = e.x;
      mouse.y = e.y;
    });

    const speed = 0.12;

    const tick = () => {
      circle.x += (mouse.x - circle.x) * speed;
      circle.y += (mouse.y - circle.y) * speed;
      const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;
      const deltaMouseX = mouse.x - previousMouse.x;
      const deltaMouseY = mouse.y - previousMouse.y;
      previousMouse.x = mouse.x;
      previousMouse.y = mouse.y;
      const mouseVelocity = Math.min(Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4, 150);
      const scaleValue = (mouseVelocity / 150) * 0.5;
      currentScale += (scaleValue - currentScale) * speed;
      const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;
      const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;

      if (mouseVelocity > 20 && rotationEnabled) {
        currentAngle = angle;
      }

      const rotateTransform = rotationEnabled ? `rotate(${currentAngle}deg)` : '';
      circleElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;
      window.requestAnimationFrame(tick);
    };

    tick();

    circleDissapearTo.forEach(container => {
      container.addEventListener('mouseenter', fadeOutCircle);
      container.addEventListener('mouseleave', fadeInCircle);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        fadeOutCircle();
      } else {
        fadeInCircle();
      }
    });

    document.addEventListener("mouseenter", fadeInCircle);
    document.addEventListener("mouseleave", fadeOutCircle);

    fadeInCircleOnLoad();

    rectangleMorphTo.forEach(container => {
      container.addEventListener('mouseenter', () => {
        const hoverText = container.getAttribute('data-hover-text');
        const circleWidth = circleElement.Width;

        gsap.to(circleElement, {
          width: "auto",
          height: "auto",
          borderRadius: "8px",
          duration: 0.2,
          ease: "power2.inOut",
          top: -20,
          left: 10,
        });

        const textElement = circleElement.querySelector('.circle-text');
        textElement.textContent = hoverText;

        gsap.to(textElement, {
          opacity: 1,
          scale: 1,
          margin: "5px",
          duration: 0.2
        });

        rotationEnabled = false;

        if (rotationTimeout) {
          clearTimeout(rotationTimeout);
        }
        hoverTimeoutActive = true;
      });

      container.addEventListener('mouseleave', () => {
        gsap.to(circleElement, {
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          duration: 0.2,
          ease: "power2.inOut",
          top: -6,
          left: -6,
        });

        const textElement = circleElement.querySelector('.circle-text');
        gsap.to(textElement, {
          opacity: 0,
          scale: 0,
          duration: 0.2
        });

        if (rotationTimeout) {
          clearTimeout(rotationTimeout);
        }

        rotationTimeout = setTimeout(() => {
          rotationEnabled = true;
          hoverTimeoutActive = false;
        }, 200);
      });
    });

    rectangleMorphTo.forEach(container => {
      container.addEventListener('mouseenter', () => {
        if (hoverTimeoutActive) {
          clearTimeout(rotationTimeout);
          hoverTimeoutActive = false;
        }
      });
    });
  }
}

executeAbove1064px();
window.addEventListener('resize', executeAbove1064px);





















const sliderHero = document.querySelector('.slider-container-hero');
const slidesHero = document.querySelector('.slider-hero');
let isDraggingHero = false;
let startXHero, scrollLeftHero, lastXHero, velocityHero, momentumIntervalHero;

// Start dragging (mousedown event)
sliderHero.addEventListener('mousedown', (e) => {
  isDraggingHero = true;
  startXHero = e.pageX - sliderHero.offsetLeft; // Mouse's starting position
  scrollLeftHero = sliderHero.scrollLeft; // Current scroll position
  lastXHero = startXHero;
  velocityHero = 0;
  sliderHero.style.cursor = 'grabbing'; // Change cursor to grabbing while dragging
  sliderHero.classList.add('dragging-hero');
  cancelAnimationFrame(momentumIntervalHero); // Cancel any momentum that might be active
});

// Stop dragging (mouseup event)
sliderHero.addEventListener('mouseup', () => {
  if (isDraggingHero) {
    isDraggingHero = false;
    sliderHero.style.cursor = 'grab'; // Change cursor back to grab
    sliderHero.classList.remove('dragging-hero');
    // Start inertia after mouse release
    momentumHero();
  }
});

// Stop dragging when mouse leaves the container
sliderHero.addEventListener('mouseleave', () => {
  if (isDraggingHero) {
    isDraggingHero = false;
    sliderHero.style.cursor = 'grab'; // Change cursor back to grab
    sliderHero.classList.remove('dragging-hero');
    // Start inertia after mouse leaves
    momentumHero();
  }
});

// Handle mouse move during dragging
sliderHero.addEventListener('mousemove', (e) => {
  if (!isDraggingHero) return;

  const xHero = e.pageX - sliderHero.offsetLeft; // Calculate the new mouse position
  const walkHero = (xHero - startXHero); // Calculate how far the mouse has moved horizontally
  sliderHero.scrollLeft = scrollLeftHero - walkHero; // Update the scroll position based on the mouse movement
  velocityHero = xHero - lastXHero; // Calculate the speed of the movement
  lastXHero = xHero;
});

// Inertia simulation after mouse release (momentum)
function momentumHero() {
  let lastTimeHero = Date.now();
  let scrollSpeedHero = -velocityHero; // Reverse the direction of the inertia

  // Momentum function using requestAnimationFrame for smooth inertia
  function momentumStepHero() {
    const now = Date.now();
    const deltaTimeHero = now - lastTimeHero;
    lastTimeHero = now;

    if (Math.abs(scrollSpeedHero) > 0.5) { // If the speed is significant enough to keep moving
      sliderHero.scrollLeft += scrollSpeedHero; // Scroll based on current speed
      scrollSpeedHero *= 0.95; // Gradually decrease the speed to simulate inertia (friction)
      momentumIntervalHero = requestAnimationFrame(momentumStepHero); // Continue inertia
    }
  }

  momentumStepHero(); // Start the inertia
}






// Rename slides to slideElements
const slideElements = document.querySelectorAll('.slide-hero');

slideElements.forEach(slide => {
  let isMouseDown = false;
  let startX = 0;

  // Detect mouse down event
  slide.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startX = e.pageX;
  });

  // Detect mouse up event
  slide.addEventListener('mouseup', (e) => {
    if (isMouseDown && Math.abs(startX - e.pageX) < 10) {  // check if mouse moved less than 10px
      const link = slide.getAttribute('data-link');
      if (link) {
        window.location.href = link;
      }
    }
    isMouseDown = false;
  });

  // Optional: Reset mouse down state if mouse leaves the slide
  slide.addEventListener('mouseleave', () => {
    isMouseDown = false;
  });
});