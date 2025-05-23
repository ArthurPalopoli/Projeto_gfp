import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Estilos, { corPrincipal } from '../styles/Estilos';
import { enderecoServidor } from '../utils';

export default function Categorias({ navigation}) {
  const [dadosLista, setDadosLista] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [atualizando, setAtualizando] = useState(false);


  const buscarDados = async () => {
    try {
      const resposta = await fetch(`${enderecoServidor}/categorias`, {
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
      buscarDados();
  }, [usuario]);
  

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
      const resposta = await fetch(`${enderecoServidor}/categorias/${id}`, {
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
        <View style={[Estilos.iconeLista, { backgroundColor: item.cor }]}>
            <MaterialIcons name={item.icone} size={24} color= '#fff' />
        </View>
        <View style={Estilos.textContainer}>
          <Text style={Estilos.nomeLista}>{item.nome}</Text>
          <Text style={Estilos.tipoTransacao}>{item.tipo_transacao}</Text>
        </View>
        <MaterialIcons name="edit" size={24} color={corPrincipal} 
          onPress={() => navigation.navigate('CadCategorias', {cor: item.cor})}
        />
        <MaterialIcons name="delete" size={24} color= 'red' 
          onPress={() => botaoExcluir(item.id_categoria)}
        />
      </TouchableOpacity>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity >
          <MaterialIcons name="add" size={24} color={'#fff'} style={{marginRight: 15}}  />
        </TouchableOpacity>
      ),
    });
  }, [navigation])
    

  return (
    <View style={Estilos.conteudoHeader}>
      <View style={Estilos.conteudoCorpo}>
        <Text>Categorias</Text>
        <FlatList
          data={dadosLista}
          renderItem={exibirItemLista}
          keyExtractor={(item) => item.id_categoria.toString()}
          refreshControl= {
            <RefreshControl refreshing={atualizando} onRefresh={buscarDados} /> 
          }
        />
      </View>
    </View>
  );
}