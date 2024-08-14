//import express
const express = require("express");

//import prismaa client
const prisma = require("../prisma/client");

//import validationResult from express-validator
const { validationResult } = require("express-validator");

//imort bcrypt
const bcrypt = require("bcryptjs");

//function getMember
const getMember = async (req, res) => {
    try {

        //get all members from database
        const members = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                name: "desc",
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: "Berhasil menampilkan semua member",
            data: members,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { getMember }