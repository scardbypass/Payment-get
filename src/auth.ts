import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import { env } from './env.js';
import { db } from './db.js';
export async function hashPassword(password:string){return bcrypt.hash(password,12)}
export async function verifyPassword(password:string,hash:string){return bcrypt.compare(password,hash)}
export function signToken(userId:number){return jwt.sign({sub:userId},env.JWT_SECRET,{expiresIn:'7d',issuer:'payment-get',audience:'payment-get-api'})}
export async function auth(req:Request&{userId?:number},res:Response,next:NextFunction){try{const h=req.headers.authorization??'';if(!h.startsWith('Bearer '))throw new Error();const p=jwt.verify(h.slice(7),env.JWT_SECRET,{issuer:'payment-get',audience:'payment-get-api'}) as jwt.JwtPayload;const id=Number(p.sub);if(!Number.isInteger(id))throw new Error();const u=await db.user.findUnique({where:{id},select:{id:true,status:true}});if(!u||u.status!=='ACTIVE')return res.status(401).json({error:'UNAUTHORIZED'});req.userId=id;next()}catch{return res.status(401).json({error:'UNAUTHORIZED'})}}
