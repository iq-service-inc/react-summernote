/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

  module.exports = __webpack_require__(1);


  /***/ }),
  /* 1 */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  
  var _selectionPreserver = __webpack_require__(2);
  
  var _selectionPreserver2 = _interopRequireDefault(_selectionPreserver);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  var WORD_REGEX = /^[^\s]+$/;
  
  var UP_KEY_CODE = 38;
  var DOWN_KEY_CODE = 40;
  var ENTER_KEY_CODE = 13;
  
  (function (factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
          __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
          (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
          __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
      module.exports = factory(require("jquery"));
    } else {
      factory(window.jQuery);
    }
  })(function ($) {
    $.extend($.summernote.plugins, {
      summernoteAtMention: function summernoteAtMention(context) {
        var _this = this;
  
        /************************
         * Setup instance vars. *
         ************************/
        this.editableEl = context.layoutInfo.editable[0];
        this.editorEl = context.layoutInfo.editor[0];
  
        this.autocompleteAnchor = { left: null, top: null };
        this.autocompleteContainer = null;
        this.showingAutocomplete = false;
        this.selectedIndex = null;
        this.suggestions = null;
  
        this.getSuggestions = function (_) {
          return [];
        };
  
        /********************
         * Read-in options. *
         ********************/
        if (context.options && context.options.callbacks && context.options.callbacks.summernoteAtMention) {
          var summernoteCallbacks = context.options.callbacks.summernoteAtMention;
  
          if (summernoteCallbacks.getSuggestions) {
            this.getSuggestions = summernoteCallbacks.getSuggestions;
          }
  
          if (summernoteCallbacks.onSelect) {
            this.onSelect = summernoteCallbacks.onSelect;
          }
        }
  
        /**********
         * Events *
         **********/
        this.events = {
          "summernote.blur": function summernoteBlur() {
            if (_this.showingAutocomplete) _this.hideAutocomplete();
          },
          "summernote.keydown": function summernoteKeydown(_, event) {
            if (_this.showingAutocomplete) {
              switch (event.keyCode) {
                case ENTER_KEY_CODE:
                  {
                    event.preventDefault();
                    event.stopPropagation();
                    _this.handleEnter();
                    break;
                  }
                case UP_KEY_CODE:
                  {
                    event.preventDefault();
                    event.stopPropagation();
                    var newIndex = _this.selectedIndex === 0 ? 0 : _this.selectedIndex - 1;
                    _this.updateAutocomplete(_this.suggestions, newIndex);
                    break;
                  }
                case DOWN_KEY_CODE:
                  {
                    event.preventDefault();
                    event.stopPropagation();
                    var _newIndex = _this.selectedIndex === _this.suggestions.length - 1 ? _this.selectedIndex : _this.selectedIndex + 1;
  
                    _this.updateAutocomplete(_this.suggestions, _newIndex);
                    break;
                  }
              }
            }
          },
          "summernote.keyup": function summernoteKeyup(_, event) {
            var selection = document.getSelection();
            var currentText = selection.anchorNode.nodeValue;
  
            var _findWordAndIndices = _this.findWordAndIndices(currentText || "", selection.anchorOffset),
                word = _findWordAndIndices.word,
                absoluteIndex = _findWordAndIndices.absoluteIndex;
  
            var trimmedWord = word.slice(1);
  
            if (_this.showingAutocomplete && ![DOWN_KEY_CODE, UP_KEY_CODE, ENTER_KEY_CODE].includes(event.keyCode)) {
              if (word[0] === "@") {
                var suggestions = _this.getSuggestions(trimmedWord);
                _this.updateAutocomplete(suggestions, _this.selectedIndex);
              } else {
                _this.hideAutocomplete();
              }
            } else if (!_this.showingAutocomplete && word[0] === "@") {
              _this.suggestions = _this.getSuggestions(trimmedWord);
              _this.selectedIndex = 0;
              _this.showAutocomplete(absoluteIndex, selection.anchorNode);
            }
          }
        };
  
        /***********
         * Helpers *
         ***********/
  
        this.handleEnter = function () {
          _this.handleSelection();
        };
  
        this.handleClick = function (suggestion) {
          var selectedIndex = _this.suggestions.findIndex(function (s) {
            return s === suggestion;
          });
  
          if (selectedIndex === -1) {
            throw new Error("Unable to find suggestion in suggestions.");
          }
  
          _this.selectedIndex = selectedIndex;
          _this.handleSelection();
        };
  
        this.handleSelection = function () {
          if (_this.suggestions === null || _this.suggestions.length === 0) {
            return;
          }
  
          var newWord = _this.suggestions[_this.selectedIndex];
  
          if (_this.onSelect !== undefined) {
            _this.onSelect(newWord);
            return;
          }
  
          var selection = document.getSelection();
          var currentText = selection.anchorNode.nodeValue;
  
          var _findWordAndIndices2 = _this.findWordAndIndices(currentText || "", selection.anchorOffset),
              word = _findWordAndIndices2.word,
              absoluteIndex = _findWordAndIndices2.absoluteIndex;
  
          var selectionPreserver = new _selectionPreserver2.default(_this.editableEl);
          selectionPreserver.preserve();
  
          selection.anchorNode.textContent = currentText.slice(0, absoluteIndex + 1) + newWord + " " + currentText.slice(absoluteIndex + word.length);
  
          selectionPreserver.restore(absoluteIndex + newWord.length + 1);
  
          if (context.options.callbacks.onChange !== undefined) {
            context.options.callbacks.onChange(_this.editableEl.innerHTML);
          }
        };
  
        this.updateAutocomplete = function (suggestions, selectedIndex) {
          _this.selectedIndex = selectedIndex;
          _this.suggestions = suggestions;
          _this.renderAutocomplete();
        };
  
        this.showAutocomplete = function (atTextIndex, indexAnchor) {
          if (_this.showingAutocomplete) {
            throw new Error("Cannot call showAutocomplete if autocomplete is already showing.");
          }
          _this.setAutocompleteAnchor(atTextIndex, indexAnchor);
          _this.renderAutocompleteContainer();
          _this.renderAutocomplete();
          _this.showingAutocomplete = true;
        };
  
        this.renderAutocompleteContainer = function () {
          _this.autocompleteContainer = document.createElement("div");
          _this.autocompleteContainer.style.top = String(_this.autocompleteAnchor.top) + "px";
          _this.autocompleteContainer.style.left = String(_this.autocompleteAnchor.left) + "px";
          _this.autocompleteContainer.style.position = "absolute";
          _this.autocompleteContainer.style.backgroundColor = "#e4e4e4";
          _this.autocompleteContainer.style.zIndex = Number.MAX_SAFE_INTEGER;
  
          document.body.appendChild(_this.autocompleteContainer);
        };
  
        this.renderAutocomplete = function () {
          if (_this.autocompleteContainer === null) {
            throw new Error("Cannot call renderAutocomplete without an autocompleteContainer. ");
          }
          var autocompleteContent = document.createElement("div");
  
          _this.suggestions.forEach(function (suggestion, idx) {
            var suggestionDiv = document.createElement("div");
            suggestionDiv.textContent = suggestion;
  
            suggestionDiv.style.padding = "5px 10px";
  
            if (_this.selectedIndex === idx) {
              suggestionDiv.style.backgroundColor = "#2e6da4";
              suggestionDiv.style.color = "white";
            }
  
            suggestionDiv.addEventListener("mousedown", function () {
              _this.handleClick(suggestion);
            });
  
            autocompleteContent.appendChild(suggestionDiv);
          });
  
          _this.autocompleteContainer.innerHTML = "";
          _this.autocompleteContainer.appendChild(autocompleteContent);
        };
  
        this.hideAutocomplete = function () {
          if (!_this.showingAutocomplete) throw new Error("Cannot call hideAutocomplete if autocomplete is not showing.");
  
          document.body.removeChild(_this.autocompleteContainer);
          _this.autocompleteAnchor = { left: null, top: null };
          _this.selectedIndex = null;
          _this.suggestions = null;
          _this.showingAutocomplete = false;
        };
  
        this.findWordAndIndices = function (text, offset) {
          if (offset > text.length) {
            return { word: "", relativeIndex: 0 };
          } else {
            var leftWord = "";
            var rightWord = "";
            var relativeIndex = 0;
            var absoluteIndex = offset;
  
            for (var currentOffset = offset; currentOffset > 0; currentOffset--) {
              if (text[currentOffset - 1].match(WORD_REGEX)) {
                leftWord = text[currentOffset - 1] + leftWord;
                relativeIndex++;
                absoluteIndex--;
              } else {
                break;
              }
            }
  
            for (var _currentOffset = offset - 1; _currentOffset > 0 && _currentOffset < text.length - 1; _currentOffset++) {
              if (text[_currentOffset + 1].match(WORD_REGEX)) {
                rightWord = rightWord + text[_currentOffset + 1];
              } else {
                break;
              }
            }
  
            return {
              word: leftWord + rightWord,
              relativeIndex: relativeIndex,
              absoluteIndex: absoluteIndex
            };
          }
        };
  
        this.setAutocompleteAnchor = function (atTextIndex, indexAnchor) {
          var html = indexAnchor.parentNode.innerHTML;
          var text = indexAnchor.nodeValue;
  
          var atIndex = -1;
          for (var i = 0; i <= atTextIndex; i++) {
            if (text[i] === "@") {
              atIndex++;
            }
          }
  
          var htmlIndex = void 0;
          for (var _i = 0, htmlAtIndex = 0; _i < html.length; _i++) {
            if (html[_i] === "@") {
              if (htmlAtIndex === atIndex) {
                htmlIndex = _i;
                break;
              } else {
                htmlAtIndex++;
              }
            }
          }
  
          var atNodeId = "at-node-" + String(Math.floor(Math.random() * 10000));
          var spanString = "<span id=\"" + atNodeId + "\">@</span>";
  
          var selectionPreserver = new _selectionPreserver2.default(_this.editableEl);
          selectionPreserver.preserve();
  
          indexAnchor.parentNode.innerHTML = html.slice(0, htmlIndex) + spanString + html.slice(htmlIndex + 1);
          var anchorElement = document.querySelector("#" + atNodeId);
          var anchorBoundingRect = anchorElement.getBoundingClientRect();
  
          _this.autocompleteAnchor = {
            top: anchorBoundingRect.top + anchorBoundingRect.height + 2,
            left: anchorBoundingRect.left
          };
  
          selectionPreserver.findRangeStartContainer().parentNode.innerHTML = html;
          selectionPreserver.restore();
        };
      }
    });
  });
  
  /***/ }),
  /* 2 */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var SelectionPreserver = function () {
    function SelectionPreserver(rootNode) {
      _classCallCheck(this, SelectionPreserver);
  
      if (rootNode === undefined || rootNode === null) {
        throw new Error("Please provide a valid rootNode.");
      }
  
      this.rootNode = rootNode;
      this.rangeStartContainerAddress = null;
      this.rangeStartOffset = null;
    }
  
    _createClass(SelectionPreserver, [{
      key: "preserve",
      value: function preserve() {
        var selection = window.getSelection();
        this.rangeStartOffset = selection.getRangeAt(0).startOffset;
        this.rangeStartContainerAddress = this.findRangeStartContainerAddress(selection);
      }
    }, {
      key: "restore",
      value: function restore(restoreIndex) {
        if (this.rangeStartOffset === null || this.rangeStartContainerAddress === null) {
          throw new Error("Please call preserve() first.");
        }
  
        var rangeStartContainer = this.findRangeStartContainer();
  
        var range = document.createRange();
        var offSet = restoreIndex || this.rangeStartOffset;
        range.setStart(rangeStartContainer, offSet);
        range.collapse();
  
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }, {
      key: "findRangeStartContainer",
      value: function findRangeStartContainer() {
        var rangeStartContainer = this.rootNode;
  
        this.rangeStartContainerAddress.forEach(function (address) {
          rangeStartContainer = rangeStartContainer.childNodes[address];
        });
  
        return rangeStartContainer;
      }
    }, {
      key: "findRangeStartContainerAddress",
      value: function findRangeStartContainerAddress(selection) {
        var rangeStartContainerAddress = [];
  
        for (var currentContainer = selection.getRangeAt(0).startContainer; currentContainer !== this.rootNode; currentContainer = currentContainer.parentNode) {
          var parent = currentContainer.parentElement;
          var children = parent.childNodes;
  
          for (var i = 0; i < children.length; i++) {
            if (children[i] === currentContainer) {
              rangeStartContainerAddress = [i].concat(_toConsumableArray(rangeStartContainerAddress));
              break;
            }
          }
        }
  
        return rangeStartContainerAddress;
      }
    }]);
  
    return SelectionPreserver;
  }();
  
  exports.default = SelectionPreserver;
  
  /***/ }),
  /* 3 */
  /***/ (function(module, exports) {
  
  module.exports = $;
  
  /***/ })
  /******/ ]);