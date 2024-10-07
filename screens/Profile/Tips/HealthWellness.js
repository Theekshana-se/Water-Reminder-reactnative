import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const HealthWellness = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

         <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#00aaff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health & Wellness</Text>
      </View>
    
      <ScrollView style={styles.tipsContainer}>
        <View style={styles.tip}>
          <Text style={styles.tipText}>Make sure to balance water intake with meals to help the body absorb nutrients efficiently.</Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipText}>Adequate hydration can improve skin elasticity and overall glow.</Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipText}>Staying hydrated helps your body fight off illnesses by flushing out toxins.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#00bfff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#00bfff',
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tip: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  tipText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00aaff',
    marginLeft: 10,
  },
});

export default HealthWellness;
