/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

/*
* 扩展运算符 ... ，将接受的多个不定参数转为数组。
*/
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  // es5中array的filter方法，返回符合过滤原则的数组
  // func => typeof func === 'function'  ES6写法
  // 等同于 function(func){return typeof func === 'function'}
  funcs = funcs.filter(func => typeof func === 'function')

  //只有一个参数，返回这个函数本身
  if (funcs.length === 1) {
    return funcs[0]
  }

  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)//返回除最后一个元素外的数组

  
  //  Array.reduceRight/reduce方法类似，只是前者是按照数组元素从右到左的顺序执行的。
  //  这里以reduce方法说明
  //  array.reduce(callbackfn,[initialValue])使用callbackfn函数作为回调函数，执行相应的功能。
  //  并且可以接受初始值
  //  在callbackfn中接受四个参数，其中index是curValue的索引值项，array是调用该方法的数组
  //  preValue是在curValue前已经处理的值，也就是说
  //  reduce中：preValue是curValue的左边的值；reduceRight中preValue是curValue右边的值。

  //  var arr = [0,1,2,3,4];
  //   arr.reduce(function (preValue,curValue,index,array) {
  //     return preValue + curValue;
  //   }, 5); //15
  

  // return function(...args){
  //   return rest.reduceRight(function(composed,f){
  //       return f(composed);
  //   },last(...args));
  // }

  // 实际上的使用就是： compose(f,g,h)(...args) => f(g(h(...args)))
  // 从右到左依次调用参数，并且每次以上次调用结果为参数。

  return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
}


// 实例：
// function func1(num) {
//   console.log('func1 获得参数 ' + num);
//   return num + 1;
// }

// function func2(num) {
//   console.log('func2 获得参数 ' + num);
//   return num + 2;
// }

// function func3(num) {
//   console.log('func3 获得参数 ' + num);
//   return num + 3;
// }

// // 有点难看（如果函数名再长一点，那屏幕就不够宽了）
// var re1 = func3(func2(func1(0)));
// console.log('re1：' + re1);

// console.log('===============');

// // 很优雅
// var re2 = Redux.compose(func3, func2, func1)(0);
// console.log('re2：' + re2);
// 
// 控制台输出：
// func1 获得参数 0
// func2 获得参数 1
// func3 获得参数 3
// re1：6
// ===============
// func1 获得参数 0
// func2 获得参数 1
// func3 获得参数 3
// re2：6