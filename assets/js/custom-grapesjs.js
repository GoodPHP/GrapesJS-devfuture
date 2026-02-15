const CodeMirrorConfig = {
  export: {
    readOnly: 1,
    theme: 'hopscotch',
    autoBeautify: true,
    lineWrapping: true,
    smartIndent: true,
    indentWithTabs: true,
  },
  import: {
    readOnly: 0,
    theme: 'hopscotch',
    autoBeautify: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    styleActiveLine: true,
    smartIndent: true,
    indentWithTabs: true,
  }
};

const scribePlugin = window['grapesjs-plugin-scribejs']?.default || window['grapesjs-plugin-scribejs'];

const editorConfig = {
  container: '#gjs',
  fromElement: true,
  height: '100%',
  showOffsets: 1,
  noticeOnUnload: 0,
  storageManager: { autoload: 0 },
  panels: { defaults: [] },

  plugins: ['gjs-blocks-basic', 'grapesjs-plugin-forms', 'grapesjs-navbar', 'grapesjs-plugin-borders'],
  pluginsOpts: {
    'gjs-blocks-basic': {
      flexGrid: true,
      blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video']
    },
    'grapesjs-plugin-borders': {
      main_color: '#3c44b1',
    }
  },

  layerManager: {
    appendTo: '.layers-container'
  },

  blockManager: {
    appendTo: '#blocks-mgr'
  },

  traitManager: {
    appendTo: '#traits-mgr'
  },

  styleManager: {
    appendTo: '#styles-mgr',
    sectors: [{
      name: 'General',
      open: true,
      buildProps: ['display', 'position', 'top', 'right', 'left', 'bottom', 'float']
    }, {
      name: 'Dimension',
      open: false,
      buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding']
    }, {
      name: 'Typography',
      open: false,
      buildProps: ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'text-align', 'text-shadow']
    }, {
      name: 'Decorations',
      open: false,
      buildProps: ['background-color', 'background', 'border-radius', 'border', 'box-shadow']
    }, {
      name: 'Flex',
      open: false,
      buildProps: ['flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'order', 'flex-basis', 'flex-grow', 'flex-shrink', 'align-self']
    }, {
      name: 'Extra',
      open: false,
      buildProps: ['opacity', 'transition', 'transform'],
      properties: [{
        type: 'slider',
        property: 'opacity',
        defaults: 1,
        step: 0.01,
        max: 1,
        min: 0,
      }]
    }],
  },

  deviceManager: {
    devices: [{
      name: 'Desktop',
      width: '',
    }, {
      name: 'Tablet',
      width: '768px',
      widthMedia: '992px',
    }, {
      name: 'Mobile',
      width: '320px',
      widthMedia: '480px',
    }]
  },
};

if (scribePlugin) {
  editorConfig.plugins.push(scribePlugin);
  editorConfig.pluginsOpts[scribePlugin] = {
    toolbar: {
      placement: 'canvas-overlay',
      responsive: true,
      flex: true,
      wrap: false,
    },
    autoInit: true,
    debug: false,
  };
}

const editor = grapesjs.init(editorConfig);

const SIGNATURE_COMPONENT_TYPE = 'signature-image';
const SIGNATURE_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80"><rect width="200" height="80" fill="#ffffff" stroke="#3c44b1" stroke-width="1.5" stroke-dasharray="6 4" rx="6"/><path d="M44 52 C70 25, 101 68, 128 40" stroke="#3c44b1" stroke-width="2" fill="none" stroke-linecap="round"/><text x="100" y="20" text-anchor="middle" font-family="Heebo, Arial, sans-serif" font-size="10" fill="#3c44b1">Double click to sign</text></svg>')}`;
const SIGNATURE_BLOCK_ICON = '<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="10" width="44" height="34" rx="5" fill="#fff" stroke="#0f172a" stroke-width="3"/><path d="M14 35h28" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/><path d="M16 30c4-1 6-7 11-5 4 1 5 6 9 6 3 0 5-2 7-4" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
let signatureModalVisible = false;
let signatureTargetComponent = null;
let signaturePad = null;
let signaturePadCtorPromise = null;
let signatureHistory = [];
let signatureHistoryIndex = -1;
let signatureReplaceOnFirstDraw = false;
let signatureCanvasHandlersBound = false;
let signatureStrokeActive = false;
let signatureStrokeStartedFromImage = false;

const getSignatureCanvas = () => document.getElementById('signature-canvas');

const updateSignatureHistoryButtons = () => {
  const undoButton = document.getElementById('signature-undo');
  const redoButton = document.getElementById('signature-redo');

  if (undoButton) {
    undoButton.disabled = signatureHistoryIndex <= 0;
  }

  if (redoButton) {
    redoButton.disabled = signatureHistoryIndex >= signatureHistory.length - 1;
  }
};

const resetSignatureHistory = () => {
  signatureHistory = [null];
  signatureHistoryIndex = 0;
  updateSignatureHistoryButtons();
};

const pushSignatureSnapshot = (snapshot) => {
  const current = signatureHistory[signatureHistoryIndex];
  if (current === snapshot) {
    updateSignatureHistoryButtons();
    return;
  }

  if (signatureHistoryIndex < signatureHistory.length - 1) {
    signatureHistory = signatureHistory.slice(0, signatureHistoryIndex + 1);
  }

  signatureHistory.push(snapshot);
  signatureHistoryIndex = signatureHistory.length - 1;
  updateSignatureHistoryButtons();
};

const renderSignatureSnapshot = (snapshot) => {
  const canvas = getSignatureCanvas();
  if (!canvas || !signaturePad) {
    return;
  }

  signaturePad.clear();
  if (!snapshot) {
    return;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  const image = new Image();
  image.onload = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
  image.src = snapshot;
};

const undoSignatureSnapshot = () => {
  if (signatureHistoryIndex <= 0) {
    return;
  }

  signatureHistoryIndex -= 1;
  renderSignatureSnapshot(signatureHistory[signatureHistoryIndex]);
  signatureReplaceOnFirstDraw = Boolean(signatureHistory[signatureHistoryIndex]);
  updateSignatureHistoryButtons();
};

const redoSignatureSnapshot = () => {
  if (signatureHistoryIndex >= signatureHistory.length - 1) {
    return;
  }

  signatureHistoryIndex += 1;
  renderSignatureSnapshot(signatureHistory[signatureHistoryIndex]);
  signatureReplaceOnFirstDraw = Boolean(signatureHistory[signatureHistoryIndex]);
  updateSignatureHistoryButtons();
};

const bindSignatureCanvasHandlers = () => {
  const canvas = getSignatureCanvas();
  if (!canvas || signatureCanvasHandlersBound) {
    return;
  }

  const handleStrokeStart = () => {
    signatureStrokeActive = true;

    if (signatureReplaceOnFirstDraw) {
      signatureStrokeStartedFromImage = true;
      signaturePad?.clear?.();
      signatureReplaceOnFirstDraw = false;
    }
  };

  const handleStrokeEnd = () => {
    if (!signatureStrokeActive || !signaturePad) {
      return;
    }

    signatureStrokeActive = false;

    if (signaturePad.isEmpty()) {
      signatureStrokeStartedFromImage = false;
      return;
    }

    const snapshot = signaturePad.toPNG();
    pushSignatureSnapshot(snapshot);
    signatureStrokeStartedFromImage = false;
  };

  canvas.addEventListener('pointerdown', handleStrokeStart);
  canvas.addEventListener('pointerup', handleStrokeEnd);
  canvas.addEventListener('pointercancel', () => {
    signatureStrokeActive = false;
    signatureStrokeStartedFromImage = false;
  });
  canvas.addEventListener('mouseleave', handleStrokeEnd);

  signatureCanvasHandlersBound = true;
};

const loadSignaturePadCtor = async () => {
  if (!signaturePadCtorPromise) {
    signaturePadCtorPromise = import('https://unpkg.com/autographjs@1.0.1/dist/index.js?module').then((module) => module.SignaturePad);
  }
  return signaturePadCtorPromise;
};

const isSignatureComponent = (component) => {
  if (!component) {
    return false;
  }

  const attributes = component.getAttributes?.() || {};
  return component.is?.(SIGNATURE_COMPONENT_TYPE) || (component.is?.('image') && attributes['data-signature-field'] === 'true');
};

const closeSignatureModal = () => {
  const modal = document.getElementById('signature-modal');
  if (modal) {
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
  }
  signatureModalVisible = false;
  signatureTargetComponent = null;
  signaturePad = null;
  signatureReplaceOnFirstDraw = false;
  signatureStrokeActive = false;
  signatureStrokeStartedFromImage = false;
  resetSignatureHistory();
};

const openSignatureModal = async (component) => {
  const modal = document.getElementById('signature-modal');
  const canvas = document.getElementById('signature-canvas');

  if (!modal || !canvas) {
    return;
  }

  signatureTargetComponent = component;
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
  signatureModalVisible = true;

  try {
    const SignaturePad = await loadSignaturePadCtor();
    requestAnimationFrame(() => {
      const width = Math.max(320, Math.floor(canvas.clientWidth || 320));
      const height = Math.max(170, Math.floor(canvas.clientHeight || 170));
      signaturePad = new SignaturePad(canvas, {
        width,
        height,
        backgroundColor: '#ffffff',
        brushSize: 1.5,
        brushColor: '#1f2937'
      });

      resetSignatureHistory();
      bindSignatureCanvasHandlers();

      const currentSrc = component?.getAttributes?.()?.src;
      if (currentSrc && currentSrc !== SIGNATURE_PLACEHOLDER) {
        signatureHistory = [currentSrc];
        signatureHistoryIndex = 0;
        signatureReplaceOnFirstDraw = true;
        renderSignatureSnapshot(currentSrc);
      }

      updateSignatureHistoryButtons();
    });
  } catch (error) {
    window.alert('Unable to load signature tool. Please check your internet connection and try again.');
    closeSignatureModal();
  }
};

editor.DomComponents.addType(SIGNATURE_COMPONENT_TYPE, {
  isComponent: (element) => {
    if (element?.tagName === 'IMG' && element.getAttribute('data-signature-field') === 'true') {
      return { type: SIGNATURE_COMPONENT_TYPE };
    }
    return false;
  },
  model: {
    defaults: {
      tagName: 'img',
      draggable: true,
      droppable: false,
      selectable: true,
      copyable: true,
      attributes: {
        src: SIGNATURE_PLACEHOLDER,
        alt: 'Signature',
        'data-signature-field': 'true'
      },
      style: {
        width: '200px',
        height: '80px',
        display: 'block',
        objectFit: 'contain'
      }
    }
  },
  view: {
    events: {
      dblclick: 'openEditor'
    },
    openEditor(event) {
      event?.preventDefault?.();
      openSignatureModal(this.model);
    }
  }
});

editor.BlockManager.add('signature', {
  label: '<span>Signature</span>',
  category: 'Extra',
  media: SIGNATURE_BLOCK_ICON,
  content: {
    type: SIGNATURE_COMPONENT_TYPE,
    attributes: {
      src: SIGNATURE_PLACEHOLDER,
      alt: 'Signature',
      'data-signature-field': 'true'
    },
    style: {
      width: '200px',
      height: '80px',
      display: 'block',
      objectFit: 'contain'
    }
  }
});

const SIDEBAR_BLOCKS = 'blocks';
const SIDEBAR_STYLES = 'styles';

const setSidebarState = (target = null) => {
  const sidebars = {
    [SIDEBAR_BLOCKS]: document.getElementById('sidebar-inner-2'),
    [SIDEBAR_STYLES]: document.getElementById('sidebar-inner-3')
  };

  const triggers = {
    [SIDEBAR_BLOCKS]: document.getElementById('editor-add'),
    [SIDEBAR_STYLES]: document.getElementById('editor-styles')
  };

  Object.keys(sidebars).forEach((key) => {
    const isVisible = key === target;
    if (sidebars[key]) {
      sidebars[key].classList.toggle('visible', isVisible);
    }
    if (triggers[key]) {
      triggers[key].classList.toggle('active', isVisible);
    }
  });
};

editor.Commands.add('set-device-desktop', {
  run: (ed) => ed.setDevice('Desktop')
});
editor.Commands.add('set-device-tablet', {
  run: (ed) => ed.setDevice('Tablet')
});
editor.Commands.add('set-device-mobile', {
  run: (ed) => ed.setDevice('Mobile')
});

editor.Commands.add('panel:toggle-blocks', {
  run: () => {
    const panel = document.getElementById('sidebar-inner-2');
    setSidebarState(panel && panel.classList.contains('visible') ? null : SIDEBAR_BLOCKS);
  }
});

editor.Commands.add('panel:toggle-styles', {
  run: () => {
    const panel = document.getElementById('sidebar-inner-3');
    setSidebarState(panel && panel.classList.contains('visible') ? null : SIDEBAR_STYLES);
  }
});

editor.Commands.add('panel:close-sidebars', {
  run: () => setSidebarState(null)
});

const toggleFullscreen = () => {
  const element = document.querySelector('#editor-area');
  if (document.fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    return;
  }

  if (element && element.requestFullscreen) {
    element.requestFullscreen();
  }
};

const syncDeviceButtons = () => {
  document.querySelectorAll('.device-type').forEach((button) => {
    button.classList.remove('bg-neutral-first');
  });

  const activeButtonByDevice = {
    Desktop: '#desktop-view',
    Tablet: '#tablet-view',
    Mobile: '#mobile-view'
  };

  const activeButton = document.querySelector(activeButtonByDevice[editor.getDevice()] || '#desktop-view');
  if (activeButton) {
    activeButton.classList.add('bg-neutral-first');
  }
};

const syncSelectionUI = () => {
  const selected = editor.getSelected();
  const styleButton = document.getElementById('editor-styles');
  const emptyState = document.getElementById('style-empty-state');

  if (styleButton) {
    styleButton.style.display = selected ? 'block' : 'none';
  }

  if (emptyState) {
    emptyState.style.display = selected ? 'none' : 'block';
  }
};

const filterBlocks = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  const blocks = document.querySelectorAll('#blocks-mgr .gjs-block');

  blocks.forEach((block) => {
    const matches = !normalized || block.textContent.toLowerCase().includes(normalized);
    block.style.display = matches ? '' : 'none';
  });

  document.querySelectorAll('#blocks-mgr .gjs-block-category').forEach((category) => {
    const items = [...category.querySelectorAll('.gjs-block')];
    const hasVisible = items.some((item) => item.style.display !== 'none');
    category.style.display = hasVisible ? '' : 'none';
  });
};

const query = (selector, parent = document) => parent.querySelector(selector);
const queryAll = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const addListener = (element, eventName, handler) => {
  if (element) {
    element.addEventListener(eventName, handler);
  }
};

const showBootstrapTab = (triggerElement) => {
  if (window.bootstrap && triggerElement) {
    window.bootstrap.Tab.getOrCreateInstance(triggerElement).show();
  }
};

const hideBootstrapModal = (modalElement) => {
  if (window.bootstrap && modalElement) {
    window.bootstrap.Modal.getOrCreateInstance(modalElement).hide();
  }
};

window.addEventListener('load', () => {
  const htmlExportTabTrigger = query('#html-export-tab');
  const cssExportTabTrigger = query('#css-export-tab');
  const editorExportModal = query('#editor-export');
  const editorImportModal = query('#editor-import');
  const importComponentButton = query('#import-component');
  const editorArea = query('#editor-area');
  const signatureModal = query('#signature-modal');
  const signatureCloseButton = query('#signature-close');
  const signatureUndoButton = query('#signature-undo');
  const signatureRedoButton = query('#signature-redo');
  const signatureClearButton = query('#signature-clear');
  const signatureSaveButton = query('#signature-save');

  addListener(query('#desktop-view'), 'click', () => editor.Commands.run('set-device-desktop'));
  addListener(query('#tablet-view'), 'click', () => editor.Commands.run('set-device-tablet'));
  addListener(query('#mobile-view'), 'click', () => editor.Commands.run('set-device-mobile'));

  addListener(query('#editor-undo'), 'click', () => editor.Commands.run('core:undo'));
  addListener(query('#editor-redo'), 'click', () => editor.Commands.run('core:redo'));

  addListener(query('#editor-add'), 'click', () => editor.Commands.run('panel:toggle-blocks'));
  addListener(query('#editor-close-bm'), 'click', () => editor.Commands.run('panel:close-sidebars'));

  addListener(query('#editor-styles'), 'click', () => editor.Commands.run('panel:toggle-styles'));
  addListener(query('#editor-close-stmgr'), 'click', () => editor.Commands.run('panel:close-sidebars'));

  addListener(query('#blocks-search'), 'input', (event) => filterBlocks(event.target.value));

  addListener(query('#sw-visibility'), 'click', (event) => {
    event.preventDefault();
    const isActive = editor.Commands.isActive('sw-visibility');
    editor.Commands[isActive ? 'stop' : 'run']('sw-visibility');
  });

  addListener(query('#editor-preview'), 'click', () => {
    const isActive = editor.Commands.isActive('core:preview');
    editor.Commands[isActive ? 'stop' : 'run']('core:preview');
  });

  addListener(query('#editor-fullscreen'), 'click', (event) => {
    event.preventDefault();
    toggleFullscreen();
  });

  addListener(query('#canvas-clear'), 'click', (event) => {
    event.preventDefault();
    if (window.confirm('Do you want to clean canvas?')) {
      editor.Commands.run('core:canvas-clear');
      editor.Commands.run('panel:close-sidebars');
    }
  });

  addListener(query('#gjs-export-zip'), 'click', () => editor.Commands.run('gjs-export-zip'));

  addListener(editorExportModal, 'shown.bs.modal', () => {
    showBootstrapTab(htmlExportTabTrigger);
  });

  addListener(editorExportModal, 'hidden.bs.modal', () => {
    if (htmlExportTabTrigger) {
      htmlExportTabTrigger.classList.remove('active');
    }
    document.querySelector('#editor-export #html-export').innerHTML = '';
    document.querySelector('#editor-export #css-export').innerHTML = '';
  });

  addListener(htmlExportTabTrigger, 'shown.bs.tab', () => {
    document.querySelector('#editor-export #html-export').innerHTML = '';
    const htmlArea = document.createElement('textarea');
    document.querySelector('#editor-export #html-export').appendChild(htmlArea);
    htmlArea.value = editor.getHtml();

    const codeViewerHtml = editor.CodeManager.getViewer('CodeMirror').clone().set({
      ...CodeMirrorConfig.export,
      codeName: 'htmlmixed',
      input: htmlArea
    });

    codeViewerHtml.init(htmlArea);
    codeViewerHtml.setContent(editor.getHtml());
    codeViewerHtml.editor.refresh();
  });

  addListener(cssExportTabTrigger, 'shown.bs.tab', () => {
    document.querySelector('#editor-export #css-export').innerHTML = '';
    const cssArea = document.createElement('textarea');
    document.querySelector('#editor-export #css-export').appendChild(cssArea);

    const codeViewerCss = editor.CodeManager.getViewer('CodeMirror').clone().set({
      ...CodeMirrorConfig.export,
      codeName: 'css',
      input: cssArea
    });

    codeViewerCss.init(cssArea);
    codeViewerCss.setContent(editor.getCss());
    codeViewerCss.editor.refresh();
  });

  addListener(editorImportModal, 'shown.bs.modal', () => {
    const modalContainer = document.querySelector('#editor-import .modal-body div');
    modalContainer.innerHTML = '';

    const importArea = document.createElement('textarea');
    modalContainer.appendChild(importArea);

    const codeViewerHtml = editor.CodeManager.getViewer('CodeMirror').clone().set({
      ...CodeMirrorConfig.import,
      codeName: 'htmlmixed',
      input: importArea
    });

    codeViewerHtml.init(importArea);
    codeViewerHtml.setContent('');
    codeViewerHtml.editor.refresh();

    if (importComponentButton) {
      importComponentButton.onclick = () => {
      editor.setComponents(codeViewerHtml.editor.getValue().trim());
      hideBootstrapModal(editorImportModal);
      modalContainer.innerHTML = '';
      editor.Commands.run('panel:close-sidebars');
      };
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && signatureModalVisible) {
      closeSignatureModal();
      return;
    }

    if (event.key === 'Escape') {
      editor.Commands.run('panel:close-sidebars');
    }
  });

  addListener(editorArea, 'click', (event) => {
    const clickedInMainSidebar = Boolean(event.target.closest('#sidebar-inner-1'));
    const clickedInPanels = Boolean(event.target.closest('#sidebar-inner-2, #sidebar-inner-3'));
    const clickedOnOpenButtons = Boolean(event.target.closest('#editor-add, #editor-styles'));

    if (!clickedInMainSidebar && !clickedInPanels && !clickedOnOpenButtons) {
      editor.Commands.run('panel:close-sidebars');
    }
  });

  addListener(signatureCloseButton, 'click', closeSignatureModal);

  addListener(signatureUndoButton, 'click', () => {
    undoSignatureSnapshot();
  });

  addListener(signatureRedoButton, 'click', () => {
    redoSignatureSnapshot();
  });

  addListener(signatureModal, 'click', (event) => {
    if (event.target === signatureModal) {
      closeSignatureModal();
    }
  });

  addListener(signatureClearButton, 'click', () => {
    signaturePad?.clear?.();
    pushSignatureSnapshot(null);
    signatureReplaceOnFirstDraw = false;
  });

  addListener(signatureSaveButton, 'click', () => {
    const historySnapshot = signatureHistory[signatureHistoryIndex];
    const signatureDataUrl = historySnapshot || (signaturePad && !signaturePad.isEmpty() ? signaturePad.toPNG() : null);

    if (!signatureDataUrl) {
      window.alert('Please draw your signature before saving.');
      return;
    }

    if (!signatureTargetComponent || !isSignatureComponent(signatureTargetComponent)) {
      closeSignatureModal();
      return;
    }

    editor.AssetManager.add({
      type: 'image',
      src: signatureDataUrl,
      name: `signature-${Date.now()}.png`
    });

    signatureTargetComponent.addAttributes({ src: signatureDataUrl });
    closeSignatureModal();
  });

  syncDeviceButtons();
  syncSelectionUI();

  queryAll('[href="#"]').forEach((anchor) => {
    if (anchor.id !== 'export' && anchor.id !== 'import') {
      addListener(anchor, 'click', (event) => event.preventDefault());
    }
  });
});

editor.on('change:device', syncDeviceButtons);
editor.on('component:selected', syncSelectionUI);
editor.on('component:deselected', syncSelectionUI);

editor.on('component:dblclick', (component) => {
  if (isSignatureComponent(component)) {
    openSignatureModal(component);
  }
});

editor.on('block:drag:stop', () => {
  editor.Commands.run('panel:close-sidebars');
});

editor.on('block:drag:start', () => {
  editor.Commands.run('panel:close-sidebars');
});

editor.on('run:sw-visibility', () => {
  document.querySelector('#sw-visibility').classList.add('active');
});

editor.on('stop:sw-visibility', () => {
  document.querySelector('#sw-visibility').classList.remove('active');
});

editor.on('run:core:preview', () => {
  document.querySelector('#editor-preview').classList.add('active');
});

editor.on('stop:core:preview', () => {
  document.querySelector('#editor-preview').classList.remove('active');
});

const fullScreenChange = () => {
  const isFullscreen = Boolean(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

  document.querySelector('#editor-fullscreen').classList.toggle('active', isFullscreen);
  document.querySelector('#editor-area').classList.toggle('fullscreen', isFullscreen);
};

window.addEventListener('fullscreenchange', fullScreenChange);
window.addEventListener('mozfullscreenchange', fullScreenChange);
window.addEventListener('webkitfullscreenchange', fullScreenChange);
window.addEventListener('msfullscreenchange', fullScreenChange);
