import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NDI3NjUxMCwiZXhwIjoxOTU5ODUyNTEwfQ.nqTIftKSp0nLqqAyMhFrNvTMBKqa085yPpFfm8isT0s';
const SUPABASE_URL = 'https://ahxqtlxvajqbvihqvrnw.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
    .from('Mensagens')
    .on('INSERT', (respostalive) => {
        adicionaMensagem(respostalive.new);
    })
    .subscribe();
}

export default function ChatPage() {

    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
            .from('Mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data, error }) => {
                // console.log('Dados da consulta', data);
                setListaDeMensagens(data);
            });

        escutaMensagensEmTempoReal((novaMensagem) => {
            console.log('Nova mensagem', novaMensagem);
            // Quero reusar um valor de referência (objeto/array)
            // Passar uma função para o set state
            // setListaDeMensagens([
            //     novaMensagem,
            //     ...listaDeMensagens
            // ])
            setListaDeMensagens((valorAtualDaLista) => {
                return [
                    novaMensagem,
                    ...valorAtualDaLista,
                ]
            });
        });
    }, [])

    /*
    // Usuário
    - Usuario digita no textare
    - Aperta enter para enviar
    - Tem que adicionar o texto na listagem

    // Dev
    - [x] Campo criado
    - [x] Vamos usar o onChange usa o UseState (ter if pra caso seja enter para limpar a variável)
    - [ ] Lista de mensagem
    */

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem,
        };

        supabaseClient
            .from('Mensagens')
            .insert([
                // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
                mensagem
            ])
            .then(({ data }) => {
                console.log('Criando a mensagem', data);
            });

        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Image styleSheet={{
                height: '100%',
                maxWidth: '95%',
                maxHeight: '95vh',
                position: 'absolute',
                margin: 'auto',
            }}
                src={listaDeMensagens.length === 0 ? 'https://acegif.com/wp-content/uploads/loading-2.gif' : ''}></Image>
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                    opacity: `${listaDeMensagens.length === 0 ? '0' : '1'}`,
                }}
            >
                <Header />

                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaDeMensagens} configuraALista={setListaDeMensagens} />
                    {/* listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    }) */}

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === "Enter" || event.key === "NumpadEnter") {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        {/* CallBack */}
                        <ButtonSendSticker 
                         onStickerClick={(sticker) => {
                            // console.log('[USANDO O COMPONENTE] clicou no sticker:', sticker);
                            handleNovaMensagem(':sticker: ' + sticker);
                         }}
                        />
                        <Box styleSheet={{
                            padding: '0 0 10px 0',
                            cursor: 'pointer',
                        }}
                            onClick={() => {
                                handleNovaMensagem(mensagem);
                            }}>
                            ➤
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {

    // function removeItem(posicao) {

    // }

    let mostraTexto;

    return (
        <Box
            tag="ul"
            styleSheet={{
                // Alteração
                overflow: 'auto',

                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {
                props.mensagens.map((mensagem) => {

                    return (
                        <Text
                            key={mensagem.id}
                            tag="li"
                            styleSheet={{
                                borderRadius: '5px',
                                padding: '6px',
                                marginBottom: '12px',
                                hover: {
                                    backgroundColor: appConfig.theme.colors.neutrals[700],
                                }
                            }}
                        >
                            <Box
                                styleSheet={{
                                    marginBottom: '8px',
                                }}
                            >
                                    <Image
                                        styleSheet={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            display: 'inline-block',
                                            marginRight: '8px',
                                            hover: {
                                                position: 'absolute',
                                                mozTransform: 'scale(5)',
                                                webkitTransform: 'scale(5)',
                                                transform: 'scale(5)',
                                            },
                                        }}
                                        src={`https://github.com/${mensagem.de}.png`}
                                    />


                                <Text tag="strong" styleSheet={{ display: 'inline' }} > {/* O display foi uma alteração*/}
                                    {mensagem.de}
                                </Text>
                                <Text
                                    styleSheet={{
                                        fontSize: '10px',
                                        marginLeft: '8px',
                                        color: appConfig.theme.colors.neutrals[300],
                                        // Altereção
                                        display: 'inline'
                                    }}
                                    tag="span"
                                >
                                    {(new Date().toLocaleDateString())}
                                </Text>
                                <Box styleSheet={{
                                    textAlign: 'right',
                                    cursor: 'pointer',
                                    opacity: 0.2,
                                    hover: {
                                        opacity: 1
                                    }
                                }}
                                    onClick={(e) => {
                                        // removeItem(mensagem);
                                    }}>
                                    ❌
                                </Box>
                            </Box>
                            {/* Declarativo */}
                                {/* Condicional: {mensagem.texto.startsWith(':sticker:').toString()} */}
                                {mensagem.texto.startsWith(':sticker:') 
                                ? (
                                    <Image src={mensagem.texto.replace(':sticker:', '')}/>
                                ) 
                                : (
                                    mensagem.texto
                                )}

                                {/* if mensagem de texto possui stickers:
                                    mostra imagem
                                else
                                    mensagem.texto */}

                            {/* {mensagem.texto} */}
                        </Text>
                    )
                })}
        </Box >
    )
}