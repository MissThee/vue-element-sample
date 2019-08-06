const path = require('path');

function resolve(dir) {
    //此处使用path.resolve 或path.join 可自行调整
    return path.join(__dirname, dir)
}

module.exports = {
    // 打包文件输出路径，即打包到哪里
    outputDir: 'dist',
    // 静态资源地址
    assetsDir: 'static',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    filenameHashing: true, //文件hash
    // chainWebpack 这个库提供了一个 webpack 原始配置的上层抽象，使其可以定义具名的 loader 规则
    // 和具名插件，可以通过其提供的一些方法链式调用，在cli-service中就使用了这个插件
    chainWebpack: config => {
        config.resolve.alias
        // key,value自行定义，比如.set('@assets', resolve('src/assets'))
            .set('src', resolve('./src'))
    },

    /*
     configureWebpack是调整webpack配置最简单的一种方式，可以新增也可以覆盖cli中的配置。
     可以是一个对象：被 webpack-merge 合并到webpack 的设置中去
     也可以是一个函数：如果你需要基于环境有条件地配置行为，就可以进行一些逻辑处理，可以直接修改或
     新增配置，(该函数会在环境变量被设置之后懒执行)。该方法的第一个参数会收到已经解析好的配置。
     在函数内，你可以直接修改配置，或者返回一个将会被合并的对象。
   */
    publicPath: "./",
    //对象形式configureWebpack
    configureWebpack: {
        externals: {
            'BMap': 'BMap',
            'BMap_Symbol_SHAPE_POINT': 'BMap_Symbol_SHAPE_POINT'
        },
        //configureWebpack中与chainWebpack配置会合并
        // resolve: {
        //     alias: {
        //         'src': resolve('src')
        //     }
        // }
    },
    //函数形式configureWebpack
    // configureWebpack: config => {
    //     if (isProduction) {
    //     ...
    //     } else {
    //     ...
    //     };
    //     //直接修改配置
    //     config.resolve.alias['src'] = resolve('src')
    // }

}


/*
* 【history模式尚无法找到nginx带前缀时如何正确匹配路由及资源，若使用history模式，暂只能使用根目录】
* 打包配置
* 使用Nginx时
* Router中使用了history，
* Nginx配置，避免刷新404：

        location /mypage/ { #访问url前缀
             alias   "H:\\WORKWORK_TEST\\nginxpage\\";#打包文件根目录
             try_files $uri $uri/ @router;#需要指向下面的@router否则会出现vue的路由在nginx中刷新出现404
             index  index.html index.htm;#默认页面
        }
		#对应上面的@router，主要原因是路由的路径资源并不是一个真实的路径，所以无法找到具体的文件
        #因此需要rewrite到index.html中，然后交给路由在处理请求资源
        location @router {
			rewrite ^.*$ /index.html last;
        }
*
* */
