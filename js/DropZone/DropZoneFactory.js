let DropZoneValidationUtils = require('./DropZoneValidationUtils');
let DropZoneErrors = require('./DropZoneErrors');
let DropZoneValidatorDisatcher = require('./DropZoneValidatorDispatcher');
let DropZoneEventManager = require('./DropZoneEventManager');
let DropZoneIdleTimer = require('./DropZoneIdleTimer');
let DropZoneFileManager = require('./DropZoneFileManager');
let DropZoneFileUtils = require('./DropZoneFileUtils');
let DropZoneCallbackManager = require('./DropZoneCallbackManager');
let DropZone = require('./DropZone');

class DropZoneFactory {
    /**
     * Create an instance of a DropZone with it's options and dependencies
     * @param {Element} node
     * @param {Object} options
     * @param {Object} errorOptions
     * @returns {DropZone}
     */
    static create (node, options, errorOptions) {
        return new DropZone(
            node,
            options,
            new DropZoneValidatorDisatcher(
                new DropZoneValidationUtils(),
                new DropZoneErrors(errorOptions.validationText),
                errorOptions.whitelist,
                errorOptions.maxFiles,
                errorOptions.maxSize
            ),
            new DropZoneEventManager(),
            new DropZoneIdleTimer(options.idleTimerDuration),
            new DropZoneFileManager(new DropZoneFileUtils()),
            new DropZoneCallbackManager()
        );
    }
}

module.exports = DropZoneFactory;
