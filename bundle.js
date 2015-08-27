(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by shuding on 8/27/15.
 * <ds303077135@gmail.com>
 */
'use strict';

module.exports = {
    elementAnalyzer: elementAnalyzer,
    eventAnalyzer:   eventAnalyzer
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

    this.logs = [];
    this.eventCenter = new EventCenter();

    // Rewrite eventWatcher
    this.eventCenter.eventWatcher = function (eventName, event, element) {
        self.logs.push({
            time: event.timeStamp,
            path: clickAnalyzer.eventAnalyzer(event)
        });
    };

    return this;
}

Angel.prototype.init = function (window) {
    this.window   = window;
    this.document = window.document;
    this.body     = window.document.body;

    this.eventCenter.attach(window, 'click');
    return this;
};

},{"./click-analyzer":1,"./event":2}],4:[function(require,module,exports){
/**
 * Created by shuding on 8/27/15.
 * <ds303077135@gmail.com>
 */

var Angel = require('./app');
window.angel = new Angel().init(window);

},{"./app":3}]},{},[4]);
