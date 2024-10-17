class secretGenerator {
    exrireIn;
    timeInMinutes = 60;

    getSecret(digit, timeInMinutes, limit, timeLimit) {
        this.timeInMinutes = timeInMinutes;

        let chars =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        const secret = this.generator(digit, chars);
        return {
            secret,
            expireIn: new Date().getTime() + 1000 * 60 * this.timeInMinutes,
            limit,
            timeLimit: new Date().getTime() + 1000 * 60 * 60 * timeLimit,
        };
    }

    getOtp(digit, timeInMinutes, limit, timeLimit) {
        this.timeInMinutes = timeInMinutes;

        let chars = "0123456789";

        const otp = this.generator(digit, chars);
        return {
            otp: otp,
            expireIn: new Date().getTime() + 1000 * 60 * timeInMinutes,
            limit,
            timeLimit: new Date().getTime() + 1000 * 60 * 60 * timeLimit,
        };
    }

    generator(digit, chars) {
        let randomstring = "";

        for (let i = 0; i < digit; i++) {
            let rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }

        return randomstring;
    }
}

module.exports = new secretGenerator();
