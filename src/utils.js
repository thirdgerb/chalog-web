

export const passRoute = ({name, params}) => ({name, params});

export const intendTo = (vm, to) =>  {
  to = to || {name:'index'};
  vm.$store.state.next = passRoute(vm.$route);
  vm.$router.replace(to);
};