import crypto from 'node:crypto';
import { db } from '../db.js';
import { reserveUniqueCode } from './unique-code.js';
import { env } from '../env.js';
export async function createPayment(userId:number,input:{amount:number;reference:string}){
  if(input.amount<1000) throw new Error('MIN_AMOUNT_1000');
  const u=await db.user.findUnique({where:{id:userId},include:{subscriptions:{where:{status:'ACTIVE',endsAt:{gt:new Date()}},orderBy:{endsAt:'desc'},take:1}}});
  if(!u||u.status!=='ACTIVE') throw new Error('USER_NOT_ACTIVE');
  if(u.subscriptions.length===0) throw new Error('SUBSCRIPTION_REQUIRED');
  let account=u.personalEnabled?await db.paymentAccount.findFirst({where:{owner:'USER',ownerUserId:userId,type:'PERSONAL',status:'ACTIVE'},orderBy:[{priority:'asc'},{lastUsedAt:'asc'}]}):null;
  if(!account) account=await db.paymentAccount.findFirst({where:{owner:'ADMIN',type:'SHARED',status:'ACTIVE'},orderBy:[{priority:'asc'},{lastUsedAt:'asc'}]});
  if(!account) throw new Error('NO_PAYMENT_ACCOUNT');
  const fee=Math.round(input.amount*Number(u.feePercent)/100);
  const expiresAt=new Date(Date.now()+env.PAYMENT_TTL_MINUTES*60_000);
  const uniqueCode=await reserveUniqueCode(account.id,input.amount);
  const paymentId='PAY-'+crypto.randomUUID().replaceAll('-','').slice(0,12).toUpperCase();
  const p=await db.payment.create({data:{paymentId,userId,accountId:account.id,reference:input.reference,amount:input.amount,uniqueCode,payableAmount:input.amount+uniqueCode,feeAmount:fee,status:'PENDING',expiresAt}});
  await db.paymentAccount.update({where:{id:account.id},data:{lastUsedAt:new Date()}});
  return p;
}
