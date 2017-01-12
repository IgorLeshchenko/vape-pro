'use strict';

// Node Imports:
import { each, includes, last } from 'lodash';
import path from 'path';
import fs from 'fs-extra';
import gm from 'gm';

gm.subClass({ imageMagick: true });

const cropSizes = [ 50, 150, 250, 500 ];

export const cropImageProcess = (data) => {
    const { fileToCrop, folder, size, cropData } = data;
    const fileToSave = path.resolve(folder, `${size}.png`);

    return new Promise((cbResolve, sbReject) => {
        gm(fileToCrop)
            .crop(cropData.width, cropData.height, cropData.x, cropData.y)
            .resize(size, size, '!')
            .noProfile()
            .write(fileToSave, (err) => {
                if (err) {
                    return sbReject(err);
                }

                cbResolve();
            });
    });
};

export const cropImage = (id, cropData, done) => {
    const fileFolder = path.resolve(__base, `../public/uploads/${id}`);
    const fileToCrop = path.resolve(__base, `../public/uploads/${id}/original.png`);
    const cropPromise = [];

    each(cropSizes, (size) => {
        cropPromise.push(
            cropImageProcess(fileToCrop, fileFolder, size, cropData)
        );
    });

    Promise.all(cropPromise)
        .then(() => done())
        .catch((error) => done(error));
};

export const checkFolderExists = (folder, done) => {
    fs.ensureDir(folder, (err) => {
        if (err) {
            return done({ reqStatus: 500, msg: `Server Error`, nodeError: err });
        }

        return done();
    });
};

export const uploadImage = (file, id, done) => {
    const fileUploadFolder = path.resolve(__base, `../public/uploads/${id}`);
    const fileUploadPath = path.resolve(__base, `../public/uploads/${id}/original.png`);

    if (!includes([ 'jpeg', 'jpg', 'png' ], last(file.name.split('.')))) {
        return done({ message: `Unsupported file extension` });
    }

    if (!includes([ 'image/jpeg', 'image/png' ], file.mimetype)) {
        return done({ message: `Unsupported file type` });
    }

    checkFolderExists(fileUploadFolder, (existanceError) => {
        if (existanceError) {
            return done(existanceError);
        }

        file.mv(fileUploadPath, (uploadError) => {
            if (uploadError) {
                return done({ message: `Server Error`, error: uploadError });
            }

            return done(null);
        });
    });
};
