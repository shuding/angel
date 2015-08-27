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
