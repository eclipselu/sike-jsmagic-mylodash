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
