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
