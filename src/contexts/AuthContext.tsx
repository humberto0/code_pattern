import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { apiAuth } from "src/services/apiAuthClient";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
  name: string;
};

type SignInCredentials = {
  email: string;
  password: string;
};
type AuthProviderProps = {
  children: ReactNode;
};
type AuthContextData = {
  signIn(credencials: SignInCredentials): Promise<void>; //ele recebe as credenciais e não retorna nada(void)
  signOut(): void;
  user: User; //ele retorna os dados do usuário para (email, name, roles e permissions)
  isAuthenticated: boolean; // ele também retorna se o usuário esta autenticado ou não
};
const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export const signOut = () => {
  destroyCookie(undefined, "dev.token");
  destroyCookie(undefined, "dev.refreshToken");

  authChannel.postMessage("signOut"); //deslogar das abas

  Router.push("/");
};
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user; //se não tiver nada é pq não ta autenticado

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = message => {
      switch (message.data) {
        case "signOut":
          signOut();
          authChannel.close();
          break;

        default:
          break;
      }
    };
  }, []); // deslogar de todas abas

  useEffect(() => {
    const { "dev.token": token } = parseCookies();
    if (token) {
      apiAuth
        .get("/me")
        .then(response => {
          const { email, permissions, roles, name } = response.data;
          setUser({
            email,
            permissions,
            roles,
            name,
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await apiAuth.post("sessions", { email, password });
      const { token, refreshToken, permissions, roles, name } = response.data;

      setCookie(undefined, "dev.token", token, {
        maxAge: 60 * 60 * 24, //1 dia
        path: "/",
      });
      setCookie(undefined, "dev.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24, //1 dia
        path: "/",
      });

      setUser({
        email,
        permissions,
        roles,
        name,
      });

      apiAuth.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuthContext(): AuthContextData {
  const context = useContext(AuthContext);
  return context;
}