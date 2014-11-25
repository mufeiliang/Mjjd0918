/**
 * Created by lan on 2014/7/10.
 */

(function(){
    ccb.ParticleStyle=Class({
        /**
         * 是否播放动画
         */
        loop:false,

        /**
         * 设置动画片段名称
         */
        tileName:null,

        /**
         * 跳转到第几帧
         */
        gotoFrame:0,

        /*
         *粒子X随机范围
         */
        scopeX:2,

        /**
         * 粒子Y随机范围
         */
        scopeY:2,

        /**
         * 粒子的X轴比例
         */
        scaleX:1,

        /**
         * 粒子的Y轴比例
         */
        scaleY:1.3,

        /**
         * 粒子X比例缩放值
         */
        addScaleX:-.06,

        /**
         * 粒子Y比例缩放值
         */
        addScaleY:-.08,

        /**
         * 粒子透明度
         */
        a:1,

        /**
         * 粒子红色通道值
         */
        r:.5,

        /**
         * 粒子绿色通道值
         */
        g:.8,

        /**
         * 粒子蓝色通道值
         */
        b: 1,

        /**
         * 粒子角度递增值
         */
        angle:0,

        /**
         * 粒子初始化角度
         */
        rotation:Math.PI/180*-90.0,

        /**
         * 粒子随机角度
         */
        rotationRandom:0,

        /**
         * 粒子运动速度
         */
        speed:5,

        /**
         * 粒子初始化透明度
         */
        alpha:1,
         /**
         * 粒子透明度递增
         */
        addAlpha:-0.08,
        /**
         * 粒子递增红色通道值
         */
        addR :.3,

        /**
         * 粒子递增绿色通道值
         */
        addG : .02,

        /**
         * 粒子递增蓝色通道值
         */
        addB :-.003,

        /**
         * 粒子递增透明度
         */
        addA :-.08

    })
})();



(function(){
    ccb.Style_HY=Class({
        /**
         * 是否播放动画
         */
        loop:false,

        /**
         * 设置动画片段名称
         */
        tileName:null,

        /**
         * 跳转到第几帧
         */
        gotoFrame:0,

        /*
         *粒子X随机范围
         */
        scopeX:0,

        /**
         * 粒子Y随机范围
         */
        scopeY:0,

        /**
         * 粒子的X轴比例
         */
        scaleX:1,

        /**
         * 粒子的Y轴比例
         */
        scaleY:1,

        /**
         * 粒子X比例缩放值
         */
        addScaleX:-.005,

        /**
         * 粒子Y比例缩放值
         */
        addScaleY:-.01,

        /**
         * 粒子透明度
         */
        a:1,

        /**
         * 粒子红色通道值
         */
        r:.5,

        /**
         * 粒子绿色通道值
         */
        g:.8,

        /**
         * 粒子蓝色通道值
         */
        b: 1,

        /**
         * 粒子角度递增值
         */
        angle:0,

        /**
         * 粒子初始化角度
         */
        rotation:Math.PI/180*90.0,

        /**
         * 粒子随机角度
         */
        rotationRandom:0,

        /**
         * 粒子运动速度
         */
        speed:0,

        /**
         * 粒子递增红色通道值
         */
        addR :.3,

        /**
         * 粒子递增绿色通道值
         */
        addG : .02,

        /**
         * 粒子递增蓝色通道值
         */
        addB :-.003,

        /**
         * 粒子递增透明度
         */
        addA :-0.02

    })
})();