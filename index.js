/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * {time：开始时间，words：歌词内容}
 */
function parseLrc() {
    var lins = list.split('\n')
    //歌词数组
    var result = []
    for (let i = 0; i < lins.length; i++) {
        var str = lins[i]
        var parts = str.split(']')
        var timeStr = parts[0].substring(1)

        var obj = {
            time: parseTime(timeStr),
            words: parts[1]
        }
        result.push(obj)
    }
    return result
}
/**
 * 辅助函数
 * 将一个时间字符串解析为数字（秒）
 */
function parseTime(timeStr) {
    var parts = timeStr.split(':')
    return +parts[0] * 60 + +parts[1]
}

var musicdata = parseLrc();

//获取dom
var doms = {
    audio: document.querySelector('audio'),
    list: document.querySelector('.list'),
    main: document.querySelector('.main'),
}

/**
 * 计算出，当前播放器播放到几秒，musicdata哪一句歌词高亮
 * 如果没有任何一句歌词需要显示，则会返回-1
 */
function findIndex() {
    //播放器当前时间,单位：秒
    var currentTime = doms.audio.currentTime


    for (let i = 0; i < musicdata.length; i++) {
        if (currentTime < musicdata[i].time) {
            return i - 1;
        }
    }
    return musicdata.length - 1;
}
/**
 * 创建界面
 */
function createElements() {
    var flag = document.createDocumentFragment();
    for (let i = 0; i < musicdata.length; i++) {
        var li = document.createElement('li')
        li.innerText = musicdata[i].words
        flag.appendChild(li)
    }
    doms.list.appendChild(flag)
}
createElements();


//容器高度
var listHeight = doms.main.clientHeight;
var liHeight = doms.list.children[0].clientHeight;
var maxoffset = doms.list.clientHeight - doms.main.clientHeight;
/**
 * 设置ul元素的偏移量
 */
function setOffset() {
    var index = findIndex();
    var offset = liHeight * index + liHeight / 2 - listHeight / 2;
    if (offset < 0) {
        offset = 0;
    }
    if (offset > maxoffset) {
        offset = maxoffset + liHeight / 2
    }

    doms.list.style.transform = `translateY(-${offset}px)`;
    //去掉上一次active的样式
    var li = doms.list.querySelector('.active')
    if(li){
        li.classList.remove('active')
    }
    li = doms.list.children[index]
    if (li) {
        li.classList.add('active')
    }

}

doms.audio.addEventListener('timeupdate',setOffset)