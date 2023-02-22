if (!window.indexedDB) {
  alert('您的浏览器不支持indexedDB');
}

const request = window.indexedDB.open('vivo', 2020);

request.onsuccess = function (ev) {
  console.log('链接数据库成功！');
  const db = ev.target.result
  if (!db.objectStoreNames.contains('person')) {
    let objectStore = db.createObjectStore('person', { keyPath: 'id' });
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('email', 'email', { unique: true });

    var a = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .add({ id: 1, name: '张三', email: 'zhangsan@example.com' });

    a.onsuccess = function (event) {
      console.log('数据写入成功');
    };
  
    a.onerror = function (event) {
      console.log('数据写入失败');
    }

  }

}

request.onerror = function (ev) {
  console.log('链接数据库失败！');
};



