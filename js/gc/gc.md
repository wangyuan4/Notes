
## 变量的生命周期
> JavaScript 变量生命周期在它声明时初始化。局部变量在函数执行完毕后销毁。全局变量在页面关闭后销毁。—— 《JavaScript 作用域| 菜鸟教程》

当引擎使用变量时，它们的生命周期包括以下几个阶段：

声明阶段：范围内注册变量。
初始化阶段：分配内存并为作用域中的变量创建绑定。在此步骤中，变量将使用进行自动初始化undefined。
分配阶段：为初始化变量分配一个值。


### var 变量

<div><img src="https://github.com/wangyuan4/Notes/blob/main/js/gc/images/var.png?raw=true" width="30%" /></div>

```javascript
function multiplyByTen(number) {
  console.log(ten); // => undefined
  var ten;
  ten = 10;
  console.log(ten); // => 10
  return number * ten;
}
multiplyByTen(4); // => 40
```
1. 进入multiplyByTen函数作用域，变量在作用域的开头通过声明 并立即初始化（初始化为undefined）；
2. 到ten=10 做赋值操作；
### let、const变量
<div><img src="https://github.com/wangyuan4/Notes/blob/main/js/gc/images/let&const.png?raw=true" width="30%" /></div>

```javascript
let condition = true;
if (condition) {
  // console.log(num); // => Throws ReferenceError
  let num;
  console.log(num); // => undefined
  num = 5;
  console.log(num); // => 5
}
```
1. 进入块级作用域之后，立即声明num变量
2. 从块级作用域开头～let 声明 之间num处于临时死亡区（TDZ）
3. 执行let num，给num进行初始化为undefined
4. num = 5，给num进行赋值
### 函数变量

<div><img src="https://github.com/wangyuan4/Notes/blob/main/js/gc/images/function.png?raw=true" width="30%" /></div>

```javascript
function sumArray(array) {
  return array.reduce(sum);
  function sum(a, b) {
    return a + b;
  }
}
sumArray([5, 10, 8]); // => 23
```
1. sumArray函数执行时进入内部函数作用域中，预编译 查找函数声明，值赋予函数体（还初始化吗？）
2. array.reduce(sum) 可以正常使用sum函数

**注意**: ([原始文案](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/30))
> var 命令和 function 命令声明的全局变量，依旧是顶层对象的属性，但 let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性
## js内存管理
不管什么程序语言，内存生命周期基本是一致的：   
1. 分配你所需要的内存
2. 使用分配到的内存（读、写）
3. 不需要时将其释放/归还

在JS中，每一个数据都需要一个内存空间。内存空间又被分为两种，栈内存(stack)与堆内存(heap)
<div><img src="https://github.com/wangyuan4/Notes/blob/main/js/gc/images/cunchu.png?raw=true" width="50%" /></div>

+ 栈(stack) 是有序的，主要存放一些基本类型的变量和对象的地址，每个区块按照一定次序存放（后进先出），它们都是直接按值存储在栈中的，每种类型的数据占用的内存空间的大小也是确定的，并由系统自动分配和自动释放
+ 堆(heap)是没有特别的顺序的，数据可以任意存放，多用于复杂数据类型（引用类型）分配空间，例如数组对象、object对象


## 垃圾回收
### 什么是垃圾回收
> 找出那些不再继续使用的值，然后释放其占用的内存

### 什么时候触发
- 栈：在使用完后会被立即回收
- 堆：会按照固定的时间间隔（或代码执行中预定的收集时间），周期性地执行这一操作
### v8回收算法
   在JavaScript中，其实绝大多数的对象存活周期都很短，大部分在经过一次的垃圾回收之后，内存就会被释放掉，而少部分的对象存活周期将会很长，一直是活跃的对象，不需要被回收。为了提高回收效率，V8 将堆分为两类新生代和老生代，新生代中存放的是生存时间短的对象，老生代中存放的生存时间久的对象。

   新生区通常只支持 1～8M 的容量，而老生区支持的容量就大很多了。对于这两块区域，V8 分别使用两个不同的垃圾回收器，以便更高效地实施垃圾回收。

+ 副垃圾回收器 - Scavenge：主要负责新生代的垃圾回收（任何对象的声明分配到的内存，将会先被放置在新生代中）。
+ 主垃圾回收器 - Mark-Sweep & Mark-Compact：主要负责老生代的垃圾回收（新生代空间中的对象满足一定条件后，会晋升到老生代空间中）。
#### 可达性
  垃圾回收器是怎么知道哪些对象是活动对象和非活动对象的呢？利用对象的可达性，从初始的根对象（window，global）的指针开始，这个根指针对象被称为根集（root set），从这个根集向下搜索其子节点，被搜索到的子节点说明该节点的引用对象可达，并为其留下标记，然后递归这个搜索的过程，直到所有子节点都被遍历结束，那么没有被标记的对象节点，说明该对象没有被任何地方引用，可以证明这是一个需要被释放内存的对象，可以被垃圾回收器回收

<div><img src="https://github.com/wangyuan4/Notes/blob/main/js/gc/images/mark.gif?raw=true" width="50%" /></div>

#### 新生代垃圾回收器 - Scaveng
Scaveng算法原理：将新生代堆分为两部分，分别叫from-space和to-space，处理步骤如下：

<div><img src="https://github.com/wangyuan4/Notes/blob/main/js/gc/images/scaveng.png?raw=true" width="50%" /></div>

将from-space里的对象标记为活动对象和非活动对象（可达性）
复制 from space 的活动对象到 to space 并对其进行排序
释放 from space 中的非活动对象的内存
将 from space 和 to space 角色互换
#### 新生代晋升到老生代
 在新生代中，还进一步进行了细分，分为nursery子代和intermediate子代两个区域，一个对象第一次分配内存时会被分配到新生代中的nursery子代，如果进过下一次垃圾回收这个对象还存在新生代中，这时候我们移动到 intermediate 子代，再经过下一次垃圾回收，如果这个对象还在新生代中，副垃圾回收器会将该对象移动到老生代中，这个移动的过程被称为晋升。

<div><img src="https://github.com/wangyuan4/Notes/blob/main/js/gc/images/jinsheng.png?raw=true" width="50%" /></div>

#### 老生代垃圾回收器 - Mark-Sweep & Mark-Compact
负责老生代的垃圾回收，有两个特点：对象占用空间大、对象存活时间长

Mark-Sweep（标记清除）
ps. 也可参考可达性的图

<div><img src="https://github.com/wangyuan4/Notes/blob/main/js/gc/images/marksweep.png?raw=true" width="50%" /></div>

1. 对老生代进行第一次扫描，标记活动对象
2. 对老生代进行第二次扫描，清除未被标记的对象，即清理非活动对象
Mark-Compact（标记整理）
   标记清除完成之后在老生代的内存里会出现很多内存碎片，如果不做碎片整理，在下一次需要给一个大对象分配内存的时候会出现内存不够提前触发垃圾回收的操作，其实这次回收并非必要。
   为了解决内存碎片的问题，标记整理被提出来，即在整理过程中，将活着的对象往一边移动，移动完成后，活着对象那一侧之外的内存会被回收

<div><img src="https://github.com/wangyuan4/Notes/blob/main/js/gc/images/markcompact.png?raw=true" width="50%" /></div>

#### 全停顿 Stop-The-World
由于垃圾回收是在JS引擎中进行的，标记整理需要移动对象，如果数据很大很多的话执行速度不可能快，为了避免JavaScript应用逻辑和垃圾回收器的内存资源竞争导致的不一致性问题，垃圾回收器会将JavaScript应用暂停，这个过程，被称为全停顿（stop-the-world）。

在新生代中，由于空间小、存活对象较少、Scavenge算法执行效率较快，所以全停顿的影响并不大。而老生代中就不一样，如果老生代中的活动对象较多，垃圾回收器就会暂停主线程较长的时间，使得页面变得卡顿。针对老生代回收较慢导致卡顿的问题v8引入了Orinoco来降低主线程挂起时长，后面会对Orinoco里主要的优化算法做逐一介绍。

#### rinoco-优化

+ 副垃圾回收器在原来的基础上于移动阶段增加了并行优化，但多个线程竞争一个新生代堆内存资源，会出现一个资源被多个线程重复操作的问题，v8的解决办法为：一个线程对某个对象资源进行复制并完成后都需要维护该对象的转发地址状态，以供其他线程可以判断这个对象是否已经被复制

<div><img src="https://github.com/wangyuan4/Notes/blob/main/js/gc/images/orinoco1.png?raw=true" width="50%" /></div>

+ 主垃圾回收器：当老生代堆的内存大小超过一定阈值之后，就会触发并发标记任务，每个辅助线程都会追踪当前对象的指针以及对这个对象的引用，当js代码对改变量做修改时，写入屏障技术会在辅助线程在并发标记的时候进行追踪。当并发标记结束或者动态分配内存到达极限时，js主线成挂起，做最后的快速标记步骤，并再扫描根集确保所有的都已被标记，确认完成之后有辅助线程做后续的内存清理与整理

<div><img src="https://github.com/wangyuan4/Notes/blob/main/js/gc/images/orinoco2.png?raw=true" width="50%" /></div>

## todo-关于内存泄漏


## 附录
### 预编译
在一个JavaScript文件或一个JavaScript代码块的内部，浏览器会先对代码进行预处理（编译），然后再执行。预处理（编译）会跳过执行语句，只处理声明语句

参考文献：https://segmentfault.com/a/1190000018001871

#### 预编译(函数执行前)
1. 创建AO对象（Active Object）
2. 查找函数形参及函数内变量声明，形参名及变量名作为AO对象的属性，值为undefined
3. 实参形参相统一，实参值赋给形参
4. 查找函数声明，函数名作为AO对象的属性，值为函数引用
#### 预编译触发时间点
函数预编译发生在函数执行前一刻。
### 参考文献
- https://juejin.cn/post/6844903891948027911
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management
- https://zhuanlan.zhihu.com/p/63114665
- https://segmentfault.com/a/1190000037435824
- https://cloud.tencent.com/developer/article/1710084
- https://zhuanlan.zhihu.com/p/55917130