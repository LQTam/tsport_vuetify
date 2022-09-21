export interface UserResource {
    id: number,
    email: string,
    password: string,
    name: string,
    role: string[] 
}

export interface CustomerResource {
    id: number,
    fname: string,
    lname: string,
}

export interface SupplierResource extends CustomerResource {
    supplier_code: string;
}

export interface RoleResource {
    id: number;
    name: string;
}