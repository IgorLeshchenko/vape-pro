'use strict';

// Node imports:
import nodemailer from 'nodemailer';

// App imports:
import { getHttpLink } from '../../../client/common/helpers/httpLink.helper';

const admins = [
    'igor.leshchenko.mail@gmail.com',
    'itarakanov.vapepro@gmail.com'
];

const sendEmail = (sendTo, subject, message, done) => {
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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            done(error)
        } else {
            done(null, info.response);
        }
    });
};

export const sendNewOrderToAdmins = (order, done) => {
    const { _id } = order;
    const orderLink = getHttpLink(`/mgm/orders/new/${_id}`);
    const subject = `Новый заказ`;
    const message = `На сайте был оставлен новый заказ <a href="${orderLink}">${_id}</a>`;

    sendEmail(admins, subject, message, done);
};

export const registerRequestCallback = ({ user, phone }, done) => {
    const subject = `Новый Заказ на CallBack`;
    const message = `
        На сайте был оставлен новый заказ на CallBack <br/> <hr />
        Пользователь: ${user} <br/>
        Телефон: ${phone} <br/>
    `;

    sendEmail(admins, subject, message, done);
};
