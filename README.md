  # 자바스크립트의 동작 원리 알기


<br/>


  ## 이걸 이해하면?...

<br/>

  
  
  - 자바스크립트가 어떤 기준으로 코드를 처리하는지 알 수 있다.
  - 동기적인 코드가 실행 될 때 자바스크립트 엔진 내부에서 어떤 일이 일어나는지 알 수 있다.
  - 비동기적인 코드가 실행 될 때 자바스크립트 엔진 내부에서 어떤 일이 일어나는지 알 수 있다.
  - 1의 경우, setTimeout에서는 recursion이 일어나도 사이트가 먹통이 되지 않으며,  
  2의 경우, Promise.then()에의한 recursion에서는 사이트가 먹통이 되는데,  
  왜 이런 일이 일어나는 줄 설명할 수 있다.

<br/>
<br/>


```
// 1
function handleClick(){
  console.log('handleClick')
  setTimeout(() => {
    console.log('setTimeout')
    handleClick()
  }, 0)
}
```



```
// 2
function handleClick(){
  console.log('handleClick')
  Promise.resolve(0)
  .then(() => {
    console.log('then')
    handleClick()
  })
}
```


전자 setTimeout에서는 recursion이 무한반복되도 사이트가 먹통이 되지 않으며,   
후자 Promise.then()에서는 사이트가 먹통이 나는 이유를 설명할 수 있다. 
<div id="1"></div>
<br/>
<br/>

## 목차
<br/>

1. 프로세스와 쓰레드
2. 자바스크립트 엔진 구조
3. 동기적 코드 실행시 자바스크립트 엔진 동작과정 살펴보기
4. 비동기적 코드 실행시 자바스크립트 엔진 동작과정 살펴보기
5. 콜백큐를 까보면 나오는 3가지: 테스크 큐(setTimeout), 마이크로테스크 큐(promise), 렌더(Requested Animation Frame)
6. 이벤트 리스너에 무한루프, setTimeout에 recursion, promise에 recursion, Requested Animation Frame 동작원리

<br/>
<br/>

<div id="2"></div>


## 1. 프로세스와 쓰레드
<br/>

  컴퓨터에 프로그램을 실행시켰다고 가정하자.  
  (예를들어 음악재생, 사진뷰어 두가지 프로그램이 동시에 실행되고 있다고 가정)  
  여기서 컴퓨터의 프로그램들을 실행될수 있도록 관리하는 것을 '운영체제(operation system)' 이라고 하고,   
  음악재생프로그램, 사진뷰어프로그램처럼 각각의 독립적인 일을 수행하는 주최를 'process(프로세스)' 라고 한다. 

<br/>
<br/>
<div align="center"> <img src="/assets/1.svg" width="700px"  alt="그림 1: 운영체제와 프로세스"></div>

<br/>
<br/>
<div align="center"> <span>그림 1 : 한 컴퓨터(운영체제, operation System)에 세개의 독립적인 프로세스가 실행되고 있다.</span></div>

<br/>
<br/>

### 프로세스의 내부구성:

1. Code: 해당 프로세스를 실행하기 위해 사용되는 프로그램 코드
2. Stack: 프로세스 안에서의 함수들이 어떤 순서로 실행되야 되는지 정함
3. Heap: 메모리 힙(memory heap)이라고 많이 부름, 프로그램이 실행되면서 새롭게 만들어진 오브젝트나 데이터들을 여기에 저장.  
동적으로 할당된 데이터들의 저장소
4. Data: 정적으로 할당된 데이터들의 저장소



<br/>
<br/>

<div align="center"> <img src="/assets/2.svg" width="700px"  alt="그림 2: 프로세스의 내부 모습"></div>

<br/>
<br/>
    <div align="center"> <span>그림2: 프로세스의 내부 모습</span></div>



<br/>
<br/>
이 프로세스(process)는 2개의 쓰레드(Thread)를 사용하고 있는 프로그램이다. 예를 들어 사진을 보여주며 동시에 음악을 들려주는 프로그램이 있다고 하면, 음악 Thread, 사진 Thread 두개가 독립적으로 돌아가고 있을 것 이다. 각 Thread는 자기만의 Stack을 보유하고 code, heap, data에서 정보를 share 하면서 각각의 맡은 바를 수행하게 된다. 
<br/>
<br/>
<br/>

### 멀티쓰레드와 싱글쓰레드
<br/>
  위와 같은 프로그램은 멀티쓰레드이다. 말 그대로 쓰레드가 두 개 이상 있기 때문이다. 쓰레드가 하나뿐인 경우를 싱글쓰레드라고 한다. 예를들어 자바는 언어 자체에서  멀티쓰레드가 지원이 된다 두개 이상의 쓰레드를 둘 수 있다는 뜻이다. 그리고 자바는 싱글 쓰레드이다. 쓰레드를 하나만 가진다는 것이다. 하지만 무조건 멀티쓰레드가 싱글쓰레드보다 좋다고 얘기할 수는 없다. 다수의 쓰레드들이 잘 설계된 톱니바퀴들처럼 서로 문제를 일으키지 않게 잘 코딩을 해야하는데, 이에 대한 부담은 순전히 개발자의 몫이 되기 때문이다. 이에 비해 자바스크립트는 싱글쓰레드이므로 그런 부분을 고려를 하지 않아도 되기 때문에 멀티쓰레드 보다 더 편할수 는 있다.   

<br/>
<br/>

### Q: 근데 자바스크립트는 싱글쓰레드임에도 불구하고 어떻게 비동기적인 일을 수행할수 있는건가?
<br/>
<br/>

답: 자바스크립트에는 '이벤트루프(event-loop)'가 있어, 싱글쓰레드임에도 불구하고 비동기적인 일을 수행할 수 있게 된다.  
이에 대해서는 자바스크립트 엔진 구조를 보면서 설명하겠음

<br/>
<br/>

## 2. 자바스크립트의 엔진구조 


<br/>
<br/>

<div align="center"> <img src="/assets/3.svg" width="700px"  alt="그림 3: 자바스크립트 엔진의 모습"></div>

<br/>
<br/>
    <div align="center"> <span>그림3: 자바스크립트 엔진의 모습</span></div>

<br/>

  - Memory Heap: 동적 메모리(Heap)을 저장하는 곳
  - Call Stack: 실행할 코드를 쌓아 두는 곳, 자바스크립트가 돌면 코드 한줄 단위로 실행하게 되는데(자바스크립트는 interpreter언어라서 한줄한줄 해석해서 코드를 읽어 감), 그 한줄 한줄이 Call Stack에 담기게 됨, LIFO(Last In First Out)이라고 가장 나중에 들어온 코드는 가장 빨리 나가게 된다 

  - Event Loop: Queue에 할당된 함수를 순서에 맞춰 Call Stack에 할당

  - Web APIs(노드에선 백그라운드라고 부름): DOM, AJAX, setTimeout, promise, requested Animation Frame과 같은 주로 비동기처리를 담당한다. 콜스텍 안에 동기가 아닌 비동기 코드가 들어올 때, 이벤트루프는 그 코드를 꺼내 Web APIs로 보내주게 된다.   

  - Callback Queue: 비동기처리가 끝난 후에 실행되어야 할 콜백함수가 차례로 들어옴   
    그리고 먼저 들어온 콜백은 먼저 빠져나가게 됨 (FIFO: First In First Out)

<br/>
<br/>

<div id="2"></div>

## 3. 동기적 코드 실행시 자바스크립트 엔진 동작과정 살펴보기


<br/>

예) 

```
function first() {
    second();
    console.log('첫번쨰!')
}
function second(){
    third();
    console.log('두번째')
}
function second(){
    console.log('세번쨰')
}
first();
third();

```

<br/>

위의 코드를 동작시키면 자바스크립트 내부에서는 어떤 일들이 일어 날 것인가?

<br/>
<br/>


|1.     | <img src="/assets/4.svg" alt="4" width="200px" height="200px" />    | 가장 먼저 가장 기본이 되는 anonymous가 콜스텍에 먼저 들어감     |    <img src="/assets/10.svg" alt="10" width="200px" height="200px" /> |
|:---:|---|:---|---|
|2.     | <img src="/assets/5.svg" alt="5" width="200px" height="200px" />      |  **함수가 호출되면'()' 콜스텍에 담겨진다** 라고 생각하면 됨 <br />자바스크립트가 함수 호출문 `first()`;를 읽고,  first가 CallStack에 담김  <br /> *`console.log("첫번째")`는 `second()`가 아직 안 끝났기 때문에 안 읽히고 있는 것임*    |<img src="/assets/10.svg" alt="10" width="200px" height="200px" />|
|3.     | <img src="/assets/6.svg" alt="6" width="200px" height="200px" />      |  "세번째"라는 콘솔로그가 실행이 됨 실행이 끝나면 CallStack에서 지워짐<br /> 함수의 제일 끝 중괄호에 닫게 되면 그 함수는 다 읽힌 것이라고 보면 됨<br /> 이리하여 `third()`도 CallStack을 빠져나감<br /> '두번째', '첫번째'를 모두 출력하고 함수호출문 `first()`의 모든 실행이 끝남     |<img src="/assets/7.svg" alt="7" width="200px" height="200px" /> |
|4.     | <img src="/assets/8.svg" alt="8" width="200px" height="200px" />      | third()가 한번 더 호출되고 anonymous가 콜스텍을 빠져나감으로써 콜스텍은 텅텅 비게 됨<br /> 콜스텍이 전부 비었다는 뜻은 자바스크립트 프로그램이 전부 종료되었다는 것과 같음 |<img src="/assets/9.svg" alt="9" width="200px" height="200px" /> |



<br/>
<br/>

<div id="3"></div>

## 4. 비동기적 코드 실행시 자바스크립트 엔진 동작과정 살펴보기


<br/>


```
console.log("시작")

setTimeout(() => {
  console.log("중간")
}, 3000)

console.log("끝")

```

이 코드는 어떻게 동작할까?




<table>
  <tr>
    <td>1.</td>
    <td> <img src="/assets/11~20/11.svg" alt="그림 11"></td>
    <td><img src="/assets/11~20/12.svg" alt="그림 12"></td>
  </tr>
  <tr>
    <td colspan="3" align="center">anonymous를 먼저 받고, 1줄의 console.log("시작")을 실행한다</td>
  </tr>
  
  <tr>
    <td>2.</td>
    <td> <img src="/assets/11~20/13.svg" alt="그림 13"></td>
    <td><img src="/assets/11~20/14.svg" alt="그림 14"></td>
  </tr>
  <tr>
    <td colspan="3" align="center">setTimeout이 CallStack에 들어옴, setTImeout은 동기가 아닌 비동기이다.<br/> 비동기인 setTimeout은 webAPIs로 따로 빠지게 된다.</td>
  </tr>
  
  <tr>
    <td>3.</td>
    <td> <img src="/assets/11~20/15.svg" alt="그림 15"></td>
    <td><img src="/assets/11~20/16.svg" alt="그림 16"></td>
  </tr>
  <tr>
    <td colspan="3" align="center">setTimeout()가 비동기로 빠지게 되고, 다음줄인 console.log("끝")이 실행 됨</td>
  </tr>
  
  <tr>
    <td>4.</td>
    <td> <img src="/assets/11~20/17.svg" alt="그림 17"></td>
    <td><img src="/assets/11~20/18.svg" alt="그림 18"></td>
  </tr>
  <tr>
    <td colspan="3" align="center">console.log("끝")도 다 실행했고, anonymous도 실행이 끝남. <br/> 3초 후 setTimeout의 타임이 끝나게 되면, setTimeout의 콜백함수는 Callback Queue로 들어가게 된다. </td>
  </tr>
  
  <tr>
    <td>5.</td>
    <td> <img src="/assets/11~20/19.svg" alt="그림 19"></td>
    <td><img src="/assets/11~20/20.svg" alt="그림 20"></td>
  </tr>
  <tr>
    <td colspan="3" align="center">EventLoop가 Callback Queue에 콜백이 들어와 있는 것을 확인한다.<br/> 그 다음으로 CallStack의 상태가 비어있는지 확인한다. CallStack이 텅텅 비어있으니 Callback Queue에서 기다리고 있는 콜백을 CallStack에 집어 넣는다. <br/>
    EventLoop는 콜스텍이 텅텅 비어있는 경우에만 Callback Queue에서 대기중인 비동기의 콜백을 콜스텍으로 가져와 실행시킨다. 만약 콜스텍이 차있으면 가져오지 않는다.   
    그리고 또, 이벤트 루프는 한번에 하나만 가져온다. Callback Queue에 콜백이 두 개 이상 머물러 있다고 해도 두 개 이상을 한번에 가져오지는 않는다. <br/>
    이렇게 setTimeout Callback 을 실행시키고 "중간"을 콘솔에 출력시키며 프로그램을 마무리 한다.       
    </td>


  </tr>

 
</table>

<br/>
> 이번 예에서 setTimeout으로 예를 들었는데, setInterval, addClickEventListener도 똑같은 원리로 동작한다. 





   







