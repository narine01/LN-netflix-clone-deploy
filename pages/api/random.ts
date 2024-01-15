import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { PrismaClient } from "@prisma/client";

export default async function handler (req: NextApiRequest, res:NextApiResponse) {
    if(req.method !== 'GET') return res.status(405).end();

    try{

        await serverAuth(req, res);

        const movieCount = await (prismadb as unknown as PrismaClient).movie.count();
        const randomIndex = Math.floor(Math.random() * movieCount );

        const randomMovies = await (prismadb as unknown as PrismaClient).movie.findMany({
            take: 1,
            skip:randomIndex
        });
        console.log("this is movie data", randomMovies[0])
        console.log(res)
        return res.status(200).json(randomMovies[0]);
    } catch(err) {
            console.log(err); 
            return res.status(400).end();
    }
}