import 'dotenv/config';
const jwtKey = process.env.JWTKEY;
export default {
    jwtSecret: jwtKey
};