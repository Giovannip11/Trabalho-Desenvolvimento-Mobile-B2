import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, Button, ImageBackground, View, TextInput, Alert } from 'react-native';
import { supabase } from '../Utils/supabase'; // Verifique se você está importando o supabase corretamente
import UVv_Campus from '../assets/UVv_Campus.jpg';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');

  // Função para enviar o email de redefinição de senha
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail');
      return;
    }

    try {
      // Enviar o e-mail de redefinição de senha
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Sucesso', 'Um e-mail de redefinição foi enviado para você.');
        setEmail(''); // Limpar o campo de e-mail após o envio
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail de redefinição:', error.message);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar enviar o e-mail de redefinição');
    }
  };

  return (
    <ImageBackground style={styles.background} source={UVv_Campus}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Esqueci minha Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          title="Enviar Email de Redefinição"
          color="#023373"
          onPress={handleResetPassword}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
