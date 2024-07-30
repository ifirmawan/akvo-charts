import React, { useRef, useEffect, useMemo } from 'react';
import { init } from 'echarts';

const backgroundColor = {
  backgroundColor: 'transparent'
};
const Animation = {
  animation: true,
  animationThreshold: 2000,
  animationDuration: 1000,
  animationEasing: 'cubicOut',
  animationDelay: 0,
  animationDurationUpdate: 300,
  animationEasingUpdate: 'cubicOut',
  animationDelayUpdate: 0
};
const TextStyle = {
  color: '#000',
  fontSize: 12,
  fontWeight: 'bold'
};
const Colors = {
  color: ['#4475B4', '#73ADD1', '#AAD9E8', '#FEE08F', '#FDAE60', '#F36C42', '#D73027']
};
const Legend = {
  show: true,
  icon: 'circle',
  top: 35,
  left: 'center',
  align: 'left',
  orient: 'horizontal',
  itemGap: 10,
  textStyle: {
    fontWeight: 'normal',
    fontSize: 12
  }
};
const Title = {
  show: true,
  text: '',
  subtext: '',
  textAlign: 'center',
  left: '50%',
  textStyle: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold'
  }
};
const Grid = {
  containLabel: true,
  left: '4%',
  right: '4%',
  bottom: '10%',
  top: '25%'
};
const Tooltip = {
  trigger: 'item',
  axisPointer: {
    type: 'shadow'
  },
  textStyle: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold'
  }
};
const Axis = {
  axisLabel: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'normal'
  },
  axisLine: {
    lineStyle: {
      color: '#000'
    }
  },
  axisTick: {
    lineStyle: {
      color: '#000'
    }
  }
};

const transformConfig = ({
  title,
  xAxisLabel: _xAxisLabel = null,
  yAxisLabel: _yAxisLabel = null,
  horizontal: _horizontal = false,
  dimensions: _dimensions = []
}) => {
  return {
    title: {
      ...Title,
      text: title
    },
    grid: {
      ...Grid
    },
    legend: {
      ...Legend,
      data: _dimensions.slice(1)
    },
    tooltip: {
      ...Tooltip
    },
    xAxis: {
      type: _horizontal ? 'value' : 'category',
      name: _xAxisLabel,
      nameTextStyle: {
        ...TextStyle
      },
      nameLocation: _horizontal ? 'end' : 'center',
      nameGap: _horizontal ? 20 : 45,
      ...Axis
    },
    yAxis: {
      type: _horizontal ? 'category' : 'value',
      name: _yAxisLabel,
      nameTextStyle: {
        ...TextStyle
      },
      nameLocation: _horizontal ? 'center' : 'end',
      nameGap: _horizontal ? 45 : 20,
      ...Axis
    },
    series: [],
    ...Colors,
    ...backgroundColor,
    ...Animation
  };
};

const sortKeys = (keys = []) => {
  const dynamicKey = keys.find(key => isNaN(key));
  const otherKeys = keys.filter(key => key !== dynamicKey);
  return [dynamicKey, ...otherKeys];
};
const normalizeData = data => {
  if (Array.isArray(data)) {
    if (data.length > 0 && Array.isArray(data[0])) {
      const [categories, ...rows] = data;
      const dimensions = categories.map(item => item.toLowerCase());
      const source = rows.map(row => {
        const obj = {};
        categories.forEach((cat, index) => {
          obj[cat.toLowerCase()] = row[index] !== undefined ? row[index] : 0;
        });
        return obj;
      });
      return {
        dimensions,
        source
      };
    } else if (data.length > 0 && typeof data[0] === 'object') {
      const keys = Array.from(new Set(data.flatMap(d => d ? Object.keys(d) : [])));
      const sortedKeys = sortKeys(keys);
      const dimensions = sortedKeys;
      const source = data.filter(i => i).map(item => {
        const obj = {};
        sortedKeys.forEach(key => {
          obj[key] = item[key] !== undefined ? item[key] : 0;
        });
        return obj;
      });
      return {
        dimensions,
        source
      };
    }
  } else if (typeof data === 'object') {
    const keys = Object.keys(data);
    const maxLength = Math.max(...keys.map(key => data[key].length));
    const sortedKeys = sortKeys(keys);
    const source = Array.from({
      length: maxLength
    }, (_, i) => {
      return sortedKeys.reduce((acc, key) => {
        acc[key] = data[key][i] !== undefined ? data[key][i] : 0;
        return acc;
      }, {});
    });
    return {
      dimensions: sortedKeys,
      source
    };
  }
  throw new Error('Unsupported data format');
};

const useECharts = ({
  config: _config = {},
  data: _data = [],
  getOptions: _getOptions = () => {}
}) => {
  const chartRef = useRef(null);
  useEffect(() => {
    let chart;
    if (chartRef.current) {
      setTimeout(() => {
        if (!chart && chartRef.current) {
          chart = init(chartRef.current);
        }
        const {
          dimensions,
          source
        } = normalizeData(_data);
        const options = {
          ...transformConfig({
            ..._config,
            dimensions
          }),
          dataset: {
            dimensions,
            source
          },
          ..._getOptions({
            dimensions
          })
        };
        if (chart) {
          chart.setOption(options);
        }
      }, 0);
    }
    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, [_config, _data, _getOptions]);
  return chartRef;
};

var styles = {"container":"_styles-module__container__1Lxpd"};

const getOptions = ({
  horizontal: _horizontal = false,
  dimensions: _dimensions = []
}) => {
  const series = _dimensions.slice(1).map(dim => ({
    name: dim,
    type: 'bar',
    encode: {
      x: _horizontal ? dim : 'category',
      y: _horizontal ? 'category' : dim
    }
  }));
  return {
    series
  };
};
const Bar = ({
  config,
  data,
  horizontal: _horizontal2 = false
}) => {
  const chartRef = useECharts({
    config: {
      ...config,
      horizontal: _horizontal2
    },
    data,
    getOptions: ({
      dimensions
    }) => getOptions({
      horizontal: _horizontal2,
      dimensions
    })
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};

const getOptions$1 = ({
  horizontal: _horizontal = false,
  dimensions: _dimensions = []
}) => {
  const series = _dimensions.slice(1).map(dim => ({
    name: dim,
    type: 'line',
    encode: {
      x: _horizontal ? dim : 'category',
      y: _horizontal ? 'category' : dim
    }
  }));
  return {
    series
  };
};
const Line = ({
  config,
  data,
  horizontal: _horizontal2 = false
}) => {
  const chartRef = useECharts({
    config: {
      ...config,
      horizontal: _horizontal2
    },
    data,
    getOptions: ({
      dimensions
    }) => getOptions$1({
      horizontal: _horizontal2,
      dimensions
    })
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};

const getOptions$2 = ({
  dimensions: _dimensions = []
}) => {
  const itemName = _dimensions[0];
  const value = _dimensions.slice(1);
  return {
    series: [{
      type: 'pie',
      encode: {
        itemName,
        value
      }
    }]
  };
};
const Pie = ({
  config,
  data
}) => {
  const chartRef = useECharts({
    config,
    data,
    getOptions: ({
      dimensions
    }) => getOptions$2({
      dimensions
    })
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};

const MAX = 70;
const getOptions$3 = ({
  dimensions: _dimensions = [],
  radius
}) => {
  const itemName = _dimensions[0];
  const value = _dimensions.slice(1);
  return {
    series: [{
      type: 'pie',
      radius,
      encode: {
        itemName,
        value
      }
    }]
  };
};
const Doughnut = ({
  config,
  data,
  size: _size = 40
}) => {
  const torus = useMemo(() => {
    if (_size >= 70) {
      return 0;
    }
    return MAX - _size;
  }, [_size]);
  const chartRef = useECharts({
    config,
    data,
    getOptions: ({
      dimensions
    }) => getOptions$3({
      dimensions,
      radius: [`${torus}%`, `${MAX}%`]
    })
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};

const getOptions$4 = ({
  dimensions,
  stackMapping,
  horizontal: _horizontal = true
}) => {
  const dimensionToStackMap = {};
  Object.keys(stackMapping).forEach(stackGroup => {
    stackMapping[stackGroup].forEach(dim => {
      dimensionToStackMap[dim] = stackGroup;
    });
  });
  const series = dimensions.slice(1).map(dim => ({
    name: dim,
    type: 'bar',
    stack: dimensionToStackMap[dim] || 'defaultStack',
    encode: {
      x: _horizontal ? dim : 'category',
      y: _horizontal ? 'category' : dim
    }
  }));
  return {
    tooltip: {
      ...Tooltip,
      trigger: 'axis'
    },
    series
  };
};
const StackBar = ({
  config,
  data,
  stackMapping: _stackMapping = {},
  horizontal: _horizontal2 = true
}) => {
  const chartRef = useECharts({
    config: {
      ...config,
      horizontal: _horizontal2
    },
    data,
    getOptions: ({
      dimensions
    }) => getOptions$4({
      dimensions,
      stackMapping: _stackMapping,
      horizontal: _horizontal2
    })
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};

const getOptions$5 = ({
  horizontal: _horizontal = false,
  dimensions: _dimensions = []
}) => {
  const series = _dimensions.slice(1).map(dim => ({
    name: dim,
    type: 'bar',
    barGap: 0,
    encode: {
      x: _horizontal ? dim : 'category',
      y: _horizontal ? 'category' : dim
    }
  }));
  return {
    tooltip: {
      ...Tooltip,
      trigger: 'axis'
    },
    series
  };
};
const StackClusterColumn = ({
  config,
  data,
  horizontal: _horizontal2 = false
}) => {
  const chartRef = useECharts({
    config: {
      ...config,
      horizontal: _horizontal2
    },
    data,
    getOptions: ({
      dimensions
    }) => getOptions$5({
      horizontal: _horizontal2,
      dimensions
    })
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: chartRef,
    role: "figure",
    className: styles.container
  });
};

export { Bar, Doughnut, Line, Pie, StackBar, StackClusterColumn };
//# sourceMappingURL=index.modern.js.map
