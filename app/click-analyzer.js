/**
 * Created by shuding on 8/27/15.
 * <ds303077135@gmail.com>
 */
'use strict';

module.exports = {
    elementAnalyzer:    elementAnalyzer,
    eventAnalyzer:      eventAnalyzer,
    similarityAnalyzer: similarityAnalyzer
};

function elementAnalyzer(element) {
    var ret = element.nodeName;
    if (element.hasAttribute && element.hasAttribute('id')) {
        ret += '#' + element.getAttribute('id');
    }
    if (element.hasAttribute && element.hasAttribute('class')) {
        ret += '.' + element.getAttribute('class');
    }
    return ret;
}

function eventAnalyzer(event) {
    var path   = [];
    var target = event.target;

    path.push(elementAnalyzer(target));
    while (target.parentNode) {
        target = target.parentNode;
        path.push(elementAnalyzer(target));
    }
    return path;
}

function similarityAnalyzer(a, b) {
    // TODO
}