import { USER_ROLES } from "./AuthTypes";

export interface UserLoginPayload { email: string; password: string; }
export interface UserRegisterPayload extends UserLoginPayload { name: string; }
export interface CommonResponse { status: boolean; message?: string; }
export interface User { name: string; email: string; profileImg: string; role: USER_ROLES; _id?: string; }

export interface AuthContextType {
  isAuthenticated: boolean;
  UserRole: USER_ROLES;
  UserLogin: (user: UserLoginPayload) => Promise<CommonResponse>;
  UserRegister: (user: UserRegisterPayload) => Promise<CommonResponse>;
  UserLogout: () => void;
  UserProfile: () => Promise<CommonResponse>;
  User?: User;
  checkEmailVerified: (email: string) => Promise<boolean>;
  updateUserName: (payload: { _id: string; name: string }) => Promise<CommonResponse>;
  updateImage: (payload: FormData,) => Promise<CommonResponse>;
  updateRole: (payload: { role: USER_ROLES, _id: string }) => Promise<CommonResponse>;
}
