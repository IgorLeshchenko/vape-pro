export const itemCreateSchema = {
    'name': {
        notEmpty: true,
        errorMessage: 'required'
    },
    'isActive': {
        notEmpty: true,
        isBoolean: true,
        errorMessage: 'required,boolean'
    },
    'index': {
        notEmpty: true,
        isInt: true,
        errorMessage: 'required,integer'
    },
    'picture': {
        notEmpty: true,
        errorMessage: 'required'
    },
    'picture._id': {
        notEmpty: true,
        errorMessage: 'required'
    },
    'directory': {
        notEmpty: true,
        errorMessage: 'required'
    },
    'directory._id': {
        notEmpty: true,
        errorMessage: 'required'
    },
    'description': {
        notEmpty: true,
        errorMessage: 'required'
    },
    'seoKeywords': {
        notEmpty: true,
        errorMessage: 'required'
    },
    'seoDescription': {
        notEmpty: true,
        errorMessage: 'required'
    }
};
