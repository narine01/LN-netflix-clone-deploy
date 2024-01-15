import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { PrismaClient } from "@prisma/client";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try {
        if(req.method === 'POST') {
            const {currentUser} = await serverAuth(req, res);
            console.log(currentUser)

            const {movieId} = req.body;

            const existingMovie = await (prismadb as unknown as PrismaClient).movie.findUnique({
                where: {
                    id: movieId,
                }
            });

            if(!existingMovie) {
                throw new Error("Invalid Id");
            }

            const user = await (prismadb as unknown as PrismaClient).user.update({
                where:{
                    email: currentUser?.email || '',
                },

                data: {
                    favouriteIds: {
                        push: movieId
                    }
                }
            });

            return res.status(200).json(user);
        } 

        if(req.method === 'DELETE') {
            const {currentUser} = await serverAuth(req, res);

            const {movieId} = req.body;

            const existingMovie = await (prismadb as unknown as PrismaClient).movie.findUnique({
                where: {
                    id: movieId,
                }
            });

            if(!existingMovie) {
                throw new Error("Invalid Id");
            }
            const updatedFavouriteIds = without(currentUser.favouriteIds, movieId);

            const updatedUser = await (prismadb as unknown as PrismaClient).user.update({
                where: {
                    email: currentUser.email || ''
                },
                data: {
                    favouriteIds: updatedFavouriteIds,
                }
            });
            return res.status(200).json(updatedUser);
        }

        return res.status(405).end();
    } catch (error) {
        console.log(error)
        return res.status(400).end()
    }
}
