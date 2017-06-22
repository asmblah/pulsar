import DropZone, { defaults } from './DropZone';
import _ from 'lodash';

const validationText = {
    whitelist: 'Unsupported file type',
    maxFiles: 'Maximum number files exceeded',
    maxSize: 'Maximum file size exceeded',
    unknown: 'That file type is not recognized'
};

export default class DropZoneValidator {
    constructor (options) {
        // extending options.validationText (derived from html) and validationText defaults - as well as defaults and options from DropZone
        // todo - this feels overly complicated, a possible solution is to pass the maxFiles, maxSize(etc) in as options, however we still need the default values to map to the DropZone defaults
        this.options = _.extend({}, defaults, options, { validationText: _.extend({}, validationText, options.validationText) });
    }

    /**
     * Validate files against validation options
     * @param {Array} files
     * @param {Number} totalFiles
     * @param {Number} totalSize
     * @returns {Object} error
     */
    validate (files, totalFiles, totalSize) {
        let result = { valid: true, text: '' };
        let fileCount = totalFiles;
        let sizeCount = totalSize;

        // if we have files but we do not have a length we're dealing
        // with a browser with limited support, so we'll return them as valid
        // now and let them be caught later
        if (!files.length) {
            return result;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileObject = file.getAsFile ? file.getAsFile() : file;

            fileCount++;

            // 1. reject items that do not have a type
            if (result.valid && file.type === '') {
                result = this.throwError('UNKNOWN');
            }

            // 2. whitelist
            //   - check we have a whitelist
            //   - ensure our file is on the whitelist
            //   - skip files that have a mock property
            if (result.valid && this.options.whitelist && this.options.whitelist.length && !file.mock && !this.validateType(file.type)) {
                result = this.throwError('WHITELIST', file.type);
            }

            // 3. max files
            //   - ensure we haven't exceeded our max files
            if (result.valid && !this.validateCount(fileCount)) {
                result = this.throwError('MAX_FILES');
            }

            // 4. max size
            //   - ensure we haven't exceeded our maximum size, if we can get size
            //
            // check to see if we can get a file, if we can't we know we cannot
            // determine the size, so we'll pass this and handle it when we can get
            // the size
            if (result.valid && fileObject && !file.mock) {
                sizeCount += fileObject.size;

                if (!this.validateSize(sizeCount)) {
                    result = this.throwError('MAX_SIZE');
                }
            }
        }

        return result;
    }

    /**
     * Validate file mime type
     * @param {String} type
     * @returns {Boolean}
     */
    validateType (type) {
        let valid = false;

        this.options.whitelist.forEach(mime => {
            if (mime.search('/')) {
                if (mime === type) {
                    // if the user has specified a full mime e.g. 'image/png'
                    // we will check that against the type
                    valid = true;
                } else if (mime.indexOf('*')) {
                    // if the user has specified a wildcard mime e.g. 'image/*'
                    // we will create a wildcard expression and test against it
                    const re = new RegExp(mime.replace('*', '[\W\w]*'));

                    if (re.exec(type)) {
                        valid = true;
                    }
                }
            } else {
                // if the user has specified a part mime e.g. 'png'
                // we'll split the type and check against the right hand side
                // the equivalent of '*/png'
                if (type.split('/')[1] === mime) {
                    valid = true;
                }
            }
        });

        return valid;
    }

    /**
     * Validate file count
     * @param {Number} count
     * @returns {boolean}
     */
    validateCount (count) {
        return count <= parseInt(this.options.maxFiles);
    }

    /**
     * Validate size count
     * @param {Number} count
     * @returns {Boolean}
     */
    validateSize (count) {
        return count <= parseInt(this.options.maxSize);
    }

    /**
     * Return error objects
     * @param {String} error
     * @param {String} culprit
     * @returns {Object}
     */
    throwError (error, culprit = '') {
        switch (error) {
            case 'WHITELIST':
                return {
                    valid: false,
                    code: 'WHITELIST',
                    text: `${this.options.validationText.whitelist}`
                };
            case 'MAX_FILES':
                return {
                    valid: false,
                    code: 'MAX_FILES',
                    text: this.options.validationText.maxFiles
                };
            case 'MAX_SIZE':
                return {
                    valid: false,
                    code: 'MAX_SIZE',
                    text: `${this.options.validationText.maxSize} (${DropZone.formatBytes(this.options.maxSize)})`
                };
            case 'UNKNOWN':
                return {
                    valid: false,
                    code: 'UNKNOWN',
                    text: this.options.validationText.unknown
                };
        }
    }
}

