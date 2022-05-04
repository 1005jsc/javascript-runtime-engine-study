// function first() {
//     second();
//     console.log('첫번쨰!')
// }
// function second(){
//     third();
//     console.log('두번째')
// }
// function second(){
//     console.log('세번쨰')
// }
// first();
// third();

console.log("시작")

setTimeout(function(){
    console.log("중간")
}, 0)

Promise.resolve()
.then(() => {console.log("프로미스")})

console.log("끝")







