import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Estilos, { corPrincipal } from '../styles/Estilos';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { enderecoServidor } from '../utils';

export default function CadContas({navigation, route}) {
    const [inputNome, setInputNome] = useState('');
    const [inputTipo, setInputTipo] = useState('');
    const [inputSaldo, setInputSaldo] = useState('');
    const [inputContaPadrao, setInputContaPadrao] = useState(false);
    const [usuario, setUsuario] = useState({});

    useEffect(() => {    
        buscarUsuarioLogado()
    }, [])

    useEffect(() => { 
        if (route.params && route.params.Conta) {
            setInputNome(route.params.Conta.nome);
            setInputTipo(route.params.Conta.tipo_conta);
            setInputSaldo(route.params.Conta.saldo.toString());
            setInputContaPadrao(route.params.Conta.conta_padrao);
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
            if (inputNome === '' || inputTipo === '' || inputSaldo === '') {
                throw new Error('Preencha todos os campos');
            }

            let endpoint = `${enderecoServidor}/contas`;
            let metodo = 'POST';

            if (route.params && route.params.Conta) {
                endpoint = `${enderecoServidor}/contas/${route.params.Conta.id_conta}`;
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
                    tipo_conta: inputTipo,
                    saldo: parseFloat(inputSaldo),
                    conta_padrao: inputContaPadrao,
                    ativo: true
                }),
            });

            if (resposta.ok) {
                alert('Conta cadastrada com sucesso!');
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
      }, [navigation, inputNome, inputTipo, inputSaldo, inputContaPadrao]);

    return (
        <View style={Estilos.conteudoHeader}>
            <View style={Estilos.conteudoCorpo}>
                <Text style={{}}>Nome da Conta:</Text>
                <TextInput placeholder='Digite o nome da conta' 
                
                    value={inputNome} onChangeText={setInputNome} 
                    style={Estilos.input}/>
                <Text>Tipo da Conta:</Text>

                <TextInput placeholder='Digite o tipo da conta' 
                    value={inputTipo} onChangeText={setInputTipo} 
                    style={Estilos.input}/>
                <Text>Saldo da Conta:</Text>

                <TextInput placeholder='Digite o saldo da conta' 
                    value={inputSaldo} onChangeText={setInputSaldo} 
                    style={Estilos.input} keyboardType='numeric'/>
                
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Switch value={inputContaPadrao} 
                        onValueChange={setInputContaPadrao} />
                    <Text>Conta Padrão</Text>
                </View>
            </View>
        </View>
    );
}