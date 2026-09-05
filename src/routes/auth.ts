import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { hashPassword, verifyPassword, signToken } from '../auth.js';
export const authRouter = Router();
const register = z.object({name:z.string().min(2),username:z.string().min(3).max(40),email:z.string().email(),phone:z.string().min(8),password:z.string().min(8)});
authRouter.post('/register', async (req,res)=>{try{const x=register.parse(req.body);const u=await db.user.create({data:{...x,passwordHash:await hashPassword(x.password),wallet:{create:{}}},select:{id:true,name:true,username:true,email:true,phone:true}});res.status(201).json({user:u,token:signToken(u.id)});}catch(e:any){res.status(400).json({error:e.message});}});
authRouter.post('/login', async (req,res)=>{try{const x=z.object({login:z.string().min(1),password:z.string().min(1)}).parse(req.body);const u=await db.user.findFirst({where:{OR:[{username:x.login},{email:x.login}]}});if(!u||!(await verifyPassword(x.password,u.passwordHash)))return res.status(401).json({error:'INVALID_CREDENTIALS'});res.json({token:signToken(u.id),user:{id:u.id,name:u.name,username:u.username,email:u.email,role:u.role}});}catch(e:any){res.status(400).json({error:e.message});}});
