// Referencias DOM
const storyInput = document.getElementById('story-input');
const lineNumbers = document.getElementById('line-numbers');

const btnBold = document.getElementById('btn-bold');
const btnItalic = document.getElementById('btn-italic');
const btnUnderline = document.getElementById('btn-underline');
const fontSelect = document.getElementById('font-select');

const btnOpenImageModal = document.getElementById('btn-open-image-modal');
const btnRemoveImage = document.getElementById('btn-remove-image');

const modal = document.getElementById('image-modal');
const modalImageFile = document.getElementById('modal-image-file');
const modalImageLine = document.getElementById('modal-image-line');
const modalInsertBtn = document.getElementById('modal-insert-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');

let selectedImage = null;

// Actualiza la numeración de líneas
function countLines() {
  let linesCount = 0;
  const nodes = Array.from(storyInput.childNodes);

  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      linesCount += node.textContent.split('\n').length;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'IMG') {
        linesCount += 1;
      } else {
        const text = node.innerText || node.textContent || '';
        linesCount += text.split('\n').length;
      }
    }
  });

  return linesCount || 1;
}

function updateLineNumbers() {
  const totalLines = countLines();
  let numbersHtml = '';
  for (let i = 1; i <= totalLines; i++) {
    numbersHtml += i + '<br>';
  }
  lineNumbers.innerHTML = numbersHtml;
}

// Aplica formato al texto seleccionado
function applyFormat(command) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  if (!storyInput.contains(selection.anchorNode)) return;

  document.execCommand(command, false, null);
  updateLineNumbers();
}

// Cambia la fuente completa
function applyFont(font) {
  storyInput.style.fontFamily = font;
}

// Abre/cierra el modal de imagen
btnOpenImageModal.addEventListener('click', () => {
  modal.classList.remove('modal-hidden');
});

modalCancelBtn.addEventListener('click', () => {
  modal.classList.add('modal-hidden');
  modalImageFile.value = '';
  modalImageLine.value = '';
});

// Inserta imagen en la línea seleccionada desde el modal
modalInsertBtn.addEventListener('click', () => {
  const file = modalImageFile.files[0];
  const line = parseInt(modalImageLine.value, 10);

  if (!file || isNaN(line) || line < 1) {
    alert('Selecciona una imagen y un número de línea válido.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imgElem = document.createElement('img');
    imgElem.src = e.target.result;
    imgElem.className = 'inserted-image';
    imgElem.style.maxWidth = '100%';
    imgElem.style.cursor = 'pointer';

    let lineCounter = 1;
    let inserted = false;
    const nodes = Array.from(storyInput.childNodes);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.nodeType === Node.TEXT_NODE) {
        const nodeLines = node.textContent.split('\n').length;
        if (line <= lineCounter + nodeLines - 1) {
          const lines = node.textContent.split('\n');
          const beforeLines = lines.slice(0, line - lineCounter);
          const afterLines = lines.slice(line - lineCounter);

          const beforeText = document.createTextNode(beforeLines.join('\n'));
          const afterText = document.createTextNode(afterLines.join('\n'));

          storyInput.replaceChild(afterText, node);
          storyInput.insertBefore(imgElem, afterText);
          storyInput.insertBefore(beforeText, imgElem);

          inserted = true;
          break;
        } else {
          lineCounter += nodeLines;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'IMG') {
          if (line === lineCounter) {
            storyInput.insertBefore(imgElem, node);
            inserted = true;
            break;
          }
          lineCounter += 1;
        } else {
          const nodeLines = (node.innerText || node.textContent || '').split('\n').length;
          if (line <= lineCounter + nodeLines - 1) {
            storyInput.insertBefore(imgElem, node);
            inserted = true;
            break;
          }
          lineCounter += nodeLines;
        }
      }
    }

    if (!inserted) {
      storyInput.appendChild(imgElem);
    }

    updateLineNumbers();

    modal.classList.add('modal-hidden');
    modalImageFile.value = '';
    modalImageLine.value = '';
  };
  reader.readAsDataURL(file);
});

// Selección de imagen y remover
storyInput.addEventListener('click', e => {
  if (e.target.tagName === 'IMG' && e.target.classList.contains('inserted-image')) {
    selectedImage = e.target;
    btnRemoveImage.style.display = 'inline';
  } else {
    selectedImage = null;
    btnRemoveImage.style.display = 'none';
  }
});

btnRemoveImage.addEventListener('click', () => {
  if (selectedImage) {
    selectedImage.remove();
    selectedImage = null;
    btnRemoveImage.style.display = 'none';
    updateLineNumbers();
  }
});

// NUEVO: Referencias de controles de edición de imagen
const imageEditControls = document.getElementById('image-edit-controls');
const imgWidthInput = document.getElementById('img-width');
const imgHeightInput = document.getElementById('img-height'); // 👈
const alignButtons = imageEditControls.querySelectorAll('button[data-align]');

// Cuando haces click en una imagen del editor:
storyInput.addEventListener('click', e => {
  if (e.target.tagName === 'IMG' && e.target.classList.contains('inserted-image')) {
    selectedImage = e.target;
    btnRemoveImage.style.display = 'inline';
    modal.classList.remove('modal-hidden');
    imageEditControls.style.display = 'block';

    let width = selectedImage.style.width || '100%';
    width = width.includes('%') ? parseInt(width) : 100;
    imgWidthInput.value = width;

    let height = selectedImage.style.height || 'auto';
    if (height.includes('%')) {
      imgHeightInput.value = parseInt(height);
    } else {
      imgHeightInput.value = '';
    }
  } else {
    selectedImage = null;
    btnRemoveImage.style.display = 'none';
    imageEditControls.style.display = 'none';
  }
});

// Control de ancho
imgWidthInput.addEventListener('input', () => {
  if (selectedImage) {
    selectedImage.style.width = imgWidthInput.value + '%';
  }
});

// Control de alto
imgHeightInput.addEventListener('input', () => {
  if (selectedImage) {
    selectedImage.style.height = imgHeightInput.value ? imgHeightInput.value + '%' : 'auto';
  }
});

// Control de alineación
alignButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (selectedImage) {
      const align = button.getAttribute('data-align');
      selectedImage.style.display = 'block';
      selectedImage.style.marginLeft = '0';
      selectedImage.style.marginRight = '0';
      selectedImage.style.float = 'none';

      if (align === 'left') {
        selectedImage.style.float = 'left';
        selectedImage.style.marginRight = '10px';
      } else if (align === 'right') {
        selectedImage.style.float = 'right';
        selectedImage.style.marginLeft = '10px';
      } else if (align === 'center') {
        selectedImage.style.margin = '0 auto';
        selectedImage.style.display = 'block';
      }
    }
  });
});

// Eventos generales
storyInput.addEventListener('input', updateLineNumbers);
storyInput.addEventListener('scroll', () => {
  lineNumbers.scrollTop = storyInput.scrollTop;
});

btnBold.addEventListener('click', () => applyFormat('bold'));
btnItalic.addEventListener('click', () => applyFormat('italic'));
btnUnderline.addEventListener('click', () => applyFormat('underline'));

fontSelect.addEventListener('change', e => applyFont(e.target.value));

updateLineNumbers();
