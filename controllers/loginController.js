// import express 
const express = require("express");

// import express validator
const { validationResult } = require("express-validator");

// import bcrypt 
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// import prisma client 
const prisma = require("../prisma/client");

// function login 
const login = async (req, res) => {

    // periksa validasi login 
    const errors = validationResult(req);

    // jika form ada yang kosong
    if (!errors.isEmpty()) {
        // Jika ada error, pesan ini disampaikan ke pengguna
        return res.status(442).json({
            success: false,
            message: "Validation Error",
            errors: errors.array(),
        });
    }

    try {

        // find user
        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            },
        });

        // user tidak ditemukan
        if (!user)
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
        
        // compare password 
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password,
        );

        // password incorrect
        if (!validPassword)
            return res.status(401).json({
                success: false,
                message: "Password Salah",
            });
        
        // generate token JWT 
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // destructure to remove password from user object 
        const { password, ...userWithoutPassword } = user;

        // return response 
        res.status(200).send({
            success: true,
            message: "Login Berhasil",
            data: {
                user: userWithoutPassword,
                token: token,
            },
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
}

module.exports = {login};

