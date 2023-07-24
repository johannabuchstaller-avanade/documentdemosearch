export interface IUserData {
  initials: string;
  datasource: string;
}


export interface IUserState {
  data: IUserData;
  authenticated: boolean;
}