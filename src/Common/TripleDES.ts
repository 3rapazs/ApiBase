import ConfigSys from "../Config/ConfigSys";
import crypto from 'crypto';
class TripleDES {

    private Algorithm: string = 'des-ede3'; // Triple DES ECB mode
    private SecretKey: string = this.to24BytesKey(ConfigSys.Secret).toString()
    private Key = Buffer.from(this.SecretKey, 'utf8');// key 24 ตัวอักษร = 24 bytes

    public EncryptTripleDES(plaintext: string): string {
        const cipher = crypto.createCipheriv(this.Algorithm, this.Key, null); // ECB mode ไม่มี IV
        let encrypted = cipher.update(plaintext, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    public DecryptTripleDES(encryptedText: string): string {
        const decipher = crypto.createDecipheriv(this.Algorithm, this.Key, null);
        let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    private to24BytesKey(str: string): Buffer {
        const buf = Buffer.from(str, 'utf8');
        if (buf.length > 24) {
            return buf.slice(0, 24);  // ตัดให้เหลือ 24 bytes
        } else if (buf.length < 24) {
            // กรณีสั้นกว่า 24 bytes ให้เติม 0 ต่อท้าย
            const padded = Buffer.alloc(24);
            buf.copy(padded);
            return padded;
        }
        return buf; // ยาวพอดี 24 bytes
    }


}

export default TripleDES;