import Mock from 'mockjs';
import axios from 'axios';

let i = 0;

let source = {};
axios.get("./source.json").then(res=>{
    source = res.data;
});

//可读--返回一条数据
Mock.mock(RegExp('/read_source$'),'get',function(){
    source.permission = "Write";
    source.source_id = ++i;
    return source;
});

//可写--返回一条数据
Mock.mock(RegExp('/write_source$'),'get',function(){
    source.permission = "Write";
    return source;
});

// 可读-可写--多条数据
Mock.mock(RegExp("/source$"),'get',function(){
    let arr = [];
    for(let i=0;i<8;i++){
        console.log(i%2==0,i%2)
        if(i%2>0){
            source.permission = "Read";
        }else{
            source.permission = "Write";
        }
        arr.push(source);
    }
    return arr;
});

