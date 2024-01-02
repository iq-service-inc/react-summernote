/**
 * patch summernote 0.8.18 module/Handle.js
 * 
 * override image handle update function
 * use getBoundingClientRect() to calculate the offset
 * source: https://github.com/summernote/summernote/issues/4242, https://github.com/summernote/summernote/pull/4283, https://github.com/summernote/summernote/commit/0b564ee0a2919651e7839faecf60e9d0b410dbd8
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {
    $.extend($.summernote.plugins, {
        'patchHandle': function (context) {
            var dom = $.summernote.dom,
                modules = context.modules

            function update(target, event) {
                if (this.context.isDisabled()) {
                    return false;
                }

                const isImage = dom.isImg(target);
                const $selection = this.$handle.find('.note-control-selection');

                this.context.invoke('imagePopover.update', target, event);

                if (isImage) {
                    const $image = $(target);

                    const areaRect = this.$editingArea[0].getBoundingClientRect();
                    const imageRect = target.getBoundingClientRect();

                    $selection.css({
                        display: 'block',
                        left: imageRect.left - areaRect.left,
                        top: imageRect.top - areaRect.top,
                        width: imageRect.width,
                        height: imageRect.height,
                    }).data('target', $image); // save current image element.

                    const origImageObj = new Image();
                    origImageObj.src = $image.attr('src');

                    const sizingText = imageRect.width + 'x' + imageRect.height + ' (' + this.lang.image.original + ': ' + origImageObj.width + 'x' + origImageObj.height + ')';
                    $selection.find('.note-control-selection-info').text(sizingText);
                    this.context.invoke('editor.saveTarget', target);
                } else {
                    this.hide();
                }

                return isImage;
            }

            modules.handle.update = update.bind(modules.handle)
        }
    })
}));
