import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { cores } from '../frontend/src/constantes/cores';

type Props = {
  texto?: string;
  onPress?: (event?: GestureResponderEvent) => void;
};

const BotaoVoltar: React.FC<Props> = ({ texto = 'Voltar', onPress }) => {
  // menos restrito para evitar erros de tipo em projetos com diferentes navigators
  const navigation = useNavigation<any>();

  const handlePress = (e?: GestureResponderEvent) => {
    if (onPress) {
      try {
        onPress(e);
      } catch (err) {
        // silencioso para não quebrar a navegação
      }
    }

    try {
      if (navigation && typeof navigation.goBack === 'function') {
        navigation.goBack();
        return;
      }
    } catch (err) {
      // se falhar, não quebra a experiência
    }
  };

  return (
    <TouchableOpacity
      style={styles.botao}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      testID="botao-voltar"
    >
      <ArrowLeft color={cores.primaria ?? '#007bff'} size={22} />
      <Text style={styles.texto}>{texto}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: cores.cinzaClaro ?? '#f3f3f3',
  },
  texto: {
    color: cores.secundaria ?? '#007bff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default BotaoVoltar;
