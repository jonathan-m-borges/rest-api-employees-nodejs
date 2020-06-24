# Criando uma WebAPI com NodeJS

## Parte 3 - Persistindo os dados no banco de dados PostgreSQL - com Sequelize

Nesta etapa vamos persistir os dados dos empregados no banco de dados PostgreSQL, utilizando o framework ORM **Sequelize**.

Para mais detalhes consulte as [referências](#referências).

> Esta é uma aplicação simples sem referências entre entidades. Para consultar sobre associações com o Sequelize, acesse [este link](https://sequelize.org/master/manual/assocs.html).


---
### Adicionando bibliotecas na aplicação

As bibliotecas **sequelize** e **pg** são necessárias na aplicação.

- Na linha de comando no diretório raiz da aplicação e execute:
  ```console
  npm install pg sequelize --save
  ```


---
### Criando a classe EmployeesContext

- Organizando diretórios da aplicação:
  ```console
  mkdir Persistence\PostgreEF
  ```
- Crie a interface EmployeesContext dentro do diretório Persistence\PostgreEF:
  ```csharp
  using Microsoft.EntityFrameworkCore;
  using RestApiEmployees.Domain.Models;
  namespace RestApiEmployees.Persistence.PostgreEF
  {
      public class EmployeesContext : DbContext
      {
          public DbSet<Employee> Employees { get; set; }
          public EmployeesContext(DbContextOptions options) : base(options)
          {
          }

          protected override void OnModelCreating(ModelBuilder modelBuilder)
          {
              base.OnModelCreating(modelBuilder);

              modelBuilder.UseSerialColumns();

              modelBuilder.Entity<Employee>().ToTable("employees");
              modelBuilder.Entity<Employee>().Property(x => x.Id).HasColumnName("id");
              modelBuilder.Entity<Employee>().Property(x => x.Name).HasColumnName("name");
              modelBuilder.Entity<Employee>().Property(x => x.Salary).HasColumnName("salary");
              modelBuilder.Entity<Employee>().Property(x => x.Age).HasColumnName("age");
              modelBuilder.Entity<Employee>().Property(x => x.ProfileImage).HasColumnName("profile_image");
          }
      }
  }
  ```



---
### Criando a classe EmployeesRepositoryEF

- Organizando diretórios da aplicação:
  ```console
  mkdir Persistence\PostgreEF
  ```
- Crie a interface EmployeesRepositoryEF dentro do diretório Persistence\PostgreEF:
  ```csharp
  using System.Collections.Generic;
  using System.Linq;
  using RestApiEmployees.Domain.Interfaces;
  using RestApiEmployees.Domain.Models;
  namespace RestApiEmployees.Persistence.PostgreEF
  {
      public class EmployeeRepositoryEF : IEmployeesRepository
      {
          private readonly EmployeesContext context;
          public EmployeeRepositoryEF(EmployeesContext context)
          {
              this.context = context;
          }

          public List<Employee> ListAll()
          {
              return context.Employees.ToList();
          }

          public Employee GetById(int id)
          {
              var employee = context.Employees.SingleOrDefault(x => x.Id == id);
              return employee;
          }

          public void Add(Employee employee)
          {
              context.Employees.Add(employee);
              context.SaveChanges();
          }

          public void DeleteById(int id)
          {
              var employee = context.Employees.SingleOrDefault(x => x.Id == id);
              if (employee == null)
                  return;
              context.Employees.Remove(employee);
              context.SaveChanges();
          }

          public void Update(Employee employee)
          {
              var persisted = context.Employees.SingleOrDefault(x => x.Id == employee.Id);
              if (persisted == null)
                  return;
              persisted.Name = employee.Name;
              persisted.Salary = employee.Salary;
              persisted.Age = employee.Age;
              persisted.ProfileImage = employee.ProfileImage;
              context.SaveChanges();
          }
      }
  }
  ```


#### Ajustando a classe Startup.cs, registrando as classes na injeção de dependência

- Altere o método ```ConfigureServices(IServiceCollection services)``` da classe ```Startup.cs```:
  ```csharp
  public void ConfigureServices(IServiceCollection services)
  {
      services.AddScoped<IEmployeesService, EmployeesService>();
      services.AddDbContext<EmployeesContext>(options =>
          options.UseNpgsql(Configuration.GetConnectionString("postgresql")));
      services.AddScoped<IEmployeesRepository, EmployeesRepositoryEF>();
      services.AddControllers();
  }
  ```

#### Execute a aplicação

Nesta etapa vamos compilar e executar a aplicação:

- Para executar a aplicação, basta executar na linha de comando:
  ```csharp
  dotnet run
  ```

#### Testando a aplicação com o Postman

Para testar os endpoints da aplicação, vamos utilizar o Postman.

Em paralelo, execute os comandos SQL no Postird para verificar que os dados foram persistidos no banco.



---
### Referências
 - [Configurando o ORM Sequelize](https://blog.rocketseat.com.br/nodejs-express-sequelize/)
 - [Sequelize - Documentação oficial - v5](https://sequelize.org/v5/index.html)
 - [Sequelize - Documentação oficial - v6](https://sequelize.org/master/index.html)
 - [Sequelize - Referência](https://sequelize.org/master/identifiers.html)
 - [Sequelize - Associações - documentação oficial](https://sequelize.org/master/manual/assocs.html)
 