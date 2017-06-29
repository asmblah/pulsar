class DropZoneValidatorDispatcher {
    /**
     * DropZoneValidator
     * @param {DropZoneValidationUtils} utils
     * @param {DropZoneErrors} errors
     * @param {Array} whitelist
     * @param {number} maxFiles
     * @param {number} maxSize
     */
    constructor (utils, errors, whitelist, maxFiles, maxSize) {
        this.utils = utils;
        this.errors = errors;
        this.whitelist = whitelist;
        this.maxFiles = maxFiles;
        this.maxSize = maxSize;
    }

    /**
     * Dispatch validation methods
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
                result = this.errors.getFileValidationError('UNKNOWN');
            }

            // 2. whitelist
            //   - check we have a whitelist
            //   - ensure our file is on the whitelist
            //   - skip files that have a mock property
            if (
                result.valid &&
                this.whitelist &&
                this.whitelist.length &&
                !file.mock &&
                !this.utils.validateType(file.type, this.whitelist)
            ) {
                result = this.errors.getFileValidationError('WHITELIST');
            }


            // 3. max files
            //   - ensure we haven't exceeded our max files
            if (result.valid && !this.utils.validateCount(fileCount, this.maxFiles)) {
                result = this.errors.getFileValidationError('MAX_FILES');
            }

            // 4. max size
            //   - ensure we haven't exceeded our maximum size, if we can get size
            //
            // check to see if we can get a file, if we can't we know we cannot
            // determine the size, so we'll pass this and handle it when we can get
            // the size
            if (result.valid && fileObject && !file.mock) {
                sizeCount += fileObject.size;

                if (!this.utils.validateSize(sizeCount, this.maxSize)) {
                    result = this.errors.getFileValidationError('MAX_SIZE');
                }
            }
        }

        return result;
    }
}

module.exports = DropZoneValidatorDispatcher;
