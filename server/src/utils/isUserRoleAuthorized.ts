import { IUser } from "../interfaces/IUser.js";
import { userRoles } from "../utils/enums/userRoles.js";

export const isUserAuthorized = (user: IUser, requiredRole: string) => {
  return (
    Object.values(userRoles).indexOf(user.role as unknown as userRoles) <=
    Object.values(userRoles).indexOf(requiredRole as unknown as userRoles)
  );
};
