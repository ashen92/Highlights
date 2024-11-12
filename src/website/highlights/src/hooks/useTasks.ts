import { User } from "@/features/auth";
import { getTasks } from "@/services/api";
import useSWR from "swr";


// export const useTasks = () => {
//     // const { data, error } = useSWR('/tasks', getTasks);
//     const { data, error } = useSWR('/highlights', getTasks);

//     return {
//         tasks: data,
//         isLoading: !error && !data,
//         isError: error
//     };


// }


// export const useTasks = () => {


//     return {
//         tasks: data,
//         isLoading: !error && !data,
//         isError: error
//     };


// import { AppUser, useAppUser } from '@/hooks/useAppUser';

export const useTasks = (user: User) => {
    const { data, error } = useSWR(user ? ['/highlights', user] : null, () => getTasks(user));

    return {
        tasks: data,
        isLoading: !error && !data,
        isError: error
    };
};