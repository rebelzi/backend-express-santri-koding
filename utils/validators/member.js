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
            const user = await prisma.user.findUnique({ where: {email: value} });
            if (user && user.id !== Number(req.params.id)) {
                throw new Error('Email Sudah digunakan');
            }
            return true;
        }),
];

module.exports = { validateMember }