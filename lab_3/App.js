import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Feather } from '@expo/vector-icons';

const MyButton = () => {
  return (
    <View style={styles.container}>
      <Feather name="camera" size={24} color="black" />
      <Button title="Tomar una foto" onPress={() => console.log('Button pressed')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyButton;
