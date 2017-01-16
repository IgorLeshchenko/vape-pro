`use strict`;

// Node imports:
import sanitize from 'mongo-sanitize';
import { ObjectId } from 'mongodb';
import { isUndefined, isEmpty } from 'lodash';

// App imports:
import LoggerService from '../../services/common/logger.service';
import CategoryModel from '../../models/category.model';
import ImgModel from '../../models/img.model';
import DirectoryModel from '../../models/directory.model'

const get = query => {
    return CategoryModel
        .findOne(query)
        .populate('picture', 'id')
        .populate('directory', 'id name')
        .exec()
        .then(category => {
            return category ? category.toJSON() : {}
        })
        .catch(error => {
            LoggerService.error('Category find error:', error, { query });
        })
};

const isUnique = ({ _id, name, directory = {} }) => {
    const query = { name: name, directory: directory._id };

    if (!isUndefined(_id)) {
        query._id = { $ne: _id };
    }

    if (!name || !directory) {
        return Promise.resolve(true);
    }

    return get(query)
        .then((category) => {
            return isEmpty(category);
        })
        .catch((err) => {
            return { status: 500, msg: err }
        })
};

export const getById = _id => {
    return get({ _id: new ObjectId(sanitize(_id)) })
};

export const getByPath = path => {
    return get({ path: sanitize(path) })
};

export const create = data => {
    const { name, directory } = data;
    const NewCategoryModel = new CategoryModel(data);

    return isUnique({ name, directory })
        .then(isNameUnique => {
            if (!isNameUnique) {
                return Promise.reject({ status: 403, code: 'nuniq', msg: 'Name is not unique' });
            }

            return NewCategoryModel.save();
        })
        .then(category => {
            return getById(category._id).then(category => {
                return { data: category };
            });
        })
        .catch(({ status = 500, code, msg = 'Server Error' }) => {
            LoggerService.error('Category create error:', { status, code, msg });

            return { status, code, msg };
        });
};

