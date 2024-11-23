import { UserLinkedAccount } from "./UserLinkedAccount";

export interface User {
    id?: string;
    sub?: string;
    linkedAccounts: UserLinkedAccount[];
}