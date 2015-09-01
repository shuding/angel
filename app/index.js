/**
 * Created by shuding on 8/27/15.
 * <ds303077135@gmail.com>
 */
'use strict';

var EventCenter = require('./event');
var Analyzer    = require('./analyzer');
var Tab         = require('./tab');

module.exports = Angel;

function Angel() {
    this.actions         = [];
    this.hoverElement    = null;
    this.elementPath     = [];
    this.eventCenter     = new EventCenter();
    this.tab             = new Tab();
    this.similarElements = [];

    return this;
}

Angel.prototype.init = function (window) {
    var self = this;

    this.window   = window;
    this.document = window.document;
    this.body     = window.document.body;

    this.tab.init();

    this.eventCenter.attach(window, 'mousemove');
    this.eventCenter.attach(window, 'click');

    // Rewrite eventWatcher
    this.eventCenter.eventWatcher = function (eventName, event, element) {
        var path   = Analyzer.eventAnalyzer(event);
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

    // Add custom stylesheet
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
        iterSimilarity = similarity * Analyzer.similarityAnalyzer(this.elementPath[deepth - 1], currentElement.childNodes[i]);
        if (iterSimilarity >= 1) {
            this.findRecursion(deepth - 1, currentElement.childNodes[i], iterSimilarity);
        }
    }
};

Angel.prototype.findSimilarElements = function (path) {
    var self = this;

    this.similarElements.forEach(function (element) {
        element[0].className = (' ' + (element[0].className || '') + ' ').replace(' angel-similar-elements ', ' ').trim();
    });
    this.similarElements = [];
    this.tab.clear();
    this.findRecursion(path.length - 1, path[path.length - 1], 1);
    var similarityAvg    = 0;
    this.similarElements.forEach(function (element) {
        similarityAvg += element[1];
    });
    similarityAvg /= (this.similarElements.length || 1);
    this.similarElements.forEach(function (element) {
        if (element[1] >= similarityAvg) {
            element[0].className += ' angel-similar-elements';
            self.tab.inject(element[0]);
        }
    });
};
