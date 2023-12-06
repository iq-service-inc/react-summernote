/* https://github.com/DiemenDesign/summernote-image-attributes */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
      module.exports = factory(require('jquery'));
    } else {
      factory(window.jQuery);
    }
  }(function ($) {
    var readFileAsDataURL = function (file) {
      return $.Deferred( function (deferred) {
        $.extend(new FileReader(),{
          onload: function (e) {
            var sDataURL = e.target.result;
            deferred.resolve(sDataURL);
          },
          onerror: function () {
            deferred.reject(this);
          }
        }).readAsDataURL(file);
      }).promise();
    };
    $.extend(true,$.summernote.lang, {
      'en-US': { /* US English(Default Language) */
        imageAttributes: {
          dialogTitle: 'Image Attributes',
          tooltip: 'Image Attributes',
          tabImage: 'Image',
            src: 'Source',
            browse: 'Browse',
            title: 'Title',
            alt: 'Alt Text',
            dimensions: 'Dimensions',
            useNaturalSize: 'Use natural image size',
            switchUnit: 'Switch Unit',
            dimensionHint: 'Leave blank to scale proportionally',
          tabAttributes: 'Attributes',
            class: 'Class',
            style: 'Style',
            role: 'Role',
          tabLink: 'Link',
            linkHref: 'URL',
            linkTarget: 'Target',
            linkTargetInfo: 'Options: _self, _blank, _top, _parent',
            linkClass: 'Class',
            linkStyle: 'Style',
            linkRel: 'Rel',
            linkRelInfo: 'Options: alternate, author, bookmark, help, license, next, nofollow, noreferrer, prefetch, prev, search, tag',
            linkRole: 'Role',
          tabUpload: 'Upload',
            upload: 'Upload',
          tabBrowse: 'Browse',
          editBtn: 'OK'
        }
      }
    });
    $.extend(true,$.summernote.lang,{
        'zh-TW':{ /* Chinese Traditional */
          imageAttributes:{
            dialogTitle: '編輯圖片',
            tooltip: '編輯圖片',
            tabImage: '圖片',
              src: '資源',
              browse: '瀏覽',
              title: '標題',
              alt: '圖片說明',
              dimensions: '圖片尺寸',
              useNaturalSize: '套用原始圖片尺寸',
              switchUnit: '切換單位',
              dimensionHint: '留空依等比例縮放',
            tabAttributes: '屬性',
              class: '類 (Class)',
              style: '樣式 (Style)',
              role: '角色 (Role)',
            tabLink: '連結',
              linkHref: '網址 (Href)',
              linkTarget: '目標 (Target)',
              linkTargetInfo: '選項: _self, _blank, _top, _parent',
              linkClass: '類 (Class)',
              linkStyle: '樣式 (Style)',
              linkRel: '相對 (Rel)',
              linkRelInfo: '選項: alternate, author, bookmark, help, license, next, nofollow, noreferrer, prefetch, prev, search, tag',
              linkRole: '角色 (Role)',
            tabUpload: '上傳',
              upload: '上傳',
            tabBrowse: '瀏覽',
            editBtn: 'OK'
          }
        }
    });
    $.extend($.summernote.options, {
      imageAttributes: {
        icon: '<i class="note-icon-pencil"/>',
        removeEmpty: true,
        disableUpload: true,
        imageFolder: '',
        autoInsertTitle: true,
      }
    });
    $.extend($.summernote.plugins, {
      'imageAttributes': function (context) {
        var modulesEditor = context.modules.editor
        modulesEditor.resize = modulesEditor.wrapCommand((value) => {
          const $target = $(modulesEditor.restoreTarget());
          value = parseFloat(value);
          if (value === 0) {
            $target.css({
              width: '',
              height: '',
            });
            if (options.imageAttributes.autoInsertTitle) {
              this.$handle = context.modules.handle.$handle
              var $img = this.$handle.find('.note-control-selection').data('target')
              let id = $img.attr('data-image-id')
              let $title = $editable.find(`input[data-image-title-id=${id}]`)
              if ($title.length) {
                $title.css('width', `${$img.width()}px`)
              }
            }
          } else {
            $target.css({
              width: value * 100 + '%',
              height: 'auto',
            });
            if (options.imageAttributes.autoInsertTitle) {
              this.$handle = context.modules.handle.$handle
              var $img = this.$handle.find('.note-control-selection').data('target')
              let id = $img.attr('data-image-id')
              let $title = $editable.find(`input[data-image-title-id=${id}]`)
              if ($title.length) {
                $title.css('width', value * 100 + '%')
              }
            }
          }
        })

        var self      = this,
            ui        = $.summernote.ui,
            dom       = $.summernote.dom,
            $note     = context.layoutInfo.note,
            $editor   = context.layoutInfo.editor,
            $editable = context.layoutInfo.editable,
            options   = context.options,
            lang      = options.langInfo,
            imageAttributesLimitation = '';
        if (options.maximumImageFileSize) {
          var unit = Math.floor(Math.log(options.maximumImageFileSize) / Math.log(1024));
          var readableSize = (options.maximumImageFileSize/Math.pow(1024,unit)).toFixed(2) * 1 + ' ' + ' KMGTP'[unit] + 'B';
          imageAttributesLimitation = '<small class="help-block note-help-block">' + lang.image.maximumFileSize + ' : ' + readableSize+'</small>';
        }
        if(! ('_counter' in $.summernote.options.imageAttributes)) {
          $.summernote.options.imageAttributes._counter = 0;
        }
        context.memo('button.imageAttributes', function() {
          var button = ui.button({
            contents: options.imageAttributes.icon,
            container: "body",
            tooltip:  lang.imageAttributes.tooltip,
            click: function () {
              context.invoke('imageAttributes.show');
            }
          });
          return button.render();
        });
        this.initialize = function () {
          var $container = options.dialogsInBody ? $(document.body) : $editor;
          $.summernote.options.imageAttributes._counter++;
          var i = $.summernote.options.imageAttributes._counter;
          // console.log('indice for imageAttribute : ', i);
          var body = '<ul class="nav note-nav nav-tabs note-nav-tabs">' +
                        '<li class="nav-item note-nav-item active"><a class="nav-link note-nav-link active" href="#note-imageAttributes-' + i + '" data-toggle="tab">' + lang.imageAttributes.tabImage + '</a></li>' +
                        '<li class="nav-item note-nav-item"><a class="nav-link note-nav-link" href="#note-imageAttributes-attributes-' + i + '" data-toggle="tab">' + lang.imageAttributes.tabAttributes + '</a></li>' +
                        '<li class="nav-item note-nav-item"><a class="nav-link note-nav-link" href="#note-imageAttributes-link-' + i + '" data-toggle="tab">' + lang.imageAttributes.tabLink + '</a></li>';
          if (options.imageAttributes.disableUpload == false) {
             body +=    '<li class="nav-item note-nav-item"><a class="nav-link note-nav-link" href="#note-imageAttributes-upload-' + i + '" data-toggle="tab">' + lang.imageAttributes.tabUpload + '</a></li>';
          }
          body +=     '</ul>' +
                      '<div class="tab-content">' +
  // Tab 2
                      '<div class="tab-pane note-tab-pane" id="note-imageAttributes-attributes-' + i + '">' +
                        '<div class="note-form-group form-group note-group-imageAttributes-class">' +
                          '<label class="control-label note-form-label col-sm-3">' + lang.imageAttributes.class + '</label>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<input class="note-imageAttributes-class form-control note-form-control note-input" type="text">' +
                          '</div>' +
                        '</div>' +
                        '<div class="note-form-group form-group note-group-imageAttributes-style">' +
                          '<label class="control-label note-form-label col-sm-3">' + lang.imageAttributes.style + '</label>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<input class="note-imageAttributes-style form-control note-form-control note-input" type="text">' +
                          '</div>' +
                        '</div>' +
                        '<div class="note-form-group form-group note-group-imageAttributes-role">' +
                          '<label class="control-label note-form-label col-sm-3">' + lang.imageAttributes.role + '</label>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<input class="note-imageAttributes-role form-control note-form-control note-input" type="text">' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
  // Tab 3
                      '<div class="tab-pane note-tab-pane" id="note-imageAttributes-link-' + i + '">' +
                        '<div class="note-form-group form-group note-group-imageAttributes-link-href">' +
                          '<label class="control-label note-form-label col-xs-3">' + lang.imageAttributes.linkHref + '</label>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<input class="note-imageAttributes-link-href form-control note-form-control note-input" type="text">' +
                          '</div>' +
                        '</div>' +
                        '<div class="note-form-group form-group note-group-imageAttributes-link-target">' +
                          '<label class="control-label note-form-label col-xs-3">' + lang.imageAttributes.linkTarget + '</label>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<input class="note-imageAttributes-link-target form-control note-form-control note-input" type="text">' +
                          '</div>' +
                          '<small class="help-block note-help-block text-right">' + lang.imageAttributes.linkTargetInfo + '</small>' +
                        '</div>' +
                        '<div class="note-form-group form-group note-group-imageAttributes-link-class">' +
                          '<label class="control-label note-form-label col-xs-3">' + lang.imageAttributes.linkClass + '</label>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<input class="note-imageAttributes-link-class form-control note-form-control note-input" type="text">' +
                          '</div>' +
                        '</div>' +
                        '<div class="note-form-group form-group note-group-imageAttributes-link-style">' +
                          '<label class="control-label note-form-label col-xs-3">' + lang.imageAttributes.linkStyle + '</label>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<input class="note-imageAttributes-link-style form-control note-form-control note-input" type="text">' +
                          '</div>' +
                        '</div>' +
                        '<div class="note-form-group form-group note-group-imageAttributes-link-rel">' +
                          '<label class="control-label note-form-label col-xs-3">' + lang.imageAttributes.linkRel + '</label>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<input class="note-imageAttributes-link-rel form-control note-form-control note-input" type="text">' +
                          '</div>' +
                          '<small class="help-block note-help-block text-right">' + lang.imageAttributes.linkRelInfo + '</small>' +
                        '</div>' +
                        '<div class="note-form-group form-group note-group-imageAttributes-link-role">' +
                          '<label class="control-label note-form-label col-xs-3">' + lang.imageAttributes.linkRole + '</label>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<input class="note-imageAttributes-link-role form-control note-form-control note-input" type="text">' +
                          '</div>' +
                        '</div>' +
                      '</div>';
        if (options.imageAttributes.disableUpload == false) {
  // Tab 4
          body +=     '<div class="tab-pane note-tab-pane" id="note-imageAttributes-upload-' + i + '">' +
                        '<label class="control-label note-form-label col-xs-3">' + lang.imageAttributes.upload + '</label>' +
                        '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                          '<input class="note-imageAttributes-input form-control note-form-control note-input" type="file" name="files" accept="image/*" multiple="multiple">' +
                          imageAttributesLimitation +
                        '</div>' +
                      '</div>';
          }
  // Tab 1
          body +=     '<div class="tab-pane note-tab-pane in active" id="note-imageAttributes-' + i + '">' +
                        '<div class="note-form-group form-group note-group-imageAttributes-url">' +
                          '<label class="control-label note-form-label col-sm-3">' + lang.imageAttributes.src + '</label>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<input class="note-imageAttributes-src form-control note-form-control note-input" type="text">' +
                          '</div>' +
                        '</div>' +
                        '<div class="note-form-group form-group note-group-imageAttributes-title">' +
                          '<label class="control-label note-form-label col-sm-3">' + lang.imageAttributes.title + '</label>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<input class="note-imageAttributes-title form-control note-form-control note-input" type="text">' +
                          '</div>' +
                        '</div>' +
                        '<div class="note-form-group form-group note-group-imageAttributes-alt">' +
                          '<label class="control-label note-form-label col-sm-3">' + lang.imageAttributes.alt + '</label>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<input class="note-imageAttributes-alt form-control note-form-control note-input" type="text">' +
                          '</div>' +
                        '</div>' +
                        '<div class="note-form-group form-group note-group-imageAttributes-dimensions">' +
                          '<div class="col-xs-12 col-sm-9">' +
                            '<label class="control-label note-form-label">' + lang.imageAttributes.dimensions + '</label>' +
                            '<button class="btn btn-sm btn-outline-primary note-btn note-imageAttributes-naturalSizeBtn shadow-none mb-1 float-right">'+ lang.imageAttributes.useNaturalSize +' </button>' +
                          '</div>' +
                          '<div class="input-group input-group-sm note-input-group col-xs-12 col-sm-9 mb-1">' +
                            '<div class="input-group-prepend col-4 p-0">' + 
                              '<label class="control-label note-form-label input-group-text rounded-left w-100 justify-content-center">' + lang.imageAttributes.switchUnit + '</label>' +
                            '</div>' +
                            '<div class="input-group-append col-8 m-0 p-0">' + 
                              '<button class="btn btn-sm w-50 shadow-none btn-outline-primary note-btn note-imageAttributes-switchUnitToPX active">px</button>' +
                              '<button class="btn btn-sm w-50 shadow-none btn-outline-primary note-btn note-imageAttributes-switchUnitToPercent">%</button>' +
                            '</div>' +
                          '</div>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9 note-imageAttributes-px">' +
                            '<input class="note-imageAttributes-width form-control note-form-control note-input" type="number" inputmode="numeric" min="0">' +
                            '<div class="input-group-prepend input-group-append">' +
                              '<div class="input-group-text form-control note-form-control">x</div>' +
                            '</div>' +
                            '<input class="note-imageAttributes-height form-control note-form-control note-input" type="number" inputmode="numeric" min="0">' +
                            '<div class="input-group-append" style="width: 2.6em">' +
                              '<div class="input-group-text form-control note-form-control">px</div>' +
                            '</div>' +
                          '</div>' +
                          '<div class="input-group note-input-group col-xs-12 col-sm-9 note-imageAttributes-percent" style="display: none">' +
                            '<input class="note-imageAttributes-width-percent form-control note-form-control note-input" type="number" pattern="^\d*(\.\d{0,2})?$" min="0">' +
                            '<div class="input-group-prepend input-group-append">' +
                              '<div class="input-group-text form-control note-form-control">x</div>' +
                            '</div>' +
                            '<input class="note-imageAttributes-height-percent form-control note-form-control note-input" type="number" pattern="^\d*(\.\d{0,2})?$" min="0">' +
                            '<div class="input-group-append" style="width: 2.6em">' +
                              '<div class="input-group-text form-control note-form-control">%</div>' +
                            '</div>' +
                          '</div>' +
                          '<small class="form-text font-italic text-muted col-xs-12 col-sm-9 text-right">' + lang.imageAttributes.dimensionHint + '</small>' +
                        '</div>' +
                      '</div>' +
                    '</div>';
          this.$dialog=ui.dialog({
            title:  lang.imageAttributes.dialogTitle,
            body:   body,
            footer: '<button href="#" class="btn btn-primary note-btn note-btn-primary note-imageAttributes-btn">' + lang.imageAttributes.editBtn + '</button>'
          }).render().appendTo($container);
          
          if (options.imageAttributes.autoInsertTitle) {
            this.$handle = context.modules.handle.$handle
            this.$handle.on('mousedown', (event) => {
              if (dom.isControlSizing(event.target)) {
                const move = () => {
                  var $img = this.$handle.find('.note-control-selection').data('target');
                  let id = $img.attr('data-image-id')
                  let $title = $editable.find(`input[data-image-title-id=${id}]`)
                  if ($title.length) {
                    $title.css('width', `${$img.width()}px`)
                      .attr('value', $img.attr('title'))
                  }
                }
                $(document).on('mousemove', move)
                  .one('mouseup', (e) => {
                    $(document).off('mousemove', move)
                  })
              }
            })
          }
        };
        this.destroy = function () {
          ui.hideDialog(this.$dialog);
          this.$dialog.remove();
        };
        this.bindEnterKey = function ($input,$btn) {
          $input.on('keypress', function (e) {
            if (e.keyCode === 13) $btn.trigger('click');
          });
        };
        this.bindLabels = function () {
          self.$dialog.find('.form-control:first').focus().select();
          self.$dialog.find('label').on('click', function () {
            $(this).parent().find('.form-control:first').focus();
          });
        };
        this.show = function () {
          var $img    = $($editable.data('target'));
          var imgInfo = {
            imgDom:  $img,
            title:   $img.attr('title'),
            src:     $img.attr('src'),
            alt:     $img.attr('alt'),
            width:   $img.width(),
            height:  $img.height(),
            role:    $img.attr('role'),
            class:   $img.attr('class'),
            style:   $img.attr('style'),
            imgLink: $($img).parent().is("a") ? $($img).parent() : null
          };
          this.showImageAttributesDialog(imgInfo).then( function (imgInfo) {
            ui.hideDialog(self.$dialog);
            var $img = imgInfo.imgDom;
            if (options.imageAttributes.removeEmpty) {
              if (imgInfo.alt)    $img.attr('alt',   imgInfo.alt);    else $img.removeAttr('alt');
              if (imgInfo.title)  $img.attr('title', imgInfo.title);  else $img.removeAttr('title');
              if (imgInfo.src)    $img.attr('src',   imgInfo.src);    else $img.attr('src', '#');
              if (imgInfo.class)  $img.attr('class', imgInfo.class);  else $img.removeAttr('class');
              if (imgInfo.style)  $img.attr('style', imgInfo.style);  else $img.removeAttr('style');
              if (imgInfo.role)   $img.attr('role',  imgInfo.role);   else $img.removeAttr('role');
              if (imgInfo.width)  $img.attr('width', imgInfo.width);  else $img.removeAttr('width');
              if (imgInfo.height) $img.attr('height',imgInfo.height); else $img.removeAttr('height');
              $img.css({ 'width': '', 'height': '' })
            } else {
              if (imgInfo.src)    $img.attr('src',   imgInfo.src);    else $img.attr('src', '#');
              $img.attr('alt',    imgInfo.alt);
              $img.attr('title',  imgInfo.title);
              $img.attr('class',  imgInfo.class);
              $img.attr('style',  imgInfo.style);
              $img.attr('role',   imgInfo.role);
              $img.attr('width',  imgInfo.width);
              $img.attr('height', imgInfo.height);
              $img.css({ 'width': '', 'height': '' })
            }
            if($img.parent().is("a")) $img.unwrap();
            if (imgInfo.linkHref) {
              var linkBody = '<a';
              if (imgInfo.linkClass) linkBody += ' class="' + imgInfo.linkClass + '"';
              if (imgInfo.linkStyle) linkBody += ' style="' + imgInfo.linkStyle + '"';
              linkBody += ' href="' + imgInfo.linkHref + '" target="' + imgInfo.linkTarget + '"';
              if (imgInfo.linkRel) linkBody += ' rel="' + imgInfo.linkRel + '"';
              if (imgInfo.linkRole) linkBody += ' role="' + imgInfo.linkRole + '"';
              linkBody += '></a>';
              $img.wrap(linkBody);
            }
            if (options.imageAttributes.autoInsertTitle) {
              let id = $img.attr('data-image-id')
              let $title = $editable.find(`input[data-image-title-id=${id}]`)
              if ($title.length) {
                // unwrap $title link
                if ($title.parent().is('a') &&
                  $title.parent().children().not($title).length == 0) {
                  $title.unwrap('a')
                }
              }
              if (imgInfo.title) {
                if ($title.length) {
                  // title get value && $title is exist
                  // update $title content and position
                  $title.css('width', `${$img.width()}px`)
                    .attr('value', imgInfo.title)
                  $title.insertAfter($img)
                }
                else {
                  // title get value && $title not exist
                  // create $title
                  let newid = self.randomId()
                  let $newtitle = $('<input>').addClass('summernote-custom-image-title')
                    .prop({
                      readonly: true,
                      disabled: true,
                    })
                    .css({
                      'display': 'block',
                      'background': 'none',
                      'border': 'none',
                      'color': 'black',
                      'textAlign': 'center',
                      'width': `${$img.width()}px`,
                      'pointerEvents': 'none',
                      'userSelect': 'none',
                    })
                    .attr({
                      'value': imgInfo.title,
                      'data-image-title-id': newid,
                    })
                  $img.after($newtitle)
                    .attr('data-image-id', newid)
                }
              }
              else {
                if ($title.length) {
                  // title is blank && $title is exist
                  // remove $title
                  $title.remove()
                  $img.removeAttr('data-image-id')
                }
              }
            }
            $note.val(context.invoke('code'));
            $note.change();
          });
        };
        this.showImageAttributesDialog = function (imgInfo) {
          return $.Deferred( function (deferred) {
            var $imageTitle  = self.$dialog.find('.note-imageAttributes-title'),
                $imageInput  = self.$dialog.find('.note-imageAttributes-input'),
                $imageSrc    = self.$dialog.find('.note-imageAttributes-src'),
                $imageAlt    = self.$dialog.find('.note-imageAttributes-alt'),
                $imageWidth  = self.$dialog.find('.note-imageAttributes-width'),
                $imageHeight = self.$dialog.find('.note-imageAttributes-height'),
                $imageWidthPercent = self.$dialog.find('.note-imageAttributes-width-percent'),
                $imageHeightPercent = self.$dialog.find('.note-imageAttributes-height-percent'),
                $imageClass  = self.$dialog.find('.note-imageAttributes-class'),
                $imageStyle  = self.$dialog.find('.note-imageAttributes-style'),
                $imageRole   = self.$dialog.find('.note-imageAttributes-role'),
                $linkHref    = self.$dialog.find('.note-imageAttributes-link-href'),
                $linkTarget  = self.$dialog.find('.note-imageAttributes-link-target'),
                $linkClass   = self.$dialog.find('.note-imageAttributes-link-class'),
                $linkStyle   = self.$dialog.find('.note-imageAttributes-link-style'),
                $linkRel     = self.$dialog.find('.note-imageAttributes-link-rel'),
                $linkRole    = self.$dialog.find('.note-imageAttributes-link-role'),
                $editBtn     = self.$dialog.find('.note-imageAttributes-btn');
                $naturalSizeBtn = self.$dialog.find('.note-imageAttributes-naturalSizeBtn');
                $switchUnitToPXBtn = self.$dialog.find('.note-imageAttributes-switchUnitToPX');
                $switchUnitToPercentBtn = self.$dialog.find('.note-imageAttributes-switchUnitToPercent');
                $pxGroup = self.$dialog.find('.note-imageAttributes-px');
                $percentGroup = self.$dialog.find('.note-imageAttributes-percent');
            $linkHref.val();
            $linkClass.val();
            $linkStyle.val();
            $linkRole.val();
            $linkTarget.val();
            $linkRel.val();
            if (imgInfo.imgLink) {
              $linkHref.val(imgInfo.imgLink.attr('href'));
              $linkClass.val(imgInfo.imgLink.attr('class'));
              $linkStyle.val(imgInfo.imgLink.attr('style'));
              $linkRole.val(imgInfo.imgLink.attr('role'));
              $linkTarget.val(imgInfo.imgLink.attr('target'));
              $linkRel.val(imgInfo.imgLink.attr('rel'));
            }
            ui.onDialogShown(self.$dialog, function () {
              context.triggerEvent('dialog.shown');
              $imageInput.replaceWith(
                $imageInput.clone().on('change', function () {
                  var callbacks = options.callbacks;
                  if (callbacks.onImageUpload) {
                    context.triggerEvent('image.upload',this.files[0]);
                  } else {
                    readFileAsDataURL(this.files[0]).then( function (dataURL) {
                      $imageSrc.val(dataURL);
                    }).fail( function () {
                      context.triggerEvent('image.upload.error');
                    });
                  }
                }).val('')
              );
              $editBtn.click( function (e) {
                e.preventDefault();
                deferred.resolve({
                  imgDom:     imgInfo.imgDom,
                  title:      $imageTitle.val(),
                  src:        $imageSrc.val(),
                  alt:        $imageAlt.val(),
                  width:      $imageWidth.val(),
                  height:     $imageHeight.val(),
                  class:      $imageClass.val(),
                  style:      $imageStyle.val(),
                  role:       $imageRole.val(),
                  linkHref:   $linkHref.val(),
                  linkTarget: $linkTarget.val(),
                  linkClass:  $linkClass.val(),
                  linkStyle:  $linkStyle.val(),
                  linkRel:    $linkRel.val(),
                  linkRole:   $linkRole.val()
                }).then(function (img) {
                  context.triggerEvent('change', $editable.html());
                });
              });
              $naturalSizeBtn.click( function (e) {
                $imageWidth.val(imgInfo.imgDom.prop('naturalWidth'))
                $imageHeight.val(imgInfo.imgDom.prop('naturalHeight'))
                $imageWidthPercent.val(100)
                $imageHeightPercent.val(100)
              })
              $switchUnitToPXBtn.click( function (e) {
                if ($switchUnitToPXBtn.hasClass('active')) return
                $imageWidth.val( function(i, v) {
                  if (!!v) return parseInt(($imageWidthPercent.val() * imgInfo.imgDom.prop('naturalWidth') / 100))
                  else return ""
                })
                $imageHeight.val( function(i, v) {
                  if (!!v) return parseInt(($imageHeightPercent.val() * imgInfo.imgDom.prop('naturalHeight') / 100))
                  else return ""
                })
                $switchUnitToPercentBtn.toggleClass('active', false)
                $switchUnitToPXBtn.toggleClass('active', true)
                $percentGroup.hide()
                $pxGroup.show()
              })
              $switchUnitToPercentBtn.click( function (e) {
                if ($switchUnitToPercentBtn.hasClass('active')) return
                $imageWidthPercent.val( function(i, v) {
                  if(!!v) return parseFloat(($imageWidth.val() / imgInfo.imgDom.prop('naturalWidth') * 100).toFixed(2))
                  else return ""
                })
                $imageHeightPercent.val( function(i, v) {
                  if(!!v) return parseFloat(($imageHeight.val() / imgInfo.imgDom.prop('naturalHeight') * 100).toFixed(2))
                  else return ""
                })
                $switchUnitToPercentBtn.toggleClass('active', true)
                $switchUnitToPXBtn.toggleClass('active', false)
                $percentGroup.show()
                $pxGroup.hide()
              })
              $imageWidth.on('keydown', preventPeriod)
              $imageHeight.on('keydown', preventPeriod)
              function preventPeriod(e) {
                // prevent .
                if (e.key == ".") e.preventDefault()
              }
              $imageWidth.on('input', parseValueToInt)
              $imageHeight.on('input', parseValueToInt)
              function parseValueToInt(e) {
                $(e.target).val(function (i, v) {
                  if (!!v) return parseInt(v)
                  else return ""
                })
              }
              $imageWidthPercent.on('keydown', preventAddMinus)
              $imageHeightPercent.on('keydown', preventAddMinus)
              function preventAddMinus(e) {
                // prevent + -
                if (e.key == "+" || e.key == "-") e.preventDefault()
              }
              $imageWidthPercent.on('input', parseValueToFixedTwo)
              $imageHeightPercent.on('input', parseValueToFixedTwo)
              function parseValueToFixedTwo(e) {
                let v = $(e.target).val()
                let precision = v.replace(/\d*\.?/, '') 
                if (precision && precision.length > 2) {
                  $(e.target).val(function (i, v) {
                    return v.replace(/(\.\d{2})\d*/, '$1')
                  })
                }
              }
              $imageTitle.val(imgInfo.title);
              $imageSrc.val(imgInfo.src);
              $imageAlt.val(imgInfo.alt);
              $imageWidth.val(imgInfo.width);
              $imageHeight.val(imgInfo.height);
              if (imgInfo.width) $imageWidthPercent.val(imgInfo.width / imgInfo.imgDom.prop('naturalWidth') * 100);
              else $imageWidthPercent.val("")
              if (imgInfo.height) $imageHeightPercent.val(imgInfo.height / imgInfo.imgDom.prop('naturalHeight') * 100);
              else $imageHeightPercent.val("")
              $imageClass.val(imgInfo.class);
              $imageStyle.val(imgInfo.style);
              $imageRole.val(imgInfo.role);
              self.bindEnterKey($editBtn);
              self.bindLabels();
            });
            ui.onDialogHidden(self.$dialog, function () {
              $editBtn.off('click');
              $naturalSizeBtn.off('click');
              $switchUnitToPXBtn.off('click')
              $switchUnitToPercentBtn.off('click')
              $imageWidth.off()
              $imageHeight.off()
              $imageWidthPercent.off()
              $imageHeightPercent.off()
              if (deferred.state() === 'pending') deferred.reject();
            });
            ui.showDialog(self.$dialog);
          });
        };
        this.randomId = function() {
          return Date.now().toString(36) + Math.random().toString(36).substring(2)
        }
      }
    });
  }));