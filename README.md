## json-transfer
- use path to update json

- support wildcard *

### install
```
   npm install json-transfer --save
```

### usage
* parameter: `jsonTrans(json={}, rules=[])`
    - json: the object you want to update, can be null;
    - rules: use rule in pairs mode, `[jsonPath, value]]`, like: 
    ```
    [['a.c', 0], ['a.b.d', 5]]
    ```
        - jsonPath: 'a.b.c', 'a.0.k', '', 'a.*.d'
        - value: can be any value

* example
```
   const jsonTrans = require('json-transfer');
   let json = jsonTrans({
      errno: 0,
      data: [{
        id: 1,
        name: 'kino'
      },{
        id: 2,
        name: 'lee'
      }]
    }, [
        ['data.*.id', '3'],
        ['data.2.name', 'xuan']
    ]);
```

### test
```
   npm test
```
