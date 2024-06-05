import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton, LinearGradient } from '@rneui/themed';

const SkeletonLoader = () => {
  const renderSkeletonItem = (_, index) => (
    <View key={index} style={styles.itemContainer}>
      <Skeleton animation="wave" LinearGradientComponent={LinearGradient} circle width={60} height={60} />
      <View style={styles.textContainer}>
        <Skeleton style={styles.largeLine} animation="wave" LinearGradientComponent={LinearGradient} width={200} height={10} />
        <Skeleton animation="wave" LinearGradientComponent={LinearGradient} width={120} height={10} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {[...Array(4)].map(renderSkeletonItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  textContainer: {
    marginLeft: 10,
  },
  largeLine: {
    marginBottom: 10,
  },
});

export default SkeletonLoader;
