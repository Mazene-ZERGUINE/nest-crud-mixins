
# NestJS CRUD MIXINS





[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)





### Overview

A CRUD Mixins Library for NestJS provides an automated and modular CRUD solution by leveraging abstract controllers and generic services.

it was inspired by Django's viewsets and mixins, this library simplifies the creation of standard CRUD endpoints in a NestJS RESTfull API with typeORM

It eliminates repetitive boilerplate by allowing developers to extend predefined generic controllers and services, automatically handling CRUD operations, validation, DTOS transformations, and filltring





## Features

- **Dynamic Endpoints Generation**: Automatically creates RESTful CRUD endpoints for entities.

- **DTO Validation**: Ensures DTO validation is applied seamlessly with NestJS Validation Pipes.

- **DTO Transformation & Custom Responses**: Supports transforming DTOs for responses and allows custom response formats.

- **Dynamic Entity Relationships**: Automatically manages entity relationships

- **Customizable Query Filtering & Pagination**: Enables filtering and pagination at the controller level for CRUD operations.

- **Method Overriding Support**: Allows controllers to override default methods for customization.

- **Flexible Controller Configuration**: Allows fine-tuned control over CRUD behavior by extending controllers

## Requirements
- Node.js (>= 18.x recommended)

- NestJS (>= 11.x)
- TypeScript (>= 5.x)
- TypeORM (>= 0.3.x)



## Installation

To use the CRUD mixins library, install it as a package within your NestJS project

```bash
  npm i --save @nestjs/typeorm typeorm
  npm i nestjs-crud-mixins
```

## Quick start

**1. Create your entity class and your dto classes**

```ts
// user.entity.ts

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}


export class UpdateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;
}
```

**2. configure your typeOrm connection in your app.module.ts**
```ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'db_user',
      password: 'db_password',
      database: 'db_name',
      entities: [UserEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**3. Create your service class**
```ts
@Injectable()
export class UserService extends MixinsCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, // Inject the user repository
  ) {
    super(userRepository, new UserEntity()); // Pass the repository to the base CRUD service
  }
}

``` 
**4. and finally create the controller class**
```ts
@Controller('/users') // Define the base route for the controller
@CreateDto(CreateUserDto) // Assign the DTO for creating users
@UpdateDto(UpdateUserDto) // Assign the DTO for updating users
export class UserController extends MixinsCrudController<UserEntity, UserService> {
  constructor(private readonly userService: UserService) {
    super(userService, new UserEntity()); // Pass service and entity instance to the base controller
  }
}
```

Once the setup is complete, the following **RESTful endpoints** are automatically generated:

| Method   | Endpoint      | Description                  | Request Body         |
|----------|--------------|------------------------------|----------------------|
| **GET**  | `/users`     | Fetch all users             | ❌ (None)           |
| **GET**  | `/users/:id` | Fetch a specific user by ID | ❌ (None)           |
| **POST** | `/users`     | Create a new user           | ✅ `CreateUserDto`  |
| **PATCH**| `/users/:id` | Update an existing user     | ✅ `UpdateUserDto`  |
| **DELETE** | `/users/:id` | Delete a user by ID        | ❌ (None)           |

## Documentation

- **[Relations](#relations)**
- **[Custom Responses](#custom-responses)**
- **[Filtering Queries](#filtering-queries)**
- **[Soft Delete](#soft-delete)**
- **[Pagination](#pagination)**

#### Relations

To define relationships, use TypeORM decorators like `@OneToMany`, `@ManyToOne`, and `@ManyToMany`. extends the `CrudMixinsEntity` class then define the entity relation that will be handled dynamicly by the service

```ts
@Entity('users')
export class UserEntity extends MixinsCrudEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  profile: ProfileEntity;

  constructor() {
    super();
    // Call the setRelations methode with an array of the entity relations
    this.setRelations(['profile']);
  }
```


#### Custom Responses

By default the controllers return the entity object as a response for GET and POST requests however it is possible to customize this response using the `@ResponseDto`decorators

```ts
// DTO 
export class ResponseUserDto {
  @Expose()  // ensure to add the @Expose controller for the mapping process 
  id: number;

  @Expose()
  username: string;
}

// Controller
@Controller('/users')
@ResponseDto(ResponseUserDto). // Add your ResponseDto at controller level  
@CreateDto(CreateUserDto)
@UpdateDto(UpdateUserDto)
export class AppController extends MixinsCrudController<
  UserEntity,
  AppService
> {
  constructor(private readonly appService: AppService) {
    super(appService, new UserEntity());
  }
}
```

In case of different Response DTOS for different routes the decorator can be used at methode level

```ts
@Controller('/users')
@CreateDto(CreateUserDto)
@UpdateDto(UpdateUserDto)
export class AppController extends MixinsCrudController<
  UserEntity,
  AppService
> {
  constructor(private readonly appService: AppService) {
    super(appService, new UserEntity());
  }
  @Get('active')
  @ResponseDto(ResponseUserDto)
  async getActiveUsers(): Promise<UserEntity[]> {
    // implimentation 
  }
}

```

It is also possible to customize the response format

```ts
@Controller('/users')
@ResponseDto(ResponseUserDto, (data) => ({
  message: 'User List',
  data: data,
}))
@CreateDto(CreateUserDto)
@UpdateDto(UpdateUserDto)
export class AppController extends MixinsCrudController<
  UserEntity,
  AppService
> {
  constructor(private readonly appService: AppService) {
    super(appService, new UserEntity());
  }
}

```
this returns a response on the format and can handel dynamicly arrays of data

```json
{
    "message": "user retrived",
    "success": "true",
    "data": {
        "username": "username",
        "email": "email"
    }
}
```


#### Filtering Queries

it is possible to configure the filtering logic globaly on the controller level using `FilterOptions` and `FilterOptionsBuilder` on controller level or in methods

```ts
@Controller('/users')
@ResponseDto(ResponseUserDto)
@CreateDto(CreateUserDto)
@UpdateDto(UpdateUserDto)
export class AppController extends MixinsCrudController<
  UserEntity,
  AppService
> {
  // Filtring by id and selection username and id 
  filterOptions = new FilterOptionsBuilder()
    .setOrderBy([{ field: 'id', order: 'DESC' }])
    .setSelectFields(['username', 'id'])
    .build();

  constructor(private readonly appService: AppService) {
    super(appService, new UserEntity());
  }

  @Get('active')
  @ResponseDto(ResponseUserDto)
  async getActiveUsers(): Promise<ResponseUserDto> {
    // filtering active users 
    const filterOptions = new FilterOptionsBuilder()
      .setSearch(['active'], 'true')
      .build();
    return this.appService.findAllEntities(filterOptions);
  }
}
```


#### Soft delete

For soft delete add the option `includeDeleted` to true in the filtering options

```ts
filterOptions = new FilterOptionsBuilder()
    .setIncludeDeleted(true)
    .build();
```




## 👨‍💻 Author

**Mazene ZERGUINE**  
🚀 GitHub: [Mazene-ZERGUINE](https://github.com/Mazene-ZERGUINE)  
📧 Email: [mmazenezerguine@gmail.com](mailto:mmazenezerguine@gmail.com)

Feel free to reach out for any **questions, suggestions, or collaborations!** 😊

## 📝 Feedback

If you have **any suggestions, feature requests, or issues**, please feel free to:
- **📩 Open an issue:** [GitHub Issues](https://github.com/Mazene-ZERGUINE/nest-crud-mixins/issues)
- **📧 Contact me directly:** [mmazenezerguine@gmail.com](mailto:mmazenezerguine@gmail.com)

Your feedback is highly appreciated! 🚀
## 🤝 Contributing

Contributions are **welcome and encouraged!** 🎉

