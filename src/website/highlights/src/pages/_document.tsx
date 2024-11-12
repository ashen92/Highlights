import { Head, Html, Main, NextScript } from 'next/document';
import { ColorSchemeScript } from '@mantine/core';
import Script from 'next/script';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <ColorSchemeScript defaultColorScheme="auto" />
                <link rel="icon" href="/favicon.png" sizes="any" />
                <Script strategy='beforeInteractive' src="https://accounts.google.com/gsi/client"></Script>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}