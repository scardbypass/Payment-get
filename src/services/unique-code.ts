import { db } from '../db.js';
export async function reserveUniqueCode(accountId:number, amount:number){const used=await db.payment.findMany({where:{accountId,amount,status:{in:['PENDING','DETECTED']},expiresAt:{gt:new Date()}},select:{uniqueCode:true}});const set=new Set(used.map(x=>x.uniqueCode));for(let i=0;i<1000;i++)if(!set.has(i))return i;throw new Error('PAYMENT_CAPACITY_FULL')}
export async function expireOldPayments(){return db.payment.updateMany({where:{status:{in:['PENDING','DETECTED']},expiresAt:{lt:new Date()}},data:{status:'EXPIRED'}})}
