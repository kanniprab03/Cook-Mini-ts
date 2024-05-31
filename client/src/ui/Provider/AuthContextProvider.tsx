import axios from "axios";
import { ReactElement, useEffect, useState } from "react";
import { AUTH_BASE_URL } from "../../lib/constant/constant";
import { AuthContext } from "../../lib/context/AuthContext";
import { USER_ROLES } from "../../lib/context/types/AuthTypes";
import { User, UserLoginPayload, CommonResponse, UserRegisterPayload, AuthContextType } from "../../lib/context/types/Context";

export default function AuthContextProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [UserRole, setUserRole] = useState(USER_ROLES.GUEST);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const oldUser = localStorage.getItem("user");
    setUser(oldUser ? JSON.parse(oldUser) : undefined);
    oldUser ? setIsAuthenticated(true) : setIsAuthenticated(false);
    UserProfile();
  }, []);

  const UserLogin = (user: UserLoginPayload): Promise<CommonResponse> => {
    return new Promise((resolve) => {
      authInstance
        .post("/login", user)
        .then((res) => {
          setUser(res.data.user);
          if (res.data.status) {
            const userObj = {
              name: res.data.user.name,
              email: res.data.user.email,
              role: res.data.user.role,
            };
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(userObj));
            setIsAuthenticated(true);
            setUserRole(res.data.user.role);
          }
          resolve({ status: res.data.status, message: res.data.message });
        })
        .catch(() => {
          setUserRole(USER_ROLES.GUEST);
          setIsAuthenticated(false);
          resolve({ status: false, message: "Something went wrong" });
        });
    });
  };

  const UserRegister = (user: UserRegisterPayload): Promise<CommonResponse> => {
    return new Promise((resolve, reject) => {
      authInstance
        .post("/register", user)
        .then((res) => {
          setIsAuthenticated(false);
          setUserRole(res.data?.user?.role);
          resolve({ status: res.data.status, message: res.data.message });
        })
        .catch((err) => {
          setUserRole(USER_ROLES.GUEST);
          setIsAuthenticated(false);
          reject({ status: 0, message: err.response?.data?.message });
        });
    });
  };

  const UserProfile = (): Promise<CommonResponse> => {
    return new Promise((resolve, reject) => {
      authInstance
        .get("/profile", {
          headers: { "auth-token": localStorage.getItem("token") },
        })
        .then((res) => {
          setIsAuthenticated(true);
          if (res.data.status) {
            setUserRole(res.data.user.role);
            setUser(res.data.user);
          } else {
            setUserRole(USER_ROLES.GUEST);
            setIsAuthenticated(false);
            setUser(undefined);
            localStorage.removeItem("user");
          }
          resolve({ status: res.data.status, message: res.data.message });
        })
        .catch((err) => {
          setUserRole(USER_ROLES.GUEST);
          setIsAuthenticated(false);
          setUser(undefined);
          console.log(err)
          if (err.response.data.status === false) {
            localStorage.removeItem("user");
          }
          reject({ status: false, message: err.message });
        });
    });
  };

  const checkEmailVerified = (email: string) => {
    return new Promise<boolean>((resolve, reject) => {
      authInstance
        .get(`/check-email-verified?email=${email}`)
        .then((res) => {
          resolve(res.data.status);
        })
        .catch((err) => {
          reject({ status: false, message: err.response.data.message });
        });
    });
  };

  const updateUserName = (payload: {
    _id: string;
    name: string;
  }): Promise<CommonResponse> => {
    return new Promise((resolve) => {
      authInstance
        .put(`/update/name`, payload)
        .then((res) => {
          if (res.data.status) {
            setUser((p) => (p ? { ...p, name: payload.name } : p));
          }
          resolve({ status: res.data.status, message: res.data.message });
        })
        .catch((err) => {
          resolve({ status: false, message: err.response.data.message });
        });
    });
  };

  const updateImage = (payload: FormData): Promise<CommonResponse> => {
    return new Promise((resolve) => {
      authInstance
        .put("/update/profileImg", payload)
        .then((res) => {
          if (res.status) {
            setUser((p) => (p ? { ...p, profileImg: res.data.profileImg } : p));
          }
          resolve({ status: res.data.status, message: res.data.message });
        })
        .catch((err) => {
          resolve({ status: false, message: err.message });
        });
    });
  };

  const updateRole = (payload: {
    role: USER_ROLES;
    _id: string;
  }): Promise<CommonResponse> => {
    return new Promise((resolve) => {
      authInstance
        .put("/update/role", payload)
        .then((res) => {
          if (res.status) {
            setUser((p) => (p ? { ...p, role: USER_ROLES.ADMIN } : p));
          }
          resolve({ status: res.data.status, message: res.data.message });
        })
        .catch((err) => {
          resolve({ status: false, message: err.message });
        });
    });
  };

  const UserLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    UserRole,
    UserLogin,
    UserLogout,
    UserRegister,
    UserProfile,
    User: user,
    checkEmailVerified,
    updateUserName,
    updateImage,
    updateRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

const authInstance = axios.create({
  baseURL: AUTH_BASE_URL,
  withCredentials: true,
  headers: {
    "auth-token": localStorage.getItem("token"),
  },
});
