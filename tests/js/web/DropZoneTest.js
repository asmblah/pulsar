"use strict";

import DropZone, { defaults } from '../../../js/libs/DropZone';
import { assert } from 'chai';
import $ from 'jquery';
import _ from 'lodash';

describe('DropZone', () => {
    describe('constructor()', () => {
        const dropZone = new DropZone({
            node: document.body,
            maxFiles: '5',
            maxSize: '123456'
        });

        it('should initialise with options', () => {
            expect(dropZone.options).to.include.keys('node', 'maxFiles', 'maxSize');
        });

        it('should convert a jQuery node to a HTMLElement', () => {
            expect(dropZone.node).to.be.an.instanceof(Element);
        });

        it('should ensure maxFiles is converted to an integer', () => {
            expect(dropZone.options.maxFiles).to.be.a('number');
        });

        it('should ensure maxSize is converted to an integer', () => {
            expect(dropZone.options.maxSize).to.be.a('number');
        });

        it('should call setup', () => {
            const setup = sinon.spy(DropZone.prototype, 'setup');
            const stubbedDropZone = new DropZone({ node: document.body });

            expect(setup).to.have.been.calledOnce;
            setup.restore();
        });
    });

    describe('setup()', () => {
        const dropZone = new DropZone({ node: document.body });
        const freshPool = dropZone.eventPool;
        const freshTracker = dropZone.eventTracker;

        it('should create/reset the empty event pool', () => {
            dropZone.reset();
            dropZone.addEventAndStore(dropZone.node, 'drag', {});
            expect(dropZone.eventPool.length).to.equal(freshPool.length + 1);
            dropZone.setup();
            expect(dropZone.eventPool.length).to.equal(freshPool.length);
        });

        it('should create/reset an empty file array', () => {
            dropZone.reset();
            dropZone.files.push('foo');
            expect(dropZone.files).to.have.lengthOf(1);
            dropZone.setup();
            expect(dropZone.files).to.have.lengthOf(0);
        });

        it('should create/reset an empty event tracker object', () => {
            dropZone.reset();
            dropZone.trackEvents('foo');
            dropZone.node.dispatchEvent(new Event('foo'));
            expect(dropZone.eventTracker.node.foo).to.equal(1);
            dropZone.setup();
            expect(dropZone.eventTracker).to.deep.equal(freshTracker);
        });

        it('should create/reset the size count', () => {
            dropZone.reset();
            dropZone.size = 1000;
            dropZone.setup();
            expect(dropZone.size).to.equal(0);
        });

        it('should create/reset window active state', () => {
            dropZone.reset();
            dropZone.windowActive = true;
            dropZone.setup();
            expect(dropZone.windowActive).to.be.false;
        });

        it('should create/reset DropZone active state', () => {
            dropZone.reset();
            dropZone.dropZoneActive = true;
            dropZone.setup();
            expect(dropZone.dropZoneActive).to.be.false;
        });

        it('should call trackEvents', () => {
            const trackEvents = sinon.spy(DropZone.prototype, 'trackEvents');
            const stubbedDropZone = new DropZone({ node: document.body });

            expect(trackEvents).to.have.been.calledOnce;
            trackEvents.restore();
        });

        it('should call attachMultipleListeners', () => {
            const attachMultipleListeners = sinon.spy(DropZone.prototype, 'attachMultipleListeners');
            const stubbedDropZone = new DropZone({ node: document.body });

            expect(attachMultipleListeners).to.have.been.calledOnce;
            attachMultipleListeners.restore();
        });

        it('should call registerEvents', () => {
            const registerEvents = sinon.spy(DropZone.prototype, 'registerEvents');
            const stubbedDropZone = new DropZone({ node: document.body });

            expect(registerEvents).to.have.been.calledOnce;
            registerEvents.restore();
        });
    });

    describe('registerEvents()', () => {
        it('should add drop event to DropZone node', () => {
            const handleDrop = sinon.spy(DropZone.prototype, 'handleDrop');
            const drop = new Event('drop');
            const stubbedDropZone = new DropZone({ node: document.body });

            drop['dataTransfer'] = { files: [{ size: 10, name: 'foo', type: 'foo' }] };
            stubbedDropZone.windowActive = true;
            stubbedDropZone.dropZoneActive = true;
            window.dispatchEvent(drop);
            expect(handleDrop).to.have.been.calledOnce;
            handleDrop.restore();
        });

        it('should add dragenter event to DropZone node', () => {
            const handleEnter = sinon.spy(DropZone.prototype, 'handleEnter');
            const dragenter = new Event('dragenter');
            const stubbedDropZone = new DropZone({ node: document.body });

            stubbedDropZone.node.dispatchEvent(dragenter);
            expect(handleEnter).to.have.been.calledOnce;
            handleEnter.restore();
        });

        it('should add dragleave event to DropZone node', () => {
            const handleLeave = sinon.spy(DropZone.prototype, 'handleLeave');
            const dragleave = new Event('dragleave');
            const stubbedDropZone = new DropZone({ node: document.body });

            stubbedDropZone.node.dispatchEvent(dragleave);
            expect(handleLeave).to.have.been.calledOnce;
            handleLeave.restore();
        });

        it('should add dragenter event to window', () => {
            const handleWindowEnter = sinon.spy(DropZone.prototype, 'handleWindowEnter');
            const dragenter = new Event('dragenter');
            const stubbedDropZone = new DropZone({ node: document.body });

            window.dispatchEvent(dragenter);
            expect(handleWindowEnter).to.have.been.calledOnce;
            handleWindowEnter.restore();
        });

        it('should add dragleave event to window', () => {
            const handleWindowLeave = sinon.spy(DropZone.prototype, 'handleWindowLeave');
            const dragleave = new Event('dragleave');
            const stubbedDropZone = new DropZone({ node: document.body });

            window.dispatchEvent(dragleave);
            expect(handleWindowLeave).to.have.been.calledOnce;
            handleWindowLeave.restore();
        });
    });

    describe('trackEvents()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should track dragenter and dragleave events on the window and DropZone node', () => {
            const actual = dropZone.eventTracker;
            const expected = {
                node: { dragenter: 1, dragleave: 2 },
                window: { dragenter: 2, dragleave: 1 }
            };

            window.dispatchEvent(new Event('dragenter'));
            window.dispatchEvent(new Event('dragenter'));
            window.dispatchEvent(new Event('dragleave'));
            dropZone.node.dispatchEvent(new Event('dragenter'));
            dropZone.node.dispatchEvent(new Event('dragleave'));
            dropZone.node.dispatchEvent(new Event('dragleave'));
            expect(actual).to.deep.equal(actual);
        });
    });

    describe('updateEventTracker()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should update an event count in the event tracker', () => {
            dropZone.reset();
            dropZone.updateEventTracker('node', 'dragenter');
            expect(dropZone.eventTracker.node.dragenter).to.equal(1);
        });
    });

    describe('handleDrop()', () => {
        const dropZone = new DropZone({ node: document.body });
        const event = { dataTransfer: { files: [{ size: 10, name: 'foo', type: 'foo' }] } };

        it('should reset active states to false', () => {
            dropZone.windowActive = true;
            dropZone.dropZoneActive = true;
            dropZone.handleDrop(event);
            expect(dropZone.windowActive).to.be.false;
            expect(dropZone.dropZoneActive).to.be.false;
        });

        it('should add valid files to the files array', () => {
            dropZone.reset();
            dropZone.windowActive = true;
            dropZone.dropZoneActive = true;
            dropZone.handleDrop(event);
            expect(dropZone.files).to.have.lengthOf(1);
        });

        it('should call dropped callback if file is accepted', () => {
            dropZone.reset();
            dropZone.windowActive = true;
            dropZone.dropZoneActive = true;
            dropZone.options.dropZoneDrop = sinon.spy();
            dropZone.handleDrop(event);
            expect(dropZone.options.dropZoneDrop).to.have.been.calledOnce;
        });

        it('should call window dropped callback', () => {
            dropZone.reset();
            dropZone.windowActive = true;
            dropZone.dropZoneActive = false;
            dropZone.options.windowDrop = sinon.spy();
            dropZone.handleDrop(event);
            expect(dropZone.options.windowDrop).to.have.been.calledOnce;
        });
    });

     describe('fileOnWindow()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should return true if we have more dragenter calls on the window than dragleaves', () => {
            const dragenter = new Event('dragenter');

            dropZone.reset();
            window.dispatchEvent(dragenter);
            expect(dropZone.fileOnWindow()).to.be.true;
        });

        it('should return false if we have more dragleave calls on the window than dragenters', () => {
            const dragleave = new Event('dragleave');

            dropZone.reset();
            window.dispatchEvent(dragleave);
            expect(dropZone.fileOnWindow()).to.be.false;
        });
    });

    describe('fileOnDropZone()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should return true if we have more dragenter calls on the DropZone than dragleaves', () => {
            const dragenter = new Event('dragenter');

            dropZone.reset();
            dropZone.node.dispatchEvent(dragenter);
            expect(dropZone.fileOnDropZone()).to.be.true;
        });

        it('should return false if we have more dragleave calls on the DropZone than dragenters', () => {
            const dragleave = new Event('dragleave');

            dropZone.reset();
            dropZone.node.dispatchEvent(dragleave);
            expect(dropZone.fileOnDropZone()).to.be.false;
        });
    });

    describe('handleWindowEnter()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should call window enter callback if file has entered window', () => {
            const dragenter = new Event('dragenter');

            dropZone.reset();
            dropZone.options.windowEnter = sinon.spy();
            window.dispatchEvent(dragenter);
            expect(dropZone.options.windowEnter).to.have.been.calledOnce;
        });
    });

    describe('handleWindowLeave()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should call window enter callback if file has entered window', () => {
            const dragleave = new Event('dragleave');
            const dragenter = new Event('dragenter');

            dropZone.reset();
            dropZone.options.windowLeave = sinon.spy();
            window.dispatchEvent(dragenter);
            window.dispatchEvent(dragleave);
            expect(dropZone.options.windowLeave).to.have.been.calledOnce;
        });
    });

    describe('handleEnter()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should call DropZone enter callback if file has entered DropZone', () => {
            const dragenter = new Event('dragenter');

            dropZone.reset();
            dropZone.options.dropZoneEnter = sinon.spy();
            dropZone.node.dispatchEvent(dragenter);
            expect(dropZone.options.dropZoneEnter).to.have.been.calledOnce;
        });
    });

    describe('handleLeave()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should call DropZone leave callback if file has left DropZone', () => {
            const dragenter = new Event('dragenter');
            const dragleave = new Event('dragleave');

            dropZone.reset();
            dropZone.options.dropZoneLeave = sinon.spy();
            dropZone.node.dispatchEvent(dragenter);
            dropZone.node.dispatchEvent(dragleave);
            expect(dropZone.options.dropZoneLeave).to.have.been.calledOnce;
        });
    });

    describe('canAcceptFiles()', () => {
        const event = { dataTransfer: { files: [{ size: 10, name: 'foo', type: 'foo' }] } };

        it('should reject files if maxFiles will be exceeded', () => {
            const dropZone = new DropZone({ node: document.body, maxFiles: 0 });
            const actual = dropZone.canAcceptFiles(event.dataTransfer.files);

            expect(actual).to.be.false;
        });

        it('should reject files if maxSize will be exceeded', () => {
            const dropZone = new DropZone({ node: document.body, maxSize: 0 });
            const actual = dropZone.canAcceptFiles(event.dataTransfer.files);

            expect(actual).to.be.false;
        });

        it('should call rejectFiles() if files are rejected', () => {
            const dropZone = new DropZone({ node: document.body, maxFiles: 0 });

            dropZone.rejectFiles = sinon.spy();
            dropZone.canAcceptFiles(event.dataTransfer.files);
            expect(dropZone.rejectFiles).to.have.been.calledOnce;
        });
    });

    describe('processFile()', () => {
        const dropZone = new DropZone({ node: document.body });
        const file = { size: 10, name: 'foo', type: 'text' };

        it('should return a file object once processed', () => {
            const actual = dropZone.processFile(file);

            expect(actual).to.include.keys('file', 'id', 'name', 'type', 'size');
        });

        it('should affect the total file size count', () => {
            dropZone.reset();

            const actual = dropZone.processFile(file);

            expect(dropZone.size).to.equal(10);
        });
    });

    describe('rejectFiles()', () => {
        const dropZone = new DropZone({ node: document.body });
        const event = { dataTransfer: { files: [{ size: 10, name: 'foo', type: 'foo' }] } };

        it('should call rejected callback if files are rejected', () => {
            dropZone.options.filesRejected = sinon.spy();
            dropZone.rejectFiles(0);
            expect(dropZone.options.filesRejected).to.have.been.calledOnce;
        });
    });

    describe('getFiles()', () => {
        const dropZone = new DropZone({ node: document.body });
        const event = { dataTransfer: { files: [{ size: 10, name: 'foo', type: 'foo' }] } };

        it('should return files in the files array', () => {
            dropZone.reset();
            dropZone.windowActive = true;
            dropZone.dropZoneActive = true;
            dropZone.handleDrop(event);
            expect(dropZone.getFiles()).to.have.lengthOf(1);
        });
    });

    describe('removeFile()', () => {
        const dropZone = new DropZone({ node: document.body });
        const event = { dataTransfer: {
            files: [
                { size: 10, name: 'foo', type: 'foo' },
                { size: 10, name: 'bar', type: 'foo' }
            ]}};

        it('should remove the correct file from the files array', () => {
            dropZone.reset();
            dropZone.windowActive = true;
            dropZone.dropZoneActive = true;
            dropZone.handleDrop(event);

            const [a, b] = dropZone.getFiles();

            dropZone.removeFile(b.id);
            expect(dropZone.getFiles()).to.have.lengthOf(1);
            expect(dropZone.getFiles()[0].id).to.equal(a.id);
        });

        it('should affect the total file size count', () => {
            dropZone.reset();
            dropZone.windowActive = true;
            dropZone.dropZoneActive = true;
            dropZone.handleDrop(event);

            const [a, b] = dropZone.getFiles();

            dropZone.removeFile(a.id);
            expect(dropZone.size).to.equal(10);
        });
    });

    describe('createCallback()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should create a callback', () => {
            const spy = sinon.spy();

            dropZone.createCallback(spy);
            expect(spy).to.have.been.calledOnce;
        });

        it('should create a callback with data', () => {
            const spy = sinon.spy();

            dropZone.createCallback(spy, 'foo');
            expect(spy).to.have.been.calledWith('foo');
        });

        it('should handle an undefined value', () => {
            expect(dropZone.createCallback()).to.be.okay;
        });
    });

    describe('attachMultipleListeners()', () => {
        const dropZone = new DropZone({
            node: document.body
        });

        it('should attach multiple event listeners to the DropZone node', () => {
            let test1 = false;
            let test2 = false;
            const handler = () => {
                test2 = test1;
                test1 = true;
            };

            dropZone.attachMultipleListeners('click mousemove', handler);
            window.dispatchEvent(new Event('click'));
            expect(test1).to.be.true;
            window.dispatchEvent(new Event('mousemove'));
            expect(test2).to.be.true;
        });
    });

    describe('addEventToPool()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should add an event to the event pool', () => {
            const expected = [{
                node: 'foo',
                event: 'bar',
                handler: 'gravy'
            }];

            dropZone.removeAllEvents();
            dropZone.addEventToPool('foo', 'bar', 'gravy');
            expect(dropZone.eventPool).to.deep.equal(expected);
        });
    });

    describe('addEventAndStore()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should add an event to a node', () => {
            const handler = () => flag = true;
            let flag = false;

            dropZone.addEventAndStore(dropZone.node, 'click', handler);
            dropZone.node.dispatchEvent(new Event('click'));
            dropZone.removeAllEvents();
            expect(flag).to.be.true;
        });

        it('should store an event in the event pool', () => {
            const handler = event => event;
            const expected = [{
                node: dropZone.node,
                event: 'click',
                handler
            }];

            dropZone.addEventAndStore(dropZone.node, 'click', handler);
            expect(dropZone.eventPool).to.deep.equal(expected);
        });
    });

    describe('removeAllEvents()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should remove all events from event pool', () => {
            dropZone.addEventAndStore(dropZone.node, 'click', {});
            dropZone.removeAllEvents();
            expect(dropZone.eventPool).to.be.empty;
        });

        it('should remove all events in the pool from the related node', () => {
            let flag1 = false;
            let flag2 = false;
            const handler = () => {
                flag2 = flag1;
                flag1 = true;
            };

            dropZone.addEventAndStore(dropZone.node, 'click', handler);
            dropZone.addEventAndStore(window, 'keydown', handler);
            dropZone.removeAllEvents();
            dropZone.node.dispatchEvent(new Event('click'));
            window.dispatchEvent(new Event('keydown'));
            expect(flag1).to.be.false;
            expect(flag2).to.be.false;
        });
    });

    describe('preventer()', () => {
        const dropZone = new DropZone({ node: document.body });

        it('should prevent default behaviour of an event', () => {
            const click = $.Event('click');

            $(dropZone.node).on('click', dropZone.preventer);
            $(dropZone.node).trigger(click);
            expect(click.isDefaultPrevented()).to.be.true;
        });
    });

    describe('reset()', () => {
        it('should call removeAllEvents()', () => {
            const removeAllEvents = sinon.spy(DropZone.prototype, 'removeAllEvents');
            const stubbedDropZone = new DropZone({ node: document.body });

            stubbedDropZone.reset();
            expect(removeAllEvents).to.have.been.calledOnce;
            removeAllEvents.restore();
        });

        it('should call setup()', () => {
            const setup = sinon.spy(DropZone.prototype, 'setup');
            const stubbedDropZone = new DropZone({ node: document.body });

            stubbedDropZone.reset();
            // twice here becuase it is clled in the constructor
            expect(setup).to.have.been.calledTwice;
            setup.restore();
        });
    });

    describe('getFileName()', () => {
        it('should return the file name', () => {
            const actual = DropZone.getFileName({ name: 'file.txt' });
            const expected = 'file.txt';

            expect(actual).to.equal(expected);
        });

        it('should remove unix file path', () => {
            const actual = DropZone.getFileName({ name: './mikes/files/file.txt' });
            const expected = 'file.txt';

            expect(actual).to.equal(expected);
        });

        it('should remove windows file path', () => {
            const actual = DropZone.getFileName({ name: '..\\mikes\\files\\file.txt' });
            const expected = 'file.txt';

            expect(actual).to.equal(expected);
        });
    });

    describe('getFileType()', () => {
        it('should return the file type', () => {
            const file = { type: 'foo' };
            const actual = DropZone.getFileType(file);
            const expected = 'foo';

            expect(actual).to.equal(expected);
        });
    });

    describe('getFileSize()', () => {
        it('should return the file size', () => {
            const actual = DropZone.getFileSize({ size: 1000 });
            const expected = '1 KB';

            expect(actual).to.equal(expected);
        });
    });

    describe('getFileThumbnail', () => {
        it('should return a url string for an image file', () => {
            const file = { type: 'image/gif' };
            const spy = sinon.spy(URL, 'createObjectURL');

            DropZone.getFileThumbnail(file);
            expect(spy).to.have.been.calledOnce;
            spy.restore();
        });

        it('should return false for a non image file', () => {
            const file = { type: 'application/foo' };

            expect(DropZone.getFileThumbnail(file)).to.be.false;
        });
    });

    describe('createOptions()', () => {
        const defaults = { foo: 'foo',  bar: 'bar' };
        const options = { foo: 'bar' };
        const expected = { foo: 'bar', bar: 'bar' };

        it('should merge defaults with options', () => {
            const actual = DropZone.createOptions(defaults, options);

            expect(actual).to.deep.equal(expected);
        });
    });

    describe('formatBytes()', () => {
        it('should return 0 Byte for 0 bytes', () => {
            expect(DropZone.formatBytes(0)).to.equal('0 Byte');
        });

        it('should return Bytes', () => {
            expect(DropZone.formatBytes(25)).to.equal('25 Bytes');
        });

        it('should return KB', () => {
            expect(DropZone.formatBytes(1000)).to.equal('1 KB');
        });

        it('should return MB', () => {
            expect(DropZone.formatBytes(1e+6)).to.equal('1 MB');
        });

        it('should return GB', () => {
            expect(DropZone.formatBytes(1e+9)).to.equal('1 GB');
        });

        it('should return 1 decimal place by default', () => {
            expect(DropZone.formatBytes(1500)).to.equal('1.5 KB');
        });

        it('should accept a decimal argument', () => {
            expect(DropZone.formatBytes(1555, 3)).to.equal('1.555 KB');
        });
    });
});