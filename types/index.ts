export type User = {
  email: string;
  family_name?: string;
  given_name?: string;
  locale?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  sid?: string;
  sub?: string;
  updated_at?: string;
};

export type Session = {
  creationTimestamp: Date;
  expirationTimestamp: Date;
  createdBy: string;
  participant: string | null;
  sessionStatus: "active" | "inactive" | "expired";
};
