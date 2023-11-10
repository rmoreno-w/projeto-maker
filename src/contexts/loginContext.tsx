'use client';

import { apiClient } from '@/services/axios';
import { createContext, ReactNode, useContext, useState } from 'react';

interface authData {
    name: string;
    cpf: string;
    email: string;
    access_token: string;
}

const AuthContext = createContext<any>(undefined);

interface authProviderProps {
    children: ReactNode;
}
// This hook can be used to access the user info.
export function useAuth() {
    return useContext(AuthContext);
}
export function AuthProvider({ children }: authProviderProps) {
    const [authData, setAuth] = useState<authData>({
        name: '',
        cpf: '',
        email: '',
        access_token: '',
    });

    async function signIn({ email, password }: { email: string; password: string }) {
        try {
            console.log(`${email} e senha ${password}`);
            await apiClient
                .post(
                    '/users/login',
                    {
                        username: email,
                        password,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                )
                .then((response) => {
                    console.log(response.data);
                    let access_token = response.data.access_token;
                    setAuth({
                        name: '',
                        cpf: '',
                        email: '',
                        access_token,
                    });
                })
                .catch((e) => console.log(e));
            return '';
        } catch (error) {
            console.log(`Erro no login: ${error}`);
            setAuth({
                name: '',
                cpf: '',
                email: '',
                access_token: '',
            });

            return 'Ops :( erro no login, por favor confirme seus dados';
        }
    }

    function signOut() {
        setAuth({
            name: '',
            cpf: '',
            email: '',
            access_token: '',
        });
    }

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                authData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
