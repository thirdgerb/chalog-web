

export const passRoute = ({name, params}) => ({name, params});

export function intendTo (vm, to) {
  to = to || {name:'index'};
  if (vm.$route.name !== to.name) {
    vm.$store.state.next = passRoute(vm.$route);
    vm.$router.replace(to);
  }
}


export function popNextRoute(vm) {
  let state = vm.$store.state;
  let next = state.next;
  if (next) {
    state.next = null;
    return next;
  }

  let session = state.chat.connectedSessions[0] || state.chat.incomingSessions[0];

  if (session) {
    return {name:'chat', params:{session}};
  } else {
    return {name:'chatIndex'};
  }
}