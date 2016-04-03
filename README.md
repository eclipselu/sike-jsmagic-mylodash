## 闭包

闭包就是一个函数以及创建它的环境。

```js

function makeLinearFunc(n, m) {
	// y = x * n + m;
	function func(i) {
		return i * n + m;
	}
	return func;
}

// 这里创建的f包含两部分内容
// 1. 上面定义的 func 的函数体本身
// 2. 环境变量们: n = 4, m = 5
var f = makeLinearFunc(4, 5);
```

## 闭包陷阱

在循环头（`for (...)`） 中使用 var 关键字，然后在循环体中创建闭包不会得到预想的结果：

```js
var funcs = [];
for (var i = 0; i < 3; i++) {
	funcs[i] = function (x) { return x + i; };
}

funcs[0](1); // 4
funcs[1](1); // 4
```

为什么会这样呢，因为循环体中的函数选择了 `var i` 作为闭包的「环境变量」，但是 `var i` 的作用域是整个代码段（从 `var funcs=[]` 到 `func[1](1)`），循环结束后它的值已经被改为 3;
所以我们相当于生成了3个这样的函数：

```js
function f(x) { return x + 3; };
```

怎么解决呢：很简单，只需要把 var 换成 let 就好了

```js
var funcs = [];
for (let i = 0; i < 3; i++) {
	funcs[i] = function (x) { return x + i; };
}

funcs[0](1); // 1
funcs[1](1); // 2
```

## 使用闭包模拟私有方法

```js
function makeCounter() {
	// private
	var count = 0;

	return {
		incr: function() {
			count += 1;
			return count;
		},
		decr: function() {
			count -= 1;
			return count;
		},
		value: function() {
			return count;
		}
	}
}

var counter = makeCounter();
counter.incr();
console.log(counter.value()); // 1
counter.decr();
console.log(counter.value()); // 0
```

https://github.com/eclipselu/sike-jsmagic-mylodash

### This 出现的场景

- 有对象就指向调用对象
- 没调用对象就指向全局对象
- 用new构造就指向新对象
- 通过 apply 或 call 或 bind 来改变 this 的所指。

### apply, call, bind

apply 和 call 用法类似，区别在于 apply 接受一个包含多个参数的数组，而 call 接受的是多个参数的列表。

```js
// call
fun.call(thisArg[, arg1[, arg2[, ...]]])

// apply
fun.apply(thisArg[, argsArray])
```

bind 相当于 partial evaluate 了一个函数，固定了这个函数的 this。

```js

function f(this[, arg1[, arg2[, ...]]])

// 相当于 pritial evaluate 了 f, this=obj,
// arg1 = partials[0], arg2 = partials[1]
bind(f, obj, partials)
```

### argument Object

- argument 是一个特殊的 Array-like Object
- 通常需要把它转成 Array 来使用

#### 使用与优化

避免 [Leaking Arguments](https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments)。猜测是：这样会使 V8 引擎把 arguments 这个在 stack 上的对象（C语言里面是在 stack 上）转换成一个 javascript 对象，从而禁止了一些优化。

此外，从安全角度上来说，arguments 应该是一个 function 的「私有属性」，如果要对它进行一些操作，最好还是先转换成 Array 赋值给一个新的变量。