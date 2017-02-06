'use strict';

// Node imports:
import nodemailer from 'nodemailer';

// App imports:
import { getHttpLink } from '../../../client/common/helpers/httpLink.helper';

const admins = [
    'igor.leshchenko.mail@gmail.com',
    // 'itarakanov.vapepro@gmail.com'
];

const sendEmail = (sendTo, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'noreply@vape-pro.com.ua',
            pass: 'Frost1251'
        }
    });
    const mailOptions = {
        from: '"Vape Pro" <noreply@vape-pro.com.ua>',
        to: sendTo ? sendTo.join(',') : '',
        subject: subject,
        html: message
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

export const sendNewOrderToAdmins = order => {
    const { _id } = order;
    const orderLink = getHttpLink(`/mgm/orders/new/${_id}`);
    const subject = `Новый заказ`;
    const message = `На сайте был оставлен новый заказ <a href="${orderLink}">${_id}</a>`;

    return sendEmail(admins, subject, message)
        .then(() => {
            return order;
        });
};

export const registerRequestCallback = ({ user, phone }) => {
    const subject = `Новый Заказ на CallBack`;
    const message = `
        На сайте был оставлен новый заказ на CallBack <br/> <hr />
        Пользователь: ${user} <br/>
        Телефон: ${phone} <br/>
    `;

    return sendEmail(admins, subject, message);
};
