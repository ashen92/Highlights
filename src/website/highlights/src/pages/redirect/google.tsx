import { useGoogleAPI } from "@/features/integrations/google/GoogleAPIContext";

export default function Google() {
    const { userManager } = useGoogleAPI();
    userManager?.signinCallback();
    return;
}