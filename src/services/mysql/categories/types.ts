export type Category = {
  id: number;
  name: string;
};

export interface Categories {
  categories: Category[];
}

export interface UpdateCategory {
  category: Category;
  affectedRows: number;
}

export interface SaveCategory {
  category: Category;
}

export interface RemoveCategory {
  message: string;
  affectedRows: number;
}
