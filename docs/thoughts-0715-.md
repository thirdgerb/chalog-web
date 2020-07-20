chat: 提供一个可供连接的对话, 变更当前对话状态.

    {
        title: '',
        scene: '',
        session : '',
        icon : '',
        closable : '',
        bot: false,
    }

quit: 退出会话的信息. 如果是 closable 则会关闭.

    {
        session,
    }

batch : 提供一批消息响应.

    {
        session : '', // 所处的房间.
        batch : '', // 消息的批次 id
        creator : '', // 发送者名称. 不同的姓名会分开放置.
        messages : [], // 消息内容.
    }

signIn : 告知用户登录的结果. 相当于握手.

    {
        token: '', 返回一个合法的 token.
    }

context : 告知用户上下文状态. 同时页面可以对此进行预定义的响应.

    {
        session : '',
        contextId : '',
        contextName : '',
        stageName : '',
        query : {},
        data : {},
        suggestions : {},
    }

directive : 给客户端下发的命令. 需要是客户端预定义的. 与页面状态有关.

    {
        name: '',
        payload: {},
    }

pulled : 拉取的消息.

    {
        session,
        batches, 发送的消息会整理成批次.
    }

*  服务端下发事件

----

sign : 告知服务端用户登录

    {
        id: '',
        name: '',
    }

join : 加入一个房间.

    {
        title: '',
        scene: '',
        session : '',
        icon : '',
        closable : '',
        bot: '',
    }

leave : 退出一个房间.

    {
        session: '' // 房间的 session id.
    }



say : 发送一条消息给服务端.

    {
        type: 消息的类型.
        id :  消息的 id
        ...   : 消息的其它参数.
    }

directives : 告知服务端客户端可以使用的所有命令. 服务端优先匹配并下发.
原则是服务端注册过, 优先按服务端逻辑. 否则直接返回命令名.

    {
        session: '',
        directives: {
            name1: suggestion1,
            name2: suggestion2,
            name3: suggestion3,
            any: 不匹配的任何信息都作为命令直接回传.
        }
    }

pull : 拉取群最近的消息.

    {
        session : '',
        self: '', 传入 self, 则不拉取自己相关的消息.
        idlt: 拉取的 ID 必须小于 这个 ID.
        limit: 消息数量.
    }

*  用户端事件

----

初步协议(事件)设计的思路:

Request :
    event : 事件名.
    payload: {
        trace: 消息的 trace id.
        token: 每个消息都带 token. 服务端不存储用户状态. 这样如果过期了也能主动发现.
        proto: 消息体, 与事件真正相关.
    }


Receive :
    event : 事件名
    payload: {
        trace: 相关的 trace id.
        errcode: 服务端逻辑上的状态码. 不代表通信异常. 0 是 success.
        errmsg: 异常信息的提示.
        proto: 消息体, 与事件相关.
    }

需要客户端处理的异常码:

- 401 : 登录信息不合法, 强制当前用户退出, 并切换到登录页.
- 403 : 提示用户没有权限
- >= 500 : 直接提示用户异常信息.

* 通信协议

----

检查一下我们现在需要用几种服务端推送方式:

1. 同步响应. socket.emit();
2. 房间广播. socket.room.emit(), 用于群聊模式.
3. 会话通知, 只给予会话的提示. 应该是向管理员房间广播. io.room(admin).emit
4. 多人私聊. 两人以上本质上都是群. 要能够正确建立房间.

房间的性质:

1. 机器人为主: 所有人的消息广播给其它人, 都发送给机器人.
2. 人 vs 机器人+管理员: 人与机器人对话, 管理员发的消息不给机器人, 或者是 delivery.
3. 群聊房间: 人与人相互说法, @bot 的消息会提交给机器人.

房间的性质还要允许变更. 变更房间性质后, 处理的逻辑就截然不同了.
初期可以不要做太复杂. 用一个极简的方式.

简化后的房间性质:

1. 群聊. 只有 @bot 的消息才会发送给机器人.
2. 机器人聊. 只有 用户本人的消息才会发送给机器人.

管理员根据登录的情况, 会有一个独立的群.


* 通信架构

----

使用 Socket.io 实现网页版双工客户端. 需要把 Commune 的策略和 Socket.io 的一致化.

Socket IO 概念:
- namespace
- room
- event

Commune 概念:
- creatorId
- scene
- sessionId

现在考虑 SessionId == Room. 这样可以往相同 SessionId 的所有连接发送消息.
实现客户端级别的广播.

Event 对与服务端和客户端, 都意味着不同的处理逻辑.

namespace 暂时考虑不用.

身份校验问题? 需要一个 JWT 来定义用户的身份. 所以每一帧的消息都要校验?

* 通信架构.
