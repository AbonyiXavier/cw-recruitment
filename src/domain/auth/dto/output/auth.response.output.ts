export class AuthResponseOutput {
  accessToken: string;
  client: {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar: string;
    photos: string[];
    createdAt: Date;
    updatedAt: Date;
  };
}
