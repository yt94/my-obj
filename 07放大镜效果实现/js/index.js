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