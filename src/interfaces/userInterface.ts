import { $Enums } from "@prisma/client";

export interface IUser {
  id: string;
  email: string;
  username: string;
  fullname: string;
  password: string;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null; // Optional field for soft delete
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
