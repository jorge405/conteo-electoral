import CryptoJS from 'crypto-js';
import Cookies from "js-cookie";

export default{
    accessToken: Cookies.get('access_token') || null,
    refreshToken: Cookies.get('refresh_token') || null,

    setToken(token,refreshToken){
        this.accessToken = token;
        this.refreshToken = refreshToken;
        
        
        Cookies.set('access_token',token,{expires: 1});
        Cookies.set('refresh_token',refreshToken,{expires: 7});
    },

    getAccessToken(){
        const decryptedToken = CryptoJS.AES.decrypt(Cookies.get('access_token'),Cookies.get('clave')).toString(CryptoJS.enc.Utf8);
        return decryptedToken;
    },

    getRefreshToken(){
        const decryptedRefreshToken = cryptr.decrypt(this.refreshToken);
        return decryptedRefreshToken;
    }
}