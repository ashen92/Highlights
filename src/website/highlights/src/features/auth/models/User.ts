import { UserLinkedAccount } from "./UserLinkedAccount";

export interface User {
    id?: string;
    displayName?: string;
    sub?: string;
    linkedAccounts: UserLinkedAccount[];
}