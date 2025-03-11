import { CustomError } from "../error-handling/customError";
import { User } from "../types/types";


const checkLoginAttemptLimit = (user: User) => {
    const timeSinceLastLoginInMilliseconds = Date.now() - user?.lastLoginAt?.getTime()

    if (timeSinceLastLoginInMilliseconds < 600000 && Number(user?.successfulLoginCount) >= 10) {
        throw new CustomError(`Maximum login requests reached. Try again later`, 429);
    }

    if (timeSinceLastLoginInMilliseconds >= 600000) {
        user.successfulLoginCount = 0;
    }
};


export {checkLoginAttemptLimit}
