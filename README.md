# Commune Chatlog [Web]

这个项目是作者 (thirdgerb@gmail.com) 为自己的对话机器人项目 [CommuneChatbot](https://github.com/thirdgerb/chatbot) 开发的前端界面.

简单来说, 我打算实现名为 __Chatlog__ 的一种产品. 它类似于 Weblog (博客), Videolog (播客), micro weblog (微博), 是一种个人化的知识管理与呈现的工具.

区别在于, 它以一个可以不断积累完善的对话机器人 (Chatbot) 作为主要的交互形式.

Chatlog 应该作为一个完整的对话机器人平台, 具备各种对话机器人的功能 (闲聊/知识管理/问答/流程控制/命令/表单/对话式游戏...).

与此同时, 项目还着重发展以下几个方面:

1. 全平台: 可以对接各种对话交互的平台
2. 异构: 可以多个平台同时作用于同一个对话机器人. 例如用智能音箱或公众号语音来控制网页.
3. 多模态: 可以使用各种多媒体方式来交互与呈现, 包括
    - 输入 : 文字/语音/网页交互
    - 输出 : 视频/图片/音频/文字/卡片/网页交互界面

至于多轮对话机器人的逻辑, [CommuneChatbot](https://github.com/thirdgerb/chatbot) 会提供一套基于配置可无限拓展的多轮对话内核,
同时又是一个全栈的对话机器人平台.
通过各种工程化手段, 理论上可以接入各种对话机器人.


由于作者并非专业的前端工程师, 所以本项目目前主要是在验证各种思路.
更多开发思路见 [开发记录](/docs/thoughts.md)


这是我第一次创造一个市面上还未曾见到过的项目. 希望各路好汉给予意见建议, 也欢迎把我打醒 :p



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
