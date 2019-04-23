const colors = {
  red: '#ee0000',
  green: 'green',
};

const mixins = {
  cancelled: {
    textDecoration: 'line-through',
    textDecorationColor: 'black',
  },
  delayed: {
    color: colors.red,
  },
  changed: {
    color: colors.red,
  },
  early: {
    color: colors.green,
  },
};

const theme: Maru.Theme = {
  colors,
  mixins,
};

export default theme;
