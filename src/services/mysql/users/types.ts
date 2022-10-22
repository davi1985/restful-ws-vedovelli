export type User = {
  id?: number;
  email: string;
  password: string;
};

export interface Users {
  users: User[];
}

export interface UpdateUser {
  user: {
    id: number;
  };
  affectedRows: number;
}

export interface SaveUser {
  user: Omit<User, "password">;
}

export interface RemoveUser {
  message: string;
  affectedRows: number;
}
