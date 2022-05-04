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
