export interface CognitoUser {
  username: string;
  attributes: Record<string, string>;
  createdAt: Date;
  lastModifiedAt: Date;
  status: string;
  enabled: boolean;
}

export interface SignInResponse {
  sub?: string;
  emailVerified?: boolean;
}
