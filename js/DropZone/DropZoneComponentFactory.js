let DropZoneComponent = require('./DropZoneComponent');
let DropZoneInstanceManager = require('./DropZoneInstanceManager');
let DropZoneFactory = require('./DropZoneFactory');
let DropZoneOptionsManager = require('./DropZoneOptionsManager');
let DropZoneComponentUtils = require('./DropZoneComponentUtils');
let DropZoneComponentValidationManager = require('./DropZoneComponentValidationManager');
let DropZoneBodyClassManager = require('./DropZoneBodyClassManager');
let MimeTyper = require('../libs/MimeTyper');
let DropZoneBrowseNodeFactory = require('./DropZoneBrowseNodeFactory');

class DropZoneComponentFactory {
    /**
     * Create an instance of the DropZoneComponent with it's dependencies
     * @param {Element} html
     * @param {String} selector
     * @returns {DropZoneComponent}
     */
    static create (html, selector) {
        const mimeTyper = new MimeTyper(),
            utilsManager = new DropZoneComponentUtils(mimeTyper);

        return new DropZoneComponent(
            html,
            selector,
            new DropZoneInstanceManager(html, DropZoneFactory, DropZoneBrowseNodeFactory),
            new DropZoneOptionsManager(utilsManager),
            utilsManager,
            new DropZoneComponentValidationManager(),
            new DropZoneBodyClassManager()
        );
    }
}

module.exports = DropZoneComponentFactory;
