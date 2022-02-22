export function GlobalStyle() {
    return (
        <style global jsx>
            {`
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                list-style: none;
            }
            body{
                font-family: 'Open Sans', sans-serif;
            }
            /* App fit Height */
            html,body, #__next{
                min-height: 100vh;
                display: flex;
                flex: 1;
            }
            #__next {
                flex: 1;
            }
            #__next > *{
                flex: 1
            }
            /* ./App fit Height */
              
            *::-webkit-scrollbar {
                width: 9px;               /* width of the entire scrollbar */
            }
              
            *::-webkit-scrollbar-thumb {
                background-color: #212931;    /* color of the scroll thumb */
                border-radius: 20px;       /* roundness of the scroll thumb */
            }
              
            `}
        </style>
    );
}


export default function MyApp({ Component, pageProps }) {
    console.log('Roda em todas as paginas');
    return (
        <>
            <GlobalStyle />
            <Component {...pageProps} />
        </>
    );
}
