/**
 * Created by shuding on 8/27/15.
 * <ds303077135@gmail.com>
 */
var expect = require('chai').expect;

var EventCenter = require('../app/event');

describe('event.js', function () {
    var eventCenter;
    var virtualDom;
    var eventListenerNumber;
    var eventRecord;
    var events;

    before(function () {
        eventCenter         = new EventCenter();
        eventListenerNumber = 0;
        eventRecord         = 0;
        events              = [];
        virtualDom          = {
            addEventListener:    function (eventName, event, element) {
                events.push(event);
                eventListenerNumber++;
            },
            removeEventListener: function (eventName, event, element) {
                var index = events.indexOf(event);
                if (index !== -1) {
                    events.splice(index, 1);
                }
                eventListenerNumber--;
            }
        };
        // Rewrites eventWatcher
        eventCenter.eventWatcher = function (eventName, event, element) {
            eventRecord++;
        };
    });

    describe('#attach', function () {
        it('should push sampleEvent and virtualDom into eventCenter', function () {
            expect(eventListenerNumber).to.equal(0);
            eventCenter.attach(virtualDom, 'sampleEvent');
            expect(eventCenter.events).to.deep.equal({sampleEvent: [virtualDom]});
            expect(eventListenerNumber).to.equal(1);
        });
        it('should push sampleEvent2 and virtualDom into eventCenter', function () {
            eventCenter.attach(virtualDom, 'sampleEvent2');
            expect(eventCenter.events).to.deep.equal({
                sampleEvent:  [virtualDom],
                sampleEvent2: [virtualDom]
            });
            expect(eventListenerNumber).to.equal(2);
        });
    });

    describe('#detach', function () {
        it('should remove sampleEvent and virtualDom from eventCenter', function () {
            eventCenter.detach(virtualDom, 'sampleEvent');
            expect(eventCenter.events).to.deep.equal({
                sampleEvent:  [],
                sampleEvent2: [virtualDom]
            });
            expect(eventListenerNumber).to.equal(1);
        });
        it('should ignore non-exist events', function () {
            eventCenter.detach(virtualDom, 'sampleEvent3');
            expect(eventCenter.events).to.deep.equal({
                sampleEvent:  [],
                sampleEvent2: [virtualDom],
                sampleEvent3: []
            });
            expect(eventListenerNumber).to.equal(1);
        });
    });

    describe('#eventWatcher', function () {
        it('should record all event activates', function () {
            expect(eventRecord).to.equal(0);
            events[0]();
            expect(eventRecord).to.equal(1);
            events[0]();
            events[0]();
            expect(eventRecord).to.equal(3);
            expect(events[1]).to.not.exist;
        });
    });
});
