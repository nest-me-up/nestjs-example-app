export interface ICreateUser {
  name: string
  email: string
}

export interface IUpdateUser extends ICreateUser {
  id: string
}

export interface IUser extends IUpdateUser {
  id: string
  createdAt: Date
}
