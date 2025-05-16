export const corPrincipal = '#3498db';
export const corSecundaria = '#2980b9';
export const corTextos = '#f2f2f2';
export const corTextos2 = '#999';
export const corPreto = '#222';
export const corFundo = '#0d0d0d';
export const corFundo2 = '#262626';
export const corBorda = '#262626';


const Estilos = {
    conteudo : {
        flex : 1,
        width : '100%',
        backgroundColor: corFundo
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#f4f6f8',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 45,
        fontSize: 16,
        color: corPreto,
        borderWidth: 1,
        borderColor: corBorda,
    },
    inputActive: {
        borderColor: corPrincipal,
        backgroundColor: 'rgba(52, 152, 219, 0.05)',
    },
    inputIcon: {
        position: 'absolute',
        left: 15,
        top: 15,
        zIndex: 1,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 1,
    },
    botao: {
        width: '100%',
        height: 55,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
    },
    degradeBotao: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    botaoTexto: {
        color: corTextos,
        fontSize: 16,
        fontWeight: 'bold',
    },
}

export default Estilos;