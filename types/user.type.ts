export interface UserDecodedPayload {
  payload: {
    user_id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface NavigationListProfileUserSettings {
  id: number;
  title: string;
  url?: string;
  value: string;
}
