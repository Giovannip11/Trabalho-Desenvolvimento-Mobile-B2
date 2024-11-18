import { View, Text, StyleSheet } from 'react-native';

export default function Card({ elemento }) {
  return (
    <View style={styles.card}>
      <Text style={styles.props}>Nome do grupo:</Text> 
      <Text>{elemento.nome}</Text> 
      
      <Text style={styles.props}>Descrição do projeto:</Text> 
      <Text>{elemento.descricao}</Text>
      
      <Text style={styles.props}>Integrantes:</Text>
      {
        elemento.integrantes && elemento.integrantes.length > 0 ? (
          elemento.integrantes.map((integrante, index) => (
            <Text key={index}> => {integrante} </Text>
          ))
        ) : (
          <Text>Sem integrantes</Text>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    margin: 20,
  },
  props: {
    fontWeight: 'bold',
  },
});



  
