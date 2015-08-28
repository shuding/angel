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
    var ret = [];
    if (element.hasAttribute && element.hasAttribute('id')) {
        ret[0] = element.getAttribute('id');
    }
    if (element.hasAttribute && element.hasAttribute('class')) {
        ret[1] = element.getAttribute('class').split(' ');
    }
    return ret;
}

function eventAnalyzer(event) {
    var path   = [];
    var target = event.target;

    path.push(target);
    while (target.parentNode) {
        target = target.parentNode;
        path.push(target);
    }
    return path;
}

function similarityAnalyzer(a, b) {
    if (a.nodeName !== b.nodeName) {
        return 0;
    }
    var score = 1;
    var a_ = elementAnalyzer(a);
    var b_ = elementAnalyzer(b);
    /* TODO: similarity of class names
    if (a_[1] != b_[1]) {
        score *= .5;
    }
    */
    if (a_[0] && b_[0]) {
        var cnt = 0;
        for (var i = 0; i < a_[0].length && i < b_[0].length; ++i) {
            if (a_[i] == b_[i]) {
                cnt++;
            } else {
                break;
            }
        }
        score *= Math.pow(4, .5 * cnt * (1 / a_[0].length + 1 / b_[0].length));
    } else if (a_[0] || b_[0]) {
        score *= .8;
    }
    return score;
}
