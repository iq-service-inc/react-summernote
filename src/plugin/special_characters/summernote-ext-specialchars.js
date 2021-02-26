(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals: jQuery
    factory(window.jQuery);
  }
}(function ($) {
  /**
  * @class plugin.specialChar
  *
  * Special Characters Plugin
  *
  * ### load script
  *
  * ```
  * < script src="plugin/summernote-ext-specialchar.js"></script >
  * ```
  *
  * ### use a plugin in toolbar
  * ```
  *    $("#editor").summernote({
  *    ...
  *    toolbar : [
  *        ['group', [ 'specialChar' ]]
  *    ]
  *    ...    
  *    });
  * ```
  */
  $.extend($.summernote.plugins, {
    'specialChar': function (context) {

      // core functions: range, dom
      var range = $.summernote.range;
      var dom = $.summernote.dom;
      var ui = $.summernote.ui,
        $note = context.layoutInfo.note,
        $editor = context.layoutInfo.editor,
        $editable = context.layoutInfo.editable,
        $toolbar = context.layoutInfo.toolbar,
        $statusbar = context.layoutInfo.statusbar,
        options = context.options,
        lang = options.langInfo;

      var KEY = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        ENTER: 13
      };
      var COLUMN_LENGTH = 15;
      var COLUMN_WIDTH = 35;

      var currentColumn, currentRow, totalColumn, totalRow = 0;

      // special characters data set
      var specialCharDataSet = [
        /*'&quot;',   // "
        '&amp;',    // &
        '&lt;',     // <
        '&gt;',     // >*/
        '&aacute;',
        '&eacute;',
        '&iacute;',
        '&oacute;',
        '&uacute;',
        '&uuml;',
        '&ntilde;',
        '&Aacute;',
        '&Eacute;',
        '&Iacute;',
        '&Ntilde;',
        '&Oacute;',
        '&Uacute;',
        '&Uuml;',
        '&iexcl;',
        '&iquest;',
        '&cent;',
        '&pound;',
        '&curren;',
        '&yen;',
        '&brvbar;',
        '&sect;',
        '&uml;',
        '&copy;',
        '&ordf;',
        '&laquo;',
        '&not;',
        //'&shy;',
        '&reg;',
        '&macr;',
        '&deg;',
        '&plusmn;',
        '&sup2;',
        '&sup3;',
        '&acute;',
        '&micro;',
        '&para;',
        '&middot;',
        '&cedil;',
        '&sup1;',
        '&ordm;',
        '&raquo;',
        '&frac14;',
        '&frac12;',
        '&frac34;',
        '&times;',
        '&divide;',
        '&fnof;',
        '&circ;',
        '&tilde;',
        /*'&ensp;',
        '&emsp;',
        '&thinsp;',
        '&zwnj;',
        '&zwj;',
        '&lrm;',
        '&rlm;',*/
        '&ndash;',
        '&mdash;',
        '&lsquo;',
        '&rsquo;',
        '&sbquo;',
        '&ldquo;',
        '&rdquo;',
        '&bdquo;',
        '&dagger;',
        '&Dagger;',
        '&bull;',
        '&hellip;',
        '&permil;',
        '&lsaquo;',
        '&rsaquo;',
        '&oline;',
        '&frasl;',
        '&euro;',
        '&image;',
        '&weierp;',
        '&real;',
        '&trade;',
        '&alefsym;',
        '&larr;',
        '&uarr;',
        '&rarr;',
        '&darr;',
        '&harr;',
        '&crarr;',
        '&lArr;',
        '&uArr;',
        '&rArr;',
        '&dArr;',
        '&hArr;',
        '&forall;',
        '&part;',
        '&exist;',
        '&empty;',
        '&nabla;',
        '&isin;',
        '&notin;',
        '&ni;',
        '&prod;',
        '&sum;',
        '&minus;',
        '&lowast;',
        '&radic;',
        '&prop;',
        '&infin;',
        '&ang;',
        '&and;',
        '&or;',
        '&cap;',
        '&cup;',
        '&int;',
        '&there4;',
        '&sim;',
        '&cong;',
        '&asymp;',
        '&ne;',
        '&equiv;',
        '&le;',
        '&ge;',
        '&sub;',
        '&sup;',
        '&nsub;',
        '&sube;',
        '&supe;',
        '&oplus;',
        '&otimes;',
        '&perp;',
        '&sdot;',
        '&lceil;',
        '&rceil;',
        '&lfloor;',
        '&rfloor;',
        //'&lang;',
        //'&rang;',
        '&loz;',
        '&spades;',
        '&clubs;',
        '&hearts;',
        '&diams;',
        '&malt;'
      ];
      this.initialize = function () {
        var body = '<div class="form-group row-fluid">' +
          this.makeSpecialCharSetTable()[0].outerHTML +
          '</div>';
              
        this.$dialog = ui.dialog({
					className: 'note-specialchar-dialog',
					// Set the title for the Dialog. Note: We don't need to build the markup for the Modal
					// Header, we only need to set the Title.
					title: lang.specialChar.select,
					
					// Set the Body of the Dialog.
					body: body,
					
					// This adds the Modal to the DOM.
				}).render().appendTo($editor);
      }
      this.destroy = function () {
        this.$dialog.remove()
      }
      /**
       * @member plugin.specialChar
       * @private
       * @param {jQuery} $editable
       * @return {String}
       */
      this.getTextOnRange = function () {
        $editable.focus();

        var rng = range.create();

        // if range on anchor, expand range with anchor
        if (rng.isOnAnchor()) {
          var anchor = dom.ancestor(rng.sc, dom.isAnchor);
          rng = range.createFromNode(anchor);
        }

        return rng.toString();
      };

      /**
       * Make Special Characters Table
       *
       * @member plugin.specialChar
       * @private
       * @return {jQuery}
       */
      this.makeSpecialCharSetTable = function () {
        var $table = $("<div/>").attr("id", "specialCharTable");
        $.each(specialCharDataSet, function (idx, text) {
          var $block = $("<span/>").attr("style", "border:1px solid black;display:inline-block;height:50px;width:35px;text-align:center;font-size:14pt;color:black;padding-top:10px;cursor:pointer;")
            .addClass("note-specialchar-node char-" + idx).attr("title", text).attr("id", "char-" + idx);
          $block.append(text);
          $table.append($block);
        });

        return $table;
      };

      /**
       * Show Special Characters and set event handlers on dialog controls.
       *
       * @member plugin.specialChar
       * @private
       * @param {jQuery} $dialog
       * @param {Object} text
       * @return {Promise}
       */
      this.showSpecialCharDialog = function (text) {
        var $specialCharDialog = this.$dialog
        return $.Deferred(function (deferred) {
          // var $specialCharDialog = $dialog.find('.note-specialchar-dialog');
          var $specialCharNode = $specialCharDialog.find('.note-specialchar-node');
          var $selectedNode = null;
          var ARROW_KEYS = [KEY.UP, KEY.DOWN, KEY.LEFT, KEY.RIGHT];
          var ENTER_KEY = KEY.ENTER;
          var pos = 0;
          var end = specialCharDataSet.length;

          function addActiveClass($target) {
            if (!$target) {
              return;
            }
            $target.find('span').addClass('active');
            $selectedNode = $target;
          }

          function removeActiveClass($target) {
            $target.find('span').removeClass('active');
            $selectedNode = null;
          }

          // find next node
          function findNextNode(row, column) {
            var findNode = null;
            $.each($specialCharNode, function (idx, $node) {
              var findRow = Math.ceil((idx + 1) / COLUMN_LENGTH);
              var findColumn = ((idx + 1) % COLUMN_LENGTH === 0) ? COLUMN_LENGTH : (idx + 1) % COLUMN_LENGTH;
              if (findRow === row && findColumn === column) {
                findNode = $node;
                return false;
              }
            });
            return $(findNode);
          }

          function arrowKeyHandler(keyCode) {
            // left, right, up, down key
            var w = $("#specialCharTable").css("width") + "";
            w = w.substr(0, w.length - 2);
            var cols = Math.floor(w / 35);
            pos = parseInt(pos);

            if (KEY.LEFT === keyCode) {
              if (pos > 0) {
                pos--;
                clear();
                $(".char-" + pos).css("border", "1px solid blue").css("background-color", "aliceblue");
                $selectedNode = $(".char-" + pos);
              }
            } else if (KEY.RIGHT === keyCode) {
              if (pos < end - 1) {
                pos++;
                clear();
                $(".char-" + pos).css("border", "1px solid blue").css("background-color", "aliceblue");
                $selectedNode = $(".char-" + pos);
              }
            } else if (KEY.UP === keyCode) {
              if (pos - cols >= 0) {
                clear();
                pos = pos - cols;
                $(".char-" + pos).css("border", "1px solid blue").css("background-color", "aliceblue");
                $selectedNode = $(".char-" + pos);
              }
            } else if (KEY.DOWN === keyCode) {
              if (pos + cols <= end) {
                clear();
                pos = pos + cols;
                $(".char-" + pos).css("border", "1px solid blue").css("background-color", "aliceblue");
                $selectedNode = $(".char-" + pos);
              }
            }
          }

          function enterKeyHandler() {
            if (!$selectedNode) {
              return;
            }

            pos = 0;
            deferred.resolve(decodeURIComponent($selectedNode.attr("title")));
            $specialCharDialog.modal('hide');
          }

          function keyDownEventHandler(event) {
            event.preventDefault();
            var keyCode = event.keyCode;
            if (keyCode === undefined || keyCode === null) {
              return;
            }
            // check arrowKeys match
            if (ARROW_KEYS.indexOf(keyCode) > -1) {
              arrowKeyHandler(keyCode);
            } else if (keyCode === ENTER_KEY) {
              enterKeyHandler();
            }
            return false;
          }

          // remove class
          removeActiveClass($specialCharNode);
          // find selected node
          if (text) {
            for (var i = 0; i < $specialCharNode.length; i++) {
              var $checkNode = $($specialCharNode[i]);
              if ($checkNode.text() === text) {
                addActiveClass($checkNode);
                currentRow = Math.ceil((i + 1) / COLUMN_LENGTH);
                currentColumn = (i + 1) % COLUMN_LENGTH;
              }
            }
          }

          $specialCharDialog.one('shown.bs.modal', function () {
            $(document).on('keydown', keyDownEventHandler);
            $specialCharNode.on('click', function (event) {
              event.preventDefault();
              pos = 0;
              deferred.resolve(decodeURIComponent(event.currentTarget.title));
              $specialCharDialog.modal('hide');
            });
            $specialCharNode.mouseenter(function () {
              clear();
              $(this).css("border", "1px solid blue").css("background-color", "aliceblue");
              $selectedNode = $(this);
              var thisid = $(this).attr("id") + "";
              pos = thisid.substr(5);
            });
            $specialCharNode.mouseleave(function () {
              clear();
            });
          }).one('hidden.bs.modal', function () {
            $specialCharNode.off('click');
            $(document).off('keydown', keyDownEventHandler);
            if (deferred.state() === 'pending') {
              deferred.reject();
            }
          }).modal('show');

          // tooltip
          /*$dialog.find('span').tooltip({
            container: $specialCharDialog.find('.form-group'),
            trigger: 'hover',
            placement: 'top'
          });*/

          // $editable blur
          $editable.blur();

          function clear() {
            $specialCharNode.css("border", "1px solid black").css("background-color", "white");
            $selectedNode = null;
          }
        });
      };

      this.show = function (text) {
        this.showSpecialCharDialog(text).then(function (selectChar) {
          // when ok button clicked
          
          // restore range
          context.invoke('editor.restoreRange');

          // build node
          var $node = $('<span></span>').html(selectChar)[0];
          //var $node = $(selectChar)[0];

          if ($node) {
            // insert character node
            context.invoke('editor.insertNode', $node);
          }
        }).fail(function () {
          // when cancel button clicked
          context.invoke('editor.restoreRange');
        });
      }
      context.memo('button.specialChar', function () {
        var button = ui.button({
          contents: 'á',
          container: options.container,
          tooltip: lang.specialChar.specialChar,
          placement: options.placement,
          click: function (e) {
            e.preventDefault();
            var currentSpecialChar = context.invoke('specialChar.getTextOnRange');

            // save current range
            context.invoke('editor.saveRange', $editable);

            context.invoke('specialChar.show', currentSpecialChar)
          }
        });
        return button.render();
      });
    }
  })
  
  $.extend(true, $.summernote.lang, {
    'en-US': {
      specialChar: {
        specialChar: 'Special Characters',
        select: 'Select Special characters'
      }
    },
    'ko-KR': {
      specialChar: {
        specialChar: '특수문자',
        select: '특수문자를 선택하세요'
      }
    },
    'zh-TW': {
      specialChar: {
        specialChar: '特殊字元',
        select: '插入特殊字元'
      }
    },
  });
}));
