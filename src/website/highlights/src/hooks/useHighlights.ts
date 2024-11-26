import { getHighlights } from "@/services/api";
import { User } from "@/features/auth";

import useSWR from "swr";

export const useHighlights = (user: User) => {
    const { data, error } = useSWR(user ? ['/highlights', user] : null, () => getHighlights(user));


    return {
        highlights: data,
        isHighlightsLoading: !error && !data,
        isHighlightsError: error
    };
}



