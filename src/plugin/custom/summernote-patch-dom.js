/**
 * patch summernote 0.8.18 core/dom.js
 * 
 * override the walkPoint and nextPointWithEmptyNode
 * fix walkPoint cannot walk entire DOM
 * source: https://github.com/summernote/summernote/issues/4471, https://github.com/summernote/summernote/pull/4472
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
    /**
     * @method walkPoint - preorder / depth first traversal of the DOM
     *
     * @param {BoundaryPoint} startPoint
     * @param {BoundaryPoint} endPoint
     * @param {Function} handler
     * @param {Boolean} isSkipInnerOffset
     */
    function walkPoint(startPoint, endPoint, handler, isSkipInnerOffset) {
        let point = startPoint;

        while (point) {
            handler(point);

            if ($.summernote.dom.isSamePoint(point, endPoint)) {
                break;
            }
            const isSkipOffset = isSkipInnerOffset &&
                startPoint.node !== point.node &&
                endPoint.node !== point.node;
            point = $.summernote.dom.nextPointWithEmptyNode(point, isSkipOffset);
        }
    }
    /**
     * Find next boundaryPoint for preorder / depth first traversal of the DOM
     * returns next boundaryPoint with empty node
     *
     * @param {BoundaryPoint} point
     * @param {Boolean} isSkipInnerOffset
     * @return {BoundaryPoint}
     */
    function nextPointWithEmptyNode(point, isSkipInnerOffset) {
        let node, offset = 0;

        if (this.nodeLength(point.node) === point.offset) {
            if (this.isEditable(point.node)) {
                return null;
            }

            node = point.node.parentNode;
            offset = this.position(point.node) + 1;

            // if parent node is editable,  return current node's sibling node.
            if (this.isEditable(node)) {
                node = point.node.nextSibling;
                offset = 0;
            }
        } else if (this.hasChildren(point.node)) {
            node = point.node.childNodes[point.offset];
            offset = 0;
        } else {
            node = point.node;
            offset = isSkipInnerOffset ? this.nodeLength(point.node) : point.offset + 1;
        }

        return {
            node: node,
            offset: offset,
        };
    }
    $.extend($.summernote.dom, {
        walkPoint,
        nextPointWithEmptyNode,
    })
}));
