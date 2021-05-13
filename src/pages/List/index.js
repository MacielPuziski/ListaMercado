import React, { useState, useCallback, useEffect} from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Modal, TextInput, AsyncStorage, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ItemsList from '../../components/ItemstList';
import * as Animatable from 'react-native-animatable';

const AnimatableBtn = Animatable.createAnimatableComponent( TouchableOpacity )

export default function List(){
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    async function loadItems(){
      const taskStorage = await AsyncStorage.getItem('@items');
    
      if(taskStorage){
        setItems(JSON.parse(taskStorage));
      }
    }

    loadItems();
  }, []);

  useEffect(() => {
    async function saveITems(){
      await AsyncStorage.setItem('@items', JSON.stringify(items));
    }

    saveITems();

  }, [items]);  

  function handleAdd(){
    if (input === '') return;

    const data = {
      key: items.length + 1,
      item: input
    } 

    setItems( [...items, data]);
    setOpen(false);
    setInput('');

  }

  const handleDelete = useCallback((data) => {
    Alert.alert("Atenção","Deseja remover este item?",
    [
      {
        text: "Cancel",
        onPress: () => {
          return;
        }
      },
      {
        text: "Ok",
        onPress: () => {
          setItems(items.filter(r => r.key !== data.key));
        }
      }
    ],
    { cancelable: false }  
    )
  })

  return(
    <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor='#171d31' barStyle="light-content"></StatusBar>
      
      <View style={styles.content}>
        <Text style={styles.title}>Lista Mercado</Text>
      </View>

      <FlatList
      marginHorizontal={10}
      showsHorizontalScrollIndicator={false}
      data={items}
      keyExtractor={ (item) => String(item.key)}
      renderItem={ ({ item }) => <ItemsList data={item} handleDelete={handleDelete}/> }
      />

      <Modal animationType="slide" transparent={false} visible={open} >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={ () => setOpen(false) }>
              <Ionicons style={{marginLeft: 5, marginRight: 5}} name="md-arrow-back" size={40} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}> Adicionar item</Text>
          </View>

          <Animatable.View style={styles.modalBody} animation="fadeInUp" useNativeDriver>
            <TextInput
            multiline={true}
            placeholderTextColor="#747474"
            autoCorrect={false}
            autoFocus={true}
            placeholder="Inserir um item para comprar"
            style={styles.input}
            onChangeText={ text => setInput(text)}
            value={input}
            >
            </TextInput>

            <TouchableOpacity style={styles.handlerAdd} onPress={() => handleAdd()}>
              <Text style={styles.handlerAddText} > Cadastrar </Text> 
            </TouchableOpacity>
          </Animatable.View>
        </SafeAreaView>
      </Modal>

      <AnimatableBtn 
      style={styles.fab}
      useNativeDriver
      animation="bounceInUp"
      duration={1500}
      onPress={ () => setOpen(true) }
      >
        <Ionicons name="ios-add" size={50} color="#FFF" />
     </AnimatableBtn> 
  </SafeAreaView>  
  );

}

const styles = StyleSheet.create({
  container:{
    flex:1, 
    backgroundColor: '#171d31',
  },
  title:{
    marginTop: 30,
    paddingBottom: 20,
    fontSize: 25,
    textAlign: 'center',
    color: '#FFF'
  },
  fab:{
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0094FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#FFF',
    shadowOpacity: 0.2,
    shadowOffset:{
      width: 1,
      height: 3,
    }
  },
  modal:{
    flex:1, 
    backgroundColor: '#171d31',
  },
  modalHeader:{
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle:{
    marginLeft: 15,
    fontSize: 23,
    color: '#FFF',
  },
  input:{
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: '#FFF',
    padding: 9,
    height: 85,
    textAlignVertical: 'top',
    color: '#000',
    borderRadius: 5
  },
  handlerAdd:{
    backgroundColor: '#FFF',
    marginTop: 10,
    alignItems:  'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5
  },
  handlerAddText:{
    fontSize: 20,
  }
});