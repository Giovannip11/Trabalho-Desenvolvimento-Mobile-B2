import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, Button, ImageBackground, View, TextInput, Image, Alert } from 'react-native';
import UVv_Campus from '../assets/UVv_Campus.jpg';
import UVv_Logo from '../assets/UVV.png';
import { supabase } from '../Utils/supabase';

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.error('Erro no login:', error.message);
  
        if (error.message.includes('Invalid login credentials')) {
          Alert.alert('Erro', 'Credenciais de login inválidas. Verifique seu e-mail e senha.');
        } else {
          Alert.alert('Erro', error.message);
        }
        return;
      }
  
      // Login bem-sucedido, redirecionar para a página principal
      navigation.navigate('Main');
    } catch (error) {
      console.error('Erro inesperado:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    }
  };
  
  return (
    <ImageBackground style={styles.background} source={UVv_Campus}>
      <SafeAreaView style={styles.container}>
        <Image style={styles.logo} source={UVv_Logo} />

        <TextInput
          style={styles.textInput}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.textInput}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={true}
        />

        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              title="Login"
              color="#021E73"
              onPress={handleLogin}
            />
          </View>

          <View style={styles.button}>
            <Button
              title="Register"
              color="#021E73"
              onPress={() => navigation.navigate('Register')}
            />
          </View>

          <View style={styles.button}>
            <Button
              title="Esqueci a Senha"
              color="#021E73"
              onPress={() => navigation.navigate('ForgetPassword')}
            />
          </View>
        </View>
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
    width: '85%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#ffffffcc',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    borderColor: '#021E73',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 8,
    color: '#333',
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
    width: '60%',
  },
});
