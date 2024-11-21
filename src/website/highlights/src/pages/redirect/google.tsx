import { useGoogleAPI } from "@/features/integrations/google";

export default function Google() {
    const { userManager } = useGoogleAPI();
    userManager?.signinCallback();
    return;
}