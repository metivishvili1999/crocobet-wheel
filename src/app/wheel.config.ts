export const WheelConfig = {
  appWidth: 600,
  appHeight: 600,
  circleRadius: 225,
  sectorRadians: Math.PI / 4,
  spinning: false,
  sectionSlices: [
    { num: 0, isText: false, id: 'house' },
    { num: 1, isText: false, id: 'gtr' },
    { num: 2, isText: true, id: '10k' },
    { num: 3, isText: true, id: '5k' },
    { num: 4, isText: true, id: '1k' },
    { num: 5, isText: false, id: 'scooter' },
    { num: 6, isText: false, id: 'pixel' },
    { num: 7, isText: true, id: '0.5k' },
  ],
  prizes: [
    { id: '10k', prizetype: 'text', colorPIXI: 0x607D8B, color: '#607D8B', text: '10 000L' },
    { id: 'gtr', prizetype: 'icon', colorPIXI: 0x8BC34A, color: '#8BC34A', iconName: 'gtr' },
    { id: 'house', prizetype: 'icon', colorPIXI: 0xFF5722, color: '#FF5722', iconName: 'house' },
    { id: '0.5k', prizetype: 'text', colorPIXI: 0x03A9F4, color: '#03A9F4', text: '500L' },
    { id: 'pixel', prizetype: 'icon', colorPIXI: 0xF44336, color: '#F44336', iconName: 'pixel' },
    { id: 'scooter', prizetype: 'icon', colorPIXI: 0x673AB7, color: '#673AB7', iconName: 'scooter' },
    { id: '1k', prizetype: 'text', colorPIXI: 0x009688, color: '#009688', text: '1000L' },
    { id: '5k', prizetype: 'text', colorPIXI: 0xFFEB3B, color: '#FFEB3B', text: '5000L' }
  ]
};
