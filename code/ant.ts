// 1.根据表达式计算字母数
//   说明：
// 		给定一个描述字母数量的表达式，计算表达式里的每个字母实际数量
// 		表达式格式：
// 		字母紧跟表示次数的数字，如 A2B3
// 		括号可将表达式局部分组后跟上数字，(A2)2B
// 		数字为1时可缺省，如 AB3。
//  	示例：
//  		countOfLetters('A2B3'); // { A: 2, B: 3 }
//  		countOfLetters('A(A3B)2'); // { A: 7, B: 2 }
//  		countOfLetters('C4(A(A3B)2)2'); // { A: 14, B: 4, C: 4 }
function countOfLetters(value){
    const strStack = [];
    const result = {};
    let needOutStack = false;

    const countLetters = (multiple) => {
        let curLetter = "";
        let preMultiple = 1;
        while(strStack.length > 0){
            curLetter = strStack.pop();
            if(curLetter === "("){
                break;
            }
            if(!Number.isNaN(+curLetter)){
                preMultiple = +curLetter;
                continue;
            }else{
                result[curLetter] = result[curLetter] ? result[curLetter] + preMultiple : preMultiple;
            }
        }
				Object.keys(result).forEach(v => {
					result[v] = result[v] * multiple
				})
    }

    for(let i = 0;i < value.length;i++){
        if(value.charAt(i) === ")"){
            needOutStack = true;
            continue;
        }
        if(needOutStack && !Number.isNaN(+value.charAt(i)){
					needOutStack = false;
            countLetters(+value.charAt(i));
            continue;
        }
        strStack.push(value.charAt(i));
    }
		if(strStack.length > 0){
			countLetters(1);
		}
		return result
}
// 2. 实现一个`Foo`方法，接受函数`func`和时间`wait`
// 	 返回一个新函数，新函数即时连续多次执行，但也只限制在`wait`的时间执行一次
		function Foo(func, wait) {
			/* 代码实现 */
			let lastTime = 0;
			return function(){
				const nowDate = +(new Date());
				if(nowDate - lastTime > wait){
					func();
				}else{
					lastTime = nowDate;
				}
			}
		}
// 3. 对象扁平化
// 说明：请实现 flatten(input) 函数，input 为一个 javascript 对象（Object 或者 Array），返回值为扁平化后的结果。
// 示例：
//  var input = {
//    a: 1,
//    b: [ 1, 2, { c: true }, [ 3 ] ],
//    d: { e: 2, f: 3 },
//    g: null,
//  }
//  var output = flatten(input);
//  output如下
//  {
//    "a": 1,
//    "b[0]": 1,
//    "b[1]": 2,
//    "b[2].c": true,
//    "b[3][0]": 3,
//    "d.e": 2,
//    "d.f": 3,
//    // "g": null,  值为null或者undefined，丢弃
// }
//

function flatten(input){
	const result = {};
	const flat = (target,prefix) => {
		if(typeof target !== "object"){
			result[prefix] = target;
		}
		const isArray = Array.isArray(target);
		for (const i in target) {
			const pre = isArray ? `${prefix ? prefix + "[" : ""}${i}${prefix?"]":""}` : `${prefix ? prefix + "." : ""}${i}`;
			flat(target[i],pre);
		}
	}
	flat(input,"");
	return result;
}