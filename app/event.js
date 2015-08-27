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
