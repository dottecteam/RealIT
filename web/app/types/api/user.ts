
export type UserRole = "ADMIN" | "MEMBER" | "VIEWER";

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    role?: UserRole;
    password?: string;
}

export interface ServiceErrorResponse {
    error: true;
    status?: number;
    data: any;
}