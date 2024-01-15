import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { PrismaClient } from "@prisma/client";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method !== 'GET') return res.status(405).end();

    try {
        
        await serverAuth(req, res);

        const {movieId} = req.query;
        if(typeof(movieId) !== 'string') {
            throw new Error('Invalid Id')
        }

        if(!movieId) {
                throw new Error('Invalid Id')
        }

        const movie = await (prismadb as unknown as PrismaClient).movie.findUnique({
            where:{
                id: movieId
            }
        });

        if(!movie) throw new Error('Invalid Id');

        return res.status(200).json(movie);
    } catch (error) {
        console.log(error)
        res.status(400).end()
    }
    
}