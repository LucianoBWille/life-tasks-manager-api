import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { SigninDto } from 'src/auth/dto/signin.dto';
import { EditUserDto } from 'src/user/dto';
import { EditTaskDto } from 'src/task/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    console.log("DB CLEANED");

    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(async () => {
    // await prisma.cleanDb();
    app.close();
  });
  
  describe('Auth', () => {
    const dto: AuthDto = {
      name: 'banana',
      email: 'banana@gmail.com',
      password: '123',
    };
    describe('sign up', () => {
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if name empty', () => {
        const { name, ...dtoWithoutName } = dto;
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dtoWithoutName)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if email empty', () => {
        const { email, ...dtoWithoutEmail } = dto;
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dtoWithoutEmail)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if email invalid', () => {
        const dtoWithInvalidEmail = {
          ...dto,
          email: 'banana',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dtoWithInvalidEmail)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if password empty', () => {
        const { password, ...dtoWithoutPassword } = dto;
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dtoWithoutPassword)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should sign up a user and return a jwt token', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withJson(dto)
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('sign in', () => {
      const signinDto: SigninDto = {
        email: dto.email,
        password: dto.password,
      };
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: signinDto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: signinDto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinDto)
          .expectStatus(HttpStatus.OK)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Edit user', () => {
      const dto: EditUserDto = {
        name: 'Apple',
        email: 'apple@gmail.com',
      };
      it('should throw if no access-token provided', () => {
        return pactum.spec()
          .patch('/users')
          .withBody(dto)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should throw if access-token invalid', () => {
        return pactum.spec()
          .delete('/users/me')
          .withHeaders({
            Authorization: 'Bearer ALGUMA_COISA_AQUI',
          })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.email);
      });
    });

    describe('delete user', () => {
      it('should throw if no access-token provided', () => {
        return pactum.spec()
          .delete('/users/me')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should throw if access-token invalid', () => {
        return pactum.spec()
          .delete('/users/me')
          .withHeaders({
            Authorization: 'Bearer ALGUMA_COISA_AQUI',
          })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      describe('should delete user', () => {
        const deleteUserDto: any = {
          name: 'kamikaze',
          email: 'kamikaze@gmail.com',
          password: '123',
        }

        it('create user', () => {
          return pactum.spec()
            .post('/auth/signup')
            .withBody(deleteUserDto)
            .expectStatus(HttpStatus.CREATED)
            .stores('userToDelete', 'access_token');
        });

        it('get user', () => {
          return pactum.spec()
            .get('/users/me')
            .withHeaders({
              Authorization: 'Bearer $S{userToDelete}', 
            })
            .expectStatus(HttpStatus.OK)
            .stores('userToDeleteData', 'body');
        });

        it('delete user', () => {
          return pactum.spec()
            .delete('/users/me')
            .withHeaders({
              Authorization: 'Bearer $S{userToDelete}', 
            })
            .expectStatus(HttpStatus.OK);
        });

        it('verify if user is deleted', () => {
          return pactum.spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userToDelete}', 
          })
          .expectStatus(HttpStatus.UNAUTHORIZED);
        });
      });      
    });
  });

  describe('Task', () => {
    const taskDto: EditTaskDto = {
      title: "I am a task",
      description: 'I have a description',
      completed: false,
      completedAt: null,
      // vencimento para 1 dia depois em ISO 8601
      dueDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
    };
    describe('create task', () => {
      it('should throw if no access-token provided', () => {
        return pactum.spec()
          .post('/tasks')
          .withBody(taskDto)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should throw if access-token invalid', () => {
        return pactum.spec()
        .post('/tasks')
        .withHeaders({
          Authorization: 'Bearer ALGUMA_COISA_AQUI',
        })
        .withBody(taskDto)
        .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should create task', () => {
        return pactum.spec()
        .post('/tasks')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withJson(taskDto)
        .expectStatus(HttpStatus.CREATED)
      });
    });

    describe('get all tasks', () => {
      it('should throw if no access-token provided', () => {
        return pactum.spec()
          .get('/tasks')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should throw if access-token invalid', () => {
        return pactum.spec()
          .get('/tasks')
          .withHeaders({
            Authorization: 'Bearer ALGUMA_COISA_AQUI',
          })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should get all tasks', () => {
        return pactum.spec()
          .get('/tasks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            completed: false,
          })
          .expectStatus(HttpStatus.OK)
          // expect a list of tasks and check if the task created is in the list
          // .expectJsonLike('$[0]', taskDto);
      });
    });

    describe('get task by id', () => {});

    describe('edit task', () => {});

    describe('delete task', () => {});
  });

  describe('Task Responsible', () => {
    describe('get all task responsibles', () => {});

    describe('get task responsible by id', () => {});

    describe('create task responsible', () => {});

    describe('edit task responsible', () => {});

    describe('delete task responsible', () => {});
  })
});
