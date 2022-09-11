import {model, Schema} from "mongoose";
import bcrypt from "bcrypt"

const OTPschema = new Schema({
        otp: String,
        user_id: String,
        email: String,
        time: {
            type: Date,
            default: Date.now,
            index: {expires: 120}
        }
    },
    {timestamps: true}
)

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3,
        uppercase: true
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
        maxlength: 32,
        default: [true, "LoginWithGoogle"]
    },
    admin: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        optional: true,
    },
    DOB: {
        type: String,
        optional: true,
    },
    gender: {
        type: String,
        optional: true,
    },
    address: {
        type: String,
        optional: true,
    },
    orders:{
        type:[],
        ref: 'order'
    },
    cart:{
        type:[],
        ref:'cart'
    }
},{timestamps: true})


UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.pre('updateOne', function() {
    this.set({ updatedAt: new Date() });
});

OTPschema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.otp = await bcrypt.hash(this.otp, salt)
})



OTPschema.methods.comparePassword = async function (canditateOTP) {
    return await bcrypt.compare(canditateOTP, this.otp)
}
UserSchema.methods.comparePassword = async function (canditatePassword) {
    return await bcrypt.compare(canditatePassword, this.password)
}

const OTP_schema = model('OTP', OTPschema);
const UserModel = model('User', UserSchema);
export {UserModel, OTP_schema};