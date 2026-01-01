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

export interface UpdateMyProfile {
  username: string;
  fullname: string;
  date_of_birth: Date | undefined;
  gender: "MALE" | "FEMALE" | "";
  phone_number: string;
}
