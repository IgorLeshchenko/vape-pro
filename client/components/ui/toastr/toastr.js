'use strict';

// Third Party imports:
import toastr from 'toastr';

toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': true,
    'progressBar': false,
    'positionClass': 'toast-bottom-full-width',
    'preventDuplicates': true,
    'onclick': null,
    'showDuration': '100',
    'hideDuration': '300',
    'timeOut': '1500',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
};

export const hide = () => {
    toastr.remove();
};

export const show = ({ type = 'info', message, title, options }) => {
    toastr.remove();
    toastr[type](message, title, options);
};

export const showShopSuccess = ({  message }) => {
    toastr.remove();
    toastr.success(message, '', {
        'positionClass': 'toast-top-center',
    });
};

export const showShopError = ({  message }) => {
    toastr.remove();
    toastr.error(message, '', {
        'positionClass': 'toast-top-center',
    });
};
