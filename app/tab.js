/**
 * Created by shuding on 9/1/15.
 * <ds303077135@gmail.com>
 */
'use strict';

module.exports = Tab;

function Tab () {
    this.window = null;
}

Tab.prototype.init = function () {
    this.window = window.open('', 'tab');
    this.clear();
};

Tab.prototype.clear = function () {
    this.window.document.body.innerHTML = '';
};

Tab.prototype.inject = function (element) {
    this.window.document.body.innerHTML += element.outerHTML;
};
