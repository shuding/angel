(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';

module.exports = EventCenter;

function EventCenter() {
    this.events         = {};
    this.eventListeners = {};
    return this;
}

/**
 * Bind with specific element
 * @param element
 * @param eventName
 */
EventCenter.prototype.attach = function (element, eventName) {
    var self = this;

    if (typeof this.events[eventName] === 'undefined') {
        this.events[eventName] = [];
        this.eventListeners[eventName] = [];
    }

    var index = this.events[eventName].indexOf(element);
    if (index === -1) {
        var eventListener = function (event) {
            self.eventWatcher(eventName, event, element);
        };
        element.addEventListener(eventName, eventListener, false);
        this.events[eventName].push(element);
        this.eventListeners[eventName].push(eventListener);
    }
    return this;
};

/**
 * Remove binding of specific element
 * @param element
 * @param eventName
 */
EventCenter.prototype.detach = function (element, eventName) {
    if (typeof this.events[eventName] === 'undefined') {
        this.events[eventName] = [];
        this.eventListeners[eventName] = [];
    }

    var index = this.events[eventName].indexOf(element);
    if (index !== -1) {
        element.removeEventListener(eventName, this.eventListeners[eventName][index], false);
        this.events[eventName].splice(index, 1);
        this.eventListeners[eventName].splice(index, 1);
    }
    return this;
};

/**
 * Fetch all events deal with
 * @param eventName
 * @param event
 * @param element
 */
EventCenter.prototype.eventWatcher = function (eventName, event, element) {
    return this;
};

},{}],3:[function(require,module,exports){
/**
 * Created by shuding on 8/27/15.
 * <ds303077135@gmail.com>
 */
'use strict';

var EventCenter   = require('./event');
var clickAnalyzer = require('./click-analyzer');

module.exports = Angel;

function Angel() {
    var self = this;

    this.actions         = [];
    this.hoverElement    = null;
    this.elementPath     = [];
    this.eventCenter     = new EventCenter();
    this.similarElements = [];

    // Rewrite eventWatcher
    this.eventCenter.eventWatcher = function (eventName, event, element) {
        var path   = clickAnalyzer.eventAnalyzer(event);
        var target = path[0];
        if (['click'].indexOf(eventName) !== -1) {
            self.actions.push({
                time: event.timeStamp,
                path: path
            });
        }
        if (['mousemove'].indexOf(eventName) !== -1) {
            if (target != self.hoverElement) {
                self.hoverElement = target;
                self.elementPath  = path;
                self.findSimilarElements(path);
            }
        }
    };

    return this;
}

Angel.prototype.init = function (window) {
    this.window   = window;
    this.document = window.document;
    this.body     = window.document.body;

    this.eventCenter.attach(window, 'mousemove');
    this.eventCenter.attach(window, 'click');

    var style = this.document.createElement('style');
    style.appendChild(this.document.createTextNode(''));
    this.document.head.appendChild(style);

    style.sheet.insertRule('.angel-similar-elements { background: #6ff; outline: 1px solid #6ff }', 0);

    return this;
};

Angel.prototype.findRecursion = function (deepth, currentElement, similarity) {
    if (deepth == 0) {
        this.similarElements.push([currentElement, similarity]);
        return;
    }
    for (var i = 0; i < currentElement.childNodes.length; ++i) {
        var iterSimilarity;
        iterSimilarity = similarity * clickAnalyzer.similarityAnalyzer(this.elementPath[deepth - 1], currentElement.childNodes[i]);
        if (iterSimilarity >= 1) {
            this.findRecursion(deepth - 1, currentElement.childNodes[i], iterSimilarity);
        }
    }
};

Angel.prototype.findSimilarElements = function (path) {
    this.similarElements.forEach(function (element) {
        element[0].className = (' ' + (element[0].className || '') + ' ').replace(' angel-similar-elements ', ' ');
    });
    this.similarElements = [];
    this.findRecursion(path.length - 1, path[path.length - 1], 1);
    this.similarElements.forEach(function (element) {
        element[0].className += ' angel-similar-elements';
    });
};

},{"./click-analyzer":1,"./event":2}],4:[function(require,module,exports){
/**
 * Created by shuding on 8/27/15.
 * <ds303077135@gmail.com>
 */

var Angel = require('./app');
window.angel = new Angel().init(window);

},{"./app":3}]},{},[4]);
