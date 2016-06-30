const qiniu = require("qiniu");
const glob = require('glob');

let qiniuAccessKey = process.argv.slice(2, 3);
let qiniuSecretKey = process.argv.slice(3);

qiniu.conf.ACCESS_KEY = qiniuAccessKey;
qiniu.conf.SECRET_KEY = qiniuSecretKey;
bucket = 'mvc-linesh-tw';

console.log('QINIU_ACCESS_KEY: ' + qiniu.conf.ACCESS_KEY);
console.log('QINIU_SECRET_KEY: ' + qiniu.conf.SECRET_KEY);
console.log('BUCKET: ' + bucket);

console.log('below should get executed: ');

const uploadingBookDirectory = glob.sync('_book/**/*.*', {}).split(',').map(name => name.substring(0, 6))

console.log('all: ' + uploadingBookDirectory);
//
// all.foreach(file => {
//     let key = file.substring(9, file.length);
//     console.log('key:' + key);
//     let token = uptoken(bucket, key);
//     console.log('token:' + token);
//     uploadFile(token, key, file)
// })

function uptoken(bucket, key) {
  return new qiniu.rs.PutPolicy(bucket + ":" + key).token(); // ':' means allow override upload
}


//构造上传函数
function uploadFile(uptoken, key, localFile) {
  var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        console.log('=====================Upload Success======================');
        console.log(ret.hash, ret.key, ret.persistentId);
      } else {
        // 上传失败， 处理返回代码
        console.log('==========================Boom===========================');
        console.log(err);
      }
  });
}
