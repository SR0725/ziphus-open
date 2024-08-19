export enum Role {
  Bot = "Bot",
  User = "User",
}

export interface Chat {
  role: Role;
  content: string;
  cost: number;
  imagePaths?: {
    path: string;
    mimeType: "image/png" | "image/jpeg";
  }[];
}
