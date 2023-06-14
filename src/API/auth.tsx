import data from "../database/users.json"
import * as jose from 'jose'
import * as CryptoJS from "crypto-js";

const generateToken = async (username : string) => {
    
    const secret = new TextEncoder().encode(
        'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
    )
    
    const alg = 'HS256'

    const jwt = await new jose.SignJWT({ username : username })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret)

    return jwt
};

export const login = (username: string, password: string): Promise<object> => {
  return new Promise<object>((resolve, reject) => {
    const existing_user = data.users.find(user => user.username === username)
    if (existing_user) {

        const secretKey = 'my-secret-key';
        const decrypted_password = CryptoJS.AES.decrypt(existing_user.password, secretKey).toString(CryptoJS.enc.Utf8);
        
        if (decrypted_password === password) {
            generateToken(username).then((token) => {
                resolve({
                    data : {
                        token : token
                    }
                })
            }).catch((error) => {
                reject(error)
            })
        } else {
            resolve({
                data : {
                    error : {
                        message : "Invalid username or password"
                    }
                }
            })
        }
    } else {
        resolve({
            data : {
                error : {
                    message : "Invalid username or password"
                }
            }
        })
    }
  });
};