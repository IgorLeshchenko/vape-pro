'use strict';

// Node imports:
import { isNull } from 'lodash';

// App imports:
import UploadService from '../../services/common/upload.service';
import LoggerService from '../../services/common/logger.service';
import ImgModel from '../../models/img.model';

const getImageCropData = crop => {
    let cropData = {
        x: 0, y: 0, width: 150, height: 150,
    };

    try {
        cropData = Object.assign({}, cropData, JSON.parse(crop));
    } catch (error) {
        cropData = null;
    }

    return cropData;
};

const uploadImage = (img, file, crop) => {
    const cropData = getImageCropData(crop);
    const { _id } = img;

    if (isNull(cropData)) {
        return Promise.reject(new Error(`Failed to parse crop data`));
    }

    return UploadService.uploadImage(_id, file)
        .then(() => UploadService.cropImage(_id, cropData))
        .then(() => {
            return img;
        })
        .catch(error => {
            LoggerService.error('Failed to upload and crop image', error);
            return Promise.reject(error);
        });
};

export const createImg = (file, crop) => {
    const img = new ImgModel({ isActive: true });

    return img.save()
        .then(newImage => uploadImage(newImage, file, crop))
        .catch(error => {
            LoggerService.error('Failed to create image', error);
            return Promise.reject(error);
        });
};
