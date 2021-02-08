/* https://github.com/tylerecouture/summernote-lists  */

(function(factory) {
    /* global define */
    if (typeof define === "function" && define.amd) {
      // AMD. Register as an anonymous module.
      define(["jquery"], factory);
    } else if (typeof module === "object" && module.exports) {
      // Node/CommonJS
      module.exports = factory(require("jquery"));
    } else {
      // Browser globals
      factory(window.jQuery);
    }
  })(function($) {
    $.extend(true, $.summernote.lang, {
      "en-US": {
        listStyleTypes: {
          tooltip: "List Styles",
          labelsListStyleTypes: [
            "Numbered",
            "Lower Alpha",
            "Upper Alpha",
            "Lower Roman",
            "Upper Roman",
            "Disc",
            "Circle",
            "Square"
          ]
        }
      },
      "zh-TW": {
        listStyleTypes: {
          tooltip: "清單樣式",
          labelsListStyleTypes: [
            "數字",
            "小寫字母",
            "大寫字母",
            "小寫羅馬數字",
            "大寫羅馬數字",
            "實心圓形",
            "空心圓形",
            "實心方形"
          ]
        }
      }
    });
    $.extend($.summernote.options, {
      listStyleTypes: {
        /* Must keep the same order as in lang.imageAttributes.tooltipShapeOptions */
        styles: [
          "decimal",
          "lower-alpha",
          "upper-alpha",
          "lower-roman",
          "upper-roman",
          "disc",
          "circle",
          "square"
        ]
      }
    });
  
    // Extends plugins for emoji plugin.
    $.extend($.summernote.plugins, {
      listStyles: function(context) {
        var self = this;
        var ui = $.summernote.ui;
        var options = context.options;
        var lang = options.langInfo;
        var listStyleTypes = options.listStyleTypes.styles;
        var listStyleLabels = lang.listStyleTypes.labelsListStyleTypes;
        var modules = context.modules
        var list = "";
  
        for (var i = 0; i < listStyleTypes.length; i++) {
          list += '<li><div class="list-style-item" data-value=' + listStyleTypes[i] + ">";
          list += '<i class="note-icon-menu-check float-left"></i>';
          list += '<ol><li style="list-style-type: ' + listStyleTypes[i] + ';">';
          list += listStyleLabels[i] + "</li></ol></div></li>";
        }
  
        context.memo("button.listStyles", function() {
          return ui
            .buttonGroup([
              ui.button({
                className: "dropdown-toggle list-styles more",
                contents: '', // twbs3 = ui.icon(options.icons.caret, "span"),
                tooltip: lang.listStyleTypes.tooltip,
                data: {
                  toggle: "dropdown"
                },
                callback: function ($dropdownBtn) {
                  $dropdownBtn.click(function (e) {
                    e.preventDefault();
                    self.updateListStyleMenuState($dropdownBtn);
                  })
                }
              }),
              ui.dropdownCheck({
                className: "dropdown-list-styles",
                checkClassName: options.icons.menuCheck,
                contents: list,
                callback: function($dropdown) {
                  $dropdown.find("div").each(function() {
                    $(this).click(function(e) {
                      e.preventDefault();
                      self.updateStyleType( $(this).data("value") )
                    });
                  });
                } // callback
              }),
            ])
            .render();
        })
  
        /* Makes sure the check marks are on the currently applied styles */
        self.updateListStyleMenuState = function($dropdownButton) {
          // editor loses selected range (e.g after blur)
          // save here... and restore after menu selection
          context.invoke('editor.saveRange');
  
          var $selectedtList = self.getParentList();
          var selectedListStyleType = !!$selectedtList && $selectedtList.css('list-style-type')
          // console.log(selectedListStyleType);
          // console.log($parentList.attr('list-style-type'));
          var $listItems = $dropdownButton.next().find("div");
          var styleFound = false;
          $listItems.each(function() {
            var itemListStyleType = $(this).data("value");
            if (selectedListStyleType == itemListStyleType) {
              $(this).addClass("checked");
              styleFound = true;
            } else {
              $(this).removeClass("checked");
            }
            if( !styleFound ) { // check the default style
              $listItems.filter('[data-value=""]').addClass("checked");
            }
          });
        }
  
        self.updateStyleType = function(style) {

          // editor loses selected range (e.g after blur)
          // restoring here
          context.invoke('editor.restoreRange');
          context.invoke('editor.focus');
  
          context.invoke("beforeCommand");
          self.getParentList().css("list-style-type", style);
          context.invoke("afterCommand");
        }
  
        self.getParentList = function (node) {

            var dom = $.summernote.dom
            var rng = modules.editor.getLastRange.call(modules.editor)
            var node = rng.commonAncestor()
            var list = dom.ancestor(rng.commonAncestor(), dom.isList);
            if (!list) context.invoke('insertOrderedList')
            
          if (window.getSelection) {
            var $focusNode = $(window.getSelection().focusNode);
            var $parentList = $focusNode.closest("div.note-editable ol, div.note-editable ul");
            return $parentList;
          }
          return null;
        }
  
        this.events = {
            'summernote.init': function (_, layoutInfo) {
                var range = $.summernote.range;
                layoutInfo.toolbar.on('mouseup', '.note-btn', function (event) {
                    var $target = $(event.currentTarget)
                    var $listicon = $target.find('.note-icon-unorderedlist, .note-icon-orderedlist')
                    if ($listicon.length) {
                        setTimeout(() => {
                            var rng = range.create()
                            $(rng.sc).closest('ul,ol').css('list-style-type','')
                        }, 10);
                    }
                    else return
                })
            }
        }
      }
    });
  });