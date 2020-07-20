
export default {
  alive : {
    title: 'Commune助手',
    scene: 'commune',
    icon: 'mdi-robot',
    closable: false,
  },

  connected : [
    {
      title: '交流群',
      scene: 'commune-chat',
      icon: 'mdi-forum',
      session: 'commune-chat',
      closable: false,
      bot: false,
    },
  ],

  list : [
    {
      title: '联系作者',
      scene: 'thirdgerb',
      icon: 'mdi-account-question',
      closable: true,
      bot: false
    }
  ],

};