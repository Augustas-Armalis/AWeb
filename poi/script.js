const formContainer = document.querySelector('.form-side-container');
const imageContainer = document.querySelector('.image-side-container');
const dragLineContainer = document.querySelector('.drag-line-container');
const dragLine = document.querySelector('.drag-line');

let isDragging = false;
let startY = 0;
let startHeight = 0;
let lastY = 0;
let lastTimestamp = 0;
let velocity = 0;

const velocityDecay = 0.8;
const bounceFactor = 0.8;

function initializeLayout() {
  formContainer.style.flexBasis = '50%';
  imageContainer.style.flexBasis = '50%';
}

function handleHover() {
  dragLine.style.backgroundColor = 'white';
  dragLine.style.width = '110px';
  dragLine.style.height = '6px';
}

function handleMouseLeave() {
  dragLine.style.backgroundColor = 'hsla(235, 5%, 25%, 1)';
  dragLine.style.width = '100px';
  dragLine.style.height = '5px';
}

function startDrag(e) {
  // Fix: Prevent default behavior when starting a drag (like scrolling)
  e.preventDefault();

  if (window.innerWidth > 768) return;

  isDragging = true;

  // Get Y position correctly depending on touch or mouse
  startY = e.touches ? e.touches[0].clientY : e.clientY;
  startHeight = formContainer.getBoundingClientRect().height;

  // Disable transitions for smooth dragging
  formContainer.style.transition = 'none';
  imageContainer.style.transition = 'none';

  lastY = startY;
  lastTimestamp = performance.now();

  document.body.style.cursor = 'grabbing';

  // Change drag line style
  dragLine.style.backgroundColor = 'white';
  dragLine.style.width = '90px';
  dragLine.style.height = '3px';
}

function onDrag(e) {
  if (!isDragging || window.innerWidth > 768) return;

  e.preventDefault(); // Fix: Prevent default scroll behavior during drag

  const currentY = e.touches ? e.touches[0].clientY : e.clientY;

  // Inverted change in Y position
  const dy = currentY - startY;
  const newHeight = startHeight - dy; // Subtract dy for inverted axes

  const minHeight = window.innerHeight * 0.5;
  const maxHeight = window.innerHeight;

  if (newHeight >= minHeight - 20 && newHeight <= maxHeight + 20) {
    const newFlexBasis = (newHeight / window.innerHeight) * 100;

    // Calculate velocity for inertia effect
    const currentTimestamp = performance.now();
    const deltaTime = currentTimestamp - lastTimestamp;

    if (deltaTime > 0) {
      // Update velocity
      velocity = (currentY - lastY) / deltaTime; // Pixels per millisecond
    }

    lastY = currentY;
    lastTimestamp = currentTimestamp;

    // Update styles smoothly
    window.requestAnimationFrame(() => {
      formContainer.style.flexBasis = `${newFlexBasis}%`;
      imageContainer.style.flexBasis = `${100 - newFlexBasis}%`;

      if (newFlexBasis < 49 && newFlexBasis >= 47) {
        formContainer.classList.add('in-radius');
      } else {
        formContainer.classList.remove('in-radius');
      }

      if (newFlexBasis >= 87) {
        formContainer.classList.add('full-open');
      } else {
        formContainer.classList.remove('full-open');
      }
    });
  }
}

function endDrag(e) {
  if (!isDragging) return;

  formContainer.style.transition = '';
  imageContainer.style.transition = '';

  const formFlexBasis = parseFloat(getComputedStyle(formContainer).flexBasis);
  let targetHeight;

  if (formFlexBasis >= 87) {
    targetHeight = 100;
    formContainer.classList.add('full-open');
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  } else {
    targetHeight = formFlexBasis - (velocity * bounceFactor * 5);
  }

  if (targetHeight > 100) targetHeight = 100;
  if (targetHeight < 50) targetHeight = 50;

  // Set the drag line to original color and start bounce effect
  dragLine.style.transition = 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
  dragLine.style.width = '100px';
  dragLine.style.height = '5px';
  dragLine.style.backgroundColor = 'hsla(235, 5%, 25%, 1)';

  // Add bounce effect
  dragLine.style.transform = 'scale(1.05, 1.05)';
  setTimeout(() => {
    dragLine.style.transform = 'scale(1, 1)';
  }, 150);

  // Apply transition for smooth effect
  formContainer.style.transition = 'flex-basis 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
  imageContainer.style.transition = 'flex-basis 0.3s cubic-bezier(0.25, 1, 0.5, 1)';

  // Set final height based on calculated target height
  formContainer.style.flexBasis = `${targetHeight}%`;
  imageContainer.style.flexBasis = `${100 - targetHeight}%`;

  // Implement inertia
  const inertiaInterval = setInterval(() => {
    if (Math.abs(velocity) < 0.1) {
      clearInterval(inertiaInterval);
      return;
    }

    targetHeight -= velocity * bounceFactor;

    if (targetHeight > 100) {
      targetHeight = 100;
      formContainer.classList.add('full-open');
    } else if (targetHeight < 50) {
      targetHeight = 50;
      formContainer.classList.remove('full-open');
      formContainer.classList.add('full-down');
    } else {
      formContainer.classList.remove('full-down');
    }

    if (targetHeight < 49 && targetHeight >= 47) {
      formContainer.classList.add('in-radius');
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    } else {
      formContainer.classList.remove('in-radius');
    }

    formContainer.style.flexBasis = `${targetHeight}%`;
    imageContainer.style.flexBasis = `${100 - targetHeight}%`;

    // Dampen the velocity
    velocity *= velocityDecay;
  }, 16); // Roughly 60 FPS

  isDragging = false;
  document.body.style.cursor = 'default';
}

// Add touchmove and touchstart event listeners with passive: false
const nonPassiveOptions = { passive: false };

dragLineContainer.addEventListener('mousedown', startDrag);
dragLineContainer.addEventListener('touchstart', startDrag, nonPassiveOptions); // Ensure default is prevented
document.addEventListener('mousemove', onDrag);
document.addEventListener('touchmove', onDrag, nonPassiveOptions); // Ensure default is prevented
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);
dragLineContainer.addEventListener('mouseenter', handleHover);
dragLineContainer.addEventListener('mouseleave', handleMouseLeave);

window.addEventListener('load', initializeLayout);
