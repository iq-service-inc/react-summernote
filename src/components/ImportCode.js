module.exports = function () {
    require('bootstrap/dist/css/bootstrap.min.css')
    require('bootstrap/js/dist/modal')
    require('bootstrap/js/dist/dropdown')
    require('bootstrap/js/dist/tooltip')

    require('summernote/dist/summernote-bs4.css')
    require('summernote/dist/summernote-bs4.js')
    require('summernote/dist/lang/summernote-zh-TW')

    require('../plugin/custom/summernote-custom')
    require('../plugin/custom/summernote-fontsize-input')
    require('../plugin/custom/summernote-toc')
    require('../plugin/custom/summernote-view-classlist')
    // require('../plugin/emoji/summernote-ext-emoji-ajax')
    // require('../plugin/emoji/summernote-ext-emoji-ajax.css')
    require('../plugin/formatting/summernote-addclass')
    require('../plugin/formatting/summernote-case-converter')
    require('../plugin/formatting/summernote-image-captionit')
    require('../plugin/formatting/summernote-image-shapes')
    require('../plugin/formatting/summernote-list-styles')
    require('../plugin/formatting/summernote-list-styles.css')
    require('../plugin/formatting/summernote-pagebreak')
    require('../plugin/formatting/summernote-video-attributes')
    require('../plugin/insert/summernote-at-mention')
    require('../plugin/insert/summernote-file')
    require('../plugin/insert/summernote-element-template')
    // require('../plugin/misc/summernoteDrafts')
    require('../plugin/misc/summernote-ext-print')
    require('../plugin/misc/summernote-text-findnreplace')
    require('../plugin/misc/summernote-ext-table')
    require('../plugin/misc/summernote-ext-table.css')
    require('../plugin/special_characters/summernote-ext-specialchars')

    //require('react-summernote/plugin/syntax/summernote-ext-highlight')
    //require('react-summernote/plugin/syntax/run_prettify')

    /**
     * override the default walkPoint method to fix styling issues
     * source: https://github.com/summernote/summernote/issues/3963#issuecomment-876953821
     */
    $.summernote.dom.walkPoint = (function (_super) {
        return function () {
            var startPoint = arguments[0]
            var endPoint = arguments[1]
            var handler = arguments[2]
            var isSkipInnerOffset = arguments[3]
            let point = startPoint;

            while (point) {
                handler(point);

                if ($.summernote.dom.isSamePoint(point, endPoint)) {
                    break;
                }
                const isSkipOffset = isSkipInnerOffset &&
                    startPoint.node !== point.node &&
                    endPoint.node !== point.node;
                point = $.summernote.dom.nextPoint(point, isSkipOffset);
            }
        };

    })($.summernote.dom.walkPoint);
}