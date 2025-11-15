import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDistanceToNow, parseISO, isBefore, addDays } from 'date-fns';

export default function ItemCard({ item, onPress }) {
  const expiryDate = parseISO(item.expiry);
  const daysLeft = formatDistanceToNow(expiryDate, { addSuffix: true });
  const isExpiringSoon = isBefore(expiryDate, addDays(new Date(), 2));
  const isExpired = isBefore(expiryDate, new Date());

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, isExpiringSoon && styles.expiringSoon, isExpired && styles.expired]}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.date, isExpiringSoon && styles.dateWarning, isExpired && styles.dateExpired]}>
          {isExpired ? 'Expired' : `Expires ${daysLeft}`}
        </Text>
      </View>
      {isExpiringSoon && !isExpired && (
        <View style={styles.warningBadge}>
          <Text style={styles.warningText}>!</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2f2f2', 
    padding: 15, 
    borderRadius: 12, 
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  expiringSoon: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  expired: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  name: { 
    fontSize: 18, 
    fontWeight: '600' 
  },
  date: { 
    color: '#888', 
    marginTop: 4 
  },
  dateWarning: {
    color: '#FF9800',
    fontWeight: '600',
  },
  dateExpired: {
    color: '#F44336',
    fontWeight: '600',
  },
  warningBadge: {
    backgroundColor: '#FF9800',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});