import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import { PrismaClient } from '@prisma/client';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method != 'POST') {
        
        console.log("method not allowed")
        return res.status(405).end();
    }   
    
    try{
        
            const {email, name, password } = req.body;

            const existingUser = await (prismadb as unknown as PrismaClient).user.findUnique({
                where : {
                    email
                }
            });
            if(existingUser) {
                return res.status(422).json({ error: 'Email taken'});
        }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await (prismadb as unknown as PrismaClient).user.create({
                data: {
                    email,
                    name,
                    hashedPassword,
                    image: '',
                    emailVerified: new Date(),
                }
            });

            return res.status(200).json(user);
    }
    catch (err) {
        console.log("error from try ",err);
        return res.status(400).end();
    }
}