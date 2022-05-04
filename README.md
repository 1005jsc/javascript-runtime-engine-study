# 자바스크립트의 런타임 환경(내부적으로 어떻게 동작하는가) 알기





  ## 이걸 이해하면?...



  
  
  - 자바스크립트가 어떤 기준으로 코드를 처리하는지 알 수 있다.
  - 동기적인 코드가 실행 될 때 자바스크립트 엔진 내부에서 어떤 일이 일어나는지 알 수 있다.
  - 비동기적인 코드가 실행 될 때 자바스크립트 엔진 내부에서 어떤 일이 일어나는지 알 수 있다.
  - 1의 경우, setTimeout에서는 recursion이 일어나도 사이트가 먹통이 되지 않으며,  
  2의 경우, Promise.then()에의한 recursion에서는 사이트가 먹통이 되는 차이를 설명할 수 있다.



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













