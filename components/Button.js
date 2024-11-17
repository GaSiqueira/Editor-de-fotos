import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Button({ label, theme, onPress }) {
  return (
    <Pressable
      style={[
        styles.button,
        theme === "primary" ? styles.primaryButton : styles.defaultButton,
      ]}
      onPress={onPress}
    >
      {theme === "primary" && (
        <FontAwesome name="picture-o" size={18} color="#fff" style={styles.buttonIcon} />
      )}
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 320,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, 
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#1E90FF',
  },
  defaultButton: {
    backgroundColor: '#25292e',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
});
