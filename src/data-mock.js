import Mock from 'mockjs';
import axios from 'axios';

let source_id = 0;

let source = {};
axios.get("./source.json").then(res=>{
    source = res.data;
});

//可读--返回一条数据
Mock.mock(RegExp('/read_source$'),'get',function(){
    let temp = Object.assign({},source);
    temp.permission = "Read";
    temp.source_id = ++source_id;
    temp.response = "";
    return temp;
});

//可写--返回一条数据
Mock.mock(RegExp('/write_source$'),'get',function(){
    let temp = Object.assign({},source);
    temp.permission = "Write";
    temp.source_id = ++source_id;
    return temp;
});

// 可读-可写--多条数据
Mock.mock(RegExp("/source$"),'get',function(){
    let arr = [];
    let temp = {};
    for(let i=0;i<4;i++){
        temp = Object.assign({},source);
        
        if(i%2==1){
            temp.permission = "Read";
            temp.response = "";
        }else{
            temp.permission = "Write";
        }
        temp.source_id = ++source_id;
        arr.push(temp);
    }
    return arr;
});

