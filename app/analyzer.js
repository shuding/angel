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
        // Return sorted classList
        ret[1] = element.getAttribute('class').split(' ').sort();
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
    var a_    = elementAnalyzer(a);
    var b_    = elementAnalyzer(b);

    if (a_[1] && b_[1]) {
        for (var i = 0, j = 0; i < a_[1].length && j < b_[1].length;) {
            while (a_[1][i] < b_[1][j] && i < a_[1].length) {
                ++i;
            }
            if (i == a_[1].length) {
                break;
            }
            while (a_[1][i] > b_[1][j] && j < b_[1].length) {
                ++j;
            }
            if (j == b_[1].length) {
                break;
            }
            if (a_[1][i] == b_[1][j]) {
                ++i;
                ++j;
                score *= 1.1;
            }
        }
    }

    if (a_[0] && b_[0]) {
        var cnt = 0;
        for (i = 0; i < a_[0].length && i < b_[0].length; ++i) {
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
