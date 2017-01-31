'use strict';

// Node Imports:
import { each, includes, last } from 'lodash';
import path from 'path';
import fs from 'fs-extra';
import gm from 'gm';

gm.subClass({ imageMagick: true });

// App Imports:
import LoggerService from './logger.service';

const cropSizes = [50, 150, 250, 500];
const trustedExtensions = ['jpeg', 'jpg', 'png'];
const trustedFilesTypes = ['image/jpeg', 'image/png'];

const checkFolderExists = folder => {
    return new Promise((resolve, reject) => {
        fs.ensureDir(folder, checkError => {
            if (checkError) {
                return reject(checkError);
            }

            return resolve();
        });
    });
};

const moveFileToFolder = (file, folder) => {
    return new Promise((resolve, reject) => {
        file.mv(folder, moveError => {
            if (moveError) {
                return reject(moveError);
            }

            return resolve();
        });
    });
};

const getFileFolderPath = id => {
    return path.resolve(__base, `../public/uploads/${id}`);
};

const getFileOriginalPath = id => {
    return path.resolve(__base, `../public/uploads/${id}/original.png`);
};

const cropImageProcess = data => {
    const { fileToCrop, folder, size, cropData } = data;
    const fileToSave = path.resolve(folder, `${size}.png`);

    return new Promise((resolve, reject) => {
        gm(fileToCrop)
            .crop(cropData.width, cropData.height, cropData.x, cropData.y)
            .resize(size, size, '!')
            .noProfile()
            .write(fileToSave, err => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
    });
};

export const cropImage = (id, cropData) => {
    const fileFolder = getFileFolderPath(id);
    const fileToCrop = getFileOriginalPath(id);
    const cropPromise = [];

    each(cropSizes, size => {
        cropPromise.push(
            cropImageProcess(fileToCrop, fileFolder, size, cropData)
        );
    });

    return Promise.all(cropPromise)
        .catch(error => {
            LoggerService.error('Failed to crop image', error);
            return Promise.reject(error);
        });
};

export const uploadImage = (id, file) => {
    const { name, mimetype } = file;
    const fileUploadFolder = getFileFolderPath(id);
    const fileUploadPath = getFileOriginalPath(id);

    if (!includes(trustedExtensions, last(name.split('.')))) {
        return Promise.reject(new Error(`Failed to upload image: Unsupported file extension`));
    }

    if (!includes(trustedFilesTypes, mimetype)) {
        return Promise.reject(new Error(`Failed to upload image: Unsupported file type`));
    }

    return checkFolderExists(fileUploadFolder)
        .then(() => moveFileToFolder(file, fileUploadPath))
        .catch(error => {
            LoggerService.error('Failed to upload image', error);
            return Promise.reject(error);
        });
};
