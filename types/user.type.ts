export interface UserDecodedPayload {
  id: string;
  username: string;
  email: string;
  role: {
    id: string;
    name: string;
    rolePermission: [];
  };
}
