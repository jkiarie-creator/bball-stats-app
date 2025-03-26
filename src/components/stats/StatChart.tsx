import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { COLORS, SPACING } from '../../theme';

interface StatChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
    }[];
  };
  title?: string;
  type?: 'line' | 'bar';
  height?: number;
  width?: number;
}

const StatChart: React.FC<StatChartProps> = ({
  data,
  title,
  type = 'line',
  height = 220,
  width = Dimensions.get('window').width - SPACING.lg * 2,
}) => {
  const chartConfig = {
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.surface,
    },
  };

  const renderChart = () => {
    const commonProps = {
      data,
      width,
      height,
      chartConfig,
      style: styles.chart,
      withInnerLines: false,
      withOuterLines: true,
      withVerticalLabels: true,
      withHorizontalLabels: true,
      fromZero: true,
      yAxisLabel: '',
      yAxisSuffix: '',
    };

    if (type === 'bar') {
      return (
        <BarChart
          {...commonProps}
          showBarTops={false}
          showValuesOnTopOfBars={true}
        />
      );
    }

    return (
      <LineChart
        {...commonProps}
        bezier
        withDots={true}
        withShadow={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  chart: {
    marginVertical: SPACING.sm,
    borderRadius: 16,
  },
});

export default StatChart; 