import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, SafeAreaView, Image } from 'react-native';

export default function AssetExample() {
  const [text, onChangeText] = useState('');
  const [number, onChangeNumber] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={require('../assets/UVV.png')} />
      <Text style={styles.label}></Text>
      <TextInput
        style={styles.textInput}
        onChangeText={onChangeText}
        value={text}
        placeholder="Username ou email"
      />
      <TextInput
        style={styles.textInput}
        onChangeText={onChangeNumber}
        value={number}
        keyboardType="numeric"
        placeholder="Password"
        secureTextEntry={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',  
  },
  logo: {
    width: 100,  
    height: 100,
    marginBottom: 20,  
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',  
    paddingHorizontal: 10,
    marginBottom: 20,  
    borderRadius: 5,   
  },
});