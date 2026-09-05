import crypto from 'node:crypto';
import { db } from '../db.js';
import { hash } from './security.js';
export function generateApiKey(){const secret=crypto.randomBytes(32).toString('base64url');return {plain:`pg_live_${secret}`,prefix:`pg_live_${secret.slice(0,8)}`,hash:hash(`pg_live_${secret}`)}}
export async function resolveApiKey(value:string){if(!value.startsWith('pg_live_'))return null;const key=await db.apiKey.findUnique({where:{keyHash:hash(value)},include:{user:true}});if(!key||!key.active||key.user.status!=='ACTIVE')return null;await db.apiKey.update({where:{id:key.id},data:{lastUsedAt:new Date()}});return key.user}
