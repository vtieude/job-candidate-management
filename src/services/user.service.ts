import { IUser, User } from "../schema/user.schema";


export const getAllUser = async () => {
  return await User.find();
}

export const findUserByEmail = async(email: string) => {
  return await User.findOne({ email });
}

export const createUser = async(user: IUser) => {
    return await User.create(user);
}
