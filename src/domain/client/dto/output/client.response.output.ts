export class ClientResponseOutput {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  photos: string[];
  role: string;
  active: boolean;
}

export type SafeClientResponseOutput = Omit<ClientResponseOutput, 'password'>;
