'use client';

import { apiClient } from '@/services/axios';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

export type roles = 'admin' | 'member' | 'customer' | '';

interface authData {
    access_token: string;
    role: roles;
}

const AuthContext = createContext<any>(undefined);

interface authProviderProps {
    children: ReactNode;
}
// This hook can be used to access the user info.
export function useAuth() {
    return useContext(AuthContext);
}
function useProtectedRoute(authData: authData) {
    const currentRoute = usePathname();
    const router = useRouter();
    const localStorageToken = localStorage.getItem('authToken');

    useEffect(() => {
        const inAuthGroup = currentRoute === '/login' || currentRoute === '/register' || currentRoute === '/';

        if (
            // If the user is not signed in and the current route is not anything in the auth group.
            !authData.access_token &&
            !localStorageToken &&
            !inAuthGroup
        ) {
            // Redirect to the initial page.
            router.replace('/');
        } else if (authData.role !== '' && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace('/profile');
        }
    }, [authData, currentRoute]); // Listens for any change in user state or path change
}

export function AuthProvider({ children }: authProviderProps) {
    const [authData, setAuth] = useState<authData>({
        role: '',
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
                    let role = response.data.role;
                    localStorage.setItem('authRole', role);
                    localStorage.setItem('authToken', access_token);
                    setAuth({
                        access_token,
                        role,
                    });
                })
                .catch((e) => console.log(e));
            return '';
        } catch (error) {
            console.log(`Erro no login: ${error}`);
            setAuth({
                access_token: '',
                role: '',
            });

            return 'Ops :( erro no login, por favor confirme seus dados';
        }
    }

    function signOut() {
        localStorage.removeItem('authRole');
        localStorage.removeItem('authToken');
        setAuth({
            access_token: '',
            role: '',
        });
    }

    useProtectedRoute(authData);

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
