import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Estilos, { corPrincipal } from '../styles/Estilos';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { enderecoServidor } from '../utils';

export default function CadCategorias({navigation, route}) {
    const [inputNome, setInputNome] = useState('');
    const [inputTipo, setInputTipo] = useState('');
    const [inputCor, setInputCor] = useState('');
    const [inputIcone, setInputIcone] = useState('');
    const [inputGastoFixo, setInputGastoFixo] = useState(false);
    const [usuario, setUsuario] = useState({});

    useEffect(() => {    
        buscarUsuarioLogado()
    }, [])

    useEffect(() => { 
        if (route.params && route.params.Categoria) {
            setInputNome(route.params.Categoria.nome);
            setInputTipo(route.params.Categoria.tipo_transacao);
            setInputCor(route.params.Categoria.cor);
            setInputIcone(route.params.Categoria.icone);
        }
    }, [route])

    const buscarUsuarioLogado = async () => {
        const usuarioLogado = await AsyncStorage.getItem("UsuarioLogado");
        if (usuarioLogado) {
            setUsuario(JSON.parse(usuarioLogado));
        } else {
            navigation.navigate('Login');
        }
    }

    const botaoSalvar = async () => {
        try {
            if (inputNome === '' || inputTipo === '' || inputCor === '' || inputIcone === '') {
                throw new Error('Preencha todos os campos');
            }

            let endpoint = `${enderecoServidor}/categorias`;
            let metodo = 'POST';

            if (route.params && route.params.Categoria) {
                endpoint = `${enderecoServidor}/categorias/${route.params.Categoria.id_Categoria}`;
                metodo = 'PUT';
            }

            const resposta = await fetch(endpoint, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario.token}`,
                },
                body: JSON.stringify({
                    nome: inputNome,
                    tipo_Categoria: inputTipo,
                    cor: inputCor,
                    icone: inputIcone,
                    gasto_Fixo: inputGastoFixo,
                    ativo: true
                }),
            });

            if (resposta.ok) {
                alert('Categoria cadastrada com sucesso!');
                navigation.goBack();
            } else {
                const erro = await resposta.json();
                console.error('Erro na resposta:', erro);
                alert('Erro ao cadastrar conta: ' + erro.message);
            }
        } catch (error) {
            console.error('Erro ao salvar conta', error);
            alert('Erro: ' + error.message);
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress={botaoSalvar}>
              <MaterialIcons name="save" size={24} color={'#fff'} style={{marginRight: 15}}  />
            </TouchableOpacity>
          ),
        });
      }, [navigation, inputNome, inputTipo, inputCor, inputIcone, inputGastoFixo]);

    return (
        <View style={Estilos.conteudoHeader}>
            <View style={Estilos.conteudoCorpo}>
                <Text>Nome da Categoria:</Text>
                <TextInput placeholder='Digite o nome da categoria' 
                    value={inputNome} onChangeText={setInputNome} 
                    style={Estilos.input}/>

                <Text>Tipo da Transação:</Text>
                <TextInput placeholder='Digite o tipo da transação' 
                    value={inputTipo} onChangeText={setInputTipo} 
                    style={Estilos.input}/>

                <Text>Cor:</Text>
                <TextInput placeholder='Digite a cor em Hexadecimal' 
                    value={inputCor} onChangeText={setInputCor} 
                    style={Estilos.input}/>

                <Text>Ícone:</Text>
                <TextInput placeholder='Digite o ícone'
                    value={inputIcone} onChangeText={setInputIcone}
                    style={Estilos.input}/>

                
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Switch value={inputGastoFixo} 
                        onValueChange={setInputGastoFixo} />
                    <Text>Gasto Fixo</Text>
                    
                </View>
            </View>
        </View>
    );
}

