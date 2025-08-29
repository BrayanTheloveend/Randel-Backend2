module.exports = {

    codeGenerator : (number)=>{
        const digits = '0123456789';
        let code = '';
        for (let i = 0; i < number; i++ ) {
            code += digits[Math.floor(Math.random() * (digits.length))];
        }
        return code;
    }
}