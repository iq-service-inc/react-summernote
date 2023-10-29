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
          labelsListStyleTypes: {
            "disc": "Disc",
            "circle": "Circle",
            "square": "Square",
            "decimal": "Numbered",
            "decimal-brackets": "Numbered - Brackets",
            "lower-alpha": "Lower Alpha",
            "lower-alpha-brackets": "Lower Alpha - Brackets",
            "upper-alpha": "Upper Alpha",
            "upper-alpha-brackets": "Upper Alpha - Brackets",
            "lower-roman": "Lower Roman",
            "lower-roman-brackets": "Lower Roman - Brackets",
            "upper-roman": "Upper Roman",
            "upper-roman-brackets": "Upper Roman - Brackets",
            "cjk-heavenly-stem": "Heavenly Stem",
            "cjk-heavenly-stem-brackets": "Heavenly Stem - Brackets",
            "trad-chinese-informal": "Traditional Chinese Informal",
            "trad-chinese-informal-brackets": "Traditional Chinese Informal - Brackets",
            "trad-chinese-formal": "Traditional Chinese Formal",
            "trad-chinese-formal-brackets": "Traditional Chinese Formal - Brackets",
          }
        }
      },
      "zh-TW": {
        listStyleTypes: {
          tooltip: "清單樣式",
          labelsListStyleTypes: {
            "disc": "實心圓形",
            "circle": "空心圓形",
            "square": "實心方形",
            "decimal": "數字",
            "decimal-brackets": "數字 - 括弧",
            "lower-alpha": "小寫字母",
            "lower-alpha-brackets": "小寫字母 - 括弧",
            "upper-alpha": "大寫字母",
            "upper-alpha-brackets": "大寫字母 - 括弧",
            "lower-roman": "小寫羅馬數字",
            "lower-roman-brackets": "小寫羅馬數字 - 括弧",
            "upper-roman": "大寫羅馬數字",
            "upper-roman-brackets": "大寫羅馬數字 - 括弧",
            "cjk-heavenly-stem": "天干",
            "cjk-heavenly-stem-brackets": "天干 - 括弧",
            "trad-chinese-informal": "繁中非正式",
            "trad-chinese-informal-brackets": "繁中非正式 - 括弧",
            "trad-chinese-formal": "繁中正式",
            "trad-chinese-formal-brackets": "繁中正式 - 括弧",
          }
        }
      }
    });
    $.extend($.summernote.options, {
      listStyleTypes: {
        /* Must keep the same order as in lang.imageAttributes.tooltipShapeOptions */
        styles: [
          [
            "disc",
            "circle",
            "square",
          ],
          [
            "decimal",
            "lower-alpha",
            "upper-alpha",
            "lower-roman",
            "upper-roman",
            "cjk-heavenly-stem",
            "trad-chinese-informal",
            "trad-chinese-formal",
          ],
          [
            "decimal-brackets",
            "lower-alpha-brackets",
            "upper-alpha-brackets",
            "lower-roman-brackets",
            "upper-roman-brackets",
            "cjk-heavenly-stem-brackets",
            "trad-chinese-informal-brackets",
            "trad-chinese-formal-brackets",
          ],
        ],
      }
    });
  
    // Extends plugins for emoji plugin.
    $.extend($.summernote.plugins, {
      listStyles: function(context) {
        var range = $.summernote.range;
        var dom = $.summernote.dom;
        var self = this;
        var ui = $.summernote.ui;
        var options = context.options;
        var lang = options.langInfo;
        var listStyleTypes = options.listStyleTypes.styles;
        var listStyleLabels = lang.listStyleTypes.labelsListStyleTypes;
        var modules = context.modules
  
        var list = listStyleTypes.map(function(group, idx){
          return group.map(function(item) {
            const value = item
            const content = `<ol style="margin:0; display:inline-block;">
              <li style="list-style-type:${item};"> ${listStyleLabels[item]}</li>
            </ol>`
            return '<a class="dropdown-item" href="#" data-value="' + value + '" role="listitem" aria-label="' + item + '">' + ui.icon(options.icons.menuCheck) + ' ' + content + '</a>';
          }).join('')
        }).join(`<div class="dropdown-divider"></div>`)

        context.memo("button.listStyles", function() {
          return ui
            .buttonGroup([
              ui.button({
                className: "dropdown-toggle list-styles",
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
                className: "dropdown-list-style",
                items: list,
                template: function (item) {
                  return `<ol style="margin:0; display:inline-block;">
                    <li style="list-style-type:${item};"> ${listStyleLabels[item]}</li>
                  </ol>`
                },
                // click
                callback: function($dropdown) {
                  $dropdown.find("a.dropdown-item").each(function() {
                    $(this).click(function(e) {
                      e.preventDefault();
                      self.updateStyleType( $(this).data("value") )
                    });
                  });
                } // callback
              }),
            ])
            .render().addClass('note-list-style-more');
        })
  
        /* Makes sure the check marks are on the currently applied styles */
        self.updateListStyleMenuState = function($dropdownButton) {
          // editor loses selected range (e.g after blur)
          // save here... and restore after menu selection
          context.invoke('editor.saveRange');

          const styleInfo = context.invoke('editor.currentStyle')
          const listStyleType = styleInfo['list-style-type']
          const listStyle = styleInfo['list-style']

          var $dropdownList = $dropdownButton.next()
          $dropdownList.find("a.dropdown-item.checked").removeClass("checked")
          if (!!listStyle && listStyle !== "none") {
            $dropdownList.find(`a.dropdown-item[data-value="${listStyleType}"]`).addClass("checked")
          }
        }
  
        self.updateStyleType = function(style) {

          // editor loses selected range (e.g after blur)
          // restoring here
          context.invoke('editor.restoreRange');
          context.invoke('editor.focus');
  
          context.invoke("beforeCommand");
          var rng = range.create()
          var list = dom.ancestor(rng.commonAncestor(), dom.isList)
          if (!list) {
            context.invoke('editor.insertOrderedList')
            list = dom.ancestor(rng.commonAncestor(), dom.isList)
          }
          $(list).css("list-style-type", style)
          context.invoke("afterCommand");
        }
  
        this.events = {
            'summernote.init': function (_, layoutInfo) {
                layoutInfo.toolbar.on('mouseup', '.note-btn', function (event) {
                    var $target = $(event.currentTarget)
                    var $listicon = $target.find('.note-icon-unorderedlist, .note-icon-orderedlist')
                    if ($listicon.length) {
                        var rng = range.create()
                        $(rng.sc).closest('ul,ol').css('list-style-type','')
                    }
                    else return
                })
            }
        }
      }
    });
  });