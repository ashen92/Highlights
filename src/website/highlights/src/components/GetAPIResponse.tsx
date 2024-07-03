import { fetchAPI } from "@/lib/api";
import { Button } from "@mantine/core";
import { useState } from "react";

type Greeting = {
    greeting: string;
}

export default function GetAPIResponse() {
    const [response, setResponse] = useState<Greeting>();

    async function getData() {
        setResponse(await fetchAPI("greeting", {}, { method: "GET" }) ?? "No response");
    }

    return (
        <>
            <Button onClick={getData}>Call API
            </Button>
            <div>
                {response ? <p>{response.greeting}</p> : null}
            </div>
        </>
    );
}