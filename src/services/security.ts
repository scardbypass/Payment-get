import crypto from 'node:crypto';
import { env } from '../env.js';
const key=crypto.createHash('sha256').update(env.ENCRYPTION_KEY).digest();
export function hash(value:string){return crypto.createHash('sha256').update(value).digest('hex')}
export function encrypt(value:string){const iv=crypto.randomBytes(12);const cipher=crypto.createCipheriv('aes-256-gcm',key,iv);const data=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${data.toString('base64url')}`}
export function decrypt(value:string){const [iv,tag,data]=value.split('.');const decipher=crypto.createDecipheriv('aes-256-gcm',key,Buffer.from(iv,'base64url'));decipher.setAuthTag(Buffer.from(tag,'base64url'));return Buffer.concat([decipher.update(Buffer.from(data,'base64url')),decipher.final()]).toString('utf8')}
export function hmac(secret:string,payload:string){return crypto.createHmac('sha256',secret).update(payload).digest('hex')}
export function requestHash(value:unknown){return hash(JSON.stringify(value))}
