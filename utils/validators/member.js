//impoer express validators
const { body } = require("express-validator");

//import prisma
const prisma = require("../../prisma/client");

//definisiakan untuk create member
const validateMember = [
    body('name').notEmpty().withMessage('Nama wajib diisi'),
    body('email')
        .notEmpty().withMessage('Alamat Email wajib diisi')
        .isEmail().withMessage('Alamat Email Salah')
        .custom(async (value, {req}) => {
            if (!value) {
                throw new Error('Alamat Email Salah');
            }
            const member = await prisma.member.findUnique({ where: {email: value} });
            if (member && member.id !== Number(req.params.id)) {
                throw new Error('Email Sudah digunakan');
            }
            return true;
        }),
    body('jiko').notEmpty().withMessage('Jiko Wajib diisi')
];

module.exports = { validateMember }