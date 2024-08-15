//import express
const express = require("express");

//import prismaa client
const prisma = require("../prisma/client");

//import validationResult from express-validator
const { validationResult } = require("express-validator");

//function createMember
const createMembers = async (req, res) => {

    //periksa hasil validasi
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        //jika ada error, kembalikan error ke pengguna
        return res.status(442).json({
            success: false,
            message: "Validation Error",
            errors: errors.array(),
        });
    }

        try {

            //insert data
            const members = await prisma.member.create({
                data: {
                    name: req.body.name,
                    email: req.body.email,
                },
            });

            res.status(201).send({
                success: true,
                message: "Nama member berhasil di Input",
                data: members,
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Internal Server Error",
            });
        }
};
//function getMember
const getMembers = async (req, res) => {
    try {

        //get all members from database
        const members = await prisma.member.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                id: "desc",
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

module.exports = { createMembers, getMembers }