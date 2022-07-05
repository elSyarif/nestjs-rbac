import { createDecipheriv, randomBytes, createCipheriv } from 'crypto';

const key = Buffer.from('fec4722ef6ed8668edd8aefdc3b81e27df0024f16fdada2d0e2291dfd520649e', 'hex');
const iv = Buffer.from('ae2f67dee9d409ed40d4d6a199777f08', 'hex');


// Encrypting text
export function Encrypt(text: string) {
	let cipher = createCipheriv('aes-256-cbc', key, iv);
	let encrypted = cipher.update(text, 'utf-8', 'hex');
	encrypted += cipher.final('hex')

	return encrypted
}

// Decrypting text
export function Decrypt(text: any) {
	let decipher = createDecipheriv('aes-256-cbc',key, iv);
	let decrypted = decipher.update(text, 'hex', 'utf-8');

	decrypted += decipher.final('utf-8')

	return decrypted
}
