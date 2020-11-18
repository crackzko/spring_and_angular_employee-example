# spring_and_angular_employee-example
This little example shows how to use spring boot to deploy an angular > 2 application and persist through mysql

## 1. Requirements
* Java >= 11
* MySql >= 5.7

## 2. Disclaimer
I don't bother to optimize this for Internet Explorer. ;)

## 3. Initial setup
For the first steps we just do some little steps to configure the application to run on your machine.

1. First make sure you use the VM Parameter ``-Dspring.profiles.active=local`` when you run the application. Otherwise
 your configuration will not work.

   1. If you use IntelliJ Community Edition do this as follows:  
      1. Run -> Run -> 0.Edit Configurations
      2. Click on "Add" (The '+' in upper left corner) and choose 'Application' in the right frame.
      3. Enter ``edu.employee.employeadminbackend.EmployeAdminBackendApplication`` as Main class
      4. Enter ``-Dspring.profiles.active=local`` as VM options.
      5. Click Apply and OK 
   2. If you use Eclipse , Netbeans or what have you ... sorry I can't help you but feel free to commit you solution
    ;) 
    
2. Make sure you have Mysql >= 5.7 installed, and the mysql client/shell running.
3. Create a Database by entering ``CREATE DATABASE employee;`` in your mysql shell.

## 4. Configuration
1. Open the ``application-local.properties`` and fill the blank spots as follows
```properties
spring.datasource.password=<yourMySQLUsersPassword>
spring.datasource.username=<yourMysqlsUsersName>
```
2. When your MySQL server don't run on the same machine your application will run please add the following to
 your ``application-local.properties`` and replace ``<MySQLServerName>`` with your machines name which runs mysql.
 ```properties
spring.datasource.url=jdbc:mysql://<MySQLServerName>:3306/employee?\
useUnicode=true\
&useJDBCCompliantTimezoneShift=true\
&useLegacyDatetimeCode=false\
&serverTimezone=Europe/Berlin
```

## 5. Development
### Backend (Java)
The source code is located in ``src/main/java/edu/employee/employeadminbackend`` nothing special there...

### Frontend (Typescript)
The source code is located in ``src/main/typescript/src``.
I highly recommend to use the angular cli >= 11.0.1 to create new services, components and so on. It just convenient.

To take a deeper dive into the [Frontend development documentation](src/main/typescript/README.md) click 
[here](src/main/typescript/README.md).