(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _constants = require('./constants');

var _canvas = require('./canvas/canvas.component');

var _storage = require('./storage/storage.component');

var _toolbar = require('./toolbar/toolbar.component');

var _toolbox = require('./toolbox/toolbox.component');

var _toolbox2 = require('./toolbox/toolbox.service');

var _modal = require('./modal/modal.component');

var _estimates = require('./services/estimates.service');

var _job_specification = require('./components/job_specification');

// Clear storage
_storage.storage.clear();

var $data = [{ "type": "fence", "icon": "vinyl-fence.png", "material": "Vinyl" }, { "type": "fence", "icon": "aluminum-fence.png", "material": "Aluminum" }, { "type": "fence", "icon": "wood-fence.png", "material": "Wood" }, { "type": "fence", "icon": "chain-fence.png", "material": "Chain Link" }, { "type": "gate", "icon": "vinyl-gate.png", "material": "Vinyl" }, { "type": "gate", "icon": "aluminum-gate.png", "material": "Aluminum" }, { "type": "gate", "icon": "wood-gate.png", "material": "Wood" }, { "type": "gate", "icon": "chain-gate.png", "material": "Chain Link" }];

pageValidations($data);

// Validate page accessed
function pageValidations(data) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const drawing_id = urlParams.get('id');

    const name = urlParams.get('name');

    jQuery('#edit-field-type-of-spec-und-0-value').val(name)
    jQuery('#job_form_id').val(drawing_id);
  (0, _job_specification.jobBindEvents)();
  if (!(0, _job_specification.isJobView)() || (0, _job_specification.isJobEdit)()) {
    startComponents(data);
  }
  if ((0, _job_specification.isJobView)()) {
    (0, _estimates.bindEstimateEvents)();
    var job_id = jQuery('div.job-specification-view').data('job');
    (0, _job_specification.getDrawingJob)(job_id, false);
  }
}


// Start all the components
function startComponents(data) {
  _storage.storage.initStorages(data);
  (0, _toolbar.setAvailableElements)();
  (0, _toolbar.tbarBindEvents)();
  (0, _toolbox.tboxBindEvents)();
  (0, _estimates.bindEstimateEvents)();
  (0, _modal.bindModalEvents)();
  (0, _toolbox.loadFontSizes)();
  var isEdit = (0, _job_specification.isJobEdit)();
  if (isEdit) {
    var job_id = jQuery('#job_form_id').val();
    (0, _canvas.startCanvas)();
    (0, _job_specification.getDrawingJob)(job_id, isEdit);
    (0, _toolbox2.enableElement)(_toolbox.clearBtn);
  } else {
    (0, _canvas.startCanvas)();
    (0, _canvas.bindCanvasEvents)();
  }
}

},{"./canvas/canvas.component":2,"./components/job_specification":12,"./constants":13,"./modal/modal.component":17,"./services/estimates.service":22,"./storage/storage.component":24,"./toolbar/toolbar.component":27,"./toolbox/toolbox.component":30,"./toolbox/toolbox.service":35}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.productPending = exports.canvas = undefined;
exports.setCanvas = setCanvas;
exports.setProductPending = setProductPending;
exports.startCanvas = startCanvas;
exports.bindCanvasEvents = bindCanvasEvents;
exports.setCanvasBackground = setCanvasBackground;
exports.setCanvasPercentSize = setCanvasPercentSize;
exports.removeSelection = removeSelection;
exports.getRandomID = getRandomID;

var _constants = require('../constants');

var _canvas = require('../canvas/canvas.object-added');

var _canvas2 = require('../canvas/canvas.object-modified');

var _canvas3 = require('../canvas/canvas.object-selection');

var _canvas4 = require('../canvas/canvas.mouse-down');

var _canvas5 = require('../canvas/canvas.mouse-move');

var _canvas6 = require('../canvas/canvas.mouse-over');

var _element = require('../services/element.service');

var _toolbox = require('../toolbox/toolbox.history');

// Export canvas
var canvas = exports.canvas = {};
var productPending = exports.productPending = false;

// Set fabric canvas object to exportable canvas
function setCanvas(pCanvas) {
  exports.canvas = canvas = pCanvas;
}

// Set fabric canvas object to exportable canvas
function setProductPending(pState) {
  exports.productPending = productPending = pState;
}

// Call all needed functions to start canvas
function startCanvas() {
  // Initialize canvas
  exports.canvas = canvas = (0, _element.newCanvas)('myCanvas');
  setCanvas(canvas);
  setCanvasBackground();
  setCanvasPercentSize();
}

// Bind available canvas events
function bindCanvasEvents() {
  // Object added event 
  canvas.on('object:added', function (o) {
    (0, _canvas.objectAdded)(o.target);
  });
  // Object modified event 
  canvas.on('object:modified', function (o) {
    (0, _canvas2.objectModified)(o.target);
  });
  // Object selected event 
  canvas.on('object:selected', function (o) {
    (0, _canvas3.objectSelected)(o.target);
  });
  // Object selected event 
  // canvas.on('object:moving', (o) => { objectMoved(o.target); });
  // Selection cleared event 
  canvas.on('selection:cleared', function (o) {
    (0, _canvas3.objectSelectionCleared)(o.target);
  });
  // Mouse down event 
  canvas.on('mouse:down', function (o) {
    (0, _canvas4.onDown)(o.e);
  });
  // Mouse move event 
  canvas.on('mouse:move', function (o) {
    (0, _canvas5.onMove)(o.e);
  });
  // Mouse over event
  canvas.on('mouse:over', function (o) {
    (0, _canvas6.onOver)(o.e);
  });
  // Mouse out event
  canvas.on('mouse:out', function (o) {
    (0, _canvas6.onOut)(o.e);
  });
  // Mouse up event 
  canvas.on('mouse:up', function (o) {});
  // Mouse down double click event
  // fabric.util.addListener(canvas.upperCanvasEl, 'dblclick', (e) => { onDoubleClick(e);});
}

// Add background to canvas
function setCanvasBackground() {
  var center = canvas.getCenter();
  canvas.setBackgroundImage(_constants.sources.icons + 'square-grid.png', function () {
    (0, _toolbox.saveHistory)();
    canvas.renderAll();
  }, {
    id: 'background',
    top: center.top,
    left: center.left,
    originX: 'center',
    originY: 'center',
    crossOrigin: 'anonymous',
    backgroundImageStretch: true
  });
}

// Set canvas proper css size
function setCanvasPercentSize() {
  jQuery('.canvas-container').css('width', '100%');
  jQuery('canvas').css('width', '100%');
}

// Remove canvas object selection
function removeSelection() {
  canvas.discardActiveObject();
  canvas.renderAll();
}

function getRandomID() {
  var id = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 5; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }return id;
}

// function objectMoved(elem) {
//   // elem.setCoords();
//   canvas.forEachObject(function(obj) {
//     if (obj === elem) return;
//     if ((obj.class === 'post' && elem.class === 'gate') && elem.intersectsWithObject(obj)) {
//       toGatePost();
//     }
//   });
// }

// function onDoubleClick(e){
//   let target = canvas.findTarget(e);
//   if (target) {
//     selectedPost = {};
//     selectedLine = {};
//     isDown = true;
//   } else {
//     isDown = true;
//   }
// }

},{"../canvas/canvas.mouse-down":5,"../canvas/canvas.mouse-move":6,"../canvas/canvas.mouse-over":7,"../canvas/canvas.object-added":8,"../canvas/canvas.object-modified":9,"../canvas/canvas.object-selection":10,"../constants":13,"../services/element.service":21,"../toolbox/toolbox.history":33}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateSegments = calculateSegments;
// Calculate segments according whole fence lenght and segment length
function calculateSegments(lineLength, segment) {
  if (segment == '0') {
    return 0;
  }
  var result = lineLength / segment;
  if (result % 1 != 0) {
    return Math.ceil(result);
  }
  return result;
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectedLine = exports.line = undefined;
exports.setSelectedLine = setSelectedLine;
exports.clearLine = clearLine;
exports.isLineSelected = isLineSelected;
exports.startLine = startLine;
exports.drawingLine = drawingLine;
exports.displayLineLength = displayLineLength;
exports.storeNewElementsData = storeNewElementsData;
exports.moveLine = moveLine;

var _constants = require('../constants');

var _canvas = require('../canvas/canvas.component');

var _canvas2 = require('../canvas/canvas.helper');

var _canvas3 = require('../canvas/canvas.post');

var _toolbar = require('../toolbar/toolbar.component');

var _element = require('../services/element.service');

var _storage = require('../storage/storage.component');

var _storage2 = require('../storage/storage.service');

var _drawing = require('../helpers/drawing.helper');

// Export line and selectedLine objects
var line = exports.line = {};
var selectedLine = exports.selectedLine = {};

// Set fabric line on selectedLine global property
function setSelectedLine(obj) {
  exports.selectedLine = selectedLine = obj;
}

// Clear line variable
function clearLine() {
  exports.line = line = {};
}

// Validate if line is selected
function isLineSelected() {
  return Object.keys(selectedLine).length === 0 ? false : true;
}

// Start drawing line
function startLine(evt, type) {
  var points = [evt.offsetX, evt.offsetY, evt.offsetX, evt.offsetY];
  exports.line = line = (0, _element.newLine)(points);
  line.id = (0, _canvas.getRandomID)();
  line.startX = evt.offsetX;
  line.startY = evt.offsetY;
  line.material = _toolbar.materialSelected;
  line.stroke = _toolbar.materialSelected ? _constants.materialColors[_toolbar.materialSelected] : 'black';
  line.drawingElement = type;
  line.posts = [];
  line.class = 'line';
  line.drawingState = 'started';
  _storage.storage.updateItem('temp', Object.assign({}, line));
  _canvas.canvas.add(line);
  _canvas.canvas.sendToBack(line);
}

// Continue drawing line on movement
function drawingLine(evt) {
  line.endX = evt.offsetX;
  line.endY = evt.offsetY;
  line.moveTo(line.startX, line.startY);
  (0, _drawing.lineMeasure)(line);
  (0, _drawing.lineDirection)(line);
  _canvas.canvas.renderAll();
}

// Show line length once drawing line is finished
function displayLineLength(segmentLength) {
  var leftPoint = line.left - segmentLength.length * 2;
  var topPoint = line.top + segmentLength.length * 2;
  if (line.direction == 'vertical') {
    leftPoint = line.left - 30;
    topPoint = line.top - segmentLength.length * 4;
  }
  var text = new fabric.Text(segmentLength, {
    id: 'length-text',
    left: leftPoint,
    top: topPoint,
    fontSize: 16,
    selectable: false,
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true
  });
  line['textLength'] = text;
  _canvas.canvas.add(text);
  _canvas.canvas.renderAll();
}

// Store fence/gate and related posts data when set new product
function storeNewElementsData(product, elementLength) {
  var drawn = _storage.storage.getItem('temp');
  var posts = '';
  if (product.type != 'gate') {
    posts = (0, _storage2.postsByFence)(product);
  }
  drawn.forEach(function (elem) {
    if (elem.class == 'post') {
      if (posts.end_post) {
        storeOnDrewElement(elem.id, posts.end_post);
      }
      return;
    }
    if (elem.class == 'line') {
      storeOnDrewElement(elem.id, product, elementLength);
      return;
    }
  });
  (0, _storage2.syncStore)();
  //jQuery('#optionsModal').modal('hide');
  jQuery('#elementLength').css('display', 'none');
  jQuery('#labelelementLength').css('display', 'none');
  jQuery('#setProduct').css('display', 'none');
  jQuery('#editLine').css('display', 'none');
  jQuery('#editPost').css('display', 'none');
}

function moveLine() {
  var end = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (!end) {
    line.set({ x1: _canvas3.selectedPost.left, y1: _canvas3.selectedPost.top });
    return;
  }
  line.set({ x2: _canvas3.selectedPost.left, y2: _canvas3.selectedPost.top });
}

// Store data on fabric element
function storeOnDrewElement(id, data) {
  var segmentLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var found = _canvas.canvas.getObjects().find(function (obj) {
    return obj.id == id;
  }) || {};
  if (!Object.keys(found).length) {
    return;
  }
  data.segmentLength = segmentLength;
  found.productData = JSON.stringify(data);
}

},{"../canvas/canvas.component":2,"../canvas/canvas.helper":3,"../canvas/canvas.post":11,"../constants":13,"../helpers/drawing.helper":14,"../services/element.service":21,"../storage/storage.component":24,"../storage/storage.service":26,"../toolbar/toolbar.component":27}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDown = undefined;
exports.setIsDown = setIsDown;
exports.onDown = onDown;

var _canvas = require('../canvas/canvas.component');

var _canvas2 = require('../canvas/canvas.mouse-over');

var _canvas3 = require('../canvas/canvas.line');

var _canvas4 = require('../canvas/canvas.post');

var _toolbar = require('../toolbar/toolbar.service');

var _modal = require('../modal/modal.component');

var _modal2 = require('../modal/modal.service');

var _storage = require('../storage/storage.component');

// Export variable to know if mouse is down
var isDown = exports.isDown = false;

function setIsDown(value) {
  exports.isDown = isDown = value;
}

// Function called when click down on canvas
function onDown(evt) {
  if (_canvas.canvas.drawMode === 'straight' || _canvas.canvas.drawMode === 'gate') {
    lineOnDown(evt, _canvas.canvas.drawMode);
  }
}

// Start/Finish line according click
function lineOnDown(evt, type) {
  if (_canvas.productPending) return;
  if (_canvas2.isOver && (0, _canvas4.isPostSelected)()) {
    exports.isDown = isDown = _canvas3.line.drawingState == 'started' ? true : false;
  }
  exports.isDown = isDown = !isDown;
  var elem = type !== 'gate' ? 'fence' : type;
  if (elem == 'gate' && !(0, _canvas4.isPostSelected)()) {
    alert('Must start drawing gate from selected post.');
    exports.isDown = isDown = false;
    return;
  }
  if (isDown) {
    if ((0, _canvas4.isPostSelected)() && _storage.storage.getItem('temp').length) {
      return;
    }
    (0, _canvas3.startLine)(evt, elem);
    if (!(0, _canvas4.isPostSelected)() || (0, _canvas4.isPostSelected)() && (0, _toolbar.isDifferentMaterial)()) {
      (0, _canvas4.addPost)('start');
    }
    if ((0, _canvas4.isPostSelected)() && !(0, _toolbar.isDifferentMaterial)()) {
      _canvas4.selectedPost.lines.push(_canvas3.line);
      _canvas3.line.posts.push(_canvas4.selectedPost);
    }
    return;
  }
  if (_canvas3.line.length > 0) {
    if (elem === 'fence') {
      if ((0, _toolbar.isDifferentMaterial)() && _canvas.canvas.getActiveObject()) {
        (0, _canvas4.addDiferentPost)();
      } else if ((0, _canvas4.isPostSelected)() && !(0, _toolbar.isDifferentMaterial)() && _canvas.canvas.getActiveObject()) {
        _canvas3.line.posts.push(_canvas4.selectedPost);
        _canvas4.selectedPost.lines.push(_canvas3.line);
        (0, _canvas3.moveLine)(true);
      } else {
        (0, _canvas4.addPost)('end');
      }
    }
    (0, _canvas.setProductPending)(true);
    _canvas3.line.setCoords();
    if (!(0, _toolbar.isMaterialSet)()) {
      onNewLine(elem);
    } else {
      onNewLine(elem, true);
      // storage.setItem('temp', []);
    }
    _canvas3.line.drawingState = 'finished';
    (0, _canvas4.clearPost)();
  }
}

function onNewLine(elem) {
  var isSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  (0, _modal.hideActions)();
  jQuery('#setProduct').css('display', 'block');
  (0, _modal2.setDefaultMaterial)(_canvas3.line.material);
  setTimeout(function onNewLineTime() {
    if (isSet) {
      (0, _modal2.setLastLineMaterial)(_canvas3.line.material, elem);
    }
    if (elem == 'fence') {
      (0, _modal2.showSegmentLength)();
    }
    (0, _modal2.showModalOptions)();
  }, 1000);
}

},{"../canvas/canvas.component":2,"../canvas/canvas.line":4,"../canvas/canvas.mouse-over":7,"../canvas/canvas.post":11,"../modal/modal.component":17,"../modal/modal.service":19,"../storage/storage.component":24,"../toolbar/toolbar.service":29}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onMove = onMove;

var _canvas = require('../canvas/canvas.component');

var _canvas2 = require('../canvas/canvas.mouse-down');

var _canvas3 = require('../canvas/canvas.line');

var _canvas4 = require('../canvas/canvas.post');

var _toolbar = require('../toolbar/toolbar.service');

// Function called when move mouse through canvas
function onMove(evt) {
  if (!_canvas2.isDown) return;
  // canvas.remove(line.text);
  if (_canvas.canvas.drawMode === 'straight' || _canvas.canvas.drawMode === 'gate' && _canvas2.isDown) {
    lineOnMove(evt);
  }
}

function lineOnMove(evt) {
  (0, _canvas3.drawingLine)(evt);
  if ((0, _canvas4.isPostSelected)()) {
    if ((0, _toolbar.isDifferentMaterial)()) {
      (0, _canvas4.movePost)();
      return;
    }
    if (_canvas3.line.drawingElement === 'fence') {
      (0, _canvas3.moveLine)();
      if (differentDirection()) {
        (0, _canvas4.toCornerPost)();
        return;
      }
      (0, _canvas4.toLinePost)();
    } else {
      (0, _canvas3.moveLine)();
      (0, _canvas4.toGatePost)();
    }
  }
}

function differentDirection() {
  var different = _canvas4.selectedPost.lines.some(function (obj) {
    return obj.direction != _canvas3.line.direction;
  });
  return different;
}

},{"../canvas/canvas.component":2,"../canvas/canvas.line":4,"../canvas/canvas.mouse-down":5,"../canvas/canvas.post":11,"../toolbar/toolbar.service":29}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onOver = onOver;
exports.onOut = onOut;
var isOver = exports.isOver = false;

function onOver(evt) {
  exports.isOver = isOver = true;
}

function onOut(evt) {
  exports.isOver = isOver = false;
}

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectAdded = objectAdded;

var _canvas = require('../canvas/canvas.component');

var _toolbox = require('../toolbox/toolbox.service');

var _toolbox2 = require('../toolbox/toolbox.history');

var _toolbar = require('../toolbar/toolbar.component');

var _toolbar2 = require('../toolbar/toolbar.service');

var _storage = require('../storage/storage.component');

// Function called once an object is added to canvas            
function objectAdded(elem) {
  var clear = jQuery('#draw-clear');
  (0, _toolbox.enableElement)(clear);
  if (_canvas.canvas.backgroundImage) {
    if (!elem.class && !elem.id == 'length-text' || !elem.class == 'line' && !elem.class == 'post') {
      (0, _toolbox2.saveHistory)();
    }
  }
  if ((elem.class == 'line' || elem.class == 'post') && (_toolbar.materialSelected || (0, _toolbar2.isMaterialSet)())) {
    validateElementAdded(elem);
  }
}

function validateElementAdded(elem) {
  var newObject = {};
  var objects = _storage.storage.getItem('drewElements');
  var lastElem = getLastDrewElement(objects, elem);
  if (Object.keys(lastElem).length > 0) {
    var data = JSON.parse(lastElem.productData);
    if (elem.class === 'line') {
      storeFenceData(data);
    }
    if (elem.class === 'post') {
      storePostData(data);
    }
    elem.productData = JSON.stringify(data);
    newObject = Object.assign({}, elem);
    objects.push(newObject);
  }
}

function getLastDrewElement(objects, elem) {
  var results = objects.filter(function (obj) {
    return obj.class == elem.class && obj.drawingElement == elem.drawingElement && obj.material == elem.material;
  });
  if (results.length > 0) {
    return results[results.length - 1];
  }
  return {};
}

},{"../canvas/canvas.component":2,"../storage/storage.component":24,"../toolbar/toolbar.component":27,"../toolbar/toolbar.service":29,"../toolbox/toolbox.history":33,"../toolbox/toolbox.service":35}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectModified = objectModified;

var _toolbox = require('../toolbox/toolbox.history');

function objectModified(elem) {
  (0, _toolbox.saveHistory)();
}

},{"../toolbox/toolbox.history":33}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectSelected = objectSelected;
exports.objectSelectionCleared = objectSelectionCleared;

var _canvas = require('../canvas/canvas.line');

var _canvas2 = require('../canvas/canvas.post');

var _canvas3 = require('../canvas/canvas.mouse-down');

var _toolbox = require('../toolbox/toolbox.component');

var _toolbox2 = require('../toolbox/toolbox.service');

// Function called once an object is selected on canvas
function objectSelected(elem) {
  var trashBtn = jQuery('#draw-trash');
  (0, _toolbox2.enableElement)(trashBtn);
  (0, _toolbox2.hideElementsOptions)();
  if (elem.class == 'line') {
    (0, _canvas.setSelectedLine)(elem);
    changeSelectedBorder(elem);
  }
  (0, _canvas2.clearPost)();
  if (elem.class == 'post') {
    (0, _canvas3.setIsDown)(false);
    (0, _canvas2.setSelectedPost)(elem);
    changeSelectedBorder(elem);
  }
  if (elem.class == 'text' || elem.class == 'shape' || elem.class == 'line' || elem.class == 'post') {
    (0, _toolbox2.showElementOptions)(elem.class, 'table-cell');
    return;
  }
}

// Function called once object selection is cleared
function objectSelectionCleared(elem) {
  var trashBtn = jQuery('#draw-trash');
  (0, _toolbox2.disableElement)(trashBtn);
  (0, _toolbox2.hideElementsOptions)();
  (0, _toolbox.resetPickColor)();
  if ((0, _canvas.isLineSelected)()) {
    (0, _canvas.setSelectedLine)({});
  }
}

//Private Functions

// Change border color of element selected to default black
function changeSelectedBorder(elem) {
  elem.set({
    'borderColor': 'black'
  });
}

},{"../canvas/canvas.line":4,"../canvas/canvas.mouse-down":5,"../canvas/canvas.post":11,"../toolbox/toolbox.component":30,"../toolbox/toolbox.service":35}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectedPost = exports.post = undefined;
exports.isPostSelected = isPostSelected;
exports.setSelectedPost = setSelectedPost;
exports.clearPost = clearPost;
exports.addPost = addPost;
exports.addDiferentPost = addDiferentPost;
exports.movePost = movePost;
exports.toCornerPost = toCornerPost;
exports.toLinePost = toLinePost;
exports.toGatePost = toGatePost;

var _constants = require('../constants');

var _canvas = require('../canvas/canvas.component');

var _canvas2 = require('../canvas/canvas.line');

var _toolbar = require('../toolbar/toolbar.component');

var _element = require('../services/element.service');

var _storage = require('../storage/storage.component');

var _storage2 = require('../storage/storage.service');

var post = exports.post = {};
var selectedPost = exports.selectedPost = {};

function isPostSelected() {
  return Object.keys(selectedPost).length === 0 ? false : true;
}

function setSelectedPost(obj) {
  exports.selectedPost = selectedPost = obj;
}

function clearPost() {
  exports.selectedPost = selectedPost = {};
  stop = true;
}

function addPost(type) {
  var points = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  exports.post = post = (0, _element.newPost)(post);
  if (!points) {
    post.left = type === 'end' ? _canvas2.line.endX : _canvas2.line.startX;
    post.top = type === 'end' ? _canvas2.line.endY : _canvas2.line.startY;
  } else {
    post.left = points.left;
    post.top = points.top;
  }
  post.id = (0, _canvas.getRandomID)();
  post.lines = [_canvas2.line];
  _canvas2.line.posts.push(post);
  post.class = 'post';
  post.postType = 'end';
  post.state = 'added';
  post.material = _toolbar.materialSelected;
  post.fill = _toolbar.materialSelected ? _constants.materialColors[_toolbar.materialSelected] : 'black';
  _storage.storage.updateItem('temp', Object.assign({}, post));
  _canvas.canvas.add(post);
  _canvas.canvas.bringToFront(post);
  post.lines.forEach(function (line) {
    _canvas.canvas.sendToBack(line);
  });
}

function addDiferentPost() {
  addPost('end');
  movePost(true);
}

function movePost() {
  var opposite = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var direction = _canvas2.line.drawingTo;
  selectedPost.state = 'modified';
  _canvas2.line.set({ x1: post.left, y1: post.top });
  if (direction === 'left' && !opposite || direction === 'right' && opposite) {
    post.left = selectedPost.left - post.width;
    post.top = selectedPost.top;
    return;
  }
  if (direction === 'right' && !opposite || direction === 'left' && opposite) {
    post.left = selectedPost.left + post.width;
    post.top = selectedPost.top;
    return;
  }
  if (direction === 'top' && !opposite || direction === 'bot' && opposite) {
    post.top = selectedPost.top - post.width;
    post.left = selectedPost.left;
    return;
  }
  if (direction === 'bot' && !opposite || direction === 'top' && opposite) {
    post.top = selectedPost.top + post.width;
    post.left = selectedPost.left;
    return;
  }
}

function toCornerPost() {
  selectedPost.postType = 'corner';
  selectedPost.state = 'modified';
  // selectedPost.setFill('orange');
  var line = JSON.parse(selectedPost.lines[0].productData);
  var posts = (0, _storage2.postsByFence)(line);
  var cornerPost = posts['corner_post'];
  if (!stop) {
    return;
  }
  selectedPost.productData = JSON.stringify(cornerPost);
  stop = false;
}

function toLinePost() {
  selectedPost.postType = 'end';
  selectedPost.state = 'modified';
  //post.setFill('red');
}

function toGatePost() {
  selectedPost.postType = 'gate';
  selectedPost.state = 'modified';
  //post.setFill('purple');
}

},{"../canvas/canvas.component":2,"../canvas/canvas.line":4,"../constants":13,"../services/element.service":21,"../storage/storage.component":24,"../storage/storage.service":26,"../toolbar/toolbar.component":27}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobBindEvents = jobBindEvents;
exports.getDrawingJob = getDrawingJob;
exports.isJobEdit = isJobEdit;
exports.isJobView = isJobView;

var _constants = require('../constants');

var _canvas = require('../canvas/canvas.component');

var _store = require('../helpers/store.helper');

var _storage = require('../storage/storage.component');

var _estimates = require('../services/estimates.service');

var _toolbox = require('../toolbox/toolbox.component');

// Bind job events
function jobBindEvents() {
  jQuery('#job-specification-entityform-edit-form').submit(function (e) {
    onSubmit();
  });
  jQuery('#update-store').click(function () {
    onUpdateStore();
  });
  if (isJobView()) {
    var toStore = JSON.parse(localStorage.getItem('toStore'));
    if (toStore) {
      toStore.job_id = jQuery('.job-specification-view').data('job');
      storeDrawingJSON(toStore);
      localStorage.removeItem('toStore');
    }
  }
}

//Call function before submit to store/update
function onSubmit() {
  var jobName = jQuery('#edit-field-type-of-spec-und-0-value').val();
  if (!jobName) return;
  setCanvasImage(_canvas.canvas);
  var store = _storage.storage.getItem('store');
  _canvas.canvas.forEachObject(function (obj) {
    if (obj.class == 'line') {
      obj.posts.forEach(function (post, index) {
        if (typeof post.toJSON == 'function') {
          obj.posts[index] = post.toJSON(['id', 'productData', 'material', 'postType', 'lines']);
        }
      });
    }
    if (obj.class == 'post') {
      obj.lines.forEach(function (line, index) {
        if (typeof line.toJSON == 'function') {
          obj.lines[index] = line.toJSON(['productData', 'direction', 'material']);
        }
      });
    }
  });
  var canvasJson = _canvas.canvas.toJSON(_constants.exportProperties);
  var jobID = jQuery("#job_form_id").val();
  var state = jQuery('#lock-drawning').data('lock');
  var data = {
    'store': store,
    'canvasJson': canvasJson,
    'state': state
  };
  var toStore = {
    'job_id': jobID,
    'job_json_data': JSON.stringify(data)
  };
  if (!isJobEdit()) {
    localStorage.setItem('toStore', JSON.stringify(toStore));
    jQuery("#tostorejson").val(btoa(JSON.stringify(toStore)))
    return;
  }

  updateDrawingJSON(toStore);
}

//Create image based on canvas and add it to form input
function setCanvasImage(canvas) {
  var url = canvas.toDataURL({ format: 'image/jpeg', multiplier: 1 });
  $("#edit-field-base64-data input").val(url);
}

// Store drawing data associated to job
function storeDrawingJSON(toStore) {
  var baseURL = jQuery("#base-url").val();
  jQuery.ajax({
    url: baseURL + '/drawing/store/ajax',
    type: 'POST',
    data: toStore,
    success: function success(data) {
      getDrawingJob(toStore.job_id);
    },
    error: function error(req, status, err) {
      console.log(status, err);
    }
  });
}

function onUpdateStore() {
  var job = _storage.storage.getItem('job_json');
  var newStore = _storage.storage.getItem('store');
  job.job_json_data = JSON.parse(job.job_json_data);
  job.job_json_data.store = newStore;
  job.job_json_data = JSON.stringify(job.job_json_data);
  updateDrawingJSON(job);
}

// Store drawing data associated to job
function updateDrawingJSON(toUpdate) {
  jQuery("#tostorejson").val(btoa(JSON.stringify(toUpdate)))
}

//Ajax to get drawing json data based on job id
function getDrawingJob(job_id) {
  var isEdit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var baseURL = jQuery("#base-url").val();
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const drawing = urlParams.get('drawing');
      var data ="["+atob(drawing)+"]";
      var jsonData = JSON.parse(data);
      if (jsonData.length) {
        var job = jsonData[0];
        _storage.storage.setItem('job_json', job);
        var jsonJobData = JSON.parse(job.job_json_data);
        // let store = JSON.parse(job.job_json_data).store;
        _storage.storage.setItem('store', jsonJobData.store);
        (0, _estimates.refreshTables)();
        if (isEdit) {
          // let canvasJson = JSON.parse(job.job_json_data).canvasJson;
          // let state = JSON.parse(job.job_json_data).state;
          startDrawingEdit(jsonJobData);
        }
      }

}

//Load canvas json on canvas
function startDrawingEdit(json) {
  var state = json.state;
  _canvas.canvas.loadFromJSON(json.canvasJson, function (o, object) {
    _canvas.canvas.renderAll();
    (0, _canvas.bindCanvasEvents)();
    if (state) {
      jQuery('#lock-drawning').data('lock', !state);
      (0, _toolbox.lockDrawing)();
    }
  });
}

//Check if is job specification edit page
function isJobEdit() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const drawing = urlParams.get('drawing')
  return !!(drawing !== null);
}

//Check if is job specification view page
function isJobView() {
  var container = jQuery('#estimations');
  return !!(container.length && container.hasClass('job-specification-view'));
}

},{"../canvas/canvas.component":2,"../constants":13,"../helpers/store.helper":15,"../services/estimates.service":22,"../storage/storage.component":24,"../toolbox/toolbox.component":30}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var sources = exports.sources = {
	'elements': '/drawing/elements/ajax',
	'icons': '/dotcreek_drawaing_fance/static/src/img/'
};

var lineModel = exports.lineModel = {
	'startX': 0,
	'endX': 0,
	'startY': 0,
	'endY': 0,
	'width': 0,
	'text': {},
	'obj': {},
	'direction': 'horizontal',
	'type': '',
	'id': ''
};

var postModel = exports.postModel = {
	'left': 0,
	'top': 0,
	'line': {},
	'obj': {},
	'color': '',
	'postType': ''
};

var materialColors = exports.materialColors = {
	'chain': 'red',
	'aluminum': 'green',
	'vinyl': '#eede17',
	'wood': 'blue'
};

var exportProperties = exports.exportProperties = ['selectable', 'hasControls', 'hasBorders', 'lockMovementX', 'lockMovementY', 'hasRotatingPoint', 'mt', 'mb', 'ml', 'mr', 'isDrawingMode', 'selection', 'perPixelTargetFind', 'targetFindTolerance', 'id', 'startX', 'startY', 'endX', 'endY', 'material', 'stroke', 'drawingElement', 'productData', 'drawingState', 'posts', 'class', 'lines', 'postType', 'state', 'fill', 'length', 'textLength'];

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lineMeasure = lineMeasure;
exports.lineDirection = lineDirection;
function lineMeasure(line) {
  var numX = line.endX * 1 - line.startX * 1;
  var numY = line.endY * 1 - line.startY * 1;
  var result = Math.sqrt(Math.pow(numX, 2) + Math.pow(numY, 2));
  line.length = result.toFixed(2);
}

function lineDirection(line) {
  var moveX = line.endX - line.startX;
  var moveY = line.endY - line.startY;
  if (Math.abs(moveX) > Math.abs(moveY)) {
    line.direction = 'horizontal';
    line.drawingTo = line.endX < line.startX ? 'left' : 'right';
    if (line.drawingElement === 'fence') {
      line.set({ x2: line.endX, y2: line.endY });
      return;
    }
    setDiagonal(line);
  } else {
    line.direction = 'vertical';
    line.drawingTo = line.endY < line.startY ? 'top' : 'bot';
    if (line.drawingElement === 'fence') {
      line.set({ x2: line.endX, y2: line.endY });
      return;
    }
    setDiagonal(line);
  }
}

function setDiagonal(line) {
  var pointX1 = line.startX;
  var pointX2 = line.endX;
  var pointY1 = line.startY;
  var pointY2 = line.endY;
  var length = parseInt(line.length);

  if (pointX2 <= pointX1 && pointY2 <= pointY1) {
    //Top Left
    line.set({ x2: pointX2, y2: pointY1 - length });
    // line.drawingTo = 'top';
    return;
  }
  if (pointX2 >= pointX1 && pointY2 <= pointY1) {
    //Top Right
    line.set({ x2: pointX2, y2: pointY1 - length });
    // line.drawingTo = 'top';
    return;
  }
  if (pointX2 <= pointX1 && pointY2 >= pointY1) {
    //Bottom Left
    line.set({ x2: pointX2, y2: pointY1 + length });
    return;
  }
  if (pointX2 >= pointX1 && pointY2 >= pointY1) {
    //Bottom Right
    line.set({ x2: pointX2, y2: pointY1 + length });
    return;
  }
}

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterElements = filterElements;
exports.calculateSegments = calculateSegments;
exports.getURLParameters = getURLParameters;

var _storage = require('../storage/storage.service');

function filterElements(material, type) {
  return _storage.storage.getItem(type).filter(function getElements(elem) {
    return elem.material.toLowerCase().includes(material.toLowerCase());
  });
}

function calculateSegments(lineLength, segment) {
  if (segment == '0') {
    return 0;
  }
  var result = lineLength / segment;
  if (result % 1 != 0) {
    return Math.ceil(result);
  }
  return result;
}

function getURLParameters() {
  return window.location.pathname.split('/').slice(1);
}

},{"../storage/storage.service":26}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayAccessories = displayAccessories;
exports.setAccessory = setAccessory;

var _storage = require('../storage/storage.component');

var _storage2 = require('../storage/storage.service');

var _estimates = require('../services/estimates.service');

// Trigger when add accessory button from table is clicked
// show accessories associated with element
function displayAccessories(clicked) {
  var store = _storage.storage.getItem('store');
  var sku = jQuery(clicked).data('sku');
  var accessories = store[sku].data.accessories;
  var options = '<option disabled selected>Select accessory</option>';
  accessories.forEach(function (obj) {
    options += '<option value="' + obj.product_sku + '">' + obj.description + '</option>';
  });
  jQuery('select#accessories').html(options);
  jQuery('#setAccessory').data('parent', sku);
  jQuery('#accessoriesModal').modal('show');
}

// Trigger when set accessory button from modal is clicked
// add accessory to product store
function setAccessory(clicked) {
  var parentSku = jQuery(clicked).data('parent');
  var store = _storage.storage.getItem('store');
  var parent = store[parentSku];
  var data = parent.data.accessories.find(function (obj) {
    return obj.product_sku = jQuery('#accessories').val();
  });
  if (!parent.hardware) {
    parent['hardware'] = {};
  }
  (0, _storage2.storeHardware)(parent['hardware'], data, parentSku, parent.qty);
  _storage.storage.setItem('store', store);
  (0, _estimates.refreshTables)();
  jQuery('#accessoriesModal').modal('hide');
}

},{"../services/estimates.service":22,"../storage/storage.component":24,"../storage/storage.service":26}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bindModalEvents = bindModalEvents;
exports.showPostTypes = showPostTypes;
exports.hideActions = hideActions;

var _constants = require('../constants');

var _canvas = require('../canvas/canvas.component');

var _canvas2 = require('../canvas/canvas.line');

var _canvas3 = require('../canvas/canvas.post');

var _modal = require('../modal/modal.product');

var _modal2 = require('../modal/modal.accessories');

var _store = require('../helpers/store.helper');

var _toolbox = require('../toolbox/toolbox.service');

var _storage = require('../storage/storage.component');

var _store2 = require('../services/store.service');

var _estimates = require('../services/estimates.service');

// EXPORTS  FUNCTIONS                    

// Bind modal events
function bindModalEvents() {
  jQuery('#setProduct').on('click', function () {
    (0, _modal.onSetProduct)();
  });
  jQuery('body').on('click', '.add-accessory', function () {
    (0, _modal2.displayAccessories)(this);
  });
  jQuery('#setAccessory').on('click', function () {
    (0, _modal2.setAccessory)(this);
  });
  jQuery('#editLine').on('click', function () {
    editLine();
  });
  jQuery('#editPost').on('click', function () {
    (0, _modal.editPost)();
  });
  jQuery('#close-modal').on('click', function () {
    onModalClose();
  });
}

// Show segment length input
function showPostTypes() {
  jQuery('#segment-length-container').show();
  jQuery('#post-types').show();
}

// Hide all the actions under modal
function hideActions() {
  jQuery('#optionsModal .modal-footer').find('button').css('display', 'none');
  jQuery('#segment-length-container').hide();
}

function editLine() {
  if (_canvas2.selectedLine.drawingElement == 'fence') {
    (0, _modal.editFence)();
    return;
  }
  (0, _modal.editGate)();
}

// Reset filters on modal
function resetFilters() {
  jQuery('#material-type').val('0').trigger('change');
}

// Remove drew elements when modal is closed without finish process
function onModalClose() {
  var temp = _storage.storage.getItem('temp');
  if (temp && temp.length > 0) {
    var objects = _canvas.canvas.getObjects();
    var toDelete = {};
    temp.forEach(function (drew) {
      toDelete = objects.find(function (obj) {
        return obj.id == drew.id;
      });
      _canvas.canvas.remove(toDelete);
    });
    _canvas.canvas.renderAll();
    (0, _canvas3.clearPost)();
    (0, _canvas.removeSelection)();
    _storage.storage.setItem('temp', []);
    (0, _canvas.setProductPending)(false);
  }
}

},{"../canvas/canvas.component":2,"../canvas/canvas.line":4,"../canvas/canvas.post":11,"../constants":13,"../helpers/store.helper":15,"../modal/modal.accessories":16,"../modal/modal.product":18,"../services/estimates.service":22,"../services/store.service":23,"../storage/storage.component":24,"../toolbox/toolbox.service":35}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onSetProduct = onSetProduct;
exports.setNewProduct = setNewProduct;
exports.editFence = editFence;
exports.editGate = editGate;
exports.editPost = editPost;

var _canvas = require('../canvas/canvas.component');

var _canvas2 = require('../canvas/canvas.line');

var _canvas3 = require('../canvas/canvas.post');

var _storage = require('../storage/storage.component');

var _storage2 = require('../storage/storage.service');

var _toolbar = require('../toolbar/toolbar.component');

var _toolbox = require('../toolbox/toolbox.history');

// legacy
/* export function onSetProduct() {
  setNewProduct();
} */
function onSetProduct() {
  setNewProduct();
}

// legacy
// Trigger when set product button from modal is clicked
// validate fence product exist and add it to table/drew data
/* export function setNewProduct() {
  let sku = jQuery('#jf-custom-sku-product').val();
  let elementLength = jQuery('#elementLength').val();
  if (!sku) {
    alert('Product sku have to be selected.');
    return;
  }
  if (!elementLength && elementSelected != 'gate') {
    alert('Element length can\'t be empty');
    return;
  }
  // let drawn = storage.getItem('temp')[0];
  // Start drawing with data from request
  let product = productBySkuLocal(sku, materialSelected);
  if(product && product.length > 0) {
    loadProduct(product, elementLength);
  } else {
    // get the product from the API
    productBySku(sku, materialSelected).done(function(product) {
      if(product && product[0] && product[0].entityform_id){
        //locally store the product
        let items = storage.getItem(elementSelected);
        items.push(product[0]);
        storage.setItem(elementSelected, items);
        loadProduct(product, elementLength);

        // get the gates of the selected material
        gatesByMaterial(materialSelected).done(function(gates) {
          if(gates){
            storage.addCollection("gate", gates);
          } else {
            console.log('No gates found');
            return;
          }

        }).fail(function(jqXHR, textStatus) {
          console.log('An error occurred getting the gates drawing components.', textStatus);
          alert('An error occurred getting the gates drawing components.');
        });
      } else {
        alert('Product doesn\'t exist');
        return;
      }

    }).fail(function(jqXHR, textStatus) {
      console.log(textStatus);
      alert('An error occurred getting the drawing components.');
      return {};
    });

  }
} */
function setNewProduct() {
  var sku = 10;
  var materialSelected = "aluminum";
  var elementLength = jQuery('#elementLength').val();
  if (!sku) {
    alert('Product sku have to be selected.');
    return;
  }
  if (!elementLength && _toolbar.elementSelected != 'gate') {
    alert('Element length can\'t be empty');
    return;
  }
  // let drawn = storage.getItem('temp')[0];
  // Start drawing with data from request
  var product = (0, _storage2.productBySkuLocal)(sku, materialSelected);
  if (product && product.length > 0) {
    loadProduct(product, elementLength);
  } else {
    // get the product from the API
    //locally store the product
    var items = _storage.storage.getItem(_toolbar.elementSelected);
    var _product = [{
      "entityform_id": "10",
      "product_sku": "10",
      "name": "Amethyst (F) ",
      "type": "fence",
      "description": "Amethyst (F) ",
      "icon": "aluminum-fence.png",
      "item_number": "10",
      "material": "Aluminum",
      "install_price": "1",
      "retail_price": "1",
      "wholesale_less": "1",
      "wholesale_more": "1",
      "default_hardware": [],
      "accessories": [],
      "posts": {
        "end_post": ["22", "22"],
        "line_post": ["24"],
        "corner_post": ["21"],
        "gate_post": ["23", "23"]
      },
      "segment": "6"
    }];
    items.push(_product[0]);
    _storage.storage.setItem(_toolbar.elementSelected, items);
    loadProduct(_product, elementLength);

    // get the gates of the selected material
    (0, _storage2.preLoadRelatedPosts)(sku);
  }
}
/**
 * Load the selected product in the drawing tool
 *
 * @param {*} product Product information
 * @param {*} elementLength Lenght of the element to draw (if applies)
 */
function loadProduct(product, elementLength) {
  if (product[0].type === 'fence') {
    //load the posts elements from the database and store them in localstorage
    var skus = [].concat.apply([], Object.values(product[0].posts));
    (0, _storage2.preLoadRelatedPosts)(skus);
  }

  if (validatePostIncluded(product)) {
    if (_toolbar.elementSelected != 'gate') {
      (0, _canvas2.storeNewElementsData)(product[0], elementLength);
      (0, _canvas2.displayLineLength)(elementLength);
    } else {
      (0, _canvas2.storeNewElementsData)(product[0], 1);
    }
    //jQuery('#optionsModal').modal('hide');
    jQuery('#elementLength').css('display', 'none');
  jQuery('#labelelementLength').css('display', 'none');
  jQuery('#setProduct').css('display', 'none');
  jQuery('#editLine').css('display', 'none');
  jQuery('#editPost').css('display', 'none');
    _storage.storage.setItem('temp', []);
    (0, _canvas2.clearLine)();
    (0, _canvas.setProductPending)(false);
    (0, _canvas.removeSelection)();
    (0, _canvas3.clearPost)();
    (0, _toolbox.saveHistory)();
  }
}

// Edit fence product data
function editFence() {
  var lineData = JSON.parse(_canvas2.selectedLine.productData);
  var newSegmentLength = jQuery('#elementLength').val();
  lineData['segmentLength'] = newSegmentLength;
  var newProductSku = jQuery('#jf-custom-sku-product').val();
  if (lineData.product_sku != newProductSku) {
    var product = (0, _storage2.productBySku)(newProductSku, _toolbar.materialSelected);
    if (!product.length) {
      alert('Product doesn\'t exist');
      return;
    }
    lineData = product[0];
    lineData['segmentLength'] = newSegmentLength;
    updateFencePosts(lineData);
  }
  var textLength = _canvas.canvas.getObjects().find(function (obj) {
    return obj.left === _canvas2.selectedLine.textLength.left && obj.top === _canvas2.selectedLine.textLength.top;
  });
  textLength.text = newSegmentLength;
  _canvas.canvas.renderAll();
  _canvas2.selectedLine.productData = JSON.stringify(lineData);
  (0, _storage2.syncStore)();
  //jQuery('#optionsModal').modal('hide');
  jQuery('#elementLength').css('display', 'none');
  jQuery('#labelelementLength').css('display', 'none');
  jQuery('#setProduct').css('display', 'none');
  jQuery('#editLine').css('display', 'none');
  jQuery('#editPost').css('display', 'none');
}

// Edit gate product data
function editGate() {
  var lineData = JSON.parse(_canvas2.selectedLine.productData);
  var newProductSku = jQuery('#jf-custom-sku-product').val();
  if (lineData.product_sku != newProductSku) {
    var product = (0, _storage2.productBySku)(newProductSku, _toolbar.materialSelected);
    if (!product.length) {
      alert('Product doesn\'t exist');
      return;
    }
    lineData = product[0];
  }
  _canvas.canvas.renderAll();
  _canvas2.selectedLine.productData = JSON.stringify(lineData);
  (0, _storage2.syncStore)();
  //jQuery('#optionsModal').modal('hide');
  jQuery('#elementLength').css('display', 'none');
  jQuery('#labelelementLength').css('display', 'none');
  jQuery('#setProduct').css('display', 'none');
  jQuery('#editLine').css('display', 'none');
  jQuery('#editPost').css('display', 'none');
}

// Update posts data associated with fence
function updateFencePosts(fence) {
  var postSkus = fence.posts;
  var canvasObjects = _canvas.canvas.getObjects();
  var newPostData = {};
  var drawnObject = {};
  var postKey = '';
  _canvas2.selectedLine.posts.map(function (post) {
    drawnObject = canvasObjects.find(function (obj) {
      return obj.id == post.id;
    });
    postKey = drawnObject.postType + '_post';
    newPostData = (0, _storage2.postBySku)(postSkus[postKey][0], _toolbar.materialSelected);
    drawnObject.productData = JSON.stringify(newPostData);
  });
}

function editPost() {
  var material = "aluminum";
  var sku = jQuery('#jf-custom-sku-product').val();
  var postType = jQuery('#post-types').val();
  var post = getExistingPostSku(material, postType, sku);
  if (!Object.keys(post).length) {
    alert('Product doesn\'t exist');
    return;
  }
  var postData = JSON.parse(_canvas3.selectedPost.productData);
  reduceFromStore(postData);
  newData(post);
  //jQuery('#optionsModal').modal('hide');
  jQuery('#elementLength').css('display', 'none');
  jQuery('#labelelementLength').css('display', 'none');
  jQuery('#setProduct').css('display', 'none');
  jQuery('#editLine').css('display', 'none');
  jQuery('#editPost').css('display', 'none');
}

// Validate if fence have all required type of posts
// with at least one product stored
function validatePostIncluded(product) {
  var posts = product[0].posts;
  var type = product[0].type;
  if (posts && Object.keys(posts).length) {
    var message = 'Errors:';
    var valid = true;
    if (type == 'fence') {
      if (posts.line_post && !posts.line_post.length) {
        message += '\n Selected fence haven\'t line posts associated.';
        valid = false;
      }
      if (posts.end_post && !posts.end_post.length) {
        message += '\n Selected fence haven\'t end posts associated.';
        valid = false;
      }
      if (posts.corner_post && !posts.corner_post.length) {
        message += '\n Selected fence haven\'t corner posts associated.';
        valid = false;
      }
      if (posts.gate_post && !posts.gate_post.length) {
        message += '\n Selected fence haven\'t gate posts associated.';
        valid = false;
      }
    }
    if (!valid) {
      alert(message);
    }
    return valid;
  }
  return true;
}

},{"../canvas/canvas.component":2,"../canvas/canvas.line":4,"../canvas/canvas.post":11,"../storage/storage.component":24,"../storage/storage.service":26,"../toolbar/toolbar.component":27,"../toolbox/toolbox.history":33}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDefaultMaterial = setDefaultMaterial;
exports.setLastLineMaterial = setLastLineMaterial;
exports.showSegmentLength = showSegmentLength;
exports.showModalOptions = showModalOptions;

var _canvas = require('../canvas/canvas.component');

// Set default material on options modal
function setDefaultMaterial(material) {
  var typeSelect = jQuery('#material-type');
  material = material.charAt(0).toUpperCase() + material.slice(1);
  var optionValue = typeSelect.find('option:contains(' + material + ')').val();
  typeSelect.val(optionValue).trigger('change');
}

function setLastLineMaterial(material, type) {
  var objects = _canvas.canvas.getObjects();
  var materialFences = objects.filter(function (obj) {
    return obj.material == material && obj.drawingElement == type;
  });
  var lastFence = materialFences[materialFences.length - 1];
  var productData = JSON.parse(lastFence.productData);
  // jQuery('.material-title').text(line.material.toUpperCase());
  jQuery('#jf-custom-sku-product').val(productData.product_sku);
  //jQuery('#jf-material-custom-sku').show();
  //jQuery('#edit-description').show();
  jQuery('#edit-description').find('input').val(productData.description);
}

// Show segment length input
function showSegmentLength() {
  jQuery('#post-types').hide();
  jQuery('#segment-length-container').show();
  jQuery('#elementLength').val('');
}

// Show modal for element options
function showModalOptions() {

  jQuery('#segment-length-container').css('display', 'block');
  //jQuery('#optionsModal').modal('show');
}

},{"../canvas/canvas.component":2}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSelected = setSelected;
// Set state of element and add remove/add
// class to show it as selected/unselected
function setSelected(btn) {
  var elem = jQuery(btn);
  if (elem.hasClass('selected')) {
    elem.removeClass('selected');
    return true;
  }
  var selected = jQuery('.selected');
  if (selected.length > 0) {
    selected.removeClass('selected');
  }
  elem.addClass('selected');
  return false;
}

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newCanvas = newCanvas;
exports.newLine = newLine;
exports.newPost = newPost;
exports.newImg = newImg;
exports.newText = newText;
exports.newCircle = newCircle;
exports.newRectangle = newRectangle;
// Start fabric canvas according canvas id
function newCanvas(id) {
  return new fabric.Canvas(id, {
    isDrawingMode: false,
    selection: false,
    perPixelTargetFind: true,
    targetFindTolerance: 4
  });
}

// Create new fabric line element
function newLine(points) {
  var line = new fabric.Line(points, {
    strokeWidth: 2,
    stroke: 'black',
    originX: 'center',
    originY: 'center',
    padding: 3,
    selectable: true,
    hasControls: false,
    hasBorders: true,
    lockMovementX: true,
    lockMovementY: true
  });

  return line;
}

// Create new fabric square element
function newPost(options) {
  var post = new fabric.Rect({
    width: 20,
    height: 20,
    originX: 'center',
    originY: 'center',
    padding: 5,
    selectable: true,
    hasControls: false,
    hasBorders: true,
    lockMovementX: true,
    lockMovementY: true
  });

  return post;
}

// Create new fabric image element
function newImg(url, canvas) {
  var img = new fabric.Image.fromURL(url, function (oImg) {
    oImg.set({
      'left': 252,
      'top': 200
    });
    oImg.scale(0.1);
    setElementOptions(oImg);
    canvas.add(oImg);
    canvas.renderAll();
  });
}

// Create new fabric text element
function newText() {
  var text = new fabric.IText('Click to change Text', {
    width: 300,
    height: 60,
    left: 252,
    top: 200
  });
  text.class = 'text';
  setElementOptions(text);

  return text;
}

// Create new fabric circle element
function newCircle() {
  var circle = new fabric.Circle({
    radius: 50,
    left: 375,
    top: 175,
    stroke: 'rgb(0,0,0)',
    strokeWidth: 1,
    fill: 'transparent'
  });
  circle.class = 'shape';
  setElementOptions(circle);

  return circle;
}

// Create new fabric rectangle element
function newRectangle() {
  var rectangle = new fabric.Rect({
    width: 150,
    height: 80,
    left: 350,
    top: 185,
    stroke: 'rgb(0,0,0)',
    strokeWidth: 1,
    fill: 'transparent'
  });
  rectangle.class = 'shape';
  setElementOptions(rectangle);

  return rectangle;
}

// Modify default element options
function setElementOptions(elem) {
  elem.setControlsVisibility({
    mt: false,
    mb: false,
    ml: false,
    mr: false
  });
  elem.set({
    hasRotatingPoint: false
  });
}

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bindEstimateEvents = bindEstimateEvents;
exports.refreshTables = refreshTables;

var _constants = require('../constants');

var _storage = require('../storage/storage.component');

// Bind tables events
function bindEstimateEvents() {
  jQuery('#table-items').on('change', 'input[type="number"]', function () {
    onQtyChanged(this);
  });
  jQuery('body').on('click', '.remove', function () {
    onRemoveRow(this);
  });
}

// Bind tables events
function refreshTables() {
  jQuery('#estimations').find('table tbody').html('');
  var store = _storage.storage.getItem('store');
  var elementKeys = Object.keys(store);
  var hardwareKeys = '';
  if (elementKeys.length > 0) {
    elementKeys.forEach(function (sku) {
      addToTable(store[sku]);
      if (store[sku].hardware) {
        hardwareKeys = Object.keys(store[sku].hardware);
        if (hardwareKeys.length > 0) {
          hardwareKeys.forEach(function (hardwareSku) {
            addToTable(store[sku].hardware[hardwareSku]);
          });
        }
      }
    });
    return;
  }
  _storage.storage.setItem('drewElements', []);
}

// Modify quantity on store when change on table input
function onQtyChanged(elem) {
  var selector = jQuery(elem);
  var id = selector.closest('tr').attr('id');
  var newQty = selector.val();
  var store = _storage.storage.getItem('store');
  store[id].qty = newQty;
  _storage.storage.setItem('store', store);
  refreshTables();
}

// Remove row from table and store
function onRemoveRow(elem) {
  if (confirm('Are you sure you want to delete this row?')) {
    var store = _storage.storage.getItem('store');
    var row = jQuery(elem).closest('tr');
    delete store[row.attr('id')];
    _storage.storage.setItem('store', store);
    row.remove();
  }
}

// Rrefresh table to reflect changes
// Params @obj Object
function addToTable(obj) {
  var sku = obj.data.product_sku;
  var table = jQuery('#table-' + obj.section);
  var tableElem = table.find('tbody');
  var hasParent = obj.parent ? true : false;
  var qty = 0;
  var price = 0;

  qty = !obj.data.quantity ? obj.qty : obj.qty * obj.data.quantity;
  price = obj.data.install_price * obj.qty;
  var html = '<tr class="' + (hasParent ? 'has-child' : '') + '" id="' + sku + '">\n    <td class="' + (hasParent ? 'hardware' : '') + '">' + obj.data.description + '</td>\n    <td>' + sku + '</td>\n    <td>' + formatPrice(price) + '</td>\n    <td>\n      <input type="number" value="' + qty + '">\n    </td>\n    <td>\n      <button type="button" data-parent="obj.parent" class="icon remove">\n        <img src="' + _constants.sources.icons + 'delete.svg">\n      </button>';
  if (!hasParent) {
    html += '<button type="button" data-sku="' + sku + '" class="icon add-accessory">\n    <span>Add Accessory</span></button>';
  }
  html += '</td></tr>';
  tableElem.append(html);
}

// Set format price based on number
// Params @value integer or string
function formatPrice(value) {
  var price = value.toString();
  var array = price.split('');
  array.splice(array.length - 2, 0, '.');
  if (price != '0') {
    price = array.join('');
  }
  return '$' + price;
}

},{"../constants":13,"../storage/storage.component":24}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loopOverSegments = loopOverSegments;
exports.postByType = postByType;
exports.getExistingPostSku = getExistingPostSku;
exports.reduceFromStore = reduceFromStore;

var _store = require('../helpers/store.helper');

var _storage = require('../storage/storage.component');

// Add to store according number of segment
function loopOverSegments(segments, data) {
  for (var i = 0; i < segments; i++) {
    newData(data);
  }
}

function postByType(posts, type) {
  var postSku = posts[type + '_posts'][0];
  if (postSku) {
    var post = _storage.storage.getItem('post').find(function (post) {
      return post.product_sku == postSku;
    });
    return post;
  } else {
    return {};
  }
}

function getExistingPostSku(material, type, sku) {
  var fences = (0, _store.filterElements)(material, 'fence');
  var results = [];
  var existing = {};
  fences.forEach(function (fence) {
    existing = fence.posts[type + '_post'].find(function (post) {
      return post == sku;
    });
    if (existing) {
      results.push(existing);
    }
  });
  if (!(results.length > 0)) {
    return {};
  }
  var post = (0, _store.filterElements)(material, 'post').find(function (post) {
    return post.product_sku == sku;
  });
  return post;
}

function reduceFromStore(data) {
  var store = _storage.storage.getItem('store');
  if (store[data.product_sku]) {
    if (store[data.product_sku].data.default_hardware.length > 0) {
      reduceFromObjects(store, store[data.product_sku].data.default_hardware);
    }
    if (store[data.product_sku].data.accessories.length > 0) {
      reduceFromObjects(store, store[data.product_sku].data.accessories);
    }
    store[data.product_sku].qty--;
    validateQtyReduced(store, data.product_sku);
  }
  _storage.storage.setItem('store', store);
}

function reduceFromObjects(store, objects) {
  objects.forEach(function (obj) {
    if (store[obj.product_sku]) {
      store[obj.product_sku].qty--;
      validateQtyReduced(store, obj.product_sku);
    }
  });
}

function validateQtyReduced(store, sku) {
  if (store[sku].qty == 0) {
    delete store[sku];
  }
}

},{"../helpers/store.helper":15,"../storage/storage.component":24}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
//Export the whole storage functions
var storage = exports.storage = {
  initStorages: function initStorages(data) {
    _initStorages(data);
  },
  isStored: function isStored(key) {
    return _isStored(key);
  },
  getItem: function getItem(key) {
    return _getItem(key);
  },
  setItem: function setItem(key, value) {
    _setItem(key, value);
  },
  updateItem: function updateItem(key, data) {
    _updateItem(key, data);
  },
  removeItem: function removeItem(key) {
    _removeItem(key);
  },
  addCollection: function addCollection(type, data) {
    _addCollection(type, data);
  },
  clear: function clear() {
    _clear();
  }

  // FUNCTIONS

  // Start stores needed on session storage
};function _initStorages(data) {
  var elements = {
    'fence': [],
    'gate': [],
    'post': []
  };
  data.forEach(function (elem) {
    elements[elem.type].push(elem);
  });
  Object.keys(elements).forEach(function (key) {
    _setItem(key, elements[key]);
  });
  _setItem('store', {});
  _setItem('temp', []);
  _setItem('drewElements', []);
}

// Add collection to store
function _addCollection(type, data) {
  var elements = _getItem(type);
  data.forEach(function (elem) {
    elements.push(elem);
  });
  _setItem(type, elements);
}

// Check if key is stored in sessions storage
function _isStored(key) {
  return !!sessionStorage[key];
}

// Get an item value from sessions storage based on key 
function _getItem(key) {
  if (!_isStored(key)) {
    return [];
  }
  return JSON.parse(sessionStorage.getItem(key));
}

// Set an item on sessions storage, key and value
function _setItem(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

// Update value from sessions storage based on key
function _updateItem(key, data) {
  var item = _getItem(key);
  item.push(data);
  _setItem(key, item);
}

// Remove item from sessions storage based on key
function _removeItem(key) {
  sessionStorage.removeItem(key);
}

// Clear whole sessions storage
function _clear() {
  sessionStorage.clear();
}

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterElements = filterElements;

var _storage = require('../storage/storage.component');

// Filter elements on storage according material and type (fence, gate, post)
function filterElements(material, type) {
  return _storage.storage.getItem(type).filter(function getElements(elem) {
    return elem.material.toLowerCase().includes(material.toLowerCase());
  });
}

},{"../storage/storage.component":24}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncStore = syncStore;
exports.storeHardware = storeHardware;
exports.productBySku = productBySku;
exports.gatesByMaterial = gatesByMaterial;
exports.productBySkuLocal = productBySkuLocal;
exports.postsByFence = postsByFence;
exports.postsByFenceAjax = postsByFenceAjax;
exports.postBySku = postBySku;
exports.postBySkuAjax = postBySkuAjax;
exports.preLoadRelatedPosts = preLoadRelatedPosts;

var _storage = require('../storage/storage.component');

var _estimates = require('../services/estimates.service');

var _storage2 = require('../storage/storage.helper');

var _canvas = require('../canvas/canvas.component');

var _canvas2 = require('../canvas/canvas.helper');

var _toolbar = require('../toolbar/toolbar.component');

var _constants = require('../constants');

// Sync drawn data with store
function syncStore() {
  var store = {};
  _canvas.canvas.forEachObject(function (obj) {
    if (obj.class == 'line') {
      storeLine(obj, store);
      storeLinePosts(obj, store);
    }
    if (obj.class == 'post') {
      storePost(obj, store);
    }
  });
  _storage.storage.setItem('store', store);
  (0, _estimates.refreshTables)();
}

// Add line to store
function storeLine(line, store) {
  var data = JSON.parse(line.productData);
  var segmentsQuantity = (0, _canvas2.calculateSegments)(data.segmentLength, data.segment || 1);
  if (store[data.product_sku]) {
    store[data.product_sku].qty += segmentsQuantity;
    return;
  }
  store[data.product_sku] = {
    'data': data,
    'qty': segmentsQuantity,
    'section': 'items'
  };
  addDefaultHardware(data, store);
}

// Add available line posts according drawn line
function storeLinePosts(line, store) {
  var data = JSON.parse(line.productData);
  var segmentsQuantity = (0, _canvas2.calculateSegments)(data.segmentLength, data.segment);
  var posts = data.posts || {};
  if (!Object.keys(posts).length) {
    return;
  }
  if (posts.line_post.length) {
    var post = postBySku(posts.line_post[0], line.material);
    if (post) {
      if (post.product_sku && store[post.product_sku]) {
        store[post.product_sku].qty += segmentsQuantity - 1;
        return;
      }
      store[post.product_sku] = {
        'data': post,
        'qty': segmentsQuantity - 1,
        'section': 'items'
      };
    }
  }
}

// Add default hardware to store under line data if exists
function addDefaultHardware(data, store) {
  if (data.default_hardware.length) {
    if (!store[data.product_sku]['hardware']) {
      store[data.product_sku]['hardware'] = {};
    }
    data.default_hardware.forEach(function (obj) {
      storeHardware(store[data.product_sku]['hardware'], obj, data.product_sku, store[data.product_sku]['qty']);
    });
  }
}

// Store de hardware data
function storeHardware(store, data, parent, parentQty) {
  if (store[data.product_sku]) {
    store[data.product_sku].qty = parentQty;
    return;
  }
  store[data.product_sku] = {
    'data': data,
    'qty': parentQty,
    'parent': parent,
    'section': 'items'
  };
}

// Add post to store according drawn post
function storePost(post, store) {
  var data = JSON.parse(post.productData);
  if (store[data.product_sku]) {
    store[data.product_sku].qty++;
    return;
  }
  store[data.product_sku] = {
    'data': data,
    'qty': 1,
    'section': 'items'
  };
}

// Validate if the product selected on filters exists
// between elements filtered by type/material and return element
function productBySku(sku, material) {
  //TODO API call to get the product info by SKU
  var url = _constants.sources.elements;
  var request = jQuery.ajax({
    method: "GET",
    url: url,
    data: { sku: sku, material: material },
    contentType: "application/json",
    dataType: "json"
  });

  return request;
}

// Get all gates of an specific material
function gatesByMaterial(material) {
  var url = _constants.sources.elements;
  var request = jQuery.ajax({
    method: "GET",
    url: url,
    data: {
      element_material: material,
      element_type: "gate"
    },
    contentType: "application/json",
    dataType: "json"
  });

  return request;
}
// find the productBySku in the local storage
function productBySkuLocal(sku, material) {
  return (0, _storage2.filterElements)(material, _toolbar.elementSelected).filter(function existingSku(element) {
    return element.product_sku == sku;
  });
}

// Get posts associated to fence between filtered results by material
function postsByFence(fence) {
  var posts = [];
  if (Object.keys(fence).length) {
    var keys = Object.keys(fence.posts);
    if (keys.length) {
      keys.forEach(function (key) {
        if (fence.posts[key].length) {
          posts[key] = postBySku(fence.posts[key][0], fence.material) || [];
        }
      });
    }
  }
  return posts;
}

// Get posts associated to fence between filtered results by material
function postsByFenceAjax(fence) {
  var posts = [];
  if (fence && Object.keys(fence.posts).length) {
    var keys = Object.keys(fence.posts);

    var skus = [].concat.apply([], Object.values(fence.posts));
    postBySku(skus, fence.material);
    // keys.forEach(function(key) {
    //   if (fence.posts[key].length) {
    //     posts[key] = postBySku(fence.posts[key][0], fence.material) || [];
    //   }
    // });
  }
  return posts;
}

// Get post by sku between filtered results by material
function postBySku(sku, material) {
  var post = (0, _storage2.filterElements)(material, 'post').find(function findPost(post) {
    return post.product_sku === sku;
  });
  return post;
}

// Get post by sku between filtered results by material
function postBySkuAjax(sku, material) {
  var url = _constants.sources.elements;
  var post = void 0;
  var request = jQuery.ajax({
    method: "GET",
    url: url,
    async: false,
    data: { sku: sku, material: material },
    contentType: "application/json",
    dataType: "json",
    success: function success(response) {
      post = response[0];
    }
  });
  return post;
}

// Get post by sku between filtered results by material
function preLoadRelatedPosts(skus, material) {
  var results = [{
    "entityform_id": "21",
    "product_sku": "21",
    "name": "Corner Post (F) ",
    "type": "corner_post",
    "description": "Corner Post (F) ",
    "icon": "aluminum-post.png",
    "item_number": "21",
    "material": "Aluminum",
    "install_price": "1",
    "retail_price": "1",
    "wholesale_less": "1",
    "wholesale_more": "1",
    "default_hardware": [],
    "accessories": []
  }, {
    "entityform_id": "22",
    "product_sku": "22",
    "name": "End Post (F) ",
    "type": "end_post",
    "description": "End Post (F) ",
    "icon": "aluminum-post.png",
    "item_number": "22",
    "material": "Aluminum",
    "install_price": "1",
    "retail_price": "1",
    "wholesale_less": "1",
    "wholesale_more": "1",
    "default_hardware": [],
    "accessories": []
  }, {
    "entityform_id": "23",
    "product_sku": "73009105",
    "name": "Heavy Duty Gate Post (F) ",
    "type": "gate_post",
    "description": "Heavy Duty Gate Post (F) ",
    "icon": "aluminum-post.png",
    "item_number": "23",
    "material": "Aluminum",
    "install_price": "1",
    "retail_price": "1",
    "wholesale_less": "1",
    "wholesale_more": "1",
    "default_hardware": [],
    "accessories": []
  }, {
    "entityform_id": "24",
    "product_sku": "24",
    "name": "Line Post (F) ",
    "type": "line_post",
    "description": "Line Post (F) ",
    "icon": "aluminum-post.png",
    "item_number": "24",
    "material": "Aluminum",
    "install_price": "1",
    "retail_price": "1",
    "wholesale_less": "1",
    "wholesale_more": "1",
    "default_hardware": [],
    "accessories": []
  }];
  var posts = _storage.storage.getItem('post') || [];
  posts = posts.concat(results);
  _storage.storage.setItem('post', posts);
  return true;
}

},{"../canvas/canvas.component":2,"../canvas/canvas.helper":3,"../constants":13,"../services/estimates.service":22,"../storage/storage.component":24,"../storage/storage.helper":25,"../toolbar/toolbar.component":27}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elementSelected = exports.materialSelected = undefined;
exports.tbarBindEvents = tbarBindEvents;
exports.setOptionSelected = setOptionSelected;
exports.setAvailableElements = setAvailableElements;

var _constants = require('../constants');

var _toolbar = require('../toolbar/toolbar.service');

var _toolbar2 = require('../toolbar/toolbar.generic');

var _storage = require('../storage/storage.component');

var _toolbox = require('../toolbox/toolbox.component');

// EXPORTS

// Export the material selected
var materialSelected = exports.materialSelected = '';
var elementSelected = exports.elementSelected = '';

// Bind toolbar events
function tbarBindEvents() {
  jQuery('.fence').on('click', function () {
    (0, _toolbar.setSelectedType)(this, 'straight');
  });
  jQuery('.gate').on('click', function () {
    (0, _toolbar.setSelectedType)(this, 'gate');
  });
  jQuery('.graphic').on('click', function () {
    (0, _toolbar2.addImg)(this);
  });
}

// Set selected options
function setOptionSelected(type, material) {
  jQuery('.material-title').text(material.toUpperCase());
  exports.materialSelected = materialSelected = material;
  exports.elementSelected = elementSelected = type;
}

// Set the available options on toolbar
function setAvailableElements() {
  var fences = _storage.storage.getItem('fence');
  var gates = _storage.storage.getItem('gate');
  setAvailableMaterial(fences, 'fence');
  setAvailableMaterial(gates, 'gate');
}

// Check the available materials on each element type
function setAvailableMaterial(elements, section) {
  if (!elements.length) return;
  var availableMaterials = {
    'aluminum': false,
    'vinyl': false,
    'wood': false,
    'chain': false
  };
  var material = '';
  var isAvailable = false;

  Object.keys(availableMaterials).forEach(function (available) {
    isAvailable = elements.some(function (elem) {
      material = elem.material.split(" ")[0].toLowerCase();
      return material === available;
    });
    if (isAvailable) {
      availableMaterials[available] = true;
    }
  });
  displayElements(availableMaterials, section);
}

// Display the options on the toolbar according 
// what is available on each element type
function displayElements(materials, section) {
  var options = '';
  var src = '';
  for (var key in materials) {
    if (materials.hasOwnProperty(key) && materials[key]) {
      src = '' + _constants.sources.icons + key + '-' + section + '.png';
      options += '\n      <li>\n          <button type="button" class="icon ' + section + ' selectable" data-material="' + key + '" data-type="' + section + '">\n              <img src="' + src + '">\n          </button>\n      </li>';
    }
  }
  jQuery('div.' + section + 's').find('ul').html(options);
}

},{"../constants":13,"../storage/storage.component":24,"../toolbar/toolbar.generic":28,"../toolbar/toolbar.service":29,"../toolbox/toolbox.component":30}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addImg = addImg;

var _canvas = require('../canvas/canvas.component');

var _element = require('../services/element.service');

var _toolbox = require('../toolbox/toolbox.drawing');

// Add graphic images
function addImg(elem) {
  var url = jQuery(elem).find('img').attr('src');
  (0, _element.newImg)(url, _canvas.canvas);
  (0, _toolbox.disableFreeDrawing)();
}

},{"../canvas/canvas.component":2,"../services/element.service":21,"../toolbox/toolbox.drawing":31}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSelectedType = setSelectedType;
exports.isMaterialSet = isMaterialSet;
exports.isDifferentMaterial = isDifferentMaterial;

var _canvas = require('../canvas/canvas.component');

var _canvas2 = require('../canvas/canvas.line');

var _canvas3 = require('../canvas/canvas.post');

var _toolbar = require('../toolbar/toolbar.component');

var _toolbox = require('../toolbox/toolbox.drawing');

var _dom = require('../services/dom.service');

var _storage = require('../storage/storage.component');

// Change drawing mode and set selected element
// according toolbar options
function setSelectedType(elem, type) {
  if (type == 'gate') {
    jQuery('#segment-length-container').hide();
  } else {
    jQuery('#segment-length-container').show();
  }
  var selected = (0, _dom.setSelected)(elem);
  (0, _toolbar.setOptionSelected)(elem.dataset.type, elem.dataset.material);
  _canvas.canvas.drawMode = selected ? '' : type;
}

function isMaterialSet() {
  var objects = _canvas.canvas.getObjects();
  var exists = objects.filter(function (obj) {
    return obj.class == 'line' && obj.drawingElement == _canvas2.line.drawingElement && obj.material == _canvas2.line.material;
  });
  if (exists.length > 1) {
    return true;
  }
  return false;
}

function isDifferentMaterial() {
  if (!(0, _canvas3.isPostSelected)()) return false;
  // let current = storage.getItem('options').elemMaterial;
  // if (current) {
  //   return selectedPost.material !== current ? true : false;
  // }
  var temp = _storage.storage.getItem('temp');
  return _canvas3.selectedPost.material !== temp[0].material ? true : false;
}

},{"../canvas/canvas.component":2,"../canvas/canvas.line":4,"../canvas/canvas.post":11,"../services/dom.service":20,"../storage/storage.component":24,"../toolbar/toolbar.component":27,"../toolbox/toolbox.drawing":31}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearBtn = exports.trashBtn = undefined;
exports.tboxBindEvents = tboxBindEvents;
exports.lockDrawing = lockDrawing;
exports.loadFontSizes = loadFontSizes;
exports.resetPickColor = resetPickColor;

var _toolbox = require('../toolbox/toolbox.drawing');

var _toolbox2 = require('../toolbox/toolbox.history');

var _toolbox3 = require('../toolbox/toolbox.remove');

var _toolbox4 = require('../toolbox/toolbox.text');

var _toolbox5 = require('../toolbox/toolbox.shapes');

var _canvas = require('../canvas/canvas.line');

var _canvas2 = require('../canvas/canvas.post');

var _modal = require('../modal/modal.component');

var _modal2 = require('../modal/modal.service');

var _storage = require('../storage/storage.component');

var _store = require('../services/store.service');

var _estimates = require('../services/estimates.service');

// Bind Toolbox Elements Events 
function tboxBindEvents() {
  // Enable/Disable free drawing mode when click on pencil 
  jQuery('#draw-pencil').on('click', function (evt) {
    (0, _toolbox.enableFreeDrawing)(evt.currentTarget);
  });
  // Add fabric text element to canvas 
  jQuery('#draw-comment').on('click', function () {
    (0, _toolbox4.addNewText)();
  });
  // Change text font color 
  colorInput.on('change', function (evt) {
    (0, _toolbox4.onTextColorChange)(evt.currentTarget);
  });
  // Change text font size 
  fontSize.on('change', function (evt) {
    (0, _toolbox4.onTextFontChange)(evt.currentTarget);
  });
  // Change text font style (italic) 
  jQuery('#font-italic').on('click', function () {
    (0, _toolbox4.onTextFontTypeChange)();
  });
  // Change text width (bold) 
  jQuery('#font-bold').on('click', function () {
    (0, _toolbox4.onTextFontWidthChange)();
  });
  // Draw circle element on canvas 
  jQuery('#draw-circle').on('click', function () {
    (0, _toolbox5.drawCircle)();
  });
  // Draw square element on canvas 
  jQuery('#draw-rectangle').on('click', function () {
    (0, _toolbox5.drawSquare)();
  });
  // Change stroke width on selected shape  
  jQuery('#shape-stroke').on('change', function (evt) {
    (0, _toolbox5.onStrokeWidthChange)(evt.currentTarget);
  });
  // Change stroke color on selected shape 
  jQuery('#stroke-color').on('change', function (evt) {
    (0, _toolbox5.onStrokeColorChange)(evt.currentTarget);
  });
  // Delete selected element from canvas 
  trashBtn.on('click', function () {
    (0, _toolbox3.removeElement)();
  });
  // Undo changes
  jQuery('#draw-undo').on('click', function () {
    (0, _toolbox2.onUndo)();
  });
  // Redo changes
  jQuery('#draw-redo').on('click', function () {
    (0, _toolbox2.onRedo)();
  });
  // Remove all objects from canvas 
  clearBtn.on('click', function () {
    (0, _toolbox3.clear)();
  });
  // Show edit line options
  jQuery('#line-options').on('click', function () {
    onEditLine();
  });
  // Show edit post options
  jQuery('#post-options').on('click', function () {
    onEditPost();
  });
  // Lock the whole drawing to avoid edition
  lockBtn.on('click', function () {
    lockDrawing();
  });
}

// Lock the whole drawing
function lockDrawing() {
  var state = !lockBtn.data('lock');
  lockBtn.data('lock', state);
  var span = lockBtn.find('span');
  state ? span.text('Unlock') : span.text('Lock');
  jQuery('button').attr('disabled', state);
  lockBtn.attr('disabled', false);
  canvas.selection = !state;
  canvas.forEachObject(function (obj) {
    obj.selectable = !state;
  });
}

// Show edit options for line element
function onEditLine() {
  var line = _canvas.selectedLine;
  (0, _modal.hideActions)();
  (0, _modal2.setDefaultMaterial)(line.material);
  setTimeout(function () {
    var productData = JSON.parse(line.productData);
    jQuery('.material-title').text(line.material.toUpperCase());
    jQuery('#editLine').css('display', 'block');
    jQuery('#editPost').css('display', 'none');
    jQuery('#elementLength').css('display', 'block');
    jQuery('#labelelementLength').css('display', 'block');
    jQuery('#jf-custom-sku-product').val(productData.product_sku);
    //jQuery('#jf-material-custom-sku').show();
    //jQuery('#edit-description').show();
    jQuery('#edit-description').find('input').val(productData.description);
    if (line.drawingElement == 'fence') {
      (0, _modal2.showSegmentLength)();
      jQuery('#elementLength').val(productData.segmentLength);
    }
    (0, _modal2.showModalOptions)();
  }, 1000);
}

// Show edit options for post element
function onEditPost() {
  var post = _canvas2.selectedPost;
  (0, _modal.hideActions)();
  (0, _modal2.setDefaultMaterial)(post.material);
  setTimeout(function () {
    var productData = JSON.parse(post.productData);
    jQuery('.material-title').text(post.material.toUpperCase());
    jQuery('#editPost').css('display', 'block');
    jQuery('#elementLength').css('display', 'none');
    jQuery('#labelelementLength').css('display', 'none');
    jQuery('#jf-custom-sku-product').val(productData.product_sku);
    //jQuery('#jf-material-custom-sku').show();
    //jQuery('#edit-description').show();
    jQuery('#edit-description').find('input').val(productData.description);
    jQuery('#post-types').val(post.postType);
    (0, _modal.showPostTypes)();
    (0, _modal2.showModalOptions)();
  }, 1000);
}

// Add options to select size 
function loadFontSizes() {
  var select = fontSize;
  var option = void 0;
  for (var i = 8; i <= 24; i++) {
    option = document.createElement('option');
    option.value = i;
    option.text = i;
    select.append(option);
  }
}

// Reset pick colors on unselect and hide color element 
function resetPickColor() {
  var black = '#000';
  var pickColor = jQuery('#pick-color');
  colorInput.val(black);
  pickColor.css('backgroundColor', black);
  pickColor.css('color', '#fff');
}

// Get HTML Elements 
// let eraserBtn = jQuery('#draw-eraser');
// let strokeColorBtn = jQuery('#pick-stroke-color');
var trashBtn = exports.trashBtn = jQuery('#draw-trash');
var clearBtn = exports.clearBtn = jQuery('#draw-clear');
var colorInput = jQuery('#fill-color');
var fontSize = jQuery('#font-size');
var lockBtn = jQuery('#lock-drawning');

},{"../canvas/canvas.line":4,"../canvas/canvas.post":11,"../modal/modal.component":17,"../modal/modal.service":19,"../services/estimates.service":22,"../services/store.service":23,"../storage/storage.component":24,"../toolbox/toolbox.drawing":31,"../toolbox/toolbox.history":33,"../toolbox/toolbox.remove":34,"../toolbox/toolbox.shapes":36,"../toolbox/toolbox.text":37}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableFreeDrawing = enableFreeDrawing;
exports.disableFreeDrawing = disableFreeDrawing;

var _canvas = require('../canvas/canvas.component');

var _dom = require('../services/dom.service');

// Enable/Disable free drawing mode
function enableFreeDrawing(button) {
  var selected = (0, _dom.setSelected)(button);
  _canvas.canvas.drawMode = '';
  _canvas.canvas.isDrawingMode = !selected;
}

// Enable/Disable free drawing mode
function disableFreeDrawing() {
  jQuery('button.selected').removeClass('selected');
  _canvas.canvas.drawMode = '';
  _canvas.canvas.isDrawingMode = false;
}

},{"../canvas/canvas.component":2,"../services/dom.service":20}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toRGB = toRGB;
// Convert hex string to rgb
function toRGB(str) {
  var bigint = parseInt(str, 16);
  var r = bigint >> 16 & 255;
  var g = bigint >> 8 & 255;
  var b = bigint & 255;
  var rgb = [r, g, b].join();

  return "rgb(" + rgb + ")";
}

},{}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveHistory = saveHistory;
exports.onUndo = onUndo;
exports.onRedo = onRedo;

var _constants = require('../constants');

var _canvas = require('../canvas/canvas.component');

var _toolbox = require('../toolbox/toolbox.service');

var _storage = require('../storage/storage.service');

// Current unsaved state
var state = void 0;
// Past states
var undo = [];
// Reverted states
var redo = [];
// Buttons
var redoBtn = jQuery('#draw-redo');
var undoBtn = jQuery('#draw-undo');

// Save object states when add/modified object 
function saveHistory() {
  // clear the redo stack
  redo = [];
  (0, _toolbox.disableElement)(redoBtn);
  // initial call won't have a state
  if (state) {
    undo.push(state);
    (0, _toolbox.enableElement)(undoBtn);
  }
  state = _canvas.canvas.toJSON(_constants.exportProperties);
}

// Undo changes
function onUndo() {
  replay(undo, redo, redoBtn, undoBtn);
  (0, _storage.syncStore)();
}

// Redo changes
function onRedo() {
  replay(redo, undo, undoBtn, redoBtn);
  (0, _storage.syncStore)();
}

// Call undo/redo actions
function replay(playStack, saveStack, redoBtn, undoBtn) {
  saveStack.push(state);
  state = playStack.pop();
  if (!state) return;
  // turn both buttons off for the moment to prevent rapid clicking
  (0, _toolbox.disableElement)(redoBtn);
  (0, _toolbox.disableElement)(undoBtn);
  _canvas.canvas.clear();
  _canvas.canvas.loadFromJSON(state, function () {
    _canvas.canvas.renderAll();
    // now turn the buttons back on if applicable
    (0, _toolbox.enableElement)(redoBtn);
    if (playStack.length) {
      (0, _toolbox.enableElement)(undoBtn);
    }
  });
}

},{"../canvas/canvas.component":2,"../constants":13,"../storage/storage.service":26,"../toolbox/toolbox.service":35}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeElement = removeElement;
exports.clear = clear;

var _canvas = require('../canvas/canvas.component');

var _toolbox = require('../toolbox/toolbox.service');

var _storage = require('../storage/storage.component');

var _storage2 = require('../storage/storage.service');

// Remove selected element from canvas
function removeElement() {
  var object = _canvas.canvas.getActiveObject();
  if (object.class && object.class == 'post') {
    alert('Can\'t delete individual post.');
    return;
  }
  var valid = object.class && object.class == 'line' ? true : false;
  if (valid) {
    validateRemoveElement(object);
  }
  _canvas.canvas.remove(object);
  _canvas.canvas.renderAll();
  (0, _storage2.syncStore)();
}

// Clear all from drawing
function clear() {
  var opt = confirm('Are you sure you want clear the whole drawing?');
  if (!opt) {
    return;
  }
  var objects = _canvas.canvas.getObjects();
  var num = objects.length;
  for (var i = 0; i < num; i++) {
    _canvas.canvas.remove(objects[0]);
  }
  var clearBtn = jQuery('#draw-clear');
  (0, _toolbox.disableElement)(clearBtn);
  _storage.storage.setItem('store', {});
  _storage.storage.setItem('options', {});
  _storage.storage.setItem('drewElements', []);
  _storage.storage.setItem('temp', []);
  (0, _storage2.syncStore)();
}

// Validate posts to be removed from line
function validateRemoveElement(line) {
  var objects = _canvas.canvas.getObjects();
  var toRemove = {};
  line.posts.map(function (post) {
    if (post.lines.length > 1) {
      post.lines = post.lines.filter(function (obj) {
        return obj.id != line.id;
      });
      return;
    }
    toRemove = objects.find(function (obj) {
      return obj.id == post.id;
    });
    _canvas.canvas.remove(toRemove);
  });
  // Remove text length near to line
  var textLength = objects.find(function (obj) {
    return obj.left && line.textLength && obj.left === line.textLength.left && obj.top === line.textLength.top;
  });
  if (textLength) {
    _canvas.canvas.remove(textLength);
  }
}

},{"../canvas/canvas.component":2,"../storage/storage.component":24,"../storage/storage.service":26,"../toolbox/toolbox.service":35}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showElementOptions = showElementOptions;
exports.hideElementsOptions = hideElementsOptions;
exports.showElement = showElement;
exports.hideElement = hideElement;
exports.enableElement = enableElement;
exports.disableElement = disableElement;
// Show element options
function showElementOptions(selected, opt) {
  var elements = jQuery('.' + selected);
  showElement(elements, opt);
}

// Hide element options
function hideElementsOptions() {
  var elements = jQuery('.third').find('li');
  hideElement(elements);
}

// Show/Hide element
function showElement(elem, opt) {
  elem.css('display', opt);
}

function hideElement(elem) {
  elem.css('display', 'none');
}

// Enable/Disable element
function enableElement(elem) {
  elem.prop('disabled', false);
}

function disableElement(elem) {
  elem.prop('disabled', true);
}

},{}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawCircle = drawCircle;
exports.drawSquare = drawSquare;
exports.onStrokeWidthChange = onStrokeWidthChange;
exports.onStrokeColorChange = onStrokeColorChange;

var _toolbox = require('../toolbox/toolbox.drawing');

var _toolbox2 = require('../toolbox/toolbox.history');

var _toolbox3 = require('../toolbox/toolbox.helper');

var _canvas = require('../canvas/canvas.component');

var _element = require('../services/element.service');

// Draw circle on canvas
function drawCircle() {
  var circle = (0, _element.newCircle)();
  _canvas.canvas.add(circle);
  (0, _toolbox.disableFreeDrawing)();
  _canvas.canvas.renderAll();
}

// Draw square on canvas
function drawSquare() {
  var rectangle = (0, _element.newRectangle)();
  _canvas.canvas.add(rectangle);
  (0, _toolbox.disableFreeDrawing)();
  _canvas.canvas.renderAll();
}

// Change stroke witdh for selected shape
function onStrokeWidthChange(evt) {
  var object = _canvas.canvas.getActiveObject();
  (0, _toolbox2.saveHistory)();
  object.setStrokeWidth(parseInt(evt.value));
  _canvas.canvas.renderAll();
}

// Change stroke color for selected shape
function onStrokeColorChange(evt) {
  var object = _canvas.canvas.getActiveObject();
  (0, _toolbox2.saveHistory)();
  var color = (0, _toolbox3.toRGB)(evt.value);
  object.setStroke(color);
  _canvas.canvas.renderAll();
}

},{"../canvas/canvas.component":2,"../services/element.service":21,"../toolbox/toolbox.drawing":31,"../toolbox/toolbox.helper":32,"../toolbox/toolbox.history":33}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addNewText = addNewText;
exports.onTextColorChange = onTextColorChange;
exports.onTextFontChange = onTextFontChange;
exports.onTextFontTypeChange = onTextFontTypeChange;
exports.onTextFontWidthChange = onTextFontWidthChange;

var _canvas = require('../canvas/canvas.component');

var _element = require('../services/element.service');

var _toolbox = require('../toolbox/toolbox.drawing');

var _toolbox2 = require('../toolbox/toolbox.history');

var _toolbox3 = require('../toolbox/toolbox.helper');

// Add text fabric element to canvas
function addNewText() {
  var text = (0, _element.newText)();
  _canvas.canvas.add(text);
  (0, _toolbox.disableFreeDrawing)();
  _canvas.canvas.renderAll();
}

// Change text font color of the element on canvas 
function onTextColorChange(evt) {
  var object = _canvas.canvas.getActiveObject();
  var color = (0, _toolbox3.toRGB)(evt.value);
  (0, _toolbox2.saveHistory)();
  object.setColor(color);
  _canvas.canvas.renderAll();
}

// Change text font size of the element on canvas
function onTextFontChange(evt) {
  var object = _canvas.canvas.getActiveObject();
  (0, _toolbox2.saveHistory)();
  object.setFontSize(evt.value);
  _canvas.canvas.renderAll();
}

// Change text font type of the element on canvas
function onTextFontTypeChange() {
  var object = _canvas.canvas.getActiveObject();
  (0, _toolbox2.saveHistory)();
  var style = object.getFontStyle();
  if (style === 'italic') {
    style = 'normal';
  } else {
    style = 'italic';
  }
  object.setFontStyle(style);
  _canvas.canvas.renderAll();
}

// Change text font width of the element on canvas
function onTextFontWidthChange() {
  var object = _canvas.canvas.getActiveObject();
  (0, _toolbox2.saveHistory)();
  var weight = object.getFontWeight();
  if (weight === 'bold') {
    weight = 'normal';
  } else {
    weight = 'bold';
  }
  object.setFontWeight(weight);
  _canvas.canvas.renderAll();
}

},{"../canvas/canvas.component":2,"../services/element.service":21,"../toolbox/toolbox.drawing":31,"../toolbox/toolbox.helper":32,"../toolbox/toolbox.history":33}]},{},[1]);
