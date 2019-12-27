一：命名规范：
    1 文件资源命名和路径
        命名方式 : 文件名建议只使用小写字母，不使用大写字母。
        命名规范 : 文件名不得含有空格、数字、下划线、汉字和特殊字符。
    2 变量命名
        命名方式 : 小驼峰式命名方法。
        命名规范 : 类型+对象描述的方式，如果没有明确的类型，就可以使前缀为名词。
    3 函数& 方法
        命名方式 : 小驼峰方式 ( 构造函数使用大驼峰命名法 )。
        命名规则 : 前缀为动词（如 can, has is get set load）。
    4 常量
        命名方法 : 全部大写。
        命名规范 : 使用大写字母和下划线来组合命名，下划线用以分割单词。
    5 类的命名：
        命名方式 : 大驼峰方式。
        命名规则 : 类型+对象描述的方式。
    6 类的成员
        公共属性和方法 :小驼峰式命名方法
        私有属性和方法 : 前缀为下划线(_)后面跟公共属性和方法一样的命名方式
    7 注释规范
        单独一行：//(双斜线)与注释文字之间保留一个空格
        多行注释 ( / **注释说明* / )
    8 组件名
        命名方式 : 大驼峰方式
        命名规则 : 功能+语义化
    9 图片命名规则
        命名方式 : 大驼峰方式
        命名规则 :  语义化（banner logo button menu title）
    10 命名常用规范词 
        10.1: 按结构
            容器: container 页头：header 内容：content/container 页面主体：main 尾：footer 导航：nav 侧栏：sidebar 栏目：column 页面外：wrapper  左右中：left right center
        10.1: 按功能
            标志：logo  登陆：login 登录条：loginbar 搜索：search 功能区：shop 标题：title 加入：joinus 状态：status 按钮：btn 滚动：scroll 标签页：tab 文章列表：list 提示信息：msg 当前的: current 小技巧：tips 图标: icon 注释：note 指南：guild 服务：service 热点：hot新闻：news 下载：download 投票：vote 合作伙伴：partner 友情链接：link 版权：copyright
        10.1: 按导航
            导航：nav 子导航：subnav 顶导航：topnav 边导航：sidebar 左导航：leftsidebar 右导航：rightsidebar 菜单：menu 子菜单：submenu 标题: title 摘要: summary
二: HTML规范
    1 语义化
        使用语义化标签也是有理由SEO的。
    2 alt标签不为空
        <img>标签的 alt 属性指定了替代文本，用于在图像无法显示或者用户禁用图像显示时，代替图像显示在浏览器中的内容。
    3 html、css、js三者分离
        尽量在文档和模板中只包含结构性的 HTML；而将所有表现代码，移入样式表中；将所有动作行为，移入脚本之中。
    4 关闭所有 HTML 元素
        在 HTML5 中, 空的 HTML 元素也不一定要关闭，但在 XHTML 和 XML 中斜线 (/) 是必须的。
    5 空行和缩进
        不要无缘无故添加空行。为每个层级添加缩进，缩进使用两个空格。
        BEM的意思就是块（block）、元素（element）、修饰符（modifier）,是由Yandex团队提出的一种前端命名方法论。
    6 采用文档流布局
        指元素在排版布局的过程中，元素会自动从左到右，从上到下的流式排列。（脱离文档流的方式有两种：浮动和定位。）
三：css规范bem
    1 id和class的命名采用BEM规范
        Bem是块（block）、元素（element）、修饰符（modifier）的简写，由 Yandex 团队提出的一种前端 CSS 命名方法论。
    2 禁止使用ID
        一般情况下ID不应该被用于样式，并且ID的权重很高，所以不使用ID解决样式的问题，而是使用class
    3 css选择器中避免使用标签名
        从结构、表现、行为分离的原则来看，应该尽量避免css中出现HTML标签，并且在css选择器中出现标签名会存在潜在的问题。
    4 使用子选择器
        很多前端开发人员写选择器链的时候不使用 直接子选择器（注：直接子选择器和后代选择器的区别）。有时，这可能会导致疼痛的设计问题并且有时候可能会很耗性能。然而，在任何情况下，这是一个非常不好的做法。
    5 尽量使用缩写属性
        尽量使用缩写属性对于代码效率和可读性是很有用的，比如font属性。
    6 0后面不带单位
        省略0后面的单位
    7 属性编写顺序
        显示属性：display/list-style/position/float/clear …
        自身属性（盒模型）：width/height/margin/padding/border
        背景：background
        行高：line-height
        文本属性：color/font/text-decoration/text-align/text-indent/vertical-align/white-space/content…
        其他：cursor/z-index/zoom/overflow
        CSS3属性：transform/transition/animation/box-shadow/border-radius如果使用CSS3的属性，如果有必要加入浏览器前缀：则按照 -webkit- / -moz- / -ms- / -o- /
四 ： js规范按照的eslint规范
    1 使用两个空格进行缩进。 
        function hello (name) {
            console.log('hi', name)
        }
    2 除需要转义的情况外，字符串统一使用单引号。
        eslint: quotes
        console.log('hello there')
        $("<div class='box'>")
    3 不要定义未使用的变量。
        eslint: no-unused-vars
        function myFunction () {
            var result = something()   // ✗ avoid·
        }
    4 关键字后面加空格。
        eslint: keyword-spacing
        if (condition) { ... }   // ✓ ok
        if(condition) { ... }    // ✗ avoid
    5 函数声明时括号与函数名间加空格。
        eslint: space-before-function-paren
        function name (arg) { ... }   // ✓ ok
        function name(arg) { ... }    // ✗ avoid
        run(function () { ... })      // ✓ ok
        run(function() { ... })       // ✗ avoid
    6 始终使用 === 替代 ==。
        例外： obj == null 可以用来检查 null || undefined。
        eslint: eqeqeq
        if (name === 'John')   // ✓ ok
        if (name == 'John')    // ✗ avoid
        if (name !== 'John')   // ✓ ok
        if (name != 'John')    // ✗ avoid
    7 字符串拼接操作符 (Infix operators) 之间要留空格。
        eslint: space-infix-ops
        // ✓ ok
        var x = 2
        var message = 'hello, ' + name + '!'
        // ✗ avoid
        var x=2
        var message = 'hello, '+name+'!'
    8 逗号后面加空格。
        eslint: comma-spacing
        // ✓ ok
        var list = [1, 2, 3, 4]
        function greet (name, options) { ... }
        // ✗ avoid
        var list = [1,2,3,4]
        function greet (name,options) { ... }
    9 else 关键字要与花括号保持在同一行。
        eslint: brace-style
        // ✓ ok
        if (condition) {
            // ...
        } else {
            // ...
        }
        // ✗ avoid
        if (condition) {
            // ...
        }
        else {
            // ...
        }
    10 多行 if 语句的的括号不能省。
        eslint: curly
        // ✓ ok
        if (options.quiet !== true) console.log('done')
        // ✓ ok
        if (options.quiet !== true) {
            console.log('done')
        }
        // ✗ avoid
        if (options.quiet !== true)
            console.log('done')
    11 不要丢掉异常处理中err参数。
        eslint: handle-callback-err
        // ✓ ok
        run(function (err) {
        if (err) throw err
            window.alert('done')
        })
        // ✗ avoid
        run(function (err) {
            window.alert('done')
        })
    12 使用浏览器全局变量时加上 window. 前缀。(此条规则不要)
        Exceptions are: document, console and navigator.
        eslint: no-undef
        window.alert('hi')   // ✓ ok
    13 不允许有连续多行空行。
        eslint: no-multiple-empty-lines
        // ✓ ok
        var value = 'hello world'
        console.log(value)
        // ✗ avoid
        var value = 'hello world'


        console.log(value)
    14 对于三元运算符 ? 和 : 与他们所负责的代码处于同一行
        eslint: operator-linebreak
        // ✓ ok
        var location = env.development ? 'localhost' : 'www.api.com'
        // ✓ ok
        var location = env.development
            ? 'localhost'
            : 'www.api.com'
        // ✗ avoid
        var location = env.development ?
            'localhost' :
            'www.api.com'
    15 每个 var 关键字单独声明一个变量。（不用var，使用let const）
        eslint: one-var
        // ✓ ok
        var silent = true
        var verbose = true
        // ✗ avoid
        var silent = true, verbose = true
        // ✗ avoid
        var silent = true,
            verbose = true 
    16 条件语句中赋值语句使用括号包起来。这样使得代码更加清晰可读，而不会认为是将条件判断语句的全等号（===）错写成了等号（=）
        eslint: no-cond-assign
        // ✓ ok
        while ((m = text.match(expr))) {
            // ...
        }
        // ✗ avoid
        while (m = text.match(expr)) {
        // ...
        }
    17 单行代码块两边加空格。
        eslint: block-spacing
        function foo () {return true}    // ✗ avoid
        function foo () { return true }  // ✓ ok
    18 对于变量和函数名统一使用驼峰命名法。
        eslint: camelcase
        function my_function () { }    // ✗ avoid
        function myFunction () { }     // ✓ ok
        var my_var = 'hello'           // ✗ avoid
        var myVar = 'hello'            // ✓ ok
    19 不允许有多余的行末逗号。分号
        eslint: comma-dangle
        var obj = {
            message: 'hello',   // ✗ avoid
        }
    20 始终将逗号置于行末。
        eslint: comma-style
        var obj = {
            foo: 'foo'
            ,bar: 'bar'   // ✗ avoid
        }
        var obj = {
            foo: 'foo',
            bar: 'bar'   // ✓ ok
        }
    21 点号操作符须与属性需在同一行。
        eslint: dot-location
        console.
            log('hello')  // ✗ avoid
        console
            .log('hello') // ✓ ok
    22 文件末尾留一空行。
        elint: eol-last
    23 函数调用时标识符与括号间不留间隔。
        eslint: func-call-spacing
        console.log ('hello') // ✗ avoid
        console.log('hello')  // ✓ ok
    24 键值对当中冒号与值之间要留空白。
        eslint: key-spacing
        var obj = { 'key' : 'value' }    // ✗ avoid
        var obj = { 'key' :'value' }     // ✗ avoid
        var obj = { 'key':'value' }      // ✗ avoid
        var obj = { 'key': 'value' }     // ✓ ok
    25 构造函数要以大写字母开头。
        eslint: new-cap
        function animal () {}
        var dog = new animal()    // ✗ avoid

        function Animal () {}
        var dog = new Animal()    // ✓ ok
    26 无参的构造函数调用时要带上括号。
        eslint: new-parens
        function Animal () {}
        var dog = new Animal    // ✗ avoid
        var dog = new Animal()  // ✓ ok
    27 对象中定义了存值器，一定要对应的定义取值器。
        eslint: accessor-pairs
        var person = {
            set name (value) {    // ✗ avoid
                this.name = value
            }
        }
        var person = {
            set name (value) {
                this.name = value
            },
            get name () {         // ✓ ok
                return this.name
            }
        }
    28 子类的构造器中一定要调用 super
        eslint: constructor-super
        class Dog {
            constructor () {
                super()   // ✗ avoid
            }
        }
        class Dog extends Mammal {
            constructor () {
                super()   // ✓ ok
            }
        }
    29 使用数组字面量而不是构造器。
        eslint: no-array-constructor
        var nums = new Array(1, 2, 3)   // ✗ avoid
        var nums = [1, 2, 3]            // ✓ ok
    30 不允许避免使用 arguments.callee 和 arguments.caller。
        eslint: no-caller
        function foo (n) {
        if (n <= 0) return
            arguments.callee(n - 1)   // ✗ avoid
        }
        function foo (n) {
            if (n <= 0) return
                foo(n - 1)
        }
    31 避免对类名重新赋值。
        eslint: no-class-assign
        class Dog {}
        Dog = 'Fido'    // ✗ avoid
    32 避免修改使用 const 声明的变量。
        eslint: no-const-assign
        const score = 100
        score = 125       // ✗ avoid
    33 避免使用常量作为条件表达式的条件（循环语句除外）。
        eslint: no-constant-condition
        if (false) {    // ✗ avoid
            // ...
        }
        if (x === 0) {  // ✓ ok
            // ...
        }
        while (true) {  // ✓ ok
        // ...
        }
    34 正则中不要使用控制符。
        eslint: no-control-regex
        var pattern = /\x1f/    // ✗ avoid
        var pattern = /\x20/    // ✓ ok
    35 不要使用 debugger。
        eslint: no-debugger
        function sum (a, b) {
            debugger      // ✗ avoid
            return a + b
        }
    36 不要对变量使用 delete 操作。
        eslint: no-delete-var
        var name
        delete name     // ✗ avoid
    37 不要定义冗余的函数参数。
        eslint: no-dupe-args
        function sum (a, b, a) {  // ✗ avoid
            // ...
        }
        function sum (a, b, c) {  // ✓ ok
            // ...
        }
    38 类中不要定义冗余的属性。
        eslint: no-dupe-class-members
        class Dog {
            bark () {}
            bark () {}    // ✗ avoid
        }
    39 对象字面量中不要定义重复的属性。
        eslint: no-dupe-keys
        var user = {
            name: 'Jane Doe',
            name: 'John Doe'    // ✗ avoid
        }
    40 switch 语句中不要定义重复的 case 分支。
        eslint: no-duplicate-case
        switch (id) {
        case 1:
            // ...
        case 1:     // ✗ avoid
        }
    41 同一模块有多个导入时一次性写完。
        eslint: no-duplicate-imports
        import { myFunc1 } from 'module'
        import { myFunc2 } from 'module'          // ✗ avoid
        import { myFunc1, myFunc2 } from 'module' // ✓ ok
    42 正则中不要使用空字符。
        eslint: no-empty-character-class
        const myRegex = /^abc[]/      // ✗ avoid
        const myRegex = /^abc[a-z]/   // ✓ ok
    43 不要解构空值。
        eslint: no-empty-pattern
        const { a: {} } = foo         // ✗ avoid
        const { a: { b } } = foo      // ✓ ok
    44 不要使用 eval()。
        eslint: no-eval
        eval( "var result = user." + propName ) // ✗ avoid
        var result = user[propName]             // ✓ ok
    45 catch 中不要对错误重新赋值。
        eslint: no-ex-assign
        try {
            // ...
        } catch (e) {
            e = 'new value'             // ✗ avoid
        }
        try {
            // ...
        } catch (e) {
            const newVal = 'new value'  // ✓ ok
        }
    46 不要扩展原生对象。
        eslint: no-extend-native
        Object.prototype.age = 21     // ✗ avoid
    47 避免多余的函数上下文绑定。
        eslint: no-extra-bind
        const name = function () {
            getName()
        }.bind(user)    // ✗ avoid
        const name = function () {
            this.getName()
        }.bind(user)    // ✓ ok
    48 避免不必要的布尔转换。
        eslint: no-extra-boolean-cast
        const result = true
        if (!!result) {   // ✗ avoid
            // ...
        }
        const result = true
        if (result) {     // ✓ ok
            // ...
        }
    49 不要使用多余的括号包裹函数。
        eslint: no-extra-parens
        const myFunc = (function () { })   // ✗ avoid
        const myFunc = function () { }     // ✓ ok
    50 switch 一定要使用 break 来将条件分支正常中断。
        eslint: no-fallthrough
        switch (filter) {
        case 1:
            doSomething()    // ✗ avoid
        case 2:
            doSomethingElse()
        }
        switch (filter) {
        case 1:
            doSomething()
            break           // ✓ ok
        case 2:
            doSomethingElse()
        }
    51 不要省去小数点前面的0。
        eslint: no-floating-decimal
        const discount = .5      // ✗ avoid
        const discount = 0.5     // ✓ ok
        避免对声明过的函数重新赋值。
    52 eslint: no-func-assign
        function myFunc () { }
        myFunc = myOtherFunc    // ✗ avoid
    53 不要对全局只读对象重新赋值。
        eslint: no-global-assign
        window = {}     // ✗ avoid
    54 注意隐式的 eval()。
        eslint: no-implied-eval
        setTimeout("alert('Hello world')")                   // ✗ avoid
        setTimeout(function () { alert('Hello world') })     // ✓ ok
    55 嵌套的代码块中禁止再定义函数。
        eslint: no-inner-declarations
        if (authenticated) {
            function setAuthUser () {}    // ✗ avoid
        }
    56 不要向 RegExp 构造器传入非法的正则表达式。
        eslint: no-invalid-regexp
        RegExp('[a-z')    // ✗ avoid
        RegExp('[a-z]')   // ✓ ok
    57 不要使用非法的空白符。
        eslint: no-irregular-whitespace
        function myFunc () /*<NBSP>*/{}   // ✗ avoid
    58 禁止使用 __iterator__。
        eslint: no-iterator
        Foo.prototype.__iterator__ = function () {}   // ✗ avoid
    59 外部变量不要与对象属性重名。
        eslint: no-label-var
        var score = 100
        function game () {
            score: 50         // ✗ avoid
        }
    60 不要使用标签语句。
        eslint: no-labels
        label:
        while (true) {
            break label     // ✗ avoid
        }
    61 不要书写不必要的嵌套代码块。
        eslint: no-lone-blocks
        function myFunc () {
            {                   // ✗ avoid
                myOtherFunc()
            }
        }
        function myFunc () {
            myOtherFunc()       // ✓ ok
        }
    62 不要混合使用空格与制表符作为缩进。
        eslint: no-mixed-spaces-and-tabs
    63 除了缩进，不要使用多个空格。
        eslint: no-multi-spaces
        const id =    1234    // ✗ avoid
        const id = 1234       // ✓ ok
    64 不要使用多行字符串。
        eslint: no-multi-str
        const message = 'Hello \
                        world'     // ✗ avoid
    65 new 创建对象实例后需要赋值给变量。
        eslint: no-new
        new Character()                     // ✗ avoid
        const character = new Character()   // ✓ ok
    66 禁止使用 Function 构造器。
        eslint: no-new-func
        var sum = new Function('a', 'b', 'return a + b')    // ✗ avoid
    67 禁止使用 Object 构造器。
        eslint: no-new-object
        let config = new Object()   // ✗ avoid
    68 禁止使用 new require。
        eslint: no-new-require
        const myModule = new require('my-module')    // ✗ avoid
    69 禁止使用 Symbol 构造器。
        eslint: no-new-symbol
        const foo = new Symbol('foo')   // ✗ avoid
    70 禁止使用原始包装器。
        eslint: no-new-wrappers
        const message = new String('hello')   // ✗ avoid
    71 不要将全局对象的属性作为函数调用。
        eslint: no-obj-calls
        const math = Math()   // ✗ avoid
    72 不要使用八进制字面量。
        eslint: no-octal
        const num = 042     // ✗ avoid
        const num = '042'   // ✓ ok
    73 字符串字面量中也不要使用八进制转义字符。
        eslint: no-octal-escape
        const copyright = 'Copyright \251'  // ✗ avoid
    74 使用 __dirname 和 __filename 时尽量避免使用字符串拼接。
        eslint: no-path-concat
        const pathToFile = __dirname + '/app.js'            // ✗ avoid
        const pathToFile = path.join(__dirname, 'app.js')   // ✓ ok
    75 使用 getPrototypeOf 来替代 __proto__。
        eslint: no-proto
        const foo = obj.__proto__               // ✗ avoid
        const foo = Object.getPrototypeOf(obj)  // ✓ ok
    76 不要重复声明变量。
        eslint: no-redeclare
        let name = 'John'
        let name = 'Jane'     // ✗ avoid
        let name = 'John'
        name = 'Jane'         // ✓ ok
    77 正则中避免使用多个空格。
        eslint: no-regex-spaces
        const regexp = /test   value/   // ✗ avoid
        const regexp = /test {3}value/  // ✓ ok
        const regexp = /test value/     // ✓ ok
    78 return 语句中的赋值必需有括号包裹。
        eslint: no-return-assign
        function sum (a, b) {
            return result = a + b     // ✗ avoid
        }
        function sum (a, b) {
            return (result = a + b)   // ✓ ok
        }
    79 避免将变量赋值给自己。
        eslint: no-self-assign
        name = name   // ✗ avoid
    80 避免将变量与自己进行比较操作。
        esint: no-self-compare
        if (score === score) {}   // ✗ avoid
    81 避免使用逗号操作符。
        eslint: no-sequences
        if (doSomething(), !!test) {}   // ✗ avoid
    82 不要随意更改关键字的值。
        eslint: no-shadow-restricted-names
        let undefined = 'value'     // ✗ avoid
    83 禁止使用稀疏数组（Sparse arrays）。
        eslint: no-sparse-arrays
        let fruits = ['apple',, 'orange']       // ✗ avoid
    84 不要使用制表符。
        eslint: no-tabs
    85 正确使用 ES6 中的字符串模板。
        eslint: no-template-curly-in-string
        const message = 'Hello ${name}'   // ✗ avoid
        const message = `Hello ${name}`   // ✓ ok
    86 使用 this 前请确保 super() 已调用。
        eslint: no-this-before-super
        class Dog extends Animal {
            constructor () {
                this.legs = 4     // ✗ avoid
                super()
            }
        }
    87 用 throw 抛错时，抛出 Error 对象而不是字符串。
        eslint: no-throw-literal
        throw 'error'               // ✗ avoid
        throw new Error('error')    // ✓ ok
    88 行末不留空格。
        eslint: no-trailing-spaces
    89 不要使用 undefined 来初始化变量。
        eslint: no-undef-init
        let name = undefined    // ✗ avoid

        let name
        name = 'value'          // ✓ ok
    90 循环语句中注意更新循环变量。
        eslint: no-unmodified-loop-condition
        for (let i = 0; i < items.length; j++) {...}    // ✗ avoid
        for (let i = 0; i < items.length; i++) {...}    // ✓ ok
    91 如果有更好的实现，尽量不要使用三元表达式。
        eslint: no-unneeded-ternary
        let score = val ? val : 0     // ✗ avoid
        let score = val || 0          // ✓ ok
        return，throw，continue 和 break 后不要再跟代码。
        eslint: no-unreachable
        function doSomething () {
            return true
            console.log('never called')     // ✗ avoid
        }
        finally 代码块中不要再改变程序执行流程。
        eslint: no-unsafe-finally
        try {
            // ...
        } catch (e) {
            // ...
        } finally {
            return 42     // ✗ avoid
        }
    92 关系运算符的左值不要做取反操作。
        eslint: no-unsafe-negation
        if (!key in obj) {}       // ✗ avoid
    93 避免不必要的 .call() 和 .apply()。
        eslint: no-useless-call
        sum.call(null, 1, 2, 3)   // ✗ avoid
    94 避免使用不必要的计算值作对象属性。
        eslint: no-useless-computed-key
        const user = { ['name']: 'John Doe' }   // ✗ avoid
        const user = { name: 'John Doe' }       // ✓ ok
    95 禁止多余的构造器。
        eslint: no-useless-constructor
        class Car {
        constructor () {      // ✗ avoid
            }
        }
    96 禁止不必要的转义。
        eslint: no-useless-escape
        let message = 'Hell\o'  // ✗ avoid
        import, export 和解构操作中，禁止赋值到同名变量。
        eslint: no-useless-rename
        import { config as config } from './config'     // ✗ avoid
        import { config } from './config'               // ✓ ok
    97 属性前面不要加空格。
        eslint: no-whitespace-before-property
        user .name      // ✗ avoid
        user.name       // ✓ ok
    98 禁止使用 with。
        eslint: no-with
        with (val) {...}    // ✗ avoid
    99 对象属性换行时注意统一代码风格。
        eslint: object-property-newline
        const user = {
            name: 'Jane Doe', age: 30,
            username: 'jdoe86'            // ✗ avoid
        }
        const user = { name: 'Jane Doe', age: 30, username: 'jdoe86' }    // ✓ ok
        const user = {
            name: 'Jane Doe',
            age: 30,
            username: 'jdoe86'
        }                                                                 // ✓ ok
    100 代码块中避免多余留白。
        eslint: padded-blocks
        if (user) {
                                    // ✗ avoid
            const name = getName()

        }
        if (user) {
            const name = getName()    // ✓ ok
        }
    101 展开运算符与它的表达式间不要留空白。
        eslint: rest-spread-spacing
        fn(... args)    // ✗ avoid
        fn(...args)     // ✓ ok
    102 遇到分号时空格要后留前不留。
        eslint: semi-spacing
        for (let i = 0 ;i < items.length ;i++) {...}    // ✗ avoid
        for (let i = 0; i < items.length; i++) {...}    // ✓ ok
    103 代码块首尾留空格。
        eslint: space-before-blocks
        if (admin){...}     // ✗ avoid
        if (admin) {...}    // ✓ ok
    104 圆括号间不留空格。
        eslint: space-in-parens
        getName( name )     // ✗ avoid
        getName(name)       // ✓ ok
    105 一元运算符后面跟一个空格。
        eslint: space-unary-ops
        typeof!admin        // ✗ avoid
        typeof !admin        // ✓ ok
    106 注释首尾留空格。
        eslint: spaced-comment
        //comment           // ✗ avoid
        // comment          // ✓ ok
        /*comment*/         // ✗ avoid
        /* comment */       // ✓ ok
    107 模板字符串中变量前后不加空格。
        eslint: template-curly-spacing
        const message = `Hello, ${ name }`    // ✗ avoid
        const message = `Hello, ${name}`      // ✓ ok
    108 检查 NaN 的正确姿势是使用 isNaN()。
        eslint: use-isnan
        if (price === NaN) { }      // ✗ avoid
        if (isNaN(price)) { }       // ✓ ok
    109 用合法的字符串跟 typeof 进行比较操作。
        eslint: valid-typeof
        typeof name === 'undefimed'     // ✗ avoid
        typeof name === 'undefined'     // ✓ ok
    110 自调用匿名函数 (IIFEs) 使用括号包裹。
        eslint: wrap-iife
        const getName = function () { }()     // ✗ avoid
        const getName = (function () { }())   // ✓ ok
        const getName = (function () { })()   // ✓ ok
        yield * 中的 * 前后都要有空格。
        eslint: yield-star-spacing
        yield* increment()    // ✗ avoid
        yield * increment()   // ✓ ok
    111 请书写优雅的条件语句（avoid Yoda conditions）。
        eslint: yoda
        if (42 === age) { }    // ✗ avoid
        if (age === 42) { }    // ✓ ok
        关于分号
    112 不要使用分号。 (参见：1，2，3)
        eslint: semi
        window.alert('hi')   // ✓ ok
        window.alert('hi');  // ✗ avoid
    113 不要使用 (, [, or ` 等作为一行的开始。在没有分号的情况下代码压缩后会导致报错，而坚持这一规范则可避免出错。
        eslint: no-unexpected-multiline
        // ✓ ok
        ;(function () {
            window.alert('ok')
        }())
        // ✗ avoid
        (function () {
            window.alert('ok')
        }())
        // ✓ ok
        ;[1, 2, 3].forEach(bar)
        // ✗ avoid
        [1, 2, 3].forEach(bar)
        // ✓ ok
        ;`hello`.indexOf('o')
        // ✗ avoid
        `hello`.indexOf('o')
        备注：上面的写法只能说聪明过头了。
        相比更加可读易懂的代码，那些看似投巧的写法是不可取的。
        譬如：
        ;[1, 2, 3].forEach(bar)
        建议的写法是：
        var nums = [1, 2, 3]
        nums.forEach(bar)

