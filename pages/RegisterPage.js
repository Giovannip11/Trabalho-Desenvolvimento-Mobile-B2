import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, Button, TextInput, ScrollView, View, Alert, ImageBackground } from 'react-native';
import UVv_Campus from '../assets/UVv_Campus.jpg';
import { supabase } from '../Utils/supabase';

export default function CreateGroup({ navigation }) {
  const [groupName, setGroupName] = useState('');
  const [presentationDate, setPresentationDate] = useState('');
  const [members, setMembers] = useState([{ name: '', course: '' }]);

  const addMember = () => {
    setMembers([...members, { name: '', course: '' }]);
  };

  const removeMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const updateMember = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  // Função para validar o formato da data (YYYY-MM-DD)
  const isValidDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  };

  // Função para criar grupo e adicionar membros
  const handleCreateGroup = async () => {
    if (!groupName || !presentationDate || members.some(m => !m.name || !m.course)) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!isValidDate(presentationDate)) {
      Alert.alert('Erro', 'A data de apresentação deve estar no formato YYYY-MM-DD.');
      return;
    }

    try {
      // 1. Inserir o grupo na tabela gruposInova
      const { data: groupData, error: groupError } = await supabase
        .from('gruposInova')
        .insert([
          {
            tema: groupName,
            diasApresentacao: presentationDate, // Data agora é inserida como texto
          },
        ])
        .select();

      if (groupError) {
        console.error('Erro ao criar grupo:', groupError.message);
        Alert.alert('Erro', 'Não foi possível criar o grupo.');
        return;
      }

      const newGroupId = groupData[0]?.id;

      // 2. Adicionar cada membro na tabela Alunos e IntegrantesGrupo
      for (const member of members) {
        // Inserir na tabela Alunos
        const { data: alunoData, error: alunoError } = await supabase
          .from('Alunos')
          .insert([
            {
              nome: member.name,
              curso: member.course,
            },
          ])
          .select();

        if (alunoError) {
          console.error('Erro ao adicionar aluno:', alunoError.message);
          Alert.alert('Erro', `Não foi possível adicionar o aluno ${member.name}.`);
          return;
        }

        const newAlunoId = alunoData[0]?.id;

        // Inserir na tabela IntegrantesGrupo
        const { error: integranteError } = await supabase.from('IntegrantesGrupo').insert([
          {
            idGrupo: newGroupId,
            idAluno: newAlunoId,
          },
        ]);

        if (integranteError) {
          console.error('Erro ao associar aluno ao grupo:', integranteError.message);
          Alert.alert('Erro', `Não foi possível associar o aluno ${member.name} ao grupo.`);
          return;
        }
      }

      Alert.alert('Sucesso', 'Grupo criado com sucesso!');
      navigation.navigate('Main');
    } catch (error) {
      console.error('Erro inesperado:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  return (
    <ImageBackground style={styles.background} source={UVv_Campus}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Criar Novo Grupo</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Nome do Grupo"
            value={groupName}
            onChangeText={setGroupName}
          />

          <TextInput
            style={styles.textInput}
            placeholder="Data de Apresentação (YYYY-MM-DD)"
            value={presentationDate}
            onChangeText={setPresentationDate}
          />

          <Text style={styles.subtitle}>Integrantes:</Text>
          {members.map((member, index) => (
            <View key={index} style={styles.memberContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={`Nome do Integrante ${index + 1}`}
                value={member.name}
                onChangeText={(value) => updateMember(index, 'name', value)}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Curso"
                value={member.course}
                onChangeText={(value) => updateMember(index, 'course', value)}
              />
              <Button
                title="Remover Integrante"
                color="#FF3B30"
                onPress={() => removeMember(index)}
              />
            </View>
          ))}

          <Button title="Adicionar Integrante" color="#34C759" onPress={addMember} />

          <View style={styles.submitButton}>
            <Button title="Criar Grupo" color="#021E73" onPress={handleCreateGroup} />
          </View>
        </ScrollView>
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
  },
  scrollView: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#021E73',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#021E73',
    marginTop: 20,
    marginBottom: 10,
  },
  textInput: {
    borderColor: '#021E73',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  memberContainer: {
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 20,
  },
});
