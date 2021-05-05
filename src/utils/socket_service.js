export default class SocketService {
  // 单例设计模式
  // 静态方法调用直接在类上进行，不能在类的实例上调用。静态方法通常用于创建实用程序函数。
  static instance = null;
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }

  //   和服务端连接的socket对象
  ws = null;
  //    实例属性 维护一个映射表，用来存储回调函数
  callBackMapping = {};
  //   实例属性 表示socket是否连接成功了
  connected = false;
  //    实例属性 记录重复send的次数
  sendRetryCount = 0;
  //    实例属性 记录重复connect的次数
  connectRetryCount = 0;

  //   定义连接服务器的方法
  connect() {
    //   连接服务器
    if (!window.WebSocket) {
      console.log("您的浏览器不支持webSocket");
      return;
    }
    this.ws = new WebSocket("ws://localhost:9998");

    // 连接成功的事件
    this.ws.onopen = () => {
      console.log("连接服务端成功了");
      this.connected = true;
      this.connectRetryCount = 0;
    };

    // 1.连接服务端失败
    // 2.但连接成功之后，服务器关闭的情况
    // 以上都会调用onclose
    this.ws.onclose = () => {
      console.log("连接服务端失败");
      this.connected = false;
      this.connectRetryCount++;
      setTimeout(() => {
        this.connect();
      }, 500 * this.connectRetryCount);
    };
    this.ws.onmessage = msg => {
      console.log("从服务端获取的数据如下：");
      //   console.log(msg.data);
      const recvData = JSON.parse(msg.data);
      const socketType = recvData.socketType;
      //   判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action;
        if (action === "getData") {
          const realData = JSON.parse(recvData.data);
          //   调用回调函数 this指向该类唯一实例
          this.callBackMapping[socketType](realData);
        } else if (action === "fullScreen") {
        } else if (action === "themeChange") {
        }
      }
    };
  }
  registerCallBack(socketType, callBack) {
    //回调函数的注册 被用于组件中
    this.callBackMapping[socketType] = callBack;
  }
  unRegisterCallBack(socketType) {
    //回调函数的取消注册 被用于组件中
    this.callBackMapping[socketType] = null;
  }

  //发送数据的方法
  send(data) {
    if (this.connected) {
      this.ws.send(JSON.stringify(data));
      this.sendRetryCount = 0;
    } else {
      this.sendRetryCount++;
      setTimeout(() => {
        this.send(data);
      }, this.sendRetryCount * 500);
    }
  }
}
