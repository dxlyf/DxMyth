/***
 * while queue队列从左到右，广度优先搜索
 * recursion 递归从上往下，深度优选搜索
 * **/


/**
     数组是计算机科学中最常用的数据结构，上一章我们学习了如何创建和使用它。
     我们知道，可以在数组的任意位置上删除或添加元素。
     然而，有时候我们还需要一种在添加或删除元素时有更多控制的数据结构。
     有两种数据结构类似于数组，但在添加和删除元素时更为可控。
     它们就是栈和队列。
     本章我们主要讲述栈。
     栈是一种遵从后进先出（LIFO）原则的有序集合。
     新添加的或待删除的元素都保存在栈的末尾，称作栈顶，另一端就叫栈底。
     在栈里，新元素都靠近栈顶，旧元素都接近栈底。
     在现实生活中也能发现很多栈的例子。
     例如，
     */
     function Stack() {

        let items = [];
    
        this.push = function (element) {
            items.push(element);
        };
    
        this.pop = function () {
            return items.pop();
        };
    
        this.peek = function () {
            return items[items.length - 1];
        };
    
        this.isEmpty = function () {
            return items.length == 0;
        };
    
        this.size = function () {
            return items.length;
        };
    
        this.clear = function () {
            items = [];
        };
    
        this.print = function () {
            console.log(items.toString());
        };
    
        this.toString = function () {
            return items.toString();
        };
    }
    // 例子：换算转二制进
    function convertBinary(val) {
        var stack = new Stack();
        do {
            stack.push(val % 2 == 0 ? 0 : 1);
            val = parseInt(val / 2);
        } while (val > 0);
        var result = '';
        while (stack.size()) {
            result += stack.pop();
        }
        return result;
    }
    
    
    /*
    我们已经学习了栈。
    队列和栈非常类似，但是使用了不同的原则，而非后进先出。
    你将在这一章学习这些内容。
    队列是遵循FIFO（FirstInFirstOut，先进先出，也称为先来先服务）原则的一组有序的项。
    队列在尾部添加新元素，并从顶部移除元素。
    最新添加的元素必须排在队列的末尾。
    在现实中，最常见的队列的例子就是排队：
    */
    function Queue() {
    
        let items = [];
    
        this.enqueue = function (element) {
            items.push(element);
        };
    
        this.dequeue = function () {
            return items.shift();
        };
    
        this.front = function () {
            return items[0];
        };
    
        this.isEmpty = function () {
            return items.length == 0;
        };
    
        this.clear = function () {
            items = [];
        };
    
        this.size = function () {
            return items.length;
        };
    
        this.print = function () {
            console.log(items.toString());
        };
    }
    // 例子:
    /*
    还有另一个修改版的队列实现，就是循环队列。
    循环队列的一个例子就是击鼓传花游戏（HotPotato）。
    在这个游戏中，孩子们围成一个圆圈，把花尽快地传递给旁边的人。
    某一时刻传花停止，这个时候花在谁手里，谁就退出圆圈结束游戏。
    重复这个过程，直到只剩一个孩子（胜者）。
    在下面这个示例中，我们要实现一个模拟的击鼓传花游戏：
    */
    function hotPotato(nameList, num) {
    
        let queue = new Queue();
    
        for (let i = 0; i < nameList.length; i++) {
            queue.enqueue(nameList[i]);
        }
    
        let eliminated = '';
        while (queue.size() > 1) {
            for (let i = 0; i < num; i++) {
                queue.enqueue(queue.dequeue());
            }
            eliminated = queue.dequeue();
            console.log(eliminated + ' was eliminated from the Hot Potato game.');
        }
    
        return queue.dequeue();
    }
    
    //let names = ['John', 'Jack', 'Camila', 'Ingrid', 'Carl'];
    //let winner = hotPotato(names, 7);
    //console.log('The winner is: ' + winner);
    
    
    /*
    队列大量应用在计算机科学以及我们的生活中，我们在之前话题中实现的默认队列也有一些修改版本。
    其中一个修改版就是优先队列。
    元素的添加和移除是基于优先级的。
    一个现实的例子就是机场登机的顺序。
    头等舱和商务舱乘客的优先级要高于经济舱乘客。
    在有些国家，老年人和孕妇（或带小孩的妇女）登机时也享有高于其他乘客的优先级。
    另一个现实中的例子是医院的（急诊科）候诊室。
    医生会优先处理病情比较严重的患者。
    通常，护士会鉴别分类，根据患者病情的严重程度放号。
    实现一个优先队列，有两种选项：设置优先级，然后在正确的位置添加元素；或者用入列操作添加元素，然后按照优先级移除它们。
    在这个示例中，我们将会在正确的位置添加元素，因此可以对它们使用默认的出列操作：
    */
    function PriorityQueue() {
    
        let items = [];
    
        function QueueElement(element, priority) { // {1}
            this.element = element;
            this.priority = priority;
        }
    
        this.enqueue = function (element, priority) {
            let queueElement = new QueueElement(element, priority);
    
            let added = false;
            for (let i = 0; i < items.length; i++) {
                if (queueElement.priority < items[i].priority) { // {2}
                    items.splice(i, 0, queueElement);             // {3}
                    added = true;
                    break; // {4}
                }
            }
            if (!added) {
                items.push(queueElement); //{5}
            }
        };
    
        this.dequeue = function () {
            return items.shift();
        };
    
        this.front = function () {
            return items[0];
        };
    
        this.isEmpty = function () {
            return items.length == 0;
        };
    
        this.size = function () {
            return items.length;
        };
    
        this.print = function () {
            for (let i = 0; i < items.length; i++) {
                console.log(`${items[i].element}  - ${items[i].priority}`);
            }
        };
    }
    /*
     * 
     * 我们在第2章中学习了数组这种数据结构。
    数组（或者也可以称为列表）是一种非常简单的存储数据序列的数据结构。
    在这一章中，你会学习如何实现和使用链表这种动态的数据结构，这意味着我们可以从中任意添加或移除项，它会按需进行扩容。
    要存储多个元素，数组（或列表）可能是最常用的数据结构。
    正如本书之前提到过的，每种语言都实现了数组。
    这种数据结构非常方便，提供了一个便利的[]语法来访问它的元素。
    然而，这种数据结构有一个缺点：（在大多数语言中）数组的大小是固定的，从数组的起点或中间插入或移除项的成本很高，因为需要移动元素（尽管我们已经学过的JavaScript的Array类方法可以帮我们做这些事，但背后的情况同样是这样）。
    链表存储有序的元素集合，但不同于数组，链表中的元素在内存中并不是连续放置的。
    每个元素由一个存储元素本身的节点和一个指向下一个元素的引用（也称指针或链接）组成。
    下图展示了一个链表的结构：
    */
    function LinkedList() {
    
        let Node = function (element) {
    
            this.element = element;
            this.next = null;
        };
    
        let length = 0;
        let head = null;
    
        this.append = function (element) {
    
            let node = new Node(element),
                current;
    
            if (head === null) { //first node on list
                head = node;
            } else {
    
                current = head;
    
                //loop the list until find last item
                while (current.next) {
                    current = current.next;
                }
    
                //get last item and assign next to added item to make the link
                current.next = node;
            }
    
            length++; //update size of list
        };
    
        this.insert = function (position, element) {
    
            //check for out-of-bounds values
            if (position >= 0 && position <= length) {
    
                let node = new Node(element),
                    current = head,
                    previous,
                    index = 0;
    
                if (position === 0) { //add on first position
    
                    node.next = current;
                    head = node;
    
                } else {
                    while (index++ < position) {
                        previous = current;
                        current = current.next;
                    }
                    node.next = current;
                    previous.next = node;
                }
    
                length++; //update size of list
    
                return true;
    
            } else {
                return false;
            }
        };
    
        this.removeAt = function (position) {
    
            //check for out-of-bounds values
            if (position > -1 && position < length) {
    
                let current = head,
                    previous,
                    index = 0;
    
                //removing first item
                if (position === 0) {
                    head = current.next;
                } else {
    
                    while (index++ < position) {
    
                        previous = current;
                        current = current.next;
                    }
    
                    //link previous with current's next - skip it to remove
                    previous.next = current.next;
                }
    
                length--;
    
                return current.element;
    
            } else {
                return null;
            }
        };
    
        this.remove = function (element) {
    
            let index = this.indexOf(element);
            return this.removeAt(index);
        };
    
        this.indexOf = function (element) {
    
            let current = head,
                index = 0;
    
            while (current) {
                if (element === current.element) {
                    return index;
                }
                index++;
                current = current.next;
            }
    
            return -1;
        };
    
        this.isEmpty = function () {
            return length === 0;
        };
    
        this.size = function () {
            return length;
        };
    
        this.getHead = function () {
            return head;
        };
    
        this.toString = function () {
    
            let current = head,
                string = '';
    
            while (current) {
                string += current.element + (current.next ? ', ' : '');
                current = current.next;
            }
            return string;
    
        };
    
        this.print = function () {
            console.log(this.toString());
        };
    }
    
    /**
    链表有多种不同的类型，这一节介绍双向链表。
    双向链表和普通链表的区别在于，在链表中，一个节点只有链向下一个节点的链接，而在双向链表中，链接是双向的：一个链向下一个元素，另一个链向前一个元素，如下图所示：
    */
    function DoublyLinkedList() {
    
        let Node = function (element) {
    
            this.element = element;
            this.next = null;
            this.prev = null; //NEW
        };
    
        let length = 0;
        let head = null;
        let tail = null; //NEW
    
        this.append = function (element) {
    
            let node = new Node(element),
                current;
    
            if (head === null) { //first node on list
                head = node;
                tail = node; //NEW
            } else {
    
                //attach to the tail node //NEW
                tail.next = node;
                node.prev = tail;
                tail = node;
            }
    
            length++; //update size of list
        };
    
        this.insert = function (position, element) {
    
            //check for out-of-bounds values
            if (position >= 0 && position <= length) {
    
                let node = new Node(element),
                    current = head,
                    previous,
                    index = 0;
    
                if (position === 0) { //add on first position
    
                    if (!head) {       //NEW
                        head = node;
                        tail = node;
                    } else {
                        node.next = current;
                        current.prev = node; //NEW {1}
                        head = node;
                    }
    
                } else if (position === length) { //last item //NEW
    
                    current = tail;     // {2}
                    current.next = node;
                    node.prev = current;
                    tail = node;
    
                } else {
                    while (index++ < position) { //{3}
                        previous = current;
                        current = current.next;
                    }
                    node.next = current;
                    previous.next = node;
    
                    current.prev = node; //NEW
                    node.prev = previous; //NEW
                }
    
                length++; //update size of list
    
                return true;
    
            } else {
                return false;
            }
        };
    
        this.removeAt = function (position) {
    
            //check for out-of-bounds values
            if (position > -1 && position < length) {
    
                let current = head,
                    previous,
                    index = 0;
    
                //removing first item
                if (position === 0) {
    
                    head = current.next; // {1}
    
                    //if there is only one item, then we update tail as well //NEW
                    if (length === 1) { // {2}
                        tail = null;
                    } else {
                        head.prev = null; // {3}
                    }
    
                } else if (position === length - 1) { //last item //NEW
    
                    current = tail; // {4}
                    tail = current.prev;
                    tail.next = null;
    
                } else {
    
                    while (index++ < position) { // {5}
    
                        previous = current;
                        current = current.next;
                    }
    
                    //link previous with current's next - skip it to remove
                    previous.next = current.next; // {6}
                    current.next.prev = previous; //NEW
                }
    
                length--;
    
                return current.element;
    
            } else {
                return null;
            }
        };
    
        this.remove = function (element) {
    
            let index = this.indexOf(element);
            return this.removeAt(index);
        };
    
        this.indexOf = function (element) {
    
            let current = head,
                index = -1;
    
            //check first item
            if (element == current.element) {
                return 0;
            }
    
            index++;
    
            //check in the middle of the list
            while (current.next) {
    
                if (element == current.element) {
                    return index;
                }
    
                current = current.next;
                index++;
            }
    
            //check last item
            if (element == current.element) {
                return index;
            }
    
            return -1;
        };
    
        this.isEmpty = function () {
            return length === 0;
        };
    
        this.size = function () {
            return length;
        };
    
        this.toString = function () {
    
            let current = head,
                s = current ? current.element : '';
    
            while (current && current.next) {
                current = current.next;
                s += ', ' + current.element;
            }
    
            return s;
        };
    
        this.inverseToString = function () {
    
            let current = tail,
                s = current ? current.element : '';
    
            while (current && current.prev) {
                current = current.prev;
                s += ', ' + current.element;
            }
    
            return s;
        };
    
        this.print = function () {
            console.log(this.toString());
        };
    
        this.printInverse = function () {
            console.log(this.inverseToString());
        };
    
        this.getHead = function () {
            return head;
        };
    
        this.getTail = function () {
            return tail;
        }
    }
    
    
    // 
    const NodeLinkedList = (function () {
    
        function Node(value) {
            return {
                value: value,
                prev: null,
                next: null,
            }
        }
        class NodeLinkedList {
            static createNode = (value) => {
                return Node(value)
            }
            constructor() {
                this.head = null
                this.tail = null
                this.length = 0
            }
            append(node) {
                this.insert(node)
            }
            insert(node, position) {
                if (position === null) {
                    position = this.length
                }
                position = Math.max(0, Math.min(position, this.length))
                if (this.head === null) {
                    this.head = this.tail = node
                } else {
                    let mid = Math.floor(this.length / 2)
                    let previous = null, current = null;
                    if (position <= mid) {
                        current = this.head
                        let i = 0
                        while (current && i++ < position) {
                            previous = current;
                            current = current.next;
                        }
                    } else {
                        previous = this.tail
                        let i = this.length
                        while (previous && i-- > position) {
                            current = previous
                            previous = previous.prev;
                        }
                    }
    
    
                    if (previous) {
                        previous.next = node
                    } else {
                        // 插入到最前面
                        this.head = node
                    }
                    if (current) {
                        current.prev = node
                    } else {
                        // 插入到最后面
                        this.tail = node
                    }
                    node.prev = previous
                    node.next = current
                }
                this.length++
    
            }
            find(callback) {
                let current = this.head
                let i = 0
                while (current) {
                    if (callback(current, i) === true) {
                        return current
                    }
                    current = current.next;
                    i++;
                }
                return null
            }
            findIndex(callback) {
                let current = this.head
                let i = 0
                while (current) {
                    if (callback(current, i) === true) {
                        return i
                    }
                    current = current.next;
                    i++;
                }
                return -1
            }
            indexOf(node) {
                return this.findIndex(cur => cur === node)
            }
            at(index) {
                return this.find((cur, i) => i === index)
            }
            move(node, to) {
                to = Math.max(0, Math.min(to, this.length))
                const from = this.indexOf(node)
                if (from !== -1 && (form > to || form + 1 < to)) {
                    let current = this.head, previous = null
                    let i = 0
                    while (current && i < to) {
                        previous = current;
                        current = current.next;
                        i++
                    }
    
                    // 把当前node,从上下节点分离
                    if (!node.prev) {
                        this.head = node.next
                    } else {
                        node.prev.next = node.next;
                    }
                    if (!node.next) {
                        this.tail = node.prev
                    } else {
                        node.next.prev = node.prev
                    }
    
                    // 将当前node,移动到目标节点
                    if (previous) {
                        previous.next = node
                    } else {
                        // 插入到最前面
                        this.head = node
                    }
                    if (current) {
                        current.prev = node
                    } else {
                        // 插入到最后面
                        this.tail = node
                    }
    
                    node.prev = previous
                    node.next = current
                    this.head.prev = null
                    this.tail.next = null
    
                    return true;
    
                }
                return false
            }
            remove(node) {
                if (node.prev) {
                    node.prev.next = node.next
                } else {
                    this.head = node.next
                }
                if (node.next) {
                    node.next.prev = node.prev
                } else {
                    this.tail = node.prev;
                }
                this.length--;
    
            }
            removeAt(index) {
                this.remove(this.at(index))
            }
        }
        return NodeLinkedList
    })();
    
    
    /**
    循环链表可以像链表一样只有单向引用，也可以像双向链表一样有双向引用。
    循环链表和链表之间唯一的区别在于，最后一个元素指向下一个元素的指针（tail.
    next）不是引用null，而是指向第一个元素（head），如下图所示。
    */
    function CircularLinkedList() {
    
        let Node = function (element) {
    
            this.element = element;
            this.next = null;
        };
    
        let length = 0;
        let head = null;
    
        this.append = function (element) {
    
            let node = new Node(element),
                current;
    
            if (head === null) { //first node on list
                head = node;
            } else {
    
                current = head;
    
                //loop the list until find last item
                while (current.next !== head) { //last element will be head instead of NULL
                    current = current.next;
                }
    
                //get last item and assign next to added item to make the link
                current.next = node;
            }
    
            //set node.next to head - to have circular list
            node.next = head;
    
            length++; //update size of list
        };
    
        this.insert = function (position, element) {
    
            //check for out-of-bounds values
            if (position >= 0 && position <= length) {
    
                let node = new Node(element),
                    current = head,
                    previous,
                    index = 0;
    
                if (position === 0) { //add on first position
    
                    node.next = current;
    
                    //update last element
                    while (current.next !== head) { //last element will be head instead of NULL
                        current = current.next;
                    }
    
                    head = node;
                    current.next = head;
    
                } else {
                    while (index++ < position) {
                        previous = current;
                        current = current.next;
                    }
                    node.next = current;
                    previous.next = node;
                }
    
                length++; //update size of list
    
                return true;
    
            } else {
                return false;
            }
        };
    
        this.removeAt = function (position) {
    
            //check for out-of-bounds values
            if (position > -1 && position < length) {
    
                let current = head,
                    previous,
                    index = 0;
    
                //removing first item
                if (position === 0) {
    
                    while (current.next !== head) { //needs to update last element first
                        current = current.next;
                    }
    
                    head = head.next;
                    current.next = head;
    
                } else { //no need to update last element for circular list
    
                    while (index++ < position) {
    
                        previous = current;
                        current = current.next;
                    }
    
                    //link previous with current's next - skip it to remove
                    previous.next = current.next;
                }
    
                length--;
    
                return current.element;
    
            } else {
                return null;
            }
        };
    
        this.remove = function (element) {
    
            let index = this.indexOf(element);
            return this.removeAt(index);
        };
    
        this.indexOf = function (element) {
    
            let current = head,
                index = -1;
    
            //check first item
            if (element == current.element) {
                return 0;
            }
    
            index++;
    
            //check in the middle of the list
            while (current.next !== head) {
    
                if (element == current.element) {
                    return index;
                }
    
                current = current.next;
                index++;
            }
    
            //check last item
            if (element == current.element) {
                return index;
            }
    
            return -1;
        };
    
        this.isEmpty = function () {
            return length === 0;
        };
    
        this.size = function () {
            return length;
        };
    
        this.getHead = function () {
            return head;
        };
    
        this.toString = function () {
    
            let current = head,
                s = current.element;
    
            while (current.next !== head) {
                current = current.next;
                s += ', ' + current.element;
            }
    
            return s.toString();
        };
    
        this.print = function () {
            console.log(this.toString());
        };
    }
    
    
    /**
    Set对象是值的集合，你可以按照插入的顺序迭代它的元素。 Set中的元素只会出现一次，即 Set 中的元素是唯一的。
    值的相等
    因为 Set 中的值总是唯一的，所以需要判断两个值是否相等。在ECMAScript规范的早期版本中，这不是基于和===操作符中使用的算法相同的算法。
    具体来说，对于 Set s， +0 （+0 严格相等于-0）和-0是不同的值。
    然而，在 ECMAScript 2015规范中这点已被更改。
    有关详细信息，请参阅浏览器兼容性 表中的“value equality for -0 and 0”。
     * ECMSCRIPT 6 already have a Set class implementation:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
     * We will try to copy  the same functionalities
     * @constructor
     */
    
    /**
        迄今为止，我们已经学习了数组（列表）、栈、队列和链表（及其变种）等顺序数据结构。
    在这一章中，我们要学习集合这种数据结构。
    集合是由一组无序且唯一（即不能重复）的项组成的。
    这个数据结构使用了与有限集合相同的数学概念，但应用在计算机科学的数据结构中。
    在深入学习集合的计算机科学实现之前，我们先看看它的数学概念。
    在数学中，集合是一组不同的对象（的集）。
    比如说，一个由大于或等于0的整数组成的自然数集合：N={0,1,2,3,4,5,6,…}。
    集合中的对象列表用“{}”（大括号）包围。
    还有一个概念叫空集。
    空集就是不包含任何元素的集合。
    比如24和29之间的素数集合。
    由于24和29之间没有素数（除了1和自身，没有其他正因数的大于1的自然数），这个集合就是空集。
    空集用“{}”表示。
    你也可以把集合想象成一个既没有重复元素，也没有顺序概念的数组。
    
    */
    function Set() {
    
        let items = {};
    
        this.add = function (value) {
            if (!this.has(value)) {
                items[value] = value;
                return true;
            }
            return false;
        };
    
        this.delete = function (value) {
            if (this.has(value)) {
                delete items[value];
                return true;
            }
            return false;
        };
    
        this.has = function (value) {
            return items.hasOwnProperty(value);
            //return value in items;
        };
    
        this.clear = function () {
            items = {};
        };
    
        /**
         * Modern browsers function
         * IE9+, FF4+, Chrome5+, Opera12+, Safari5+
         * @returns {Number}
         */
        this.size = function () {
            return Object.keys(items).length;
        };
    
        /**
         * cross browser compatibility - legacy browsers
         * for modern browsers use size function
         * @returns {number}
         */
        this.sizeLegacy = function () {
            let count = 0;
            for (let key in items) {
                if (items.hasOwnProperty(key))
                    ++count;
            }
            return count;
        };
    
        /**
         * Modern browsers function
         * IE9+, FF4+, Chrome5+, Opera12+, Safari5+
         * @returns {Array}
         */
        this.values = function () {
            let values = [];
            for (let i = 0, keys = Object.keys(items); i < keys.length; i++) {
                values.push(items[keys[i]]);
            }
            return values;
        };
    
        this.valuesLegacy = function () {
            let values = [];
            for (let key in items) {
                if (items.hasOwnProperty(key)) {
                    values.push(items[key]);
                }
            }
            return values;
        };
    
        this.getItems = function () {
            return items;
        };
        //并集:对于给定的两个集合，返回一个包含两个集合中所有元素的新集合。
        this.union = function (otherSet) {
            let unionSet = new Set(); //{1}
    
            let values = this.values(); //{2}
            for (let i = 0; i < values.length; i++) {
                unionSet.add(values[i]);
            }
    
            values = otherSet.values(); //{3}
            for (let i = 0; i < values.length; i++) {
                unionSet.add(values[i]);
            }
    
            return unionSet;
        };
        //交集：对于给定的两个集合，返回一个包含两个集合中共有元素的新集合。
        this.intersection = function (otherSet) {
            let intersectionSet = new Set(); //{1}
    
            let values = this.values();
            for (let i = 0; i < values.length; i++) { //{2}
                if (otherSet.has(values[i])) {    //{3}
                    intersectionSet.add(values[i]); //{4}
                }
            }
    
            return intersectionSet;
        };
        //差集：对于给定的两个集合，返回一个包含所有存在于第一个集合且不存在于第二个集合的元素的新集合。
        this.difference = function (otherSet) {
            let differenceSet = new Set(); //{1}
    
            let values = this.values();
            for (let i = 0; i < values.length; i++) { //{2}
                if (!otherSet.has(values[i])) {    //{3}
                    differenceSet.add(values[i]); //{4}
                }
            }
    
            return differenceSet;
        };
        //子集：验证一个给定集合是否是另一集合的子集。
        this.subset = function (otherSet) {
    
            if (this.size() > otherSet.size()) { //{1}
                return false;
            } else {
                let values = this.values();
                for (let i = 0; i < values.length; i++) { //{2}
                    if (!otherSet.has(values[i])) {    //{3}
                        return false; //{4}
                    }
                }
                return true;
            }
        };
    }
    
    /**
    在上一章中，我们学习了集合。
    本章我们会继续学习使用字典和散列表来存储唯一值（不重复的值）的数据结构。
    集合、字典和散列表可以存储不重复的值。
    在集合中，我们感兴趣的是每个值本身，并把它当作主要元素。
    在字典中，我们用[键，值]的形式来存储数据。
    在散列表中也是一样（也是以[键，值]对的形式来存储数据）。
    但是两种数据结构的实现方式略有不同，本章中将会介绍。
    7.
    1字典你已经知道，集合表示一组互不相同的元素（不重复的元素）。
    在字典中，存储的是[键，值]对，其中键名是用来查询特定元素的。
    字典和集合很相似，集合以[值，值]的形式存储元素，字典则是以[键，值]的形式来存储元素。
    字典也称作映射。
    */
    function Dictionary() {
    
        var items = {};
    
        this.set = function (key, value) {
            items[key] = value; //{1}
        };
    
        this.delete = function (key) {
            if (this.has(key)) {
                delete items[key];
                return true;
            }
            return false;
        };
    
        this.has = function (key) {
            return items.hasOwnProperty(key);
            //return value in items;
        };
    
        this.get = function (key) {
            return this.has(key) ? items[key] : undefined;
        };
    
        this.clear = function () {
            items = {};
        };
    
        this.size = function () {
            return Object.keys(items).length;
        };
    
        this.keys = function () {
            return Object.keys(items);
        };
    
        this.values = function () {
            var values = [];
            for (var k in items) {
                if (this.has(k)) {
                    values.push(items[k]);
                }
            }
            return values;
        };
    
        this.each = function (fn) {
            for (var k in items) {
                if (this.has(k)) {
                    fn(k, items[k]);
                }
            }
        };
    
        this.getItems = function () {
            return items;
        }
    }
    /**
    在本节中，你将会学到HashTable类，也叫HashMap类，是Dictionary类的一种散列表实现方式。
    散列算法的作用是尽可能快地在数据结构中找到一个值。
    在之前的章节中，你已经知道如果要在数据结构中获得一个值（使用get方法），需要遍历整个数据结构来找到它。
    如果使用散列函数，就知道值的具体位置，因此能够快速检索到该值。
    散列函数的作用是给
    */
    function HashTable() {
    
        var table = [];
    
        var loseloseHashCode = function (key) {
            var hash = 0;
            for (var i = 0; i < key.length; i++) {
                hash += key.charCodeAt(i);
            }
            return hash % 37;
        };
    
        var djb2HashCode = function (key) {
            var hash = 5381;
            for (var i = 0; i < key.length; i++) {
                hash = hash * 33 + key.charCodeAt(i);
            }
            return hash % 1013;
        };
    
        var hashCode = function (key) {
            return loseloseHashCode(key);
        };
    
        this.put = function (key, value) {
            var position = hashCode(key);
            console.log(position + ' - ' + key);
            table[position] = value;
        };
    
        this.get = function (key) {
            return table[hashCode(key)];
        };
    
        this.remove = function (key) {
            table[hashCode(key)] = undefined;
        };
    
        this.print = function () {
            for (var i = 0; i < table.length; ++i) {
                if (table[i] !== undefined) {
                    console.log(i + ": " + table[i]);
                }
            }
        };
    }
    
    
    function HashTableSeparateChaining() {
    
        var table = [];
    
        var ValuePair = function (key, value) {
            this.key = key;
            this.value = value;
    
            this.toString = function () {
                return '[' + this.key + ' - ' + this.value + ']';
            }
        };
    
        var loseloseHashCode = function (key) {
            var hash = 0;
            for (var i = 0; i < key.length; i++) {
                hash += key.charCodeAt(i);
            }
            return hash % 37;
        };
    
        var hashCode = function (key) {
            return loseloseHashCode(key);
        };
    
        this.put = function (key, value) {
            var position = hashCode(key);
            console.log(position + ' - ' + key);
    
            if (table[position] == undefined) {
                table[position] = new LinkedList();
            }
            table[position].append(new ValuePair(key, value));
        };
    
        this.get = function (key) {
            var position = hashCode(key);
    
            if (table[position] !== undefined && !table[position].isEmpty()) {
    
                //iterate linked list to find key/value
                var current = table[position].getHead();
    
                do {
                    if (current.element.key === key) {
                        return current.element.value;
                    }
                    current = current.next;
                } while (current);
            }
            return undefined;
        };
    
        this.remove = function (key) {
    
            var position = hashCode(key);
    
            if (table[position] !== undefined) {
    
                //iterate linked list to find key/value
                var current = table[position].getHead();
    
                do {
                    if (current.element.key === key) {
                        table[position].remove(current.element);
                        if (table[position].isEmpty()) {
                            table[position] = undefined;
                        }
                        return true;
                    }
                    current = current.next;
                } while (current);
            }
    
            return false;
        };
    
        this.print = function () {
            for (var i = 0; i < table.length; ++i) {
                if (table[i] !== undefined) {
                    console.log(table[i].toString());
                }
            }
        };
    }
    
    function HashLinearProbing() {
    
        var table = [];
    
        var ValuePair = function (key, value) {
            this.key = key;
            this.value = value;
    
            this.toString = function () {
                return '[' + this.key + ' - ' + this.value + ']';
            }
        };
    
        var loseloseHashCode = function (key) {
            var hash = 0;
            for (var i = 0; i < key.length; i++) {
                hash += key.charCodeAt(i);
            }
            return hash % 37;
        };
    
        var hashCode = function (key) {
            return loseloseHashCode(key);
        };
    
        this.put = function (key, value) {
            var position = hashCode(key);
            console.log(position + ' - ' + key);
    
            if (table[position] == undefined) {
                table[position] = new ValuePair(key, value);
            } else {
                var index = ++position;
                while (table[index] != undefined) {
                    index++;
                }
                table[index] = new ValuePair(key, value);
            }
        };
    
        this.get = function (key) {
            var position = hashCode(key);
    
            if (table[position] !== undefined) {
                if (table[position].key === key) {
                    return table[position].value;
                } else {
                    var index = ++position;
                    while (table[index] === undefined || table[index].key !== key) {
                        index++;
                    }
                    if (table[index].key === key) {
                        return table[index].value;
                    }
                }
            }
            return undefined;
        };
    
        this.remove = function (key) {
            var position = hashCode(key);
    
            if (table[position] !== undefined) {
                if (table[position].key === key) {
                    table[position] = undefined;
                } else {
                    var index = ++position;
                    while (table[index] === undefined || table[index].key !== key) {
                        index++;
                    }
                    if (table[index].key === key) {
                        table[index] = undefined;
                    }
                }
            }
        };
    
        this.print = function () {
            for (var i = 0; i < table.length; ++i) {
                if (table[i] !== undefined) {
                    console.log(i + ' -> ' + table[i].toString());
                }
            }
        };
    }
    
    /**    
    二叉树中的节点最多只能有两个子节点：一个是左侧子节点，另一个是右侧子节点。
    这些定义有助于我们写出更高效的向/从树中插入、查找和删除节点的算法。
    二叉树在计算机科学中的应用非常广泛。
    二叉搜索树（BST）是二叉树的一种，但是它只允许你在左侧节点存储（比父节点）小的值，在右侧节点存储（比父节点）大（或者等于）的值。
    上一节的图中就展现了一棵二叉搜索树。
    二叉搜索树将是我们在本章中要研究的数据结构。
     * */
    function BinarySearchTree() {
    
        var Node = function (key) {
            this.key = key;
            this.left = null;
            this.right = null;
        };
    
        var root = null;
    
        this.insert = function (key) {
    
            var newNode = new Node(key);
    
            //special case - first element
            if (root === null) {
                root = newNode;
            } else {
                insertNode(root, newNode);
            }
        };
    
        var insertNode = function (node, newNode) {
            if (newNode.key < node.key) {
                if (node.left === null) {
                    node.left = newNode;
                } else {
                    insertNode(node.left, newNode);
                }
            } else {
                if (node.right === null) {
                    node.right = newNode;
                } else {
                    insertNode(node.right, newNode);
                }
            }
        };
    
        this.getRoot = function () {
            return root;
        };
    
        this.search = function (key) {
    
            return searchNode(root, key);
        };
    
        var searchNode = function (node, key) {
    
            if (node === null) {
                return false;
            }
    
            if (key < node.key) {
                return searchNode(node.left, key);
    
            } else if (key > node.key) {
                return searchNode(node.right, key);
    
            } else { //element is equal to node.item
                return true;
            }
        };
        /**
         中序遍历 递归形式
         对任一子树，先遍历其左子树，然后访问根，最后遍历其右子树。
         */
        this.inOrderTraverse = function (callback) {
            inOrderTraverseNode(root, callback);
        };
        var inOrderTraverseNode = function (node, callback) {
            if (node !== null) {
                inOrderTraverseNode(node.left, callback);
                callback(node.key);
                inOrderTraverseNode(node.right, callback);
            }
        };
        /**
         先序遍历 递归形式
         对任一子树，先访问根，然后遍历其左子树，最后遍历其右子树。
         */
        this.preOrderTraverse = function (callback) {
            preOrderTraverseNode(root, callback);
        };
        var preOrderTraverseNode = function (node, callback) {
            if (node !== null) {
                callback(node.key);
                preOrderTraverseNode(node.left, callback);
                preOrderTraverseNode(node.right, callback);
            }
        };
        /**
         后序遍历 递归形式
         对任一子树，先遍历其左子树，然后遍历其右子树，最后访问根。
         */
        this.postOrderTraverse = function (callback) {
            postOrderTraverseNode(root, callback);
        };
        var postOrderTraverseNode = function (node, callback) {
            if (node !== null) {
                postOrderTraverseNode(node.left, callback);
                postOrderTraverseNode(node.right, callback);
                callback(node.key);
            }
        };
        /***非递归深度遍历-先序*/
        this.preOrderTraverseNoRecursion = function (callback) {
            var stack = new Stack();
            stack.push(root);
            var current;
            while (stack.size() > 0) {
                current = stack.pop();
                callback(current.key);
                if (current.right) {
                    stack.push(current.right);
                }
                if (current.left) {
                    stack.push(current.left);
                }
            }
        }
        // 非递归深度遍历－中序
        this.inOrderTraverseNoRecursion = function (callback) {
            var stack = new Stack();
            var current = root;
            while (current || !stack.isEmpty()) {
                // 查找当前最后一个左节点
                while (current) {
                    stack.push(current);
                    current = current.left;
                }
                current = stack.pop();
                callback(current.key);// 当前元素处理完成后
                current = current.right;// 检查当前节点，右边节点
    
            }
        }
        // 非递归深度遍历－后序
        this.postOrderTraverseNoRecursion = function (callback) {
            var stack = new Stack();
            var current = root;
            var rightNode = null;
            while (current || !stack.isEmpty()) {
                // 查找当前最后一个左节点
                while (current) {
                    stack.push(current);
                    current = current.left;
                }
                current = stack.pop();
                // 如果当前节点存在右分支节点,
                // 当前结点没有右结点或上一个结点（已经输出的结点）是当前结点的右结点，则输出当前结点  
                while (current.right == null || current.right == rightNode) {
                    callback(current.key);
                    rightNode = current;
                    if (stack.isEmpty()) {
                        return; //root以输出，则遍历结束  
                    }
                    current = stack.pop();
                }
                stack.push(current); //还有右结点没有遍历  
                current = current.right;
            }
        }
    
        /** 
       * 广度优先遍历二叉树，又称层次遍历二叉树 
       * @param node 
       */
        this.breadthFirstTraverse = function (callback) {
            var queue = new Queue();
            var currentNode = null;
            queue.enqueue(root);
            while (!queue.isEmpty()) {
                currentNode = queue.dequeue();
                callback(currentNode.key);
                if (currentNode.left != null)
                    queue.enqueue(currentNode.left);
                if (currentNode.right != null)
                    queue.enqueue(currentNode.right);
            }
        }
    
        this.min = function () {
            return minNode(root);
        };
    
        var minNode = function (node) {
            if (node) {
                while (node && node.left !== null) {
                    node = node.left;
                }
    
                return node.key;
            }
            return null;
        };
    
        this.max = function () {
            return maxNode(root);
        };
    
        var maxNode = function (node) {
            if (node) {
                while (node && node.right !== null) {
                    node = node.right;
                }
    
                return node.key;
            }
            return null;
        };
    
        this.remove = function (element) {
            root = removeNode(root, element);
        };
    
        var findMinNode = function (node) {
            while (node && node.left !== null) {
                node = node.left;
            }
    
            return node;
        };
    
        var removeNode = function (node, element) {
    
            if (node === null) {
                return null;
            }
    
            if (element < node.key) {
                node.left = removeNode(node.left, element);
                return node;
    
            } else if (element > node.key) {
                node.right = removeNode(node.right, element);
                return node;
    
            } else { //element is equal to node.item
    
                //handle 3 special conditions
                //1 - a leaf node
                //2 - a node with only 1 child
                //3 - a node with 2 children
    
                //case 1
                if (node.left === null && node.right === null) {
                    node = null;
                    return node;
                }
    
                //case 2
                if (node.left === null) {
                    node = node.right;
                    return node;
    
                } else if (node.right === null) {
                    node = node.left;
                    return node;
                }
    
                //case 3
                var aux = findMinNode(node.right);
                node.key = aux.key;
                node.right = removeNode(node.right, aux.key);
                return node;
            }
        };
    }
    
    /**
     * 
    AVL树本质上还是一棵二叉搜索树，它的特点是：
    1.本身首先是一棵二叉搜索树。
    2.带有平衡条件：每个结点的左右子树的高度之差的绝对值（平衡因子）最多为1。也就是说，AVL树，本质上是带了平衡功能的二叉查找树（二叉排序树，二叉搜索树）。
     * */
    function AVLTree() {
    
        var Node = function (key) {
            this.key = key;
            this.left = null;
            this.right = null;
        };
    
        var root = null;
    
        this.getRoot = function () {
            return root;
        };
    
        var heightNode = function (node) {
            if (node === null) {
                return -1;
            } else {
                return Math.max(heightNode(node.left), heightNode(node.right)) + 1;
            }
        };
    
        var rotationLL = function (node) {
            var tmp = node.left;
            node.left = tmp.right;
            tmp.right = node;
    
            return tmp;
        };
    
        var rotationRR = function (node) {
            var tmp = node.right;
            node.right = tmp.left;
            tmp.left = node;
    
            return tmp;
        };
    
        var rotationLR = function (node) {
            node.left = rotationRR(node.left);
            return rotationLL(node);
        };
    
        var rotationRL = function (node) {
            node.right = rotationLL(node.right);
            return rotationRR(node);
        };
    
        var insertNode = function (node, element) {
    
            if (node === null) {
                node = new Node(element);
    
            } else if (element < node.key) {
    
                node.left = insertNode(node.left, element);
    
                if (node.left !== null) {
    
                    if ((heightNode(node.left) - heightNode(node.right)) > 1) {
                        if (element < node.left.key) {
                            node = rotationLL(node);
                        } else {
                            node = rotationLR(node);
                        }
                    }
                }
            } else if (element > node.key) {
    
                node.right = insertNode(node.right, element);
    
                if (node.right !== null) {
    
                    if ((heightNode(node.right) - heightNode(node.left)) > 1) {
    
                        if (element > node.right.key) {
                            node = rotationRR(node);
                        } else {
                            node = rotationRL(node);
                        }
                    }
                }
            }
    
            return node;
        };
    
        this.insert = function (element) {
            root = insertNode(root, element);
        };
    
        var parentNode;
        var nodeToBeDeleted;
    
        var removeNode = function (node, element) {
            if (node === null) {
                return null;
            }
            parentNode = node;
    
            if (element < node.key) {
                node.left = removeNode(node.left, element);
            } else {
                nodeToBeDeleted = node;
                node.right = removeNode(node.right, element);
            }
    
            if (node === parentNode) { //remove node
                if (nodeToBeDeleted !== null && element === nodeToBeDeleted.key) {
                    if (nodeToBeDeleted === parentNode) {
                        node = node.left;
                    } else {
                        var tmp = nodeToBeDeleted.key;
                        nodeToBeDeleted.key = parentNode.key;
                        parentNode.key = tmp;
                        node = node.right;
                    }
                }
            } else { //do balancing
    
                if (node.left === undefined) node.left = null;
                if (node.right === undefined) node.right = null;
    
                if ((heightNode(node.left) - heightNode(node.right)) === 2) {
                    if (element < node.left.key) {
                        node = rotationLR(node);
                    } else {
                        node = rotationLL(node);
                    }
                }
    
                if ((heightNode(node.right) - heightNode(node.left)) === 2) {
                    if (element > node.right.key) {
                        node = rotationRL(node);
                    } else {
                        node = rotationRR(node);
                    }
                }
            }
    
            return node;
        };
    
        this.remove = function (element) {
            parentNode = null;
            nodeToBeDeleted = null;
            root = removeNode(root, element);
        };
    }
    
    /**
     红黑树（RedBlackTree）是一种自平衡二叉查找树，是在计算机科学中用到的一种数据结构，典型的用途是实现关联数组。
    它是在1972年由RudolfBayer发明的，当时被称为平衡二叉B树（symmetricbinaryB-trees）。
    后来，在1978年被LeoJ.
    Guibas和RobertSedgewick修改为如今的“红黑树”。
    红黑树和AVL树类似，都是在进行插入和删除操作时通过特定操作保持二叉查找树的平衡，从而获得较高的查找性能。
    它虽然是复杂的，但它的最坏情况运行时间也是非常良好的，并且在实践中是高效的：它可以在O(logn)时间内做查找，插入和删除，这里的n是树中元素的数目。
     * */
    function RedBlackTree() {
    
        var Colors = {
            RED: 0,
            BLACK: 1
        };
    
        var Node = function (key, color) {
            this.key = key;
            this.left = null;
            this.right = null;
            this.color = color;
    
            this.flipColor = function () {
                if (this.color === Colors.RED) {
                    this.color = Colors.BLACK;
                } else {
                    this.color = Colors.RED;
                }
            };
        };
    
        var root = null;
    
        this.getRoot = function () {
            return root;
        };
    
        var isRed = function (node) {
            if (!node) {
                return false;
            }
            return node.color === Colors.RED;
        };
    
        var flipColors = function (node) {
            node.left.flipColor();
            node.right.flipColor();
        };
    
        var rotateLeft = function (node) {
            var temp = node.right;
            if (temp !== null) {
                node.right = temp.left;
                temp.left = node;
                temp.color = node.color;
                node.color = Colors.RED;
            }
            return temp;
        };
    
        var rotateRight = function (node) {
            var temp = node.left;
            if (temp !== null) {
                node.left = temp.right;
                temp.right = node;
                temp.color = node.color;
                node.color = Colors.RED;
            }
            return temp;
        };
    
        var insertNode = function (node, element) {
    
            if (node === null) {
                return new Node(element, Colors.RED);
            }
    
            var newRoot = node;
    
            if (element < node.key) {
    
                node.left = insertNode(node.left, element);
    
            } else if (element > node.key) {
    
                node.right = insertNode(node.right, element);
    
            } else {
                node.key = element;
            }
    
            if (isRed(node.right) && !isRed(node.left)) {
                newRoot = rotateLeft(node);
            }
    
            if (isRed(node.left) && isRed(node.left.left)) {
                newRoot = rotateRight(node);
            }
            if (isRed(node.left) && isRed(node.right)) {
                flipColors(node);
            }
    
            return newRoot;
        };
    
        this.insert = function (element) {
            root = insertNode(root, element);
            root.color = Colors.BLACK;
        };
    }
    
    /*
    图最常见的实现是邻接矩阵。
    每个节点都和一个整数相关联，该整数将作为数组的索引。
    我们用一个二维数组来表示顶点之间的连接。
    如果索引为i的节点和索引为j的节点相邻，则array[i][j]===1，否则array[i][j]===0，如下图所示：
    
    有两种算法可以对图进行遍历：广度优先搜索（Breadth-FirstSearch，BFS）和深度优先搜索（Depth-FirstSearch，DFS）。
    图遍历可以用来寻找特定的顶点或寻找两个顶点之间的路径，检查图是否连通，检查图是否含有环等。
    在实现算法之前，让我们来更好地理解
    
    
    算法数据结构描述深度优先搜索栈通过将顶点存入栈中（在第3章中学习过），
    顶点是沿着路径被探索的，存在新的相邻顶点就去访问广度优先搜索队列通过将顶点存入队列中（在第4章中学习过），
    最先入队列的顶点先被探索
    
    
    当要标注已经访问过的顶点时，我们用三种颜色来反映它们的状态。
    白色：表示该顶点还没有被访问。 未发现
    灰色：表示该顶点被访问过，但并未被探索过。 发现
    黑色：表示该顶点被访问过且被完全探索过。  探索
    这就是之前提到的务必访问每个顶点最多两次的原因。
    
    
    */
    function Graph() {
    
        var vertices = []; //list
    
        var adjList = new Dictionary();
    
        // 顶点
        this.addVertex = function (v) {
            vertices.push(v);
            adjList.set(v, []); //initialize adjacency list with array as well;
        };
        // 相邻点
        this.addEdge = function (v, w) {
            adjList.get(v).push(w);
            //adjList.get(w).push(v); //commented to run the improved DFS with topological sorting
        };
    
        this.toString = function () {
            var s = '';
            for (var i = 0; i < vertices.length; i++) {
                s += vertices[i] + ' -> ';
                var neighbors = adjList.get(vertices[i]);
                for (var j = 0; j < neighbors.length; j++) {
                    s += neighbors[j] + ' ';
                }
                s += '\n';
            }
            return s;
        };
    
        var initializeColor = function () {
            var color = {};
            for (var i = 0; i < vertices.length; i++) {
                color[vertices[i]] = 'white';
            }
            return color;
        };
    
        this.bfs = function (v, callback) {
    
            var color = initializeColor(),
                queue = new Queue();
            queue.enqueue(v);
    
            while (!queue.isEmpty()) {
                var u = queue.dequeue(),
                    neighbors = adjList.get(u);
                color[u] = 'grey';
                for (var i = 0; i < neighbors.length; i++) {
                    var w = neighbors[i];
                    if (color[w] === 'white') {
                        color[w] = 'grey';
                        queue.enqueue(w);
                    }
                }
                color[u] = 'black';
                if (callback) {
                    callback(u);
                }
            }
        };
    
        this.dfs = function (callback) {
    
            var color = initializeColor();
    
            for (var i = 0; i < vertices.length; i++) {
                if (color[vertices[i]] === 'white') {
                    dfsVisit(vertices[i], color, callback);
                }
            }
        };
    
        var dfsVisit = function (u, color, callback) {
    
            color[u] = 'grey';
            if (callback) {
                callback(u);
            }
            console.log('Discovered ' + u);
            var neighbors = adjList.get(u);
            for (var i = 0; i < neighbors.length; i++) {
                var w = neighbors[i];
                if (color[w] === 'white') {
                    dfsVisit(w, color, callback);
                }
            }
            color[u] = 'black';
            console.log('explored ' + u);
        };
    
        //广度优先搜索 
        this.BFS = function (v) {
    
            var color = initializeColor(),
                queue = new Queue(),
                d = {},
                pred = {};
            queue.enqueue(v);
    
            for (var i = 0; i < vertices.length; i++) {
                d[vertices[i]] = 0;
                pred[vertices[i]] = null;
            }
    
            while (!queue.isEmpty()) {
                var u = queue.dequeue(),
                    neighbors = adjList.get(u);
                color[u] = 'grey';
                for (i = 0; i < neighbors.length; i++) {
                    var w = neighbors[i];
                    if (color[w] === 'white') {
                        color[w] = 'grey';
                        d[w] = d[u] + 1;
                        pred[w] = u;
                        queue.enqueue(w);
                    }
                }
                color[u] = 'black';
            }
    
            return {
                distances: d,
                predecessors: pred
            };
        };
    
        var time = 0;
        // 深度优先搜索
        this.DFS = function () {
    
            var color = initializeColor(),
                d = {},
                f = {},
                p = {};
            time = 0;
    
            for (var i = 0; i < vertices.length; i++) {
                f[vertices[i]] = 0;
                d[vertices[i]] = 0;
                p[vertices[i]] = null;
            }
    
            for (i = 0; i < vertices.length; i++) {
                if (color[vertices[i]] === 'white') {
                    DFSVisit(vertices[i], color, d, f, p);
                }
            }
    
            return {
                discovery: d,
                finished: f,
                predecessors: p
            };
        };
    
        var DFSVisit = function (u, color, d, f, p) {
    
            console.log('discovered ' + u);
            color[u] = 'grey';
            d[u] = ++time;
            var neighbors = adjList.get(u);
            for (var i = 0; i < neighbors.length; i++) {
                var w = neighbors[i];
                if (color[w] === 'white') {
                    p[w] = u;
                    DFSVisit(w, color, d, f, p);
                }
            }
            color[u] = 'black';
            f[u] = ++time;
            console.log('explored ' + u);
        };
    }
    
    
    function ShortestPath(graph) {
    
        this.graph = graph;
    
        var INF = Number.MAX_SAFE_INTEGER;
    
        var minDistance = function (dist, visited) {
    
            var min = INF,
                minIndex = -1;
    
            for (var v = 0; v < dist.length; v++) {
                if (visited[v] == false && dist[v] <= min) {
                    min = dist[v];
                    minIndex = v;
                }
            }
    
            return minIndex;
        };
    
        this.dijkstra = function (src) {
    
            var dist = [],
                visited = [],
                length = this.graph.length;
    
            for (var i = 0; i < length; i++) {
                dist[i] = INF;
                visited[i] = false;
            }
    
            dist[src] = 0;
    
            for (var i = 0; i < length - 1; i++) {
    
                var u = minDistance(dist, visited);
    
                visited[u] = true;
    
                for (var v = 0; v < length; v++) {
                    if (!visited[v] && this.graph[u][v] != 0 && dist[u] != INF && dist[u] + this.graph[u][v] < dist[v]) {
                        dist[v] = dist[u] + this.graph[u][v];
                    }
                }
            }
    
            return dist;
        };
    
        this.floydWarshall = function () {
    
            var dist = [],
                length = this.graph.length,
                i, j, k;
    
            for (i = 0; i < length; i++) {
                dist[i] = [];
                for (j = 0; j < length; j++) {
                    dist[i][j] = this.graph[i][j];
                }
            }
    
            for (k = 0; k < length; k++) {
                for (i = 0; i < length; i++) {
                    for (j = 0; j < length; j++) {
                        if (dist[i][k] + dist[k][j] < dist[i][j]) {
                            dist[i][j] = dist[i][k] + dist[k][j];
                        }
                    }
                }
            }
    
            return dist;
        }
    }
    
    function MinimumSpanningTree(graph) {
    
        this.graph = graph;
    
        var INF = Number.MAX_SAFE_INTEGER;
    
        var minKey = function (key, visited) {
            // Initialize min value
            var min = INF, minIndex;
    
            for (var v = 0; v < this.graph.length; v++) {
                if (visited[v] == false && key[v] < min) {
                    min = key[v];
                    minIndex = v;
                }
            }
    
            return minIndex;
        };
    
        this.prim = function () {
            var parent = [],
                key = [],
                visited = [],
                length = this.graph.length,
                i;
    
            for (i = 0; i < length; i++) {
                key[i] = INF;
                visited[i] = false;
            }
    
            key[0] = 0;
            parent[0] = -1;
    
            for (i = 0; i < length - 1; i++) {
                var u = minKey(key, visited);
                visited[u] = true;
    
                for (var v = 0; v < length; v++) {
                    if (this.graph[u][v] && visited[v] == false && this.graph[u][v] < key[v]) {
                        parent[v] = u;
                        key[v] = this.graph[u][v];
                    }
                }
            }
    
            return parent;
        };
    
        var find = function (i, parent) {
            while (parent[i]) {
                i = parent[i];
            }
            return i;
        };
    
        var union = function (i, j, parent) {
            if (i != j) {
                parent[j] = i;
                return true;
            }
            return false;
        };
    
        var initializeCost = function () {
            var cost = [], length = this.graph.length;
            for (var i = 0; i < length; i++) {
                cost[i] = [];
                for (var j = 0; j < length; j++) {
                    if (this.graph[i][j] == 0) {
                        cost[i][j] = INF;
                    } else {
                        cost[i][j] = this.graph[i][j];
                    }
                }
            }
            return cost;
        };
    
        this.kruskal = function () {
    
            var length = this.graph.length,
                parent = [], cost,
                ne = 0, a, b, u, v, i, j, min;
    
            cost = initializeCost();
    
            while (ne < length - 1) {
    
                for (i = 0, min = INF; i < length; i++) {
                    for (j = 0; j < length; j++) {
                        if (cost[i][j] < min) {
                            min = cost[i][j];
                            a = u = i;
                            b = v = j;
                        }
                    }
                }
    
                u = find(u, parent);
                v = find(v, parent);
    
                if (union(u, v, parent)) {
                    ne++;
                }
    
                cost[a][b] = cost[b][a] = INF;
            }
    
            return parent;
        }
    }
    
    /**
    排序算法
    **/
    function ArrayListSort() {
    
        var array = [];
    
        this.insert = function (item) {
            array.push(item);
        };
    
        var swap = function (array, index1, index2) {
            var aux = array[index1];
            array[index1] = array[index2];
            array[index2] = aux;
            //ES2015 swap - Firefox only, for other browser, uncomment code above and coment line below
            //[array[index1], array[index2]] = [array[index2], array[index1]];
        };
    
        this.toString = function () {
            return array.join();
        };
    
        this.array = function () {
            return array;
        };
    
        this.bubbleSort = function () {
            var length = array.length;
    
            for (var i = 0; i < length; i++) {
                console.log('--- ');
                for (var j = 0; j < length - 1; j++) {
                    console.log('compare ' + array[j] + ' with ' + array[j + 1]);
                    if (array[j] > array[j + 1]) {
                        console.log('swap ' + array[j] + ' with ' + array[j + 1]);
                        swap(array, j, j + 1);
                    }
                }
            }
        };
    
        this.modifiedBubbleSort = function () {
            var length = array.length;
    
            for (var i = 0; i < length; i++) {
                console.log('--- ');
                for (var j = 0; j < length - 1 - i; j++) {
                    console.log('compare ' + array[j] + ' with ' + array[j + 1]);
                    if (array[j] > array[j + 1]) {
                        console.log('swap ' + array[j] + ' with ' + array[j + 1]);
                        swap(j, j + 1);
                    }
                }
            }
    
        };
    
        this.selectionSort = function () {
            var length = array.length,
                indexMin;
    
            for (var i = 0; i < length - 1; i++) {
                indexMin = i;
                console.log('index ' + array[i]);
                for (var j = i; j < length; j++) {
                    if (array[indexMin] > array[j]) {
                        console.log('new index min ' + array[j]);
                        indexMin = j;
                    }
                }
                if (i !== indexMin) {
                    console.log('swap ' + array[i] + ' with ' + array[indexMin]);
                    swap(i, indexMin);
                }
            }
        };
    
        this.insertionSort = function () {
            var length = array.length,
                j, temp;
            for (var i = 1; i < length; i++) {
                j = i;
                temp = array[i];
                console.log('to be inserted ' + temp);
                while (j > 0 && array[j - 1] > temp) {
                    console.log('shift ' + array[j - 1]);
                    array[j] = array[j - 1];
                    j--;
                }
                console.log('insert ' + temp);
                array[j] = temp;
            }
        };
    
        var insertionSort_ = function (array) {
            var length = array.length,
                j, temp;
            for (var i = 1; i < length; i++) {
                j = i;
                temp = array[i];
                while (j > 0 && array[j - 1] > temp) {
                    array[j] = array[j - 1];
                    j--;
                }
                array[j] = temp;
            }
        };
    
        this.mergeSort = function () {
            array = mergeSortRec(array);
        };
    
        var mergeSortRec = function (array) {
    
            var length = array.length;
    
            if (length === 1) {
                console.log(array);
                return array;
            }
    
            var mid = Math.floor(length / 2),
                left = array.slice(0, mid),
                right = array.slice(mid, length);
    
            return merge(mergeSortRec(left), mergeSortRec(right));
        };
    
        var merge = function (left, right) {
            var result = [],
                il = 0,
                ir = 0;
    
            while (il < left.length && ir < right.length) {
    
                if (left[il] < right[ir]) {
                    result.push(left[il++]);
                } else {
                    result.push(right[ir++]);
                }
            }
    
            while (il < left.length) {
                result.push(left[il++]);
            }
    
            while (ir < right.length) {
                result.push(right[ir++]);
            }
    
            console.log(result);
    
            return result;
        };
    
        this.quickSort = function () {
            quick(array, 0, array.length - 1);
        };
    
        var partition = function (array, left, right) {
    
            var pivot = array[Math.floor((right + left) / 2)],
                i = left,
                j = right;
    
            console.log('pivot is ' + pivot + '; left is ' + left + '; right is ' + right);
    
            while (i <= j) {
                while (array[i] < pivot) {
                    i++;
                    console.log('i = ' + i);
                }
    
                while (array[j] > pivot) {
                    j--;
                    console.log('j = ' + j);
                }
    
                if (i <= j) {
                    console.log('swap ' + array[i] + ' with ' + array[j]);
                    swap(array, i, j);
                    i++;
                    j--;
                }
            }
    
            return i;
        };
    
        var quick = function (array, left, right) {
    
            var index;
    
            if (array.length > 1) {
    
                index = partition(array, left, right);
    
                if (left < index - 1) {
                    quick(array, left, index - 1);
                }
    
                if (index < right) {
                    quick(array, index, right);
                }
            }
            return array;
        };
    
        this.heapSort = function () {
            var heapSize = array.length;
    
            buildHeap(array);
    
            while (heapSize > 1) {
                heapSize--;
                console.log('swap (' + +array[0] + ',' + array[heapSize] + ')');
                swap(array, 0, heapSize);
                console.log('heapify ' + array.join());
                heapify(array, heapSize, 0);
            }
        };
    
        var buildHeap = function (array) {
            console.log('building heap');
            var heapSize = array.length;
            for (var i = Math.floor(array.length / 2); i >= 0; i--) {
                heapify(array, heapSize, i);
            }
            console.log('heap created: ' + array.join());
        };
    
        var heapify = function (array, heapSize, i) {
            var left = i * 2 + 1,
                right = i * 2 + 2,
                largest = i;
    
            if (left < heapSize && array[left] > array[largest]) {
                largest = left;
            }
    
            if (right < heapSize && array[right] > array[largest]) {
                largest = right;
            }
    
            console.log('Heapify Index = ' + i + ' and Heap Size = ' + heapSize);
    
            if (largest !== i) {
                console.log('swap index ' + i + ' with ' + largest + ' (' + +array[i] + ',' + array[largest] + ')');
                swap(array, i, largest);
                console.log('heapify ' + array.join());
                heapify(array, heapSize, largest);
            }
        };
    
        this.countingSort = function () {
    
            var i,
                maxValue = this.findMaxValue(),
                sortedIndex = 0,
                counts = new Array(maxValue + 1);
    
            for (i = 0; i < array.length; i++) {
                if (!counts[array[i]]) {
                    counts[array[i]] = 0;
                }
                counts[array[i]]++;
            }
    
            console.log('Frequencies: ' + counts.join());
    
            for (i = 0; i < counts.length; i++) {
                while (counts[i] > 0) {
                    array[sortedIndex++] = i;
                    counts[i]--;
                }
            }
        };
    
        this.bucketSort = function (bucketSize) {
    
            var i,
                minValue = this.findMinValue(),
                maxValue = this.findMaxValue(),
                BUCKET_SIZE = 5;
    
            console.log('minValue ' + minValue);
            console.log('maxValue ' + maxValue);
    
            bucketSize = bucketSize || BUCKET_SIZE;
            var bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
            var buckets = new Array(bucketCount);
            console.log('bucketSize = ' + bucketCount);
            for (i = 0; i < buckets.length; i++) {
                buckets[i] = [];
            }
    
            for (i = 0; i < array.length; i++) {
                buckets[Math.floor((array[i] - minValue) / bucketSize)].push(array[i]);
                console.log('pushing item ' + array[i] + ' to bucket index ' + Math.floor((array[i] - minValue) / bucketSize));
            }
    
            array = [];
            for (i = 0; i < buckets.length; i++) {
                insertionSort_(buckets[i]);
    
                console.log('bucket sorted ' + i + ': ' + buckets[i].join());
    
                for (var j = 0; j < buckets[i].length; j++) {
                    array.push(buckets[i][j]);
                }
            }
        };
    
        this.radixSort = function (radixBase) {
    
            var i,
                minValue = this.findMinValue(),
                maxValue = this.findMaxValue(),
                radixBase = radixBase || 10;
    
            // Perform counting sort for each significant digit), starting at 1
            var significantDigit = 1;
            while (((maxValue - minValue) / significantDigit) >= 1) {
                console.log('radix sort for digit ' + significantDigit);
                array = countingSortForRadix(array, radixBase, significantDigit, minValue);
                console.log(array.join());
                significantDigit *= radixBase;
            }
        };
    
        var countingSortForRadix = function (array, radixBase, significantDigit, minValue) {
            var i, countsIndex,
                counts = new Array(radixBase),
                aux = new Array(radixBase);
    
            for (i = 0; i < radixBase; i++) {
                counts[i] = 0;
            }
    
            for (i = 0; i < array.length; i++) {
                countsIndex = Math.floor(((array[i] - minValue) / significantDigit) % radixBase);
                counts[countsIndex]++;
            }
    
            for (i = 1; i < radixBase; i++) {
                counts[i] += counts[i - 1];
            }
    
            for (i = array.length - 1; i >= 0; i--) {
                countsIndex = Math.floor(((array[i] - minValue) / significantDigit) % radixBase);
                aux[--counts[countsIndex]] = array[i];
            }
    
            for (i = 0; i < array.length; i++) {
                array[i] = aux[i];
            }
    
            return array;
        };
    
        this.sequentialSearch = function (item) {
    
            for (var i = 0; i < array.length; i++) {
                if (item === array[i]) {
                    return i;
                }
            }
    
            return -1;
        };
    
        this.findMaxValue = function () {
            var max = array[0];
            for (var i = 1; i < array.length; i++) {
                if (max < array[i]) {
                    max = array[i];
                }
            }
    
            return max;
        };
    
        this.findMinValue = function () {
            var min = array[0];
            for (var i = 1; i < array.length; i++) {
                if (min > array[i]) {
                    min = array[i];
                }
            }
    
            return min;
        };
    
        this.binarySearch = function (item) {
            this.quickSort();
    
            var low = 0,
                high = array.length - 1,
                mid, element;
    
            while (low <= high) {
                mid = Math.floor((low + high) / 2);
                element = array[mid];
                console.log('mid element is ' + element);
                if (element < item) {
                    low = mid + 1;
                    console.log('low is ' + low);
                } else if (element > item) {
                    high = mid - 1;
                    console.log('high is ' + high);
                } else {
                    console.log('found it');
                    return mid;
                }
            }
            return -1;
        };
    
    }
    var Yallist = (function () {
        function Yallist(list) {
            var self = this
            if (!(self instanceof Yallist)) {
                self = new Yallist()
            }
    
            self.tail = null
            self.head = null
            self.length = 0
    
            if (list && typeof list.forEach === 'function') {
                list.forEach(function (item) {
                    self.push(item)
                })
            } else if (arguments.length > 0) {
                for (var i = 0, l = arguments.length; i < l; i++) {
                    self.push(arguments[i])
                }
            }
    
            return self
        }
    
        Yallist.prototype.removeNode = function (node) {
            if (node.list !== this) {
                throw new Error('removing node which does not belong to this list')
            }
    
            var next = node.next
            var prev = node.prev
    
            if (next) {
                next.prev = prev
            }
    
            if (prev) {
                prev.next = next
            }
    
            if (node === this.head) {
                this.head = next
            }
            if (node === this.tail) {
                this.tail = prev
            }
    
            node.list.length--
            node.next = null
            node.prev = null
            node.list = null
    
            return next
        }
    
        Yallist.prototype.unshiftNode = function (node) {
            if (node === this.head) {
                return
            }
    
            if (node.list) {
                node.list.removeNode(node)
            }
    
            var head = this.head
            node.list = this
            node.next = head
            if (head) {
                head.prev = node
            }
    
            this.head = node
            if (!this.tail) {
                this.tail = node
            }
            this.length++
        }
    
        Yallist.prototype.pushNode = function (node) {
            if (node === this.tail) {
                return
            }
    
            if (node.list) {
                node.list.removeNode(node)
            }
    
            var tail = this.tail
            node.list = this
            node.prev = tail
            if (tail) {
                tail.next = node
            }
    
            this.tail = node
            if (!this.head) {
                this.head = node
            }
            this.length++
        }
    
        Yallist.prototype.push = function () {
            for (var i = 0, l = arguments.length; i < l; i++) {
                push(this, arguments[i])
            }
            return this.length
        }
    
        Yallist.prototype.unshift = function () {
            for (var i = 0, l = arguments.length; i < l; i++) {
                unshift(this, arguments[i])
            }
            return this.length
        }
    
        Yallist.prototype.pop = function () {
            if (!this.tail) {
                return undefined
            }
    
            var res = this.tail.value
            this.tail = this.tail.prev
            if (this.tail) {
                this.tail.next = null
            } else {
                this.head = null
            }
            this.length--
            return res
        }
    
        Yallist.prototype.shift = function () {
            if (!this.head) {
                return undefined
            }
    
            var res = this.head.value
            this.head = this.head.next
            if (this.head) {
                this.head.prev = null
            } else {
                this.tail = null
            }
            this.length--
            return res
        }
    
        Yallist.prototype.forEach = function (fn, thisp) {
            thisp = thisp || this
            for (var walker = this.head, i = 0; walker !== null; i++) {
                fn.call(thisp, walker.value, i, this)
                walker = walker.next
            }
        }
    
        Yallist.prototype.forEachReverse = function (fn, thisp) {
            thisp = thisp || this
            for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
                fn.call(thisp, walker.value, i, this)
                walker = walker.prev
            }
        }
    
        Yallist.prototype.get = function (n) {
            for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
                // abort out of the list early if we hit a cycle
                walker = walker.next
            }
            if (i === n && walker !== null) {
                return walker.value
            }
        }
    
        Yallist.prototype.getReverse = function (n) {
            for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
                // abort out of the list early if we hit a cycle
                walker = walker.prev
            }
            if (i === n && walker !== null) {
                return walker.value
            }
        }
    
        Yallist.prototype.map = function (fn, thisp) {
            thisp = thisp || this
            var res = new Yallist()
            for (var walker = this.head; walker !== null;) {
                res.push(fn.call(thisp, walker.value, this))
                walker = walker.next
            }
            return res
        }
    
        Yallist.prototype.mapReverse = function (fn, thisp) {
            thisp = thisp || this
            var res = new Yallist()
            for (var walker = this.tail; walker !== null;) {
                res.push(fn.call(thisp, walker.value, this))
                walker = walker.prev
            }
            return res
        }
    
        Yallist.prototype.reduce = function (fn, initial) {
            var acc
            var walker = this.head
            if (arguments.length > 1) {
                acc = initial
            } else if (this.head) {
                walker = this.head.next
                acc = this.head.value
            } else {
                throw new TypeError('Reduce of empty list with no initial value')
            }
    
            for (var i = 0; walker !== null; i++) {
                acc = fn(acc, walker.value, i)
                walker = walker.next
            }
    
            return acc
        }
    
        Yallist.prototype.reduceReverse = function (fn, initial) {
            var acc
            var walker = this.tail
            if (arguments.length > 1) {
                acc = initial
            } else if (this.tail) {
                walker = this.tail.prev
                acc = this.tail.value
            } else {
                throw new TypeError('Reduce of empty list with no initial value')
            }
    
            for (var i = this.length - 1; walker !== null; i--) {
                acc = fn(acc, walker.value, i)
                walker = walker.prev
            }
    
            return acc
        }
    
        Yallist.prototype.toArray = function () {
            var arr = new Array(this.length)
            for (var i = 0, walker = this.head; walker !== null; i++) {
                arr[i] = walker.value
                walker = walker.next
            }
            return arr
        }
    
        Yallist.prototype.toArrayReverse = function () {
            var arr = new Array(this.length)
            for (var i = 0, walker = this.tail; walker !== null; i++) {
                arr[i] = walker.value
                walker = walker.prev
            }
            return arr
        }
    
        Yallist.prototype.slice = function (from, to) {
            to = to || this.length
            if (to < 0) {
                to += this.length
            }
            from = from || 0
            if (from < 0) {
                from += this.length
            }
            var ret = new Yallist()
            if (to < from || to < 0) {
                return ret
            }
            if (from < 0) {
                from = 0
            }
            if (to > this.length) {
                to = this.length
            }
            for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
                walker = walker.next
            }
            for (; walker !== null && i < to; i++, walker = walker.next) {
                ret.push(walker.value)
            }
            return ret
        }
    
        Yallist.prototype.sliceReverse = function (from, to) {
            to = to || this.length
            if (to < 0) {
                to += this.length
            }
            from = from || 0
            if (from < 0) {
                from += this.length
            }
            var ret = new Yallist()
            if (to < from || to < 0) {
                return ret
            }
            if (from < 0) {
                from = 0
            }
            if (to > this.length) {
                to = this.length
            }
            for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
                walker = walker.prev
            }
            for (; walker !== null && i > from; i--, walker = walker.prev) {
                ret.push(walker.value)
            }
            return ret
        }
    
        Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
            if (start > this.length) {
                start = this.length - 1
            }
            if (start < 0) {
                start = this.length + start;
            }
    
            for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
                walker = walker.next
            }
    
            var ret = []
            for (var i = 0; walker && i < deleteCount; i++) {
                ret.push(walker.value)
                walker = this.removeNode(walker)
            }
            if (walker === null) {
                walker = this.tail
            }
    
            if (walker !== this.head && walker !== this.tail) {
                walker = walker.prev
            }
    
            for (var i = 0; i < nodes.length; i++) {
                walker = insert(this, walker, nodes[i])
            }
            return ret;
        }
    
        Yallist.prototype.reverse = function () {
            var head = this.head
            var tail = this.tail
            for (var walker = head; walker !== null; walker = walker.prev) {
                var p = walker.prev
                walker.prev = walker.next
                walker.next = p
            }
            this.head = tail
            this.tail = head
            return this
        }
    
        function insert(self, node, value) {
            var inserted = node === self.head ?
                new Node(value, null, node, self) :
                new Node(value, node, node.next, self)
    
            if (inserted.next === null) {
                self.tail = inserted
            }
            if (inserted.prev === null) {
                self.head = inserted
            }
    
            self.length++
    
            return inserted
        }
    
        function push(self, item) {
            self.tail = new Node(item, self.tail, null, self)
            if (!self.head) {
                self.head = self.tail
            }
            self.length++
        }
    
        function unshift(self, item) {
            self.head = new Node(item, null, self.head, self)
            if (!self.tail) {
                self.tail = self.head
            }
            self.length++
        }
    
        function Node(value, prev, next, list) {
            if (!(this instanceof Node)) {
                return new Node(value, prev, next, list)
            }
    
            this.list = list
            this.value = value
    
            if (prev) {
                prev.next = this
                this.prev = prev
            } else {
                this.prev = null
            }
    
            if (next) {
                next.prev = this
                this.next = next
            } else {
                this.next = null
            }
        }
    
        return Yallist
    })();
    var DoublyLinked = (function () {
    
        /* doublylinked
         ------------------------
         (c) 2017-present Panates
         SQB may be freely distributed under the MIT license.
         For details and documentation:
         https://panates.github.io/doublylinked/
         */
    
    
        /**
         *
         * @class
         */
        class DoublyLinked {
    
            /**
             * @param {*} element... - The elements to add to the end of the list
             * @constructor
             */
            constructor(...element) {
                this._cursor = undefined;
                this._head = undefined;
                this._tail = undefined;
                this._length = 0;
                this._eof = undefined;
                if (arguments.length)
                    this.push.apply(this, arguments);
            }
    
            /**
             *
             * @returns {Node}
             */
            get cursor() {
                return this._cursor;
            }
    
            /**
             *
             * @returns {Node}
             */
            get head() {
                return this._head;
            }
    
            /**
             *
             * @returns {int}
             */
            get length() {
                return this._length;
            }
    
            /**
             *
             * @returns {Node}
             */
            get tail() {
                return this._tail;
            }
    
            /**
             * Merges cursor list with and given lists/values into new list
             *
             * @param {String} element... - Lists and/or values to concatenate into a new list
             * @return {DoublyLinked} - A new DoublyLinked instance
             * @public
             */
            concat(...element) {
                const result = new DoublyLinked();
                const mergeFn = (acc, node) => {
                    acc.push(node);
                    return acc;
                };
                this.reduce(mergeFn, result);
                for (const arg of element) {
                    if (arg instanceof DoublyLinked)
                        arg.reduce(mergeFn, result);
                    else result.push(arg);
                }
    
                return result.reset();
            }
    
            /**
             * Returns the iterator object contains entries
             *
             * @return {Iterator}
             */
            entries() {
                return {
                    [Symbol.iterator]: () => {
                        let _cursor;
                        let i = 0;
                        return {
                            next: () => {
                                _cursor = _cursor ? _cursor.next : this.head;
                                return {
                                    value: _cursor && [i++, _cursor.value],
                                    done: !_cursor
                                };
                            }
                        };
                    }
                };
            }
    
            /**
             * Returns the iterator object contains keys
             *
             * @return {Iterator}
             */
            keys() {
                return {
                    [Symbol.iterator]: () => {
                        let _cursor;
                        let i = 0;
                        return {
                            next: () => {
                                _cursor = _cursor ? _cursor.next : this.head;
                                return {
                                    value: _cursor && i++,
                                    done: !_cursor
                                };
                            }
                        };
                    }
                };
            }
            /**
             * Returns the iterator object contains nodes
             *
             * @return {function}
             */
            nodes() {
                return {
                    [Symbol.iterator]: () => {
                        let _cursor;
                        return {
                            next: () => {
                                _cursor = _cursor ? _cursor.next : this.head;
                                return {
                                    value: _cursor,
                                    done: !_cursor
                                };
                            }
                        };
                    }
                };
            }
            /**
             * Returns the iterator object contains values
             *
             * @return {function}
             */
            values() {
                return {
                    [Symbol.iterator]: () => {
                        let _cursor;
                        return {
                            next: () => {
                                _cursor = _cursor ? _cursor.next : this.head;
                                return {
                                    value: _cursor && _cursor.value,
                                    done: !_cursor
                                };
                            }
                        };
                    }
                };
            }
    
            /**
             * Tests whether all elements in the list pass the test implemented by
             * the provided function (from left to right)
             *
             * @param {Function} callback - Function to test for each element
             * @param {*} [thisArg] - Value to use as this when executing callback
             * @return {Boolean} - true if the callback function returns a truthy value for every list element; otherwise, false
             * @public
             */
            every(callback, thisArg) {
                if (typeof callback !== 'function')
                    throw new TypeError('You must provide a function as first argument');
                if (!(this._length && callback))
                    return true;
                thisArg = thisArg !== undefined ? thisArg : this;
                let tmp = this._head;
                let nxt;
                let i = 0;
                while (tmp) {
                    nxt = tmp.next;
                    if (!callback.call(thisArg, tmp.value, i++, thisArg))
                        return false;
                    tmp = nxt;
                }
                return true;
            }
    
            /**
             * Tests whether all elements in the list pass the test implemented by
             * the provided function (from right to left)
             *
             * @param {Function} callback - Function to test for each element
             * @param {*} [thisArg] - Value to use as this when executing callback
             * @return {Boolean} - true if the callback function returns a truthy value for every list element; otherwise, false
             * @public
             */
            everyRight(callback, thisArg) {
                if (typeof callback !== 'function')
                    throw new TypeError('You must provide a function as first argument');
                if (!(this._length && callback))
                    return true;
                thisArg = thisArg !== undefined ? thisArg : this;
                let tmp = this.tail;
                for (let i = 0; i < this._length; i++) {
                    if (!callback.call(thisArg, tmp.value, this._length - i - 1, thisArg))
                        return false;
                    tmp = tmp.prev;
                }
                return true;
            }
    
            /**
             * Creates a new list with all elements that pass the test implemented
             * by the provided function
             *
             * @param {Function} callback - Function to test for each element
             * @param {*} [thisArg] - Value to use as this when executing callback
             * @return {DoublyLinked} - A new list with the elements that pass the test
             * @public
             */
            filter(callback, thisArg) {
                if (typeof callback !== 'function')
                    throw new TypeError('You must provide a function as first argument');
                thisArg = thisArg !== undefined ? thisArg : this;
                let index = 0;
                return this.reduce((acc, value) => {
                    if (callback.call(thisArg, value, index++, thisArg))
                        acc.push(value);
                    return acc;
                }, new DoublyLinked());
            }
    
            /**
             * Returns the value of the first element in the list that satisfies
             * the provided testing function. Otherwise undefined is returned
             *
             * @param {Function} callback - Function to test for each element
             * @param {*} [thisArg] - Value to use as this when executing callback
             * @return {*} - A value in the list if an element passes the test; otherwise, undefined
             * @public
             */
            find(callback, thisArg) {
                if (typeof callback !== 'function')
                    throw new TypeError('You must provide a function as first argument');
                if (!this._length)
                    return;
                thisArg = thisArg !== undefined ? thisArg : this;
                let tmp = this.head;
                for (let i = 0; i < this.length; i++) {
                    if (callback.call(thisArg, tmp.value, i, thisArg)) {
                        this._cursor = tmp;
                        this._eof = false;
                        return tmp.value;
                    }
                    tmp = tmp.next;
                }
                this._cursor = undefined;
            }
    
            /**
             * Executes a provided function once for each list element (from left to right)
             *
             * @param {Function} callback - Function to execute for each element
             * @param {*} [thisArg] - Value to use as this when executing callback
             * @public
             */
            forEach(callback, thisArg) {
                this.every((element, index, instance) => {
                    callback.call(this, element, index, instance);
                    return true;
                }, thisArg);
            }
    
            /**
             * Executes a provided function once for each list element (from right-to-left)
             *
             * @param {Function} callback - Function to execute for each element
             * @param {*} [thisArg] - Value to use as this when executing callback
             * @public
             */
            forEachRight(callback, thisArg) {
                this.everyRight((element, index, instance) => {
                    callback.call(this, element, index, instance);
                    return true;
                }, thisArg);
            }
    
            /**
             * Determines whether an list includes a certain element,
             * returning true or false as appropriate
             *
             * @param {*} searchElement - The element to search for
             * @param {int} [fromIndex = 0] - The position in this list at which to begin searching for searchElement
             * @return {Boolean} - true if the searchElement found in the list; otherwise, false
             * @public
             */
            includes(searchElement, fromIndex) {
    
                const sameValueZero = (x, y) => {
                    return x === y ||
                        (typeof x === 'number' && typeof y === 'number' &&
                            isNaN(x) && isNaN(y));
                };
    
                fromIndex = fromIndex || 0;
                if (fromIndex < 0)
                    fromIndex = this.length + fromIndex;
                this.find((element, index) =>
                    (index >= fromIndex && sameValueZero(element, searchElement)));
                return !!this.cursor;
            }
    
            /**
             * Adds one or more elements right after the cursor node of the list and returns
             * the new length of the list
             *
             * @param {*} element... - The elements to add after cursor node
             * @returns {int} - The new length of the list
             * @public
             */
            insert(...element) {
                for (const arg of element) {
                    const node = new Node(this, arg);
                    if (this._length) {
                        this._cursor.next = node;
                        node.prev = this._cursor;
                        this._cursor = node;
                    } else {
                        this._head = node;
                        this._tail = node;
                        this._cursor = node;
                    }
                    this._length++;
                    this._eof = false;
                }
                return this._length;
            }
    
            /**
             * Joins all elements of the list into a string and returns this string
             *
             * @param {String} [separator=','] - Specifies a string to separate each pair of adjacent elements of the list
             * @return {String} - A string with all list elements joined. If length is 0, the empty string is returned
             * @public
             */
            join(separator) {
                separator = separator || ',';
                let out = '';
                this.forEach((value) => {
                    out += (out ? separator : '') + value;
                });
                return out;
            }
    
            /**
             * Creates a new list with the results of calling a provided function on
             * every element in the calling list
             *
             * @param {Function} callback - Function that produces an element of the new list
             * @return {DoublyLinked} - A new list with each element being the result of the callback function
             * @public
             */
            map(callback) {
                if (typeof callback !== 'function')
                    throw new TypeError('You must provide a function as first argument');
                const out = new DoublyLinked();
                this.forEach((value, index, instance) => out.push(callback(value, index, instance)));
                return out.reset();
            }
    
            /**
             * Moves cursor to the next and returns its value
             *
             * @return {*} - Returns value of next node to the cursor. If cursor reaches to the end it returns undefined
             * @public
             */
            next() {
                if (this._cursor === this._tail) {
                    this._eof = true;
                    return undefined;
                }
                const c = this._cursor ? this._cursor.next : this._head;
                this._cursor = c;
                return c && c.value;
            }
    
            /**
             * Moves cursor to the previous and returns its value
             *
             * @return {*} - Returns value of previous node to the cursor. If cursor reaches to the head it returns undefined
             * @public
             */
            prev() {
                let c;
                if (this._eof) {
                    this._eof = false;
                    c = this._cursor = this._tail;
                    return c && c.value;
                }
                c = this._cursor && this._cursor.prev;
                this._cursor = c;
                return c && c.value;
            }
    
            /**
             * Removes the last element from the list and returns that element
             *
             * @returns {*} - The removed element from the list; undefined if the list is empty.
             * @public
             */
            pop() {
                const ret = this._tail;
                if (ret) {
                    ret.remove();
                    return ret.value;
                }
            }
    
            /**
             * Adds one or more elements to the end of the list and returns
             * the new length of the list
             *
             * @param {*} element... - The elements to add to the end of the list
             * @returns {int} - The new length of the list
             * @public
             */
            push(...element) {
                if (element.length)
                    this._eof = false;
                for (const arg of element) {
                    const node = new Node(this, arg);
                    if (this._length) {
                        this._tail.next = node;
                        node.prev = this._tail;
                        this._tail = node;
                    } else {
                        this._head = node;
                        this._tail = node;
                    }
                    this._length++;
                }
                return this._length;
            }
    
            /**
             * Applies a function against an accumulator and each element in
             * the list (from left-to-right) to reduce it to a single value
             *
             * @param {Function} callback - Function to execute on each element in the list
             * @param {*} [initialValue] - Value to use as the first argument to the first call of the callback
             * @return {*} - The value that results from the reduction
             * @public
             */
            reduce(callback, initialValue) {
                if (typeof callback !== 'function')
                    throw new TypeError('You must provide a function as first argument');
                let accumulator = initialValue;
                this.forEach((value, index) => {
                    accumulator = callback(accumulator, value, index, this);
                });
                return accumulator;
            }
    
            /**
             * Applies a function against an accumulator and each element in
             * the list (from right-to-left) to reduce it to a single value
             *
             * @param {Function} callback - Function to execute on each element in the list
             * @param {*} [initialValue] - Value to use as the first argument to the first call of the callback
             * @return {*} - The value that results from the reduction
             * @public
             */
            reduceRight(callback, initialValue) {
                if (typeof callback !== 'function')
                    throw new TypeError('You must provide a function as first argument');
                let accumulator = initialValue;
                this.forEachRight((value, index) => {
                    accumulator = callback(accumulator, value, index, this);
                });
                return accumulator;
            }
    
            /**
             * Removes an element from the list
             *
             * @param {*} element - The element to be removed
             * @param {int} [fromIndex = 0] - The position in this list at which to begin searching for element
             * @return {*} - Returns removed element if found, undefined otherwise
             * @public
             */
            remove(element, fromIndex) {
                if (this.includes(element, fromIndex)) {
                    const cur = this._cursor;
                    cur.remove();
                    return cur.value;
                }
            }
    
            /**
             * Resets cursor to head
             *
             * @return {DoublyLinked} - Returns the DoublyLinked instance which this method is called
             * @public
             */
            reset() {
                this._cursor = undefined;
                this._eof = false;
                return this;
            }
    
            /**
             * Reverses a list in place. The first array element becomes the last, and the last list element becomes the first.
             *
             * @return {DoublyLinked} - Returns the DoublyLinked instance which this method is called
             * @public
             */
            reverse() {
                let cur = this._head;
                let p, n;
                for (let i = 0; i < this._length; i++) {
                    p = cur.prev;
                    n = cur.next;
                    cur.prev = n;
                    cur.next = p;
                    cur = n;
                }
                p = this._head;
                n = this._tail;
                this._head = n;
                this._tail = p;
                this.reset();
                return this;
            }
    
            /**
             * Removes the first element from the list and returns that element
             *
             * @returns {*} - The removed element from the list; undefined if the list is empty
             * @public
             */
            shift() {
                const ret = this._head;
                if (ret) {
                    ret.remove();
                    return ret.value;
                }
            }
    
            /**
             * Returns a shallow copy of a portion of an array into a new array object
             * selected from start to end (end not included) where start and
             * end represent the index of items in that array.
             *
             * @param {number} [start]
             * @param {number} [end]
             * @returns {Array}
             * @public
             */
            slice(start, end) {
                start = start || 0;
                const acc = [];
                this.every((value, index) => {
                    if (index >= start)
                        acc.push(value);
                    return !end || index < end;
                });
                return acc;
            }
    
            /**
             * Tests whether all elements in the list pass the test implemented by
             * the provided function (from left to right)
             *
             * @param {Function} callback - Function to test for each element
             * @param {*} [thisArg] - Value to use as this when executing callback
             * @public
             */
            some(callback, thisArg) {
                return !this.every((element, index, instance) =>
                    !callback.call(this, element, index, instance), thisArg);
            }
    
            /**
             * Tests whether at least one element in the list passes the test
             * implemented by the provided function (from right to left)
             *
             * @param {Function} callback - Function to test for each element
             * @param {*} [thisArg] - Value to use as this when executing callback
             * @public
             */
            someRight(callback, thisArg) {
                return !this.everyRight((element, index, instance) =>
                    !callback.call(this, element, index, instance), thisArg);
            }
    
            /**
             * Returns a new array containing elements of the list
             *
             * @return {Array} - A new Array instance contains elements of the list
             * @public
             */
            toArray() {
                return this.slice();
            }
    
            /**
             * Returns a string representing the specified list and its elements.
             * @return {string} - Returns a string representing the specified list and its elements.
             */
            toString() {
                return 'DoublyLinked(' + this.join() + ')';
            }
    
            /**
             * Adds one or more elements to the beginning of the list
             * the new length of the list
             *
             * @param {*} element... - The elements to add to the front of the list
             * @returns {int} - The new length of the list
             * @public
             */
            unshift(...element) {
                for (const arg of element) {
                    const node = new Node(this, arg);
                    if (this._length) {
                        this._head.prev = node;
                        node.next = this._head;
                        this._head = node;
                    } else {
                        this._head = node;
                        this._tail = node;
                    }
                    this._length++;
                }
                return this._length;
            }
    
            /**
             * Returns the iterator object contains entries
             *
             * @return {Object} - Returns the iterator object contains entries
             */
            [Symbol.iterator]() {
                let _cursor;
                return {
                    next: () => {
                        _cursor = _cursor ? _cursor.next : this.head;
                        return {
                            value: _cursor && _cursor.value,
                            done: !_cursor
                        };
                    }
                };
            }
    
        }
    
        /**
         *
         * @constructor
         */
        class Node {
            constructor(list, value) {
                this.list = list;
                this.value = value;
                this.prev = undefined;
                this.next = undefined;
            }
    
            remove() {
                if (!this.list)
                    return;
                if (this.prev)
                    // noinspection JSUnresolvedVariable
                    this.prev.next = this.next;
                if (this.next)
                    // noinspection JSUnresolvedVariable
                    this.next.prev = this.prev;
                if (this === this.list._cursor)
                    this.list._cursor = this.next || this.prev;
                if (this === this.list._head)
                    this.list._head = this.next;
                if (this === this.list._tail)
                    this.list._tail = this.prev;
                this.list._length--;
                this.prev = undefined;
                this.next = undefined;
                this.list = undefined;
            }
        }
    
        return DoublyLinked
    })();
    
    
    class Node {
        constructor(value) {
            this.value = value;
            this.prev = null; // 指向前一个节点
            this.next = null; // 指向下一个节点
        }
    }
    
    class DoublyLinkedList2 {
        constructor() {
            this.head = null; // 链表的头节点
            this.tail = null; // 链表的尾节点
            this.size = 0;    // 链表的大小
        }
    
        // 在链表末尾添加节点
        append(value) {
            const newNode = new Node(value);
            if (!this.head) {
                this.head = newNode;
                this.tail = newNode;
            } else {
                this.tail.next = newNode;
                newNode.prev = this.tail;
                this.tail = newNode;
            }
            this.size++;
        }
    
        // 在链表头部添加节点
        prepend(value) {
            const newNode = new Node(value);
            if (!this.head) {
                this.head = newNode;
                this.tail = newNode;
            } else {
                newNode.next = this.head;
                this.head.prev = newNode;
                this.head = newNode;
            }
            this.size++;
        }
    
        // 在指定位置插入节点
        insertAt(value, position) {
            if (position < 0 || position > this.size) {
                throw new Error("Position out of bounds");
            }
    
            if (position === 0) {
                this.prepend(value);
            } else if (position === this.size) {
                this.append(value);
            } else {
                const newNode = new Node(value);
                let current = this.head;
    
                for (let i = 0; i < position; i++) {
                    current = current.next;
                }
    
                newNode.prev = current.prev;
                newNode.next = current;
    
                if (current.prev) {
                    current.prev.next = newNode;
                }
                current.prev = newNode;
    
                this.size++;
            }
        }
    
        // 删除指定值的节点
        delete(value) {
            if (!this.head) return;
    
            let current = this.head;
    
            while (current) {
                if (current.value === value) {
                    if (current.prev) {
                        current.prev.next = current.next;
                    } else {
                        this.head = current.next; // 更新头节点
                    }
    
                    if (current.next) {
                        current.next.prev = current.prev;
                    } else {
                        this.tail = current.prev; // 更新尾节点
                    }
    
                    this.size--;
                    return;
                }
                current = current.next;
            }
        }
    
        // 移动节点到新位置
        move(value, newPosition) {
            if (newPosition < 0 || newPosition >= this.size) {
                throw new Error("New position out of bounds");
            }
    
            let current = this.head;
            let nodeToMove = null;
    
            // 找到要移动的节点
            while (current) {
                if (current.value === value) {
                    nodeToMove = current;
                    break;
                }
                current = current.next;
            }
    
            if (!nodeToMove) {
                throw new Error("Node not found");
            }
    
            // 从当前链表中删除节点
            if (nodeToMove.prev) {
                nodeToMove.prev.next = nodeToMove.next;
            } else {
                this.head = nodeToMove.next; // 更新头节点
            }
    
            if (nodeToMove.next) {
                nodeToMove.next.prev = nodeToMove.prev;
            } else {
                this.tail = nodeToMove.prev; // 更新尾节点
            }
    
            this.size--;
    
            // 在新位置插入节点
            if (newPosition === 0) {
                this.prepend(nodeToMove.value);
            } else {
                let newCurrent = this.head;
    
                for (let i = 0; i < newPosition; i++) {
                    newCurrent = newCurrent.next;
                }
    
                nodeToMove.prev = newCurrent.prev;
                nodeToMove.next = newCurrent;
    
                if (newCurrent.prev) {
                    newCurrent.prev.next = nodeToMove;
                }
                newCurrent.prev = nodeToMove;
    
                if (newPosition === 1) {
                    this.head = nodeToMove; // 更新头节点
                }
            }
    
            this.size++;
        }
    
        // 遍历链表并返回值数组
        toArray() {
            const result = [];
            let current = this.head;
    
            while (current) {
                result.push(current.value);
                current = current.next;
            }
    
            return result;
        }
    }
    
    // 树状链表
    class TreeLinkedNode {
        constructor() {
            this.return = null
            this.child = null
            this.sibling = null
        }
        addChild(child) {
            if (this.child === null) {
                this.child = child
            } else {
                let current = this.child
                while (current.sibling) {
                    current = current.sibling
                }
                current.sibling = child
            }
        }
    }
    
    
    class DomLinked {
        constructor() {
            this.head = null
            this.tail = null
            this.length = 0
        }
        createElement(type, config, ...children) {
            let key = null;
            let props = {}
            for (let name in config) {
                if (name === 'key') {
                    key = config[name]
                    continue
                }
                props[name] = config[name]
            }
            if (children.length === 1) {
    
            }
            props.children = children.length === 1 ?
            return { type, key, props };
        }
        createNode(value) {
            return {
                value,
                next: null,
                prev: null
            }
        }
        find(callback) {
            let i = 0;
            let current = this.head
            while (current) {
                if (callback(current, i) === true) {
                    return current
                }
                current = current.next
                i++;
            }
            return null
        }
        findIndex(callback) {
            let i = 0;
            let current = this.head
            while (current) {
                if (callback(current, i) === true) {
                    return i
                }
                current = current.next
                i++;
            }
            return -1
        }
        at(index) {
            return this.find((node, i) => i === index)
        }
        indexOf(node) {
            return this.findIndex(cur => cur === node)
        }
        appendChild(child) {
            this.insertBefore(child)
        }
        insertBefore(node, before) {
    
            if (this.head === null && this.tail === null) {
                this.head = this.tail = node
            } else if (before === null || before === void 0) {
                this.removeChild(node)
                this.tail.next = node
                node.prev = this.tail
                node.next = null
                this.tail = node
            } else {
                this.removeChild(node)
    
                if (before.prev) {
                    before.prev.next = node
                } else {
                    this.head = node
                }
                node.prev = before.prev
                node.next = before
                before.prev = node
            }
            this.length++
        }
        removeChild(node) {
            if (node.prev || node.next) {
                if (node.prev) {
                    node.prev.next = node.next
                } else {
                    this.head = node.next
                }
                if (node.next) {
                    node.next.prev = node.prev
                } else {
                    this.tail = node.prev
                }
                this.length--
            } else if (this.head === node) {
                this.head = this.tail = null
                this.length--
            }
    
        }
        entries() {
            return this.toArray().entries()
        }
        toArray() {
            const arr = []
            let current = this.head
            while (current) {
                arr.push(current.value)
                current = current.next
            }
            return arr
        }
        // [Symbol.iterator](){
        //     let current=this.head
        //     return {
        //         next:(...args)=>{
        //             if(current){
        //                 const value=current.value;
        //                 current=current.next
        //                 return {
        //                     value,
        //                     done:false
        //                 }
        //             }
        //             return {
        //                 value:undefined,
        //                 done:true
        //             }
        //         },
        //         return:(value)=>{
    
        //         },
        //         throw:(e)=>{
    
        //         }
        //     }
        // }
        /**
         * const myIterator = {
            next() {
                // ...
            },
            [Symbol.iterator]() {
                return this;
            },
        };
         */
        // next=()=>{
        //     let cur=this._cur
        //     if(cur){
        //         this._cur=cur.next
        //         return {
        //             value:cur.value,
        //             done:false
        //         }
        //     }
        //     return {done:true,value:undefined}
        // }
        // [Symbol.iterator]=()=>{
        //     this._cur=this.head
        //     this._index=0
        //     return this;
        // }
        *[Symbol.iterator]() {
            let current = this.head, i = 0
            while (current) {
                yield [i++, current.value]
                current = current.next
            }
        }
    
    
    }
    /**
     *二叉堆一般用数组来表示。如果根节点在数组中的位置是1，第n个位置的子节点分别在2n和 2n+1。
     因此，第1个位置的子节点在2和3，第2个位置的子节点在4和5。以此类推。
     这种基于1的数组存储方式便于寻找父节点和子节点。
    
    如果存储数组的下标基于0，那么下标为i的节点的子节点是2i + 1与2i + 2；
    其父节点的下标是⌊floor((i − 1) ∕ 2)⌋。函数floor(x)的功能是“向下取整”，
    或者说“向下舍入”，即取不大于x的最大整数（与“四舍五入”不同，向下取整是直接取按照数轴上最接近要求值的左边值，即不大于要求值的最大的那个值）。比如floor(1.1)、floor(1.9)都返回1。
                1                                 11                          
             /      \                          /      \ 
           2         3                       9         10
        /    \     /   \                   /   \     /    \ 
       4      5   6     7                5      6   7      8
      / \    / \                        / \    / \
     8  9   10 11                      1   2  3   4 
    
    
     对于一个很大的堆，这种存储是低效的。因为节点的子节点很可能在另外一个内存页中。
     B-heap是一种效率更高的存储方式，把每个子树放到同一内存页。
    如果用指针链表存储堆，那么需要能访问叶节点的方法。
    可以对二叉树“穿线”(threading)方式，来依序遍历这些节点。
     */
    class PriorityQueue2 {
        constructor(compare) {
            this.compare = compare || ((a, b) => a - b);
            this.heap = [];// 二叉堆
            // 
        }
    
        push(value) {
            this.heap.push(value);
            this._heapifyUp();
        }
    
        pop() {
            if (this.size() === 0) return null;
            const top = this.heap[0];
            const last = this.heap.pop();
            if (this.size() > 0) {
                this.heap[0] = last;
                this._heapifyDown();
            }
            return top;
        }
    
        peek() {
            return this.size() > 0 ? this.heap[0] : null;
        }
    
        size() {
            return this.heap.length;
        }
    
        _heapifyUp() {
            let index = this.size() - 1;
            while (index > 0) {
                let parentIndex = Math.floor((index - 1) / 2);
                if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) break;
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            }
        }
    
        _heapifyDown() {
            let index = 0;
            const length = this.size();
            while (true) {
                let leftChild = index * 2 + 1;
                let rightChild = index * 2 + 2;
                let smallest = index;
    
                if (leftChild < length && this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
                    smallest = leftChild;
                }
    
                if (rightChild < length && this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
                    smallest = rightChild;
                }
    
                if (smallest === index) break;
                [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
                index = smallest;
            }
        }
    }
    class BHeap {
        constructor(compare, k = 4) {
            this.compare = compare || ((a, b) => a - b);
            this.k = k;
            this.heap = [];
        }
    
        push(value) {
            this.heap.push(value);
            this._heapifyUp();
        }
    
        pop() {
            if (this.size() === 0) return null;
            const top = this.heap[0];
            const last = this.heap.pop();
            if (this.size() > 0) {
                this.heap[0] = last;
                this._heapifyDown();
            }
            return top;
        }
    
        peek() {
            return this.size() > 0 ? this.heap[0] : null;
        }
    
        size() {
            return this.heap.length;
        }
    
        _heapifyUp() {
            let index = this.size() - 1;
            while (index > 0) {
                let parentIndex = Math.floor((index - 1) / this.k);
                if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) break;
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            }
        }
    
        _heapifyDown() {
            let index = 0;
            const length = this.size();
            while (true) {
                let smallest = index;
                for (let i = 1; i <= this.k; i++) {
                    let childIndex = this.k * index + i;
                    if (childIndex < length && this.compare(this.heap[childIndex], this.heap[smallest]) < 0) {
                        smallest = childIndex;
                    }
                }
                if (smallest === index) break;
                [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
                index = smallest;
            }
        }
    }
    
    class TinyQueue {
        constructor(data = [], compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) {
            this.data = data;
            this.length = this.data.length;
            this.compare = compare;
    
            if (this.length > 0) {
                for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
            }
        }
    
        push(item) {
            this.data.push(item);
            this._up(this.length++);
        }
    
        pop() {
            if (this.length === 0) return undefined;
    
            const top = this.data[0];
            const bottom = this.data.pop();
    
            if (--this.length > 0) {
                this.data[0] = bottom;
                this._down(0);
            }
    
            return top;
        }
    
        peek() {
            return this.data[0];
        }
    
        _up(pos) {
            const { data, compare } = this;
            const item = data[pos];
    
            while (pos > 0) {
                const parent = (pos - 1) >> 1;
                const current = data[parent];
                if (compare(item, current) >= 0) break;
                data[pos] = current;
                pos = parent;
            }
    
            data[pos] = item;
        }
    
        _down(pos) {
            const { data, compare } = this;
            const halfLength = this.length >> 1;
            const item = data[pos];
    
            while (pos < halfLength) {
                let bestChild = (pos << 1) + 1; // initially it is the left child
                const right = bestChild + 1;
    
                if (right < this.length && compare(data[right], data[bestChild]) < 0) {
                    bestChild = right;
                }
                if (compare(data[bestChild], item) >= 0) break;
    
                data[pos] = data[bestChild];
                pos = bestChild;
            }
    
            data[pos] = item;
        }
    }
    
    
    
    class MinHead {
        constructor(compare = (a, b) => a - b) {
            this.data = [];
            this.compare = compare
        }
        push(value) {
            this.data.push(value)
            this.shitUp(this.data.length - 1)
        }
        shitUp(index) {
            let value = this.data[index]
            while (index > 0) {
                let parentIndex = (index - 1) >> 1;
                let parent = this.data[parentIndex]
                if (this.compare(parent, value) > 0) {
                    this.data[index] = parent
                    this.data[parentIndex] = value
                    index = parentIndex
                } else {
                    break
                }
            }
        }
        siftDown(index) {
            let value = this.data[index]
            let length = this.data.length
            let halfLength = length >>> 1
            while (index < halfLength) {
    
                let leftIndex = index * 2 + 1
                let rightIndex = index * 2 + 2
                let left = this.data[leftIndex]
                let right = this.data[rightIndex]
    
    
                if (leftIndex < length && this.compare(left, value) < 0) {
                    if (rightIndex < length && this.compare(right, left) < 0) {
                        this.data[index] = right
                        this.data[rightIndex] = value
                        index = rightIndex
                    } else {
                        this.data[index] = left
                        this.data[leftIndex] = value
                        index = leftIndex
                    }
                }
                else if (rightIndex < length && this.compare(right, value) < 0) {
                    this.data[index] = right
                    this.data[rightIndex] = value
                    index = rightIndex
                } else {
                    break
                }
            }
        }
        pop() {
            if (this.data.length) {
                let value = this.data[0]
                let last = this.data.pop()
                if (value !== last) {
                    this.data[0] = last
                    this.siftDown(0)
                }
                return value
            }
        }
    }