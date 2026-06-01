
export type UserRole = "DEV" | "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
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