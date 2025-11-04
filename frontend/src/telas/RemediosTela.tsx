import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, ImageBackground, ScrollView} from 'react-native';
import { Checkbox } from '@futurejj/react-native-checkbox';
import { Plus } from 'lucide-react-native';


import { Menu, Percent, Truck, CalendarClock, Camera, PlusCircle, ArrowLeft, ArrowRight } from 'lucide-react-native';

//importando os estilo
import {cores} from '../constantes/cores';
import {styles} from '../style/homeStyle';


const RemediosTela: React.FC = function(){

    const Header = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity>
        <Menu color={cores.primaria} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Remedios</Text>
      <View style={{ width: 28 }} />
    </View>
  );

  //data da lista
  const CardData = () => (
    <View style={styles.viewData}>
        <TouchableOpacity><ArrowLeft /></TouchableOpacity>
        <Text>Hoje - 22 de Outubro</Text>
        <TouchableOpacity><ArrowRight /></TouchableOpacity>
    </View>
  )

  

    //use state para se tiver remedios
  const [temRemedio, setRemedio] = useState(0);

  if(temRemedio){
    var titulo = "Medicamentos para Hoje";
  }else{
    var titulo = "Nao ha Medicamentos para hoje";
  }


   // Componente para o cabeçalho de uma seção
  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
    </View>
  );

  const [checked, setChecked] = useState(false);

  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  // Componente para o banner principal (Clube CareHub)
  const CardListaRemedio = () => (
    <View style={styles.cardRemedio}>
    <View style={styles.cardRemedioText}>
        <Text style={styles.textoNormal}>08:00</Text>
        <Text style={styles.textoNormal}>clonazepam 2mg</Text>
    </View>
    <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={toggleCheckbox}
      />

    </View>
  );

  const ButtonAddRemedio = () =>(
    <TouchableOpacity style={styles.plusButton}>
      <Plus size={35}/>
    </TouchableOpacity>
  )

  


    return(
        <ScrollView style={styles.screenContainer} >
          
            <Header />
            <CardData />
            <SectionHeader title={titulo} />
          
            <ButtonAddRemedio />
            
        </ScrollView>
    );

}

export default RemediosTela;