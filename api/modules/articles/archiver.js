const archiver = require("archiver");
const _ = require('lodash');
const path = require('path');

class FileArchiver {
    constructor(app, files = [], response) {
        this.app = app;
        this.files = files;
        this.response = response;
    }

    download() {

        const app = this.app;
        const files = this.files;
        const zip = archiver('zip');
        const response = this.response;


        response.attachment('download.zip');
        zip.pipe(response);


        _.each(files, (file) => {

            const filePath = path.join(uploadDir, _.get(file, 'name'));
            zip.file(filePath, {name: _.get(file, 'originalName')});
        });

        zip.finalize();


        return this;


    }
}

module.exports = FileArchiver;
