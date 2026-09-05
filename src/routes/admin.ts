import { Router } from 'express'; import { db } from '../db.js'; import { auth } from '../auth.js';
export const adminRouter=Router(); adminRouter.use(auth); adminRouter.use(async(req:any,res,next)=>{const u=await db.user.findUnique({where:{id:req.userId}});if(u?.role!=='ADMIN')return res.status(403).json({error:'FORBIDDEN'});next()});
adminRouter.get('/users',async(_,res)=>res.json(await db.user.findMany({select:{id:true,name:true,username:true,email:true,phone:true,feePercent:true,withdrawalFee:true,personalEnabled:true,status:true}})));
adminRouter.post('/users/:id/pricing',async(req,res)=>res.json(await db.user.update({where:{id:Number(req.params.id)},data:{feePercent:req.body.feePercent,withdrawalFee:req.body.withdrawalFee,personalEnabled:req.body.personalEnabled}})));
adminRouter.get('/accounts',async(_,res)=>res.json(await db.paymentAccount.findMany({orderBy:{priority:'asc'}}));
adminRouter.post('/accounts',async(req,res)=>res.status(201).json(await db.paymentAccount.create({data:req.body})));
adminRouter.post('/withdrawals/:id/pay',async(req,res)=>res.json(await db.withdrawal.update({where:{id:Number(req.params.id)},data:{status:'PAID',providerRef:req.body.providerRef,processedAt:new Date()}})));
