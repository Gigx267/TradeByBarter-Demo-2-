import { userSchema } from "../schemas/userSchema";
import bcrypt from 'bcrypt'


userSchema.pre('save',async function(next){
    if (!this.isModified('password')) return

    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;

})

userSchema.methods.correctPassword = async function(plainTextPassword : string, hashedPassword:string){
    return await bcrypt.compare(plainTextPassword, hashedPassword)
}

