import { UserLinkedAccount } from "./UserLinkedAccount";

export interface AppUser {
    id?: string;
    displayName?: string;
    sub?: string;
    linkedAccounts: UserLinkedAccount[];
}