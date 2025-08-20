import type { ChartType } from 'chart.js';
import type { Dimension } from './types';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    pointLabelsPlugin?: {
      dimensions?: Dimension[];
    };
  }
}
