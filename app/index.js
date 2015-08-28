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
