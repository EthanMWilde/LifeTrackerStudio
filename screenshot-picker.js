document.querySelectorAll('.screenshot-toolbar').forEach(toolbar => {
  const picker = toolbar.querySelector('.screenshot-picker');
  const section = toolbar.closest('.section');
  const row = section?.querySelector('.screenshot-row');

  if (!picker || !row) return;

  const buttons = picker.querySelectorAll('button');

  function setScreenshotPlatform(platform) {
    const prefix = row.dataset[`${platform}Prefix`];
    const extension = row.dataset[`${platform}Extension`];

    if (!prefix || !extension) return;

    buttons.forEach(button => {
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.platform === platform)
      );
    });

    row.dataset.platform = platform;

    row.querySelectorAll('.screenshot-card').forEach(card => {
      const index = card.dataset.screenshotIndex;
      const image = card.querySelector('.screenshot');
      const caption = card.dataset[`${platform}Caption`] || '';

      image.src = `images/${prefix}${index}.${extension}`;
      image.alt = caption;
    });
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      setScreenshotPlatform(button.dataset.platform);
    });
  });
});

const screenshotRows = document.querySelectorAll('.screenshot-row');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-img');

let draggedRow = null;
let dragStartX = 0;
let dragStartScrollLeft = 0;
let dragMoved = false;
let suppressNextClick = false;

screenshotRows.forEach(row => {
  row.addEventListener('mousedown', event => {
    if (event.button !== 0) return;

    draggedRow = row;
    dragStartX = event.clientX;
    dragStartScrollLeft = row.scrollLeft;
    dragMoved = false;
    row.classList.add('is-dragging');
  });

  row.addEventListener('mousemove', event => {
    if (draggedRow !== row) return;

    const distance = event.clientX - dragStartX;
    if (Math.abs(distance) > 4) dragMoved = true;

    row.scrollLeft = dragStartScrollLeft - distance;
  });

  row.addEventListener('click', event => {
    if (suppressNextClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressNextClick = false;
      return;
    }

    const image = event.target.closest('img.screenshot');
    if (!image || !lightbox || !lightboxImage) return;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.style.display = 'flex';
  });

  row.addEventListener('dragstart', event => {
    event.preventDefault();
  });
});

function stopScreenshotDrag() {
  if (!draggedRow) return;

  draggedRow.classList.remove('is-dragging');
  draggedRow = null;

  if (dragMoved) {
    suppressNextClick = true;
    setTimeout(() => {
      suppressNextClick = false;
    }, 0);
  }
}

document.addEventListener('mouseup', stopScreenshotDrag);
window.addEventListener('blur', stopScreenshotDrag);

if (lightboxImage) {
  lightboxImage.addEventListener('click', event => {
    event.stopPropagation();
  });
}
