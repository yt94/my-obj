// 完成放大进底部缩略图效果 左右滑动 点击换图
(function() {
    // 获取相关元素
    var arrowLeft = document.querySelector('#arrowLeft');  // 左箭头按钮
    var arrowRight = document.querySelector('#arrowRight');  // 右箭头按钮
    var thumbWrapper = document.querySelector('#thumbWrapper'); // 缩略图的直接包裹元素
    var smallImage = document.querySelector('#smallZoom img');  // 小图元素
    var bigImage = document.querySelector('#bigZoom img');  // 大图元素



    // 根据数据，创建缩略图; 遍历缩略图数据
    goodData.imgsrc.forEach(function(item) {
        // 创建一个新的 img 元素
        var imgNode = new Image();
        // 给图片设置 图片地址
        imgNode.src = item.s;
        // 把图片添加到包裹元素中
        thumbWrapper.appendChild(imgNode);
    });

    // 计算每张图片需要的位置（自身的宽度（content+padding+border）+ margin-right）
    var imageWidth = thumbWrapper.firstElementChild.offsetWidth + parseInt(getStyle(thumbWrapper.firstElementChild, 'margin-right'))
    // 设置变量 规定每次滑动的距离
    var dstLen = imageWidth * 2;

    // 计算 thumbWrapper left 属性的最小值
    // 默认只能显示五张图片
    var minLeft = imageWidth * 5 - thumbWrapper.offsetWidth;

    // 点击右边按钮
    arrowRight.addEventListener('click', function() {
        // 计算 thumbWrapper left 的目标值
        var left =  thumbWrapper.offsetLeft - dstLen;
        // 判断 left 是否超出范围
        if (left < minLeft) {
            left = minLeft;
        }
        // 设置 thumbWrapper 的样式
        thumbWrapper.style.left = left + 'px';
    });

    // 点击左边按钮
    arrowLeft.addEventListener('click', function() {
         // 计算 thumbWrapper left 的目标值
         var left = thumbWrapper.offsetLeft + dstLen;
         // 判断是否超出范围
         if (left > 0) {
             left = 0;
         }
        // 设置 thumbWrapper 的样式
        thumbWrapper.style.left = left + 'px';
    });

    // 给每个缩略图 添加 click 事件
    [].forEach.call(thumbWrapper.children, function(img, index) {
        // 给每个图片 click 事件
        img.addEventListener('click', function() {
            // 设置小图的图片地址
            smallImage.src = img.src;
            // 设置大图的图片地址
            bigImage.src = goodData.imgsrc[index].b;
        });
    });


})();

// 放大镜效果
(function() {
    // 获取相关元素
    var smallZoom = document.querySelector('#smallZoom');  // 小图片的包裹元素
    var bigZoom = document.querySelector('#bigZoom'); // 大图片的包裹元素
    var opacityBox = document.querySelector('#opacityBox');  // 小图上的蒙版

    // 监听 鼠标进入 smallZoom 事件
    smallZoom.addEventListener('mouseenter', function() {
        // 大图显示
        bigZoom.style.display = 'block';
        // 蒙版显示
        opacityBox.style.display = 'block';
    });

    // 监听 鼠标离开 smallZomm 的事件
    smallZoom.addEventListener('mouseleave', function() {
        // 大图隐藏
        bigZoom.style.display = 'none';
        // 蒙版隐藏
        opacityBox.style.display = 'none';
    });

    // 添加 鼠标在 smallZoom 上移动的事件
    smallZoom.addEventListener('mousemove', function(event) {
        // 获取鼠标在 smallZoom 上的位置
        // 鼠标在视口上的位置 - 元素在视口上的位置
        var mouseLeft = event.clientX - smallZoom.getBoundingClientRect().left;
        var mouseTop = event.clientY - smallZoom.getBoundingClientRect().top;

        // 根据鼠标位置计算蒙版的位置
        var left = mouseLeft - opacityBox.offsetWidth / 2;
        var top = mouseTop - opacityBox.offsetHeight / 2;

        // 对象蒙版位置进行大小限定
        // 水平位置限定
        if (left < 0) {
            left = 0;
        } else if (left > (smallZoom.clientWidth - opacityBox.offsetWidth)) {
            left = smallZoom.clientWidth - opacityBox.offsetWidth;
        }
        // 垂直位置限定
        if (top < 0) {
            top = 0;
        } else if (top > (smallZoom.clientHeight - opacityBox.offsetHeight)) {
            top = smallZoom.clientHeight - opacityBox.offsetHeight;
        }

        // 调整蒙版的位置
        opacityBox.style.left = left + 'px';
        opacityBox.style.top = top + 'px';

        // 根据蒙版的位置调整大图的位置
        bigZoom.scrollLeft = left * 2;
        bigZoom.scrollTop = top * 2;
    });

})();

// 侧边栏选项卡效果
(function() {
    // 调用函数实现选项卡
    tab(document.querySelectorAll('#asideTabTitle span'), document.querySelectorAll('#asideTabContent .tab-item'));
})();

// 商品详情选项卡效果
(function() {
    // 调用函数实现选项卡
    tab(document.querySelectorAll('#productTabTitle span'), document.querySelectorAll('#productTabContent .tab-item'));
})();

// 商品的参数选项和价格变化
(function() {
    // 获取相关元素
    var priceBox = document.querySelector('#priceValue');  // 显示价格的元素
    var optionsBox = document.querySelector('#optionsBox'); // 参数选项的包裹元素
    var selectedBox = document.querySelector('#selectedBox');   // 选中的标签的包裹元素
    var shopcartNumInput = document.querySelector('#shopcartNum');  // 购物车数量输入框
    var plusBtn = document.querySelector('#plusBtn');  // 增加数量的按钮
    var minusBtn = document.querySelector('#minusBtn');  // 减少数量的按钮


    // 定义变量，存储被选择到的 dd. 有几组选项数组长度就是几
    var selectedArr = new Array(goodData.goodsDetail.crumbData.length);

    // 定义全局变量 记录要购买商品的数量
    var productNumbers = 1;

    // 设置价格数据
    priceBox.innerHTML = goodData.goodsDetail.price;

    // 根据数据，动态创建商品的选项信息
    // 遍历数据
    goodData.goodsDetail.crumbData.forEach(function(option, index) {
        // 创建 dl 元素
        var dlNode = document.createElement('dl');
        // 给 dl 设置一个自定义属性
        dlNode.dataset.index = index;

        // 创建 dt 元素
        var dtNode = document.createElement('dt');
        // 设置 dt 里面的内容
        dtNode.innerHTML = option.title;
        // 把 dt 添加到 dl 中
        dlNode.appendChild(dtNode);

        // 遍历数据 创建 dd
        option.data.forEach(function(item, index){
            // 创建 dd 元素
            var ddNode = document.createElement('dd');
            // 如果是每一组中的第一个 dd，默认选中状态
            if (index === 0) {
                ddNode.classList.add('active');
            }
            // 设置 dd 的内容
            ddNode.innerHTML = item.type;
            // 设置自定义属性，表示该选项的价格变化
            ddNode.dataset.changePrice = item.changePrice;
            // 把 dd 添加到 dl 中
            dlNode.appendChild(ddNode);
        });

        // 把 dl 添加到 optionsBox 中
        optionsBox.appendChild(dlNode);
    });

    // 获取所有的 optionsBox 中的 dd元素
    var ddItems = document.querySelectorAll('#optionsBox dd');
    // 遍历所以的dd，给每个 dd 元素添加 click 事件
    ddItems.forEach(function(ddItem, index) {
        // 监听事件
        ddItem.addEventListener('click', function() {
            // 排他第一步，去掉所有兄弟元素 dd 的 active 类
            this.parentElement.querySelectorAll('dd').forEach(function(item) {
                item.classList.remove('active');
            });
            // 排他第二步，当前的 dd 添加 active 类
            this.classList.add('active');
            
            // 把当前点击的dd元素设置给数组对应的成员
            selectedArr[this.parentElement.dataset.index] = this;

            // 清空 selectedBox， 清空完了再添加
            selectedBox.innerHTML = '';
            // 根据 selectedArr 给 selectedBox 添加标签元素
            selectedArr.forEach(function(ddItem, ddIndex) {
                // 判断数组成员是否有值
                if (ddItem) {
                    // 根据 ddItem 的内容创建标签元素
                    var tagEle = document.createElement('div');
                    tagEle.classList.add('selected-tag');
                    // 设置内容
                    tagEle.innerHTML = ddItem.innerHTML;
                    // 创建关闭按钮
                    var closeBtn = document.createElement('span');
                    closeBtn.classList.add('close');
                    closeBtn.innerHTML = 'X';
                    closeBtn.dataset.index = ddIndex;  // 给关闭按钮添加自定属性，值是标签元素的索引
                    tagEle.appendChild(closeBtn);

                    // 把 ddItem 添加到 selectedBox 中
                    selectedBox.appendChild(tagEle);
                }
            });
            // 计算价格
            computedPrice();
           
        });
    });

    // 通过事件委托，给标签元素中的关闭按钮监听单击事件
    selectedBox.addEventListener('click', function(event) {
        // 如果目标元素是关闭按钮
        if (event.target.className === 'close') {
            // 去关闭按钮所在标签元素
            selectedBox.removeChild(event.target.parentElement);
            
            // 对应那一组的选项，目前的dd去掉 active类型， 让第一个dd添加 active类型
            selectedArr[event.target.dataset.index].classList.remove('active');
            selectedArr[event.target.dataset.index].parentElement.children[1].classList.add('active');

            // 去掉数组中对应的 dd 元素
            selectedArr[event.target.dataset.index] = null;

            // 计算价格
            computedPrice();
        }
    });

    // 点击增加购物车数量按钮
    plusBtn.addEventListener('click', function() {
        productNumbers ++;
        shopcartNumInput.value = productNumbers;
        // 计算价格
        computedPrice();
    });

    // 点击减少购物车数量按钮
    minusBtn.addEventListener('click', function() {
        productNumbers --;
        if (productNumbers < 1) {
            productNumbers = 1;
        }
        shopcartNumInput.value = productNumbers;
        // 计算价格
        computedPrice();
    });

    // 数量输入框元素监听 change 事件
    shopcartNumInput.addEventListener('change', function() {
        // 如果输入的是不正常的内容（非数字）或是空，不进行操作
        if (!(+shopcartNumInput.value >= 1)) {
            shopcartNumInput.value = 1;
        }

        // 获取输入框中的内容
        productNumbers = Math.floor(+shopcartNumInput.value);

        // 然输入框中显示的内容与全局变量保持一致
        shopcartNumInput.value = productNumbers;

        // 计算价格
        computedPrice();
    });


    // 封装函数，计算商品价格
    function computedPrice() {
        // 获取商品的基本价格
        var price = goodData.goodsDetail.price;

        // 遍历 selectedArr 加上每个选项的价格变化
        selectedArr.forEach(function(ddItem) {
            if (ddItem) {
                price += +ddItem.dataset.changePrice;
            }
        });

        // 设置价格  单价乘上数量
        priceBox.innerHTML = price * productNumbers;

    }
    

})()