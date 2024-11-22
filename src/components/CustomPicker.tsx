import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput as RNTextInput,
} from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';

interface PickerItem {
  label: string;
  value: string;
}

interface CustomPickerProps {
  data: PickerItem[];
  selectedValue: string;
  onValueChange: (value: PickerItem) => void;
  title: string;
  placeholder: string;
  leftIcon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  data,
  selectedValue,
  onValueChange,
  title,
  placeholder,
  leftIcon,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { width, height } = useWindowDimensions();

  const filteredData = data.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedLabel = data.find((item) => item.value === selectedValue)?.label || '';

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          label={
            <Text>
              {title} <Text style={{ color: 'red' }}>*</Text>
            </Text>
          }
          value={selectedLabel}
          placeholder={placeholder}
          editable={false}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name={leftIcon} size={size} color={color} />
              )}
            />
          }
          right={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="chevron-down" size={size} color={color} />
              )}
              onPress={() => setModalVisible(true)}
            />
          }
        />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View
                  style={{
                    width: width * 0.8,
                    height: height * 0.6,
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                  }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <IconButton icon="close" size={24} onPress={() => setModalVisible(false)} />
                  </View>
                  <RNTextInput
                    placeholder="Buscar..."
                    value={searchText}
                    onChangeText={setSearchText}
                    style={{ marginBottom: 20, borderBottomWidth: 1 }}
                  />
                  <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          onValueChange(item);
                          setModalVisible(false);
                          setSearchText('');
                        }}>
                        <Text style={{ padding: 10 }}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default CustomPicker;
