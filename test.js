/**
 * Created by choyunsung on 2016. 6. 15..
 */

var fora_rank = require('./lib/ForaRankImage');

var bbb ="insta";

switch(bbb)
{
    case "merge":
        var obj = {
            img_urls : [
                {"url":"https://storage.googleapis.com/fora_us_1/en_GB/post/f471af80-358d-11e6-9c63-ccfb0000079d/2016_06_22_17_25_51.713837.jpg","rank":1},{"url":"https://storage.googleapis.com/fora_europe_1/en_GB/post/fb33402a-38c3-11e6-9c63-ccf80000079c/2016_06_22_21_56_21.98832.png","rank":2},{"url":"https://storage.googleapis.com/fora_asia_1/ko_KR/post/76263b50-e10a-11e5-9c63-ccfa000006bb/2016_05_13_10_36_29.39514.jpg","rank":3},{"url":"https://storage.googleapis.com/fora_asia_1/ko_KR/post/5ddea8e6-efda-11e5-9c63-ccfa000006e8/2016_05_13_07_36_13.528923.jpg","rank":4},{"url":"https://storage.googleapis.com/fora_asia_1/ko_KR/post/0/2016_05_27_07_29_15.659703.jpg","rank":5},{"url":"https://storage.googleapis.com/fora_asia_1/ko_KR/post/0/2016_05_12_12_12_03.457888.jpeg","rank":6},{"url":"https://storage.googleapis.com/fora_asia_1/ko_KR/post/0/2016_05_12_11_02_09.750744.jpg","rank":7},{"url":"https://storage.googleapis.com/fora_asia_1/ko_KR/post/0/2016_05_12_12_08_07.965827.jpeg","rank":8}
            ],
            // action : ['crop','marge','all'],
            action : 'merge',
            option : 'text',
            rank : '59',
            gender : 'male' ,
            text : 'Most Beautiful Girl in US #%d',
            size : {width:150,height:150},
            file_name : 'selfie_ranking_top_8.jpg' ,
            gcloud : '0/selfie_rank/',
            path : '/tmp/',
            bucket : 'fora_asia_temp_1',
            cdn: 'https://storage.googleapis.com'

        }


        fora_rank.rankingimage(obj,function(error,result){
            if(error)
            {

            }else{
                console.log(result);
            }

        });
        break;
    case "crop":

        var obj = {
            img_urls : [
                {url:'https://storage.googleapis.com/fora_asia_1/ko_KR/post/0/2016_06_14_03_23_41.186227.jpg',rank:1},
                {url:'https://storage.googleapis.com/fora_us_1/en_US/post/53924f56-2b70-11e6-9c63-ccfb00000795/2016_06_15_03_28_44.518284.jpg',rank:2},
                {url:'https://storage.googleapis.com/fora_us_1/en_US/post/26c179d6-32a3-11e6-9c63-ccfb0000079d/2016_06_15_02_56_04.469532.jpg',rank:3},
                {url:'https://storage.googleapis.com/fora_us_1/en_US/post/97674846-3280-11e6-9c63-ccf80000079d/2016_06_14_22_39_50.822359.jpg',rank:4},
                {url:'https://storage.googleapis.com/fora_us_1/en_US/post/4863fe74-26c3-11e6-9c63-ccfa00000793/2016_05_31_00_08_02.949034.jpg',rank:5},
                {url:'https://storage.googleapis.com/fora_us_1/en_US/post/5994742e-2774-11e6-9c63-ccf800000795/2016_06_13_20_25_01.722969.jpg',rank:6},
                {url:'https://storage.googleapis.com/fora_europe_1/en_GB/post/c0f77652-2fee-11e6-9c63-ccfb00000796/2016_06_11_18_36_04.360175.jpg',rank:7},
                {url:'https://storage.googleapis.com/fora_us_1/en_US/post/6698b574-277c-11e6-9c63-ccf800000795/2016_05_31_22_11_51.834315.jpg',rank:8},
                // {url:'https://storage.googleapis.com/fora_us_1/en_US/post/f95cfe7c-2067-11e6-9c63-ccfb00000783/2016_05_31_19_51_54.26896.jpg',rank:9},
                // {url:'https://storage.googleapis.com/fora_us_1/en_US/post/0a600c30-281c-11e6-9c63-ccfb00000795/2016_06_10_17_59_08.554973.jpg',rank:10},
                // {url:'https://storage.googleapis.com/fora_us_1/en_US/post/0a600c30-281c-11e6-9c63-ccfb00000795/2016_06_13_19_26_42.613114.jpg',rank:11},
            ],
            // action : ['crop','marge','all'],
            action : 'crop',
            option : 'text',
            rank : '1',
            text : 'Most Beautiful Girl in US #%d',
            size : {width:300,height:300},
            file_name : 'test.jpg' ,
            gender : 'male' ,
            gcloud : '0/selfie_rank/post/',
            path : '/tmp/',
            bucket : 'fora_asia_temp_1',
            cdn: 'https://storage.googleapis.com'

        }
        
        fora_rank.postimage(obj,function(error,result){
            if(error)
            {

            }else{
                console.log(result);
            }

        });
        break;
    case "insta":

        var obj = {
            img_urls : [
                {url:'https://storage.googleapis.com/fora_asia_1/ko_KR/post/0/2016_06_14_03_23_41.186227.jpg',rank:1},
                {url:'https://storage.googleapis.com/fora_us_1/en_US/post/53924f56-2b70-11e6-9c63-ccfb00000795/2016_06_15_03_28_44.518284.jpg',rank:2},
                {url:'https://storage.googleapis.com/fora_us_1/en_US/post/26c179d6-32a3-11e6-9c63-ccfb0000079d/2016_06_15_02_56_04.469532.jpg',rank:3},
                {url:'https://storage.googleapis.com/fora_us_1/en_US/post/97674846-3280-11e6-9c63-ccf80000079d/2016_06_14_22_39_50.822359.jpg',rank:4},
                {url:'https://storage.googleapis.com/fora_us_1/en_US/post/4863fe74-26c3-11e6-9c63-ccfa00000793/2016_05_31_00_08_02.949034.jpg',rank:5},
                {url:'https://storage.googleapis.com/fora_us_1/en_US/post/5994742e-2774-11e6-9c63-ccf800000795/2016_06_13_20_25_01.722969.jpg',rank:6},
                {url:'https://storage.googleapis.com/fora_europe_1/en_GB/post/c0f77652-2fee-11e6-9c63-ccfb00000796/2016_06_11_18_36_04.360175.jpg',rank:7},
                {url:'https://storage.googleapis.com/fora_us_1/en_US/post/6698b574-277c-11e6-9c63-ccf800000795/2016_05_31_22_11_51.834315.jpg',rank:8},
                // {url:'https://storage.googleapis.com/fora_us_1/en_US/post/f95cfe7c-2067-11e6-9c63-ccfb00000783/2016_05_31_19_51_54.26896.jpg',rank:9},
                // {url:'https://storage.googleapis.com/fora_us_1/en_US/post/0a600c30-281c-11e6-9c63-ccfb00000795/2016_06_10_17_59_08.554973.jpg',rank:10},
                // {url:'https://storage.googleapis.com/fora_us_1/en_US/post/0a600c30-281c-11e6-9c63-ccfb00000795/2016_06_13_19_26_42.613114.jpg',rank:11},
            ],
            // action : ['crop','marge','all'],
            // action : 'insta',
            action : 'crop',
            option : 'text',
            rank : '10',
            gender : 'male' ,
            text : 'Most Beautiful Girl in US #%d',
            size : {width:300,height:300},
            file_name : 'test.jpg' ,
            gcloud : '0/selfie_rank/post/',
            path : '/tmp/',
            bucket : 'fora_asia_temp_1',
            cdn: 'https://storage.googleapis.com'

        }

        fora_rank.postimage(obj,function(error,result){
            if(error)
            {

            }else{
                console.log(result);
            }

        });
        break;
}

