MongoDB 쉘인 `mongosh`를 사용하여 MongoDB와 상호작용하는 방법은 매우 간단합니다. 여기서 몇 가지 기본적인 명령어들을 소개하겠습니다.

### 1. **데이터베이스 보기**

현재 MongoDB 서버에 있는 모든 데이터베이스를 나열하려면:

```shell
show dbs
```

### 2. **데이터베이스 선택 또는 생성**

사용할 데이터베이스를 선택하거나 새로운 데이터베이스를 생성하려면:

```shell
use myDatabase
```

이 명령어는 `myDatabase`라는 이름의 데이터베이스로 이동하거나, 해당 데이터베이스가 없다면 새로 생성합니다.

### 3. **컬렉션 보기**

현재 데이터베이스의 모든 컬렉션을 나열하려면:

```shell
show collections
```

### 4. **문서 삽입**

컬렉션에 새 문서를 삽입하려면:

```shell
db.myCollection.insertOne({ name: "Alice", age: 25 })
```

또는 여러 문서를 삽입하려면:

```shell
db.myCollection.insertMany([
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 }
])
```

### 5. **문서 찾기**

컬렉션에서 문서를 찾으려면:

```shell
db.myCollection.find()
```

특정 조건을 가진 문서를 찾으려면:

```shell
db.myCollection.find({ name: "Alice" })
```

### 6. **문서 업데이트**

컬렉션의 문서를 업데이트하려면:

```shell
db.myCollection.updateOne({ name: "Alice" }, { $set: { age: 26 } })
```

여러 문서를 업데이트하려면:

```shell
db.myCollection.updateMany({ age: { $lt: 30 } }, { $set: { young: true } })
```

### 7. **문서 삭제**

컬렉션에서 문서를 삭제하려면:

```shell
db.myCollection.deleteOne({ name: "Alice" })
```

여러 문서를 삭제하려면:

```shell
db.myCollection.deleteMany({ age: { $lt: 30 } })
```

### 8. **컬렉션 삭제**

컬렉션 자체를 삭제하려면:

```shell
db.myCollection.drop()
```

### 9. **데이터베이스 삭제**

현재 사용 중인 데이터베이스를 삭제하려면:

```shell
db.dropDatabase()
```

### 10. **도움말 보기**

MongoDB 쉘에서 사용할 수 있는 명령어들에 대한 도움말을 보려면:

```shell
help
```

이 명령어들로 MongoDB에서 기본적인 CRUD(생성, 읽기, 업데이트, 삭제) 작업을 수행할 수 있습니다. 더 복잡한 쿼리나 관리 작업을 수행하려면 공식 문서를 참고하거나, 추가적인 질문을 해주세요!
