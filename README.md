  # 자바스크립트의 런타임 환경(내부적으로 어떻게 동작하는가) 알기


<br/>


  ## 이걸 이해하면?...

<br/>

  
  
  - 자바스크립트가 어떤 기준으로 코드를 처리하는지 알 수 있다.
  - 동기적인 코드가 실행 될 때 자바스크립트 엔진 내부에서 어떤 일이 일어나는지 알 수 있다.
  - 비동기적인 코드가 실행 될 때 자바스크립트 엔진 내부에서 어떤 일이 일어나는지 알 수 있다.
  - 1의 경우, setTimeout에서는 recursion이 일어나도 사이트가 먹통이 되지 않으며,  
  2의 경우, Promise.then()에의한 recursion에서는 사이트가 먹통이 되는 차이를 설명할 수 있다.

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

## 1. 프로세스와 쓰레드
<br/>

                컴퓨터에 프로그램을 실행시켰다고 가정하자.  
         (예를들어 음악재생, 사진뷰어 두가지 프로그램이 동시에 실행되고 있다고 가정)  
  여기서 컴퓨터의 프로그램들을 실행될수 있도록 관리하는 것을 '운영체제(operation system)' 이라고 하고
















