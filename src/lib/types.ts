export interface Task{
    _id: string,
    title: string,
    description: string,
    boardId: string,
    createdAt: string,
    updatedAt: string
    members: User[],
    order: number,
    laneId: string
  }

export interface Board{
    _id: string,
    title: string,
    description: string,
    owner: User,
    isFavorite: boolean,
    members: User[],
    lanes:{title:string, id:string}[]
    createdAt: string,
    updatedAt: string
    taskCount: number
}

export interface User{
    _id: string,
    name: string,
    email: string
}

export type TaskInput = {
    title: string;
    description?: string;
    laneId: string;
    members?: string[]; // IDs apenas
    order: number;
    boardId: string;
  };
  