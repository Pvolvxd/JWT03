import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  // Mantiene el token actual disponible inmediatamente
  const accessTokenRef = useRef(null);

  // ==============================
  // LOGIN
  // ==============================

  const login = (userData) => {
    setAccessToken(userData.accessToken);
    accessTokenRef.current = userData.accessToken;

    setUser({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      roles: userData.roles,
    });

    localStorage.setItem(
      "refreshToken",
      userData.refreshToken
    );
  };

  // ==============================
  // LOGOUT
  // ==============================

  const logout = async () => {
    const refreshToken =
      localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await api.post("/auth/signout", {
          refreshToken,
        });
      }
    } catch (error) {
      console.error(
        "Error al cerrar sesión:",
        error
      );
    } finally {
      setAccessToken(null);
      accessTokenRef.current = null;

      setUser(null);

      localStorage.removeItem(
        "refreshToken"
      );
    }
  };

  // ==============================
  // INTERCEPTORES AXIOS
  // ==============================

  useEffect(() => {
    const requestInterceptor =
      api.interceptors.request.use(
        (config) => {
          if (accessTokenRef.current) {
            config.headers.Authorization =
              `Bearer ${accessTokenRef.current}`;
          }

          return config;
        },
        (error) =>
          Promise.reject(error)
      );

    const responseInterceptor =
      api.interceptors.response.use(
        (response) => response,

        async (error) => {
          const originalRequest =
            error.config;

          if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes(
              "/auth/signin"
            ) &&
            !originalRequest.url.includes(
              "/auth/refreshtoken"
            )
          ) {
            originalRequest._retry = true;

            const storedRefreshToken =
              localStorage.getItem(
                "refreshToken"
              );

            if (!storedRefreshToken) {
              setAccessToken(null);
              accessTokenRef.current = null;
              setUser(null);

              return Promise.reject(error);
            }

            try {
              console.log(
                "Access Token expiró."
              );

              console.log(
                "Solicitando nuevo Access Token..."
              );

              const response =
                await axios.post(
                  "http://localhost:3000/api/auth/refreshtoken",
                  {
                    refreshToken:
                      storedRefreshToken,
                  }
                );

              const newAccessToken =
                response.data.accessToken;

              // Actualiza estado y referencia inmediatamente
              setAccessToken(newAccessToken);
              accessTokenRef.current =
                newAccessToken;

              console.log(
                "Nuevo Access Token generado automáticamente:",
                newAccessToken
              );

              // Coloca explícitamente el token nuevo
              originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

              // Repite la solicitud original
              return api(originalRequest);

            } catch (refreshError) {
              console.error(
                "No se pudo renovar el Access Token."
              );

              setAccessToken(null);
              accessTokenRef.current = null;
              setUser(null);

              localStorage.removeItem(
                "refreshToken"
              );

              return Promise.reject(
                refreshError
              );
            }
          }

          return Promise.reject(error);
        }
      );

    return () => {
      api.interceptors.request.eject(
        requestInterceptor
      );

      api.interceptors.response.eject(
        responseInterceptor
      );
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}