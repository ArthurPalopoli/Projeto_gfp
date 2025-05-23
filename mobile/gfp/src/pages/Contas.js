import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Estilos, { corPrincipal } from '../styles/Estilos';
import { enderecoServidor } from '../utils';
import { useIsFocused } from '@react-navigation/native';

export default function Contas({ navigation}) {
  const [dadosLista, setDadosLista] = useState([]);
  const [usuario, setUsuario] = useState({});

  const isFocused = useIsFocused();

  const buscarDados = async () => {
    try {
      const resposta = await fetch(`${enderecoServidor}/contas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usuario.token}`,
        },
    });
      const dados = await resposta.json();
      setDadosLista(dados);
    } catch (error) {
      console.error('Erro ao buscar dados', error);
    }
  };


  //Executa essa funçõa quando o componente é criado [ vazio]
  useEffect(() => {
      buscarUsuarioLogado();
  }, []);

  //Executa essa função quando o usuário é
  useEffect(() => {
    if (isFocused === true) {
      buscarDados();
    }
  }, [usuario, isFocused]);
  

  const buscarUsuarioLogado = async () => {
    const usuarioLogado = await AsyncStorage.getItem("UsuarioLogado");
    if (usuarioLogado) {
      setUsuario(JSON.parse(usuarioLogado));
    } else {
      navigation.navigate('Login');
    }
  }

  const botaoExcluir = async (id) => {
    try {
      const resposta = await fetch(`${enderecoServidor}/contas/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usuario.token}`,
          },
    });

    if (resposta.ok) {
        buscarDados();
      } 

    } catch (error) {
      console.error('Erro ao excluir', error);
    }
  }

  const exibirItemLista = ({ item }) => {
    return (
      <TouchableOpacity style={Estilos.itemLista}>
        <Image source={require('../assets/logo.png')} style={Estilos.imagemLista} />
        <View style={Estilos.textContainer}>
          <Text style={Estilos.tipoConta}>{item.tipo_conta}</Text>
          <Text style={Estilos.nomeLista}>{item.nome}</Text>
        </View>
        <MaterialIcons name="edit" size={24} color={corPrincipal} 
          onPress={() => navigation.navigate('CadContas', {Conta: item})}
        />
        <MaterialIcons name="delete" size={24} color={corPrincipal} 
          onPress={() => botaoExcluir(item.id_conta)}
        />
      </TouchableOpacity>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('CadContas')}>
          <MaterialIcons name="add" size={24} color={'#fff'} style={{marginRight: 15}}  />
        </TouchableOpacity>
      ),
    });
  }, [navigation])
    

  return (
    <View style={Estilos.conteudoHeader}>
      <View style={Estilos.conteudoCorpo}>
        <Text>Contas</Text>
        <FlatList
          data={dadosLista}
          renderItem={exibirItemLista}
          keyExtractor={(item) => item.id_conta.toString()}
        />
      </View>
    </View>
  );
}