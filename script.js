const fontSelect = document.getElementById('font-select');
const colorPicker = document.getElementById('color-picker');
const imgRef = document.getElementById('img-ref');
const imgDisplay = document.getElementById('img-display');
const titleInput = document.getElementById('title-input');
const storyInput = document.getElementById('story-input');
const viewerTitle = document.getElementById('viewer-title');
const viewerStory = document.getElementById('viewer-story');
const editorContainer = document.querySelector('.editor-container');
const viewerContainer = document.querySelector('.viewer-container');
const imgPreview = document.querySelector('.img-preview');
const toggleBtn = document.getElementById('toggle-btn');

if (fontSelect && storyInput) {
  fontSelect.addEventListener('change', () => {
    storyInput.style.fontFamily = fontSelect.value;
  });
}

if (colorPicker && storyInput) {
  colorPicker.addEventListener('input', () => {
    storyInput.style.color = colorPicker.value;
  });
}

if (imgRef && imgDisplay) {
  imgRef.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const readerFile = new FileReader();
      readerFile.onload = (event) => {
        imgDisplay.src = event.target.result;
        imgPreview.classList.remove('hidden');
      };
      readerFile.readAsDataURL(file);
    }
  });
}

if (toggleBtn) {
  let isReading = false;
  toggleBtn.addEventListener('click', () => {
    if (!isReading) {
      viewerTitle.textContent = titleInput.value;
      viewerStory.textContent = storyInput.value;
      viewerStory.style.fontFamily = fontSelect.value;
      viewerStory.style.color = colorPicker.value;

      editorContainer.classList.add('hidden');
      viewerContainer.classList.remove('hidden');
      toggleBtn.textContent = 'Editar Historia';
    } else {
      viewerContainer.classList.add('hidden');
      editorContainer.classList.remove('hidden');
      toggleBtn.textContent = 'Ver Historia';
    }
    isReading = !isReading;
  });
}
