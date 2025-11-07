import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
// Importa nossos estilos comuns (do homeStyle)
import { styles } from '../style/homeStyle'; 
import { cores } from '../constantes/cores';

// Esta é a nova tela real
const MeuPerfilTela: React.FC = () => {
  
  // PENSANDO NO BACK-END:
  // No futuro, usaríamos um 'useEffect' aqui para buscar
  // os dados do usuário na API, (ex: 'GET /api/usuarios/meu-perfil')
  // e preencher os 'useState'.

  // (Simulação de dados)
  const usuario = {
    nome: "Maria Rodrigues",
    email: "maria@email.com",
    telefone: "(11) 98765-4321",
    tipo: "Familiar"
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={{ padding: 20 }}>
        
        {/* Usando os estilos 'formTitle' e 'formSubtitle' do comumEstilos */}
        <Text style={styles.formTitle}>Meu Perfil</Text>
        <Text style={styles.formSubtitle}>
          Aqui você pode ver e editar seus dados.
        </Text>

        {/* Inputs (desabilitados por enquanto) */}
        <Text style={styles.inputLabel}>Nome</Text>
        <TextInput
          style={styles.input}
          value={usuario.nome}
          editable={false} // (Tornaremos editável no futuro)
        />
        
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={usuario.email}
          editable={false}
        />

        <Text style={styles.inputLabel}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={usuario.telefone}
          editable={false}
        />

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.buttonText}>Salvar Alterações (Em breve)</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};


export default MeuPerfilTela;