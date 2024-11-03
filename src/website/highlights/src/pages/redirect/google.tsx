import { useUserManager } from '../_app';

export default function Google() {
    const userManager = useUserManager();
    userManager.signinCallback();
    return;
}