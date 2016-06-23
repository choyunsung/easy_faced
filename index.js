/**
 * Created by choyunsung on 2016. 6. 15..
 */

var path = require('path');
var _app_dir = path.dirname(require.main.filename);

try {
    var Faced = require(_app_dir + '/lib/faced/faced.js'),
        faced = new Faced();
}catch (e){
    var faced = false;
}
var fs = require('fs'),
    sprintf= require('sprintf').sprintf,
    vsprintf= require('sprintf').vsprintf,
    request = require('request'),
    easyimg = require(_app_dir+'/lib/easyimage'),
    googleStorage = require(_app_dir+'/lib/GoogleStorage')(),
    async = require('async')

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        // console.log('content-type:', res.headers['content-type']);
        // console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

var splitUri = function(uri) {

    var splitted = uri.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
    // return (splitted)?true:false;
    var _return = splitted;
    _return.status = (splitted[1])?true:false;
    return _return;
};

function rankingimage(obj,callfinished)
{

    function iamge_reformat(obj,image)
    {
        var _org_img = {
            width : image.width(),
            height : image.height(),
        }

        var _face_rt = {
            x:0,
            y:0,
            width:0,
            height:0,
            cropwidth:0,
            cropheight:0,
            org_width:image.width(),
            org_height:image.height()
        }

        // 다수의 얼굴일 경우 처리
        for(var i in obj)
        {
            var face = obj[i];

            if(face)
            {
                _face_rt.x = face.getX()
                _face_rt.y = face.getY()
                _face_rt.width = face.getWidth()
                _face_rt.height = face.getHeight()
            }

        }

        return _face_rt;
    }


    if(obj) {

        function cropimage(hhh,callback)
        {
            console.log('CROP:',hhh);
            easyimg.cropresize(hhh).then(
                function(image) {
                    
                    try{
                        fs.unlinkSync(hhh.src);
                    }catch (e){}
                    callback();
                },
                function (err) {
                    console.log(err);
                }
            );

        }
        var item = [];
        async.forEach(obj.img_urls ,function (fpath , callback) {
            var path = fpath.url;
            var _indexing = Number(fpath.rank) -1;
            var _check_img = splitUri(path);
            if(_check_img.status)
            {

                var _img_path = _check_img[3].split('/');
                var _file_name = _img_path[Math.ceil(_img_path.length -1 )];
                var _resize_name = 're_'+_file_name;
                item[_indexing] = obj.path + _resize_name;
                
                download( path, obj.path + _file_name , function(){

                    try{
                        faced.detect( obj.path + _file_name , function (faces, image, file ) {
                            console.log(_file_name, image.width(),image.height(),image)
                            if (!faces || faces.length == 0 ) {

                                var hhh = {
                                    src: obj.path + _file_name, dst: obj.path + _resize_name,
                                    cropwidth: image.width(), cropheight: image.height() ,
                                    width: obj.size.width, height:obj.size.height,
                                    x: 0  , y: 0,
                                    files : {
                                        width: image.width(),
                                        height: image.height()
                                    },
                                };

                                cropimage(hhh,function(){
                                    callback();
                                })



                            }else{

                                var face = iamge_reformat(faces,image);
                                if(face.width > obj.size.width || face.height > obj.size.height )
                                {
                                    var sizeOf = require('image-size');
                                    var dimensions = sizeOf(obj.path + _file_name);
                                    var hhh = {
                                        src: obj.path + _file_name, dst: obj.path + _resize_name,
                                        cropwidth: dimensions.width, cropheight: dimensions.width ,
                                        width: obj.size.width, height:obj.size.height,
                                        x:0  , y: 0,
                                        files : {
                                            width:dimensions.width,
                                            height:dimensions.height,
                                        }
                                    };

                                    cropimage(hhh,function(){
                                        callback();
                                    })

                                }else{

                                    var hhh = {
                                        src:obj.path + _file_name, dst: obj.path + _resize_name,
                                        cropwidth: face.org_width, cropheight: face.org_width ,
                                        width: obj.size.width, height:obj.size.height,
                                        x: face.x  , y: 0,
                                        files : {
                                            width: image.width(),
                                            height: image.height()
                                        },
                                    };

                                    cropimage(hhh,function(){
                                        callback();
                                    })

                                }
                            }

                        });
                        callback();

                    }catch (e){

                        var sizeOf = require('image-size');
                        var dimensions = sizeOf(obj.path + _file_name);
                        var hhh = {
                            src: obj.path + _file_name, dst: obj.path + _resize_name,
                            cropwidth: dimensions.width, cropheight: dimensions.width ,
                            width: obj.size.width, height:obj.size.height,
                            x:0  , y: 0,
                            files : {
                                width:dimensions.width,
                                height:dimensions.height,
                            }
                        };

                        cropimage(hhh,function(){
                            callback();
                        })
                        callback();
                    }

                });

            }// end try catch

        },function(){

            var args = {
                dst : obj.file_name,
                action : obj.action,
                gender : obj.gender,
                list : []
            }

            console.log(item);
            
            args.list = item;
            
            setTimeout(function(){
                easyimg.appendimg(args).then(
                    function(image) {

                        var dest_base_path = obj.gcloud;
                        var new_original_name = obj.file_name;
                        var bucket_name = obj.bucket;

                        var file_path = args.dst;

                        googleStorage.upload(obj.path + file_path, dest_base_path + new_original_name , bucket_name, true, function(error, new_bucket_path){

                            if(error){
                                callfinished(error);
                            }
                            else {
                                try{
                                    for(var k in item)
                                    {
                                        fs.unlinkSync(item[k]);
                                    }
                                    fs.unlinkSync(obj.path + file_path);
                                }catch (e){}

                                callfinished(null,obj.cdn + new_bucket_path);
                            }

                        });


                    },
                    function (err) {
                        console.log(err);
                    }
                );
            }, 2000);

        });
    }


}

function postimage(obj,callfinished)
{

    function iamge_reformat(obj,image)
    {
        var _org_img = {
            width : image.width(),
            height : image.height(),
        }

        var _face_rt = {
            x:0,
            y:0,
            width:0,
            height:0,
            cropwidth:0,
            cropheight:0,
            org_width:image.width(),
            org_height:image.height()
        }

        for(var i in obj)
        {
            var face = obj[i];

            if(face)
            {
                _face_rt.x = face.getX()
                _face_rt.y = face.getY()
                _face_rt.width = face.getWidth()
                _face_rt.height = face.getHeight()
            }

        }

        return _face_rt;
    }


    if(obj) {

        function cropimage(hhh,callback)
        {
            easyimg.cropresize(hhh).then(
                function(image) {
                    console.log('Resized : ' , image);
                    try{
                        fs.unlinkSync(hhh.src);
                    }catch (e){}
                    callback();
                },
                function (err) {
                    console.log(err);
                }
            );

        }
        var item = [];

        obj.img_urls = [obj.img_urls[0]];
        
        
        async.forEach( obj.img_urls ,function (fpath , callback) {
            var path = fpath.url;
            var _check_img = splitUri(path);
            if(_check_img.status)
            {

                var _img_path = _check_img[3].split('/');
                var _file_name = _img_path[Math.ceil(_img_path.length -1 )];
                
                
                download( path, obj.path + _file_name , function(){

                    var _resize_name = 're_'+_file_name;

                    item.push(obj.path + _resize_name);

                    try{

                        faced.detect( obj.path + _file_name , function (faces, image, file ) {
                            
                            if (!faces || faces.length == 0 ) {
                                if( faces == undefined )
                                {
                                    var sizeOf = require('image-size');
                                    var dimensions = sizeOf(obj.path + _file_name);
                                    var hhh = {
                                        src: obj.path + _file_name, dst: obj.path + _resize_name,
                                        cropwidth: dimensions.width, cropheight: dimensions.width ,
                                        width: obj.size.width, height:obj.size.height,
                                        x:0  , y: 0,
                                        files : {
                                            width:dimensions.width,
                                            height:dimensions.height,
                                        }
                                    };

                                    cropimage(hhh, function () {
                                        callback();
                                    })
                                    
                                }else {

                                    var hhh = {
                                        src: obj.path + _file_name, dst: obj.path + _resize_name,
                                        cropwidth: image.width(), cropheight: image.height(),
                                        width: obj.size.width, height: obj.size.height,
                                        x: 0, y: 0,
                                        files: {
                                            width: image.width(),
                                            height: image.height(),
                                        }

                                    };

                                    cropimage(hhh, function () {
                                        callback();
                                    })
                                    
                                }



                            }else{

                                var face = iamge_reformat(faces,image);

                                var hhh = {
                                    src:obj.path + _file_name, dst: obj.path + _resize_name,
                                    cropwidth: face.org_width, cropheight: face.org_width ,
                                    width: obj.size.width, height:obj.size.height,
                                    x: face.x  , y: 0,
                                    files : {
                                        width:image.width(),
                                        height:image.height(),
                                    }
                                    
                                };

                                cropimage(hhh,function(){
                                    callback();
                                })
                            }

                        });
                        callback();

                    }catch (e){

                        var sizeOf = require('image-size');
                        var dimensions = sizeOf(obj.path + _file_name);
                        var hhh = {
                            src: obj.path + _file_name, dst: obj.path + _resize_name,
                            cropwidth: dimensions.width, cropheight: dimensions.width ,
                            width: obj.size.width, height:obj.size.height,
                            x:0  , y: 0,
                            files : {
                                width:dimensions.width,
                                height:dimensions.height,
                            }
                        };

                        cropimage(hhh,function(){
                            callback();
                        })
                        callback();
                    }

                });

            }
        },function(){

            var args = {
                dst : obj.file_name,
                path : obj.path,
                action : obj.action,
                gender : obj.gender,
                list : []
            }

            args.list = item[0];
            
            // console.log(args);
            
            setTimeout(function(){
                
                easyimg.post_ranking( args , obj.rank ).then(
                    function(image) {
            
                        var dest_base_path = obj.gcloud;
                        var new_original_name = obj.file_name;
                        var bucket_name = obj.bucket;
            
                        var file_path = args.dst;
                        
                        googleStorage.upload( args.list , dest_base_path + new_original_name , bucket_name, true, function(error, new_bucket_path){
                           
                            if(error){
                                callfinished(error);
                            }
                            else {
                               
                                try{
                                    for(var k in item)
                                    {
                                        fs.unlinkSync(item[k]);
                                    }
                                    fs.unlinkSync(file_path);
                                }catch (e){}
                        
                                callfinished(null,obj.cdn + new_bucket_path);
                            }
                        
                        });
            
            
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            }, 2000);
            
        });
    }
         

}


module.exports.rankingimage = rankingimage;
module.exports.postimage = postimage;