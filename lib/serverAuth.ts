import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb';
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

const serverAuth =async (req:NextApiRequest, res:NextApiResponse) => {
const session = await getServerSession(req, res, authOptions);;
        console.log("this is session",session)
    if(!session?.user?.email){
        console.log("hello its inside session")
        throw new Error('Not signed in');
    }

    const currentUser = await prismadb.user.findUnique({
        where : {
            email: session?.user?.email
        }
    });
console.log(currentUser);
    if(!currentUser) {throw  new Error ('Not Signed in')};

    return {currentUser}
}

export default serverAuth;