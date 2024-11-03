export const LinkedAccount = {
    Microsoft: "Microsoft",
    Google: "Google",
} as const;

export type LinkedAccount =
    (typeof LinkedAccount)[keyof typeof LinkedAccount];