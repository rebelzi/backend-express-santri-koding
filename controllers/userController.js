//import express
const express = require("express");

//import prisma client
const prisma = require("../prisma/client");

//import validationResult from express-validator 
const { validationResult } = require("express-validator")

//import bcrypt
const bcrypt = require("bcryptjs");

//function findUsers
const findUsers = async (req, res) => {
    try {

        //get all users from database
        const users = await prisma.user.findMany({
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
            message: "Get all users successfully",
            data: users,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

//function createUser
const createUser = async (req, res) => {

    // Periksa hasil validasi
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Jika ada error, kembalikan error ke pengguna
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {

        //insert data
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        res.status(201).send({
            success: true,
            message: "User created successfully",
            data: user,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

//function findUserById
const findUserById = async (req, res) => {

    //get ID from params
    const { id } = req.params;

    try {

        //get user by id
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: `Berhasil mengabil user dengan id: ${id}`,
            data: user,  
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
};

//function update user
const updateUser = async (req, res) => {

    //get id for params
    const { id } = req.params;

    //periksa hasil validasi
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(402).json({
            success: false,
            message: "Validation Error",
            errors: errors.array(),
        });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {

        //update user
        const user = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: `Update user dengan id ${id} sudah berhasil`,
            data: user,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
};

//function delete user
const deleteUser = async (req, res) => {

    //get id from params
    const { id } = req.params;

    try {

        //delete user
        await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: `Berhasil menghapus user dengan id ${id}`,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { findUsers, createUser, findUserById, updateUser, deleteUser };