export enum AuthType {
  Discord = 'discord',
}

export type UserData = {
  name: string;
  email: string;
  roles?: string[];
};
