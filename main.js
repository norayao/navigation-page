// Navigator 对象包含一些有关浏览器的信息，
// userAgent是该对象的一个只读属性，声明了浏览器用于 HTTP 请求的用户代理头的值
// 通过判断navigator.useragent里面是否有某些值来判断当前的客户端是什么状态
var isMobile = /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent)
const simplify_url = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '') // 删除 / 开头的内容
}
const favourites_local = JSON.parse(localStorage.getItem('fav_storage'));
const sites_local = JSON.parse(localStorage.getItem('site_storage'));
const favourites = favourites_local || [
    {title:'Github',text:'github.com',url:'https://www.github.com'},
    {title:'掘金',text:'juejin.cn',url:'https://juejin.cn/'},
    {title:'Bilibili',text:'bilibili.com',url:'https://www.bilibili.com/'},
    {title:'TED',text:'ted.com',url:'https://www.ted.com/'},
    {title:'淘宝',text:'taobao.com',url:'https://www.taobao.com/'},
    {title:'新浪微博',text:'weibo.com',url:'https://weibo.com/'},
    {title:'知乎',text:'zhihu.com',url:'https://www.zhihu.com/'},
    {title:'腾讯云',text:'cloud.tencent.com',url:'https://cloud.tencent.com/'}
]
const sites = sites_local || [
    {title:'MDB Web Docs',text:'MDM Web 文档',url:'https://developer.mozilla.org/zh-CN/'},
    {title:'Can I Use',text:'CSS 兼容性查询',url:'https://caniuse.com/'},
    {title:'BootCDN',text:'国内CDN加速',url:'https://www.bootcdn.cn/'},
    {title:'iconfont',text:'矢量图标库',url:'https://www.iconfont.cn'},
    {title:'JS Bin',text:'代码片段调试',url:'https://jsbin.com/'},
    {title:'Bootstrap',text:'开源前端框架',url:'https://getbootstrap.com/'},
    {title:'Cloudflare',text:'CDN 域名解析',url:'https://www.cloudflare.com/'},
    {title: 'Stack Overflow', text: '实用问答社区', url:'https://stackoverflow.com'}
]

const $favourites_list = $('.favourites-list');
const $sites_list = $('.sites-list');

const render = () =>{
    $favourites_list.find('div:not(.add-button)').remove();
    $sites_list.find('div').remove();
    $add_button = $('.add-button');

    favourites.forEach((node,index) =>{
        let url = node.url;
        let text = node.text;
        let title = '';
        if(isMobile){
            title = node.title[0];
            text = text.replace(/\..*/, '')
        }
        else {
            title = node.title;
        }

        const $curr_site = $(`
            <div class="site-card">
                <h3 class="site-card-title">
                    <span>${title}</span>
                </h3>
                <div class="site-card-body">
                    <p class="site-card-text">${text}</p>
                </div>
            </div>
        `)
        $curr_site.insertBefore($add_button);
        // 替代 <a>，点击跳转对应网站
        $curr_site.on('click', () => {
            window.open(url);
        });


        if(isMobile){
            let start_time = 0;
            let end_time = 0;
            $curr_site.on('touchstart',() => {
                start_time = +new Date();
                console.log(start_time);
            });
            $curr_site.on('touchend',(e) =>{
                end_time = +new Date();
                console.log(end_time);
                if ((end_time - start_time) > 500){
                    confirm_delete = confirm('确认删除？');
                    if(confirm_delete){
                        e.stopPropagation();
                        favourites.splice(index,1);
                        console.log('成功删除')
                        render();
                    }
                }
            })
        }
        else {
            let $close_button = $(`
                <div class="close">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-searchclose"></use>
                    </svg>
                </div>`);
            $curr_site.append($close_button);
            // PC端通过点击div.close删除对应标签
            $curr_site.on('click','.close',(e) =>{
                // 通过阻止冒泡，点击关闭不触发网页跳转
                e.stopPropagation();
                // 删除对应网页导航，重新渲染
                favourites.splice(index,1);
                render();
            });
        }
    });

    sites.forEach((node,index) =>{
        let url = node.url;
        let text = node.text;
        let title = node.title;

        const $curr_site = $(`
            <div class="nav-card">
                <h3 class="nav-card-title">
                    <a href="${url}/" target="_blank">${title}</a>
                </h3>
                <div class="nav-card-body">
                    <p class="nav-card-text">${text}</p>
                </div>
            </div>
        `);
        $sites_list.append($curr_site);
    });
}

// 调用渲染，显示favourites-list, sites-list
render();

$('.add-button').on('click',()=>{
    let site_title = window.prompt('请输入网站的名字：');
    let site_url = window.prompt('请输入您要添加的网址：');
    let site_text = simplify_url(site_url);
    if (site_url.indexOf('http') !== 0) {
        site_url = 'https://' + site_url
    }
    favourites.push({title:site_title,text:site_text,url:site_url});
    // 防止刷新时无法储存
    const favToString = JSON.stringify(favourites);
    localStorage.setItem('fav_storage',favToString);
    // 重新渲染
    render();
})


window.onbeforeunload = () =>{
    const favToString = JSON.stringify(favourites);
    const siteToString = JSON.stringify(site_storage);
    localStorage.setItem('fav_storage',favToString);
    localStorage.setItem('site_storage',siteToString);
}
