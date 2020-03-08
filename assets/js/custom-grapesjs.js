const CodeMirror_config = {
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
}

const editor = grapesjs.init({
  height: '100%',
  showOffsets: 1,
  noticeOnUnload: 0,
  storageManager: { autoload: 0 },
  container: '#gjs',
  fromElement: true,

  plugins: ['grapesjs-blocks-basic', 'grapesjs-plugin-export', 'grapesjs-plugin-forms', 'grapesjs-navbar'],
  pluginsOpts: {
    'grapesjs-blocks-basic': {}
  },

  layerManager: {
    appendTo: '.layers-container'
  },

  deviceManager: {
    devices: [{
        name: 'Desktop',
        width: '',
      }, {
        name: 'Tablet',
        width: "768px",
        widthMedia: "992px",
      }, {
        name: 'Mobile',
        width: '320px',
        widthMedia: '480px',
    }]
  },

  blockManager: {
    appendTo: '#blocks-mgr'
  },

  styleManager: {
    appendTo: '#styles-or-traits-mgr #styles-mgr',
    sectors: [{
      name: 'General',
      open: false,
      buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom']
    },{
      name: 'Dimension',
      open: false,
      buildProps: [ 'width', 'height', 'max-width', 'min-height', 'margin', 'padding']
    },{
      name: 'Typography',
      open: false,
      buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-shadow']
    },{
      name: 'Decorations',
      open: false,
      buildProps: ['border-radius-c', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
    },{
      name: 'Extra',
      open: false,
      buildProps: ['opacity', 'transition', 'perspective', 'transform'],
      properties: [{
        type: 'slider',
        property: 'opacity',
        defaults: 1,
        step: 0.01,
        max: 1,
        min:0,
      }]
    }],
  },

  traitManager: {
    appendTo: '#styles-or-traits-mgr #traits-mgr'
  },

  panels: { defaults: [] },
});

editor.Commands.add('set-device-desktop', {
  run: editor => editor.setDevice('Desktop')
});
editor.Commands.add('set-device-tablet', {
  run: editor => editor.setDevice('Tablet')
});
editor.Commands.add('set-device-mobile', {
  run: editor => editor.setDevice('Mobile')
});

window.addEventListener('load', ()=>{
  $('#desktop-view').on('click', (event)=>{
    editor.Commands.run('set-device-desktop');
  })

  $('#tablet-view').on('click', (event)=>{
    editor.Commands.run('set-device-tablet');
  })

  $('#mobile-view').on('click', (event)=>{
    editor.Commands.run('set-device-mobile');
  })

  $('#editor-undo').on('click', (event)=>{
    editor.Commands.run('core:undo');
  })
  $('#editor-redo').on('click', (event)=>{
    editor.Commands.run('core:redo');
  })

  $('#sw-visibility').on('click', (event)=>{
    let status = editor.Commands.isActive('sw-visibility');

    if(status){
      editor.Commands.stop('sw-visibility');
    }else{
      editor.Commands.run('sw-visibility');
    }
  })

  $('#editor-preview').on('click', (event)=>{
    let status = editor.Commands.isActive('core:preview');

    if(status){
      editor.Commands.stop('core:preview');
    }else{
      editor.Commands.run('core:preview');
    }
  })

  $('#editor-add').on('click', (event) => {
    $('#sidebar-inner-2')[0].classList.add('visible');
  })
  $('#editor-close-bm').on('click', (event) => {
    $('#sidebar-inner-2')[0].classList.remove('visible');
  })


  $('#editor-styles').on('click', (event) => {
    $('#sidebar-inner-3')[0].classList.add('visible');
  })
  $('#editor-close-stmgr').on('click', (event) => {
    $('#sidebar-inner-3')[0].classList.remove('visible');
  })

  $('#editor-fullscreen').on('click', (event)=>{
    let element = document.querySelector('#editor-area');

    if(document.fullscreenElement){
      if(document.exitFullscreen){
        document.exitFullscreen();
      }else if(document.cancelFullScreen){
        document.cancelFullScreen();
      }else if(document.webkitCancelFullScreen){
        document.webkitCancelFullScreen();
      }else if(document.mozCancelFullScreen){
        document.mozCancelFullScreen();
      }
    }else{
      if(element.requestFullscreen){
        element.requestFullscreen();
      }else if(element.webkitRequestFullScreen){
        element.webkitRequestFullScreen();
      }else if(element.mozRequestFullScreen){
        element.mozRequestFullScreen();
      }else if(element.requestFullscreen){
        element.requestFullscreen();
      }
    }
  })

  $('#canvas-clear').on('click', (event)=>{
    editor.Commands.run('core:canvas-clear');
  })

  $('#gjs-export-zip').on('click', (event)=>{
    editor.Commands.run('gjs-export-zip');
  })

  $('#editor-export').on('shown.bs.modal', ()=>{
    $('#html-export-tab').tab('show');
    $('#html-export').tab('show');
  });

  $('#editor-export').on('hidden.bs.modal', ()=>{
    $('#html-export-tab')[0].classList.remove('active')
    document.querySelector('#editor-export #html-export').innerHTML = "";
    document.querySelector('#editor-export #css-export').innerHTML = "";
  });

  $('#html-export-tab').on('shown.bs.tab', ()=>{
    document.querySelector('#editor-export #html-export').innerHTML = "";

    let txtarea_html = document.createElement('textarea');
    document.querySelector('#editor-export #html-export').appendChild(txtarea_html);
    txtarea_html.value = editor.getHtml()

    var codeViewer_html = editor.CodeManager.getViewer('CodeMirror').clone().set({
      ...CodeMirror_config.export,

      codeName: 'htmlmixed',
      input: txtarea_html
    });

    codeViewer_html.init(txtarea_html);
    codeViewer_html.setContent(editor.getHtml());
    codeViewer_html.editor.refresh();
  })

  $('#css-export-tab').on('shown.bs.tab', ()=>{
    document.querySelector('#editor-export #css-export').innerHTML = "";
    let txtarea_css = document.createElement('textarea');
    document.querySelector('#editor-export #css-export').appendChild(txtarea_css);

    var codeViewer_css = editor.CodeManager.getViewer('CodeMirror').clone().set({
      ...CodeMirror_config.export,

      codeName: 'css',
      input: txtarea_css
    });

    codeViewer_css.init(txtarea_css);
    codeViewer_css.setContent(editor.getCss());
    codeViewer_css.editor.refresh();
  })


  $('#editor-import').on('shown.bs.modal', ()=>{
    document.querySelector('#editor-import .modal-body div').innerHTML = "";
    let txtarea_html = document.createElement('textarea');
    document.querySelector('#editor-import .modal-body div').appendChild(txtarea_html);
    var codeViewer_html = editor.CodeManager.getViewer('CodeMirror').clone().set({
      ...CodeMirror_config.import,

      codeName: 'htmlmixed',
      input: txtarea_html
    });

    codeViewer_html.init(txtarea_html);
    codeViewer_html.setContent('');
    codeViewer_html.editor.refresh();

    $('#import-component')[0].onclick = (e)=>{
      editor.setComponents(codeViewer_html.editor.getValue().trim());
      $('#editor-import').modal('hide');
      document.querySelector('#editor-import .modal-body div').innerHTML = "";
    }
  });
})

editor.on('component:selected', (arguments) => {
  $('#editor-styles')[0].style.display = 'block';
})

editor.on('change:device', () => {
  document.querySelector('.device-type.bg-neutral-first').classList.remove('bg-neutral-first');

  console.log(editor.getDevice());

  switch (editor.getDevice()) {
    case 'Tablet':
      document.querySelector('.device-type#tablet-view').classList.add('bg-neutral-first');
      break;
    case 'Mobile':
      document.querySelector('.device-type#mobile-view').classList.add('bg-neutral-first');
      break;
    case 'Desktop':
      document.querySelector('.device-type#desktop-view').classList.add('bg-neutral-first');
      break;
    default:

  }
});

editor.on('run:sw-visibility', ()=>{
  document.querySelector('#sw-visibility').classList.add('active');
})
editor.on('stop:sw-visibility', ()=>{
  document.querySelector('#sw-visibility').classList.remove('active');
})

window.addEventListener('fullscreenchange', fullScreenChange)
window.addEventListener('mozfullscreenchange', fullScreenChange)
window.addEventListener('webkitfullscreenchange', fullScreenChange)
window.addEventListener('msfullscreenchange', fullScreenChange)

function fullScreenChange(){
  console.log("fullscreen");
  if(!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement ||   document.msFullscreenElement)){
    document.querySelector('#editor-fullscreen').classList.remove('active');
    document.querySelector('#editor-area').classList.remove('fullscreen')
  }else{
    document.querySelector('#editor-fullscreen').classList.add('active');
    document.querySelector('#editor-area').classList.add('fullscreen')
  }
}
