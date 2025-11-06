//aqui vamos definir as cores do nosso aplicativo

interface PaletaCores{
    primaria: string;
    secundaria: string;
    destaque: string;
    fundo: string;
    preto: string;
    branco: string;
    azulEscuro: string;
    azulClaro: string;

}

//agora vamos exportar o obejto para os outros arquivopds poderem acessar ele
//funcao construtora
export const cores: PaletaCores = {
    primaria: '#57CC99',
    secundaria: '#38a2a3',
    destaque: '#5838a3',
    fundo: '#c7f9cc',
    preto: '#000000',
    branco: '#ffffff',
    azulEscuro: '#0B3D91',
    azulClaro: '#0097A7',
};