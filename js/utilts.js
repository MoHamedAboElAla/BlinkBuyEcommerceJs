const isNameValid=(n)=>{
    let p =/^[A-za-z]{3,12}$/;
    return p.test(n);
}
const ispassValid=(n)=>{
    let p =/^[A-za-z0-9]{8,12}$/;
    return p.test(n);
}
const isEmailValid=(n)=>{
    let p =/^[A-za-z0-9._%+-]+@[A-za-z0-9.-]+\.[A-za-z0]{2,}$/;
    return p.test(n);
}