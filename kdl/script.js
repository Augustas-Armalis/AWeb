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
let offsetY = 0; // Variable to store the initial offset when dragging starts

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
  if (window.innerWidth > 768) return;

  isDragging = true;
  const touchY = e.touches ? e.touches[0].clientY : e.clientY;

  // Get the bounding rect of the drag line container
  const dragLineRect = dragLineContainer.getBoundingClientRect();
  // Calculate the offset from the center of the drag line
  offsetY = touchY - dragLineRect.top - (dragLineRect.height / 2);

  startY = touchY; // Initialize starting Y position
  startHeight = formContainer.getBoundingClientRect().height;

  // Disable transitions for smooth dragging
  formContainer.style.transition = 'none';
  imageContainer.style.transition = 'none';

  lastY = startY;
  lastTimestamp = performance.now();

  document.body.style.cursor = 'grabbing';
  e.preventDefault(); // Prevent default scroll behavior

  // Change drag line style
  dragLine.style.backgroundColor = 'white';
  dragLine.style.width = '90px';
  dragLine.style.height = '3px';

  // Trigger vibration effect on press
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

function startDrag(e) {
  if (window.innerWidth > 768) return;

  isDragging = true;
  const touchY = e.touches ? e.touches[0].clientY : e.clientY;

  // Get the bounding rect of the drag line container
  const dragLineRect = dragLineContainer.getBoundingClientRect();
  // Calculate the offset from the center of the drag line
  offsetY = touchY - dragLineRect.top - (dragLineRect.height / 2);

  startY = touchY; // Initialize starting Y position
  startHeight = formContainer.getBoundingClientRect().height;

  // Disable transitions for smooth dragging
  formContainer.style.transition = 'none';
  imageContainer.style.transition = 'none';

  lastY = startY;
  lastTimestamp = performance.now();

  document.body.style.cursor = 'grabbing';
  e.preventDefault(); // Prevent default scroll behavior

  // Change drag line style
  dragLine.style.backgroundColor = 'white';
  dragLine.style.width = '90px';
  dragLine.style.height = '3px';

  // Trigger vibration effect on press
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

function onDrag(e) {
  if (!isDragging || window.innerWidth > 768) return;

  const currentY = e.touches ? e.touches[0].clientY : e.clientY;

  // Calculate new height using the offset to avoid jumping
  const newHeight = startHeight + (startY - (currentY - offsetY));

  const minHeight = window.innerHeight * 0.5;
  const maxHeight = window.innerHeight;

  if (newHeight >= minHeight - 20 && newHeight <= maxHeight + 20) {
    const newFlexBasis = (newHeight / window.innerHeight) * 100;

    // Update velocity for inertia effect
    const currentTimestamp = performance.now();
    const deltaTime = currentTimestamp - lastTimestamp;

    if (deltaTime > 0) {
      // Update velocity
      velocity = (currentY - lastY) / deltaTime; // Pixels per millisecond
    }

    lastY = currentY;
    lastTimestamp = currentTimestamp;

    // Log values for debugging
    console.log('startY:', startY, 'currentY:', currentY, 'newHeight:', newHeight, 'offsetY:', offsetY);

    // Update styles smoothly
    window.requestAnimationFrame(() => {
      formContainer.style.flexBasis = `${newFlexBasis}%`;
      imageContainer.style.flexBasis = `${100 - newFlexBasis}%`;

      // Add or remove classes based on new flex basis
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

  e.preventDefault(); // Prevent default scroll behavior
}

// Ensure smooth ending of drag and prevent jump
function endDrag() {
  if (!isDragging) return;

  formContainer.style.transition = '';
  imageContainer.style.transition = '';

  const formFlexBasis = parseFloat(getComputedStyle(formContainer).flexBasis);
  let targetHeight;

  // Determine target height based on final position
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

  // Smooth transition back to default style
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

// Attach event listeners
const nonPassiveOptions = { passive: false };

dragLineContainer.addEventListener('mousedown', startDrag);
dragLineContainer.addEventListener('touchstart', startDrag, nonPassiveOptions);
document.addEventListener('mousemove', onDrag);
document.addEventListener('touchmove', onDrag, nonPassiveOptions);
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);
dragLineContainer.addEventListener('mouseenter', handleHover);
dragLineContainer.addEventListener('mouseleave', handleMouseLeave);

window.addEventListener('load', initializeLayout);