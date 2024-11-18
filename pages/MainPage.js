import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, StyleSheet, FlatList, View, Alert, ImageBackground, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { supabase } from '../Utils/supabase';
import UVv_Campus from '../assets/UVv_Campus.jpg';

export default function Main({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Controle do Modal
  const [selectedGroup, setSelectedGroup] = useState(null); // Grupo selecionado
  const [rating, setRating] = useState(''); // Nota do grupo
  const [feedback, setFeedback] = useState(''); // Feedback opcional
  const [showDetails, setShowDetails] = useState({}); // Controle de visibilidade dos detalhes

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('gruposInova')
        .select(`
          id,
          nomeGrupo,
          diasApresentacao,
          IntegrantesGrupo (
            Alunos (nome, curso)
          )
        `);

      if (error) throw error;

      // Formata os dados, extraindo os nomes e cursos dos alunos
      const formattedData = data.map(group => ({
        ...group,
        integrantes: group.IntegrantesGrupo.map(i => ({
          nome: i.Alunos?.nome || 'Desconhecido',
          curso: i.Alunos?.curso || 'Desconhecido',
        })),
      }));

      setGroups(formattedData);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error.message);
    }
  };

  // Buscar grupos ao carregar a tela
  useEffect(() => {
    fetchGroups();
  }, []);

  // Função para abrir o modal de avaliação
  const openModal = (group) => {
    setSelectedGroup(group); // Define o grupo selecionado
    setIsModalVisible(true); // Abre o modal
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalVisible(false);
    setRating('');
    setFeedback('');
  };

  // Função para salvar a avaliação
  const submitRating = async () => {
    if (rating < 1 || rating > 10) {
      Alert.alert('Erro', 'A nota deve ser entre 1 e 10');
      return;
    }

    // Inserir os dados de avaliação na tabela 'Avaliacoes'
    try {
      const { error } = await supabase
        .from('Avaliacoes')
        .insert([
          {
            idGrupo: selectedGroup.id,
            nota: rating,
            feedback: feedback,
          },
        ]);

      if (error) {
        throw error;
      }

      // Fechar o modal após salvar
      closeModal();
      Alert.alert('Avaliação', 'Sua avaliação foi registrada!');
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error.message);
      Alert.alert('Erro', 'Ocorreu um erro ao registrar sua avaliação');
    }
  };

  // Função para alternar a visibilidade dos detalhes
  const toggleDetails = (groupId) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [groupId]: !prevState[groupId],
    }));
  };

  // Renderizar cada item (grupo)
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.groupTitle}>Nome do grupo: {item.nomeGrupo}</Text>
      <Text style={styles.presentationDate}>Data de Apresentação: {item.diasApresentacao}</Text>

      {/* Botão para Avaliar o Grupo */}
      <TouchableOpacity 
        style={styles.evaluateButton} 
        onPress={() => openModal(item)}
      >
        <Text style={styles.buttonText}>Avaliar Grupo</Text>
      </TouchableOpacity>

      {/* Botão para Mostrar Detalhes */}
      <TouchableOpacity
        style={styles.showDetailsButton}
        onPress={() => toggleDetails(item.id)}
      >
        <Text style={styles.buttonText}>{showDetails[item.id] ? 'Ocultar Detalhes' : 'Ver Detalhes'}</Text>
      </TouchableOpacity>

      {/* Exibir os detalhes do grupo, se visível */}
      {showDetails[item.id] && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Detalhes do Grupo:</Text>
          <Text style={styles.detailsText}>Data de Apresentação: {item.diasApresentacao}</Text>
          {item.integrantes && item.integrantes.length > 0 ? (
            item.integrantes.map((member, index) => (
              <View key={index}>
                <Text style={styles.detailsText}>Integrante: {member.nome}</Text>
                <Text style={styles.detailsText}>Curso: {member.curso}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noMembers}>Nenhum integrante</Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <ImageBackground source={UVv_Campus} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Lista de Grupos */}
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum grupo encontrado</Text>}
        />

        {/* Botão para criar grupo */}
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => navigation.navigate('Create')}
        >
          <Text style={styles.buttonText}>Criar Grupo</Text>
        </TouchableOpacity>

        {/* Modal de Avaliação */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Avaliar {selectedGroup?.nomeGrupo}</Text>
              <TextInput
                style={styles.input}
                placeholder="Nota (1 a 10)"
                keyboardType="numeric"
                value={rating}
                onChangeText={setRating}
              />
              <TextInput
                style={styles.input}
                placeholder="Feedback (opcional)"
                multiline
                value={feedback}
                onChangeText={setFeedback}
              />
              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={closeModal} />
                <Button title="Enviar" onPress={submitRating} />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#021E73',
    marginBottom: 10,
  },
  presentationDate: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  integrantesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#021E73',
    marginTop: 10,
    marginBottom: 5,
  },
  memberName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  memberCourse: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
  noMembers: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    marginLeft: 10,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  createButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  evaluateButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  showDetailsButton: {
    backgroundColor: '#5AC8FA',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#021E73',
  },
  detailsText: {
    fontSize: 16,
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
