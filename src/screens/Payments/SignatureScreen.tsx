import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { set } from 'date-fns';
import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { ActivityIndicator, Appbar, Button, Modal, Portal, Text } from 'react-native-paper';
import Signature, { SignatureViewRef } from 'react-native-signature-canvas';
import { theme } from '~/core/theme';
import { UserDTO } from '~/dtos/UserDTO';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { api } from '~/services/api';

const SignatureScreen = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const signatureRef = useRef<SignatureViewRef>(null);
  const [visible, setVisible] = useState(true);
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserSignature();
  }, []);

  const getUserSignature = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/me');
      const user: UserDTO = response.data;
      if (user.hashed_signature) {
        setSignature(user.hashed_signature);
        setVisible(false);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a assinatura do usuário.');
      console.log('Erro ao buscar a assinatura do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignature = async (signature: string) => {
    console.log('Assinatura capturada:', signature);
    setSignature(signature);
    try {
      const response = await api.patch('/users/me', { hashed_signature: signature });
      Alert.alert('Sucesso', 'Assinatura salva com sucesso!');
      console.log('Assinatura salva com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao salvar a assinatura:', error);
      if (axios.isAxiosError(error)) {
        console.error('Erro ao obter inquilinos:', error.response?.data);
      }
    }
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setSignature(null);
  };

  const handleUndo = () => {
    signatureRef.current?.undo();
  };

  const handleSave = async () => {
    signatureRef.current?.readSignature();
  };

  const hideModal = () => setVisible(false);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Assinatura" />
      </Appbar.Header>
      {loading ? (
        <ActivityIndicator animating color={theme.colors.primary} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalText}>Crie sua assinatura de recibo</Text>
              <Button mode="contained" onPress={hideModal} style={styles.modalButton}>
                OK
              </Button>
            </Modal>
          </Portal>
          {/* {signature ? (
            <>
              <Text style={{ marginBottom: 16 }}>Assinatura salva:</Text>
              <Image
                resizeMode={'contain'}
                style={{ width: 335, height: 50 }}
                source={{ uri: signature }}
              />
            </>
          ) : null} */}
          <Text variant="titleLarge">Sua assinatura:</Text>
          <Signature
            ref={signatureRef}
            onOK={handleSignature}
            onEmpty={() => console.log('Tela está vazia')}
            descriptionText="Assine aqui"
            clearText="Limpar"
            confirmText="Salvar"
            webStyle=".m-signature-pad--footer { display: none; }"
            autoClear
            imageType="image/png"
            dataURL={signature || ''}
            trimWhitespace
            key={signature}
          />
          <Button
            mode="contained"
            icon="content-save"
            onPress={handleSave}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}>
            Salvar Assinatura
          </Button>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleClear} style={styles.button}>
              Limpar
            </Button>
            <Button mode="contained" onPress={handleUndo} style={styles.button}>
              Desfazer
            </Button>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  saveButton: {
    marginTop: 16,
  },
  saveButtonContent: {
    flexDirection: 'row-reverse',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButton: {
    alignSelf: 'center',
  },
});

export default SignatureScreen;
