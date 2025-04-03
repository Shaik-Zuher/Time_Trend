# Time Trend

Angular Cli-19

Asp.Net Version 8.0.0(Using latest versions creates problems connecting database)

Mysql


You will need 2 terminals.
# Steps to Set Up & Run the Project 


## 1.Clone Repositoy or Download Zip file

If zip file downloaded extract them.
or
To Clone Repository
open vscode terminal, run:

```bash
git clone https://github.com/Shaik-Zuher/Watches.git
```

## 2. Install .NET 8 SDK* (if not installed)  

Check version

```bash
dotnet --version
```
If not installed, download from: [Net 8.0](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)

## 3. Navigate to API Folder

```bash
cd WatchEcom.Api
```

## 4. Install Dependencies

```bash
dotnet restore
```

## 5. Configure Database (MySQL)

Make sure MySQL is installed and running.  

Update the connection string in appsettings.json if needed:  
json

```bash
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;port=3306;database=WatchEcomDB;user=root;password=YourPassword;"
}
```
Replace localhost,user,password with your mysql credentials.

## 6. Apply Database Migrations

```bash
dotnet ef database update
```
(If dotnet ef is missing, install it using )  

```bash
dotnet tool install --global dotnet-ef
```
## 7. Run the Backend
```bash
dotnet run
```
API will be available at https://localhost:5001/api/

## Now open another Terminal-In Vscode Terminal>new Terminal(We need 2 terminals running simultaneously)
## 8. Install Node.js & Angular CLI
Check versions:  
```bash
node -v
ng version
```
If not installed, get Node.js from [Nodejs](https://nodejs.org/) and install Angular CLI:  
```bash
npm install -g @angular/cli
```

## 9. Navigate to Frontend Folder

```bash
cd ../WatchEcom.App
```

## 10. Install Dependencies
```bash
npm install
```


## 11. Run the Angular App
```bash
ng serve
```

Frontend will be available at http://localhost:4200/

---

## *Testing*
- Open *http://localhost:4200/* in a browser.

# Members
Makireddy Siva Sai Teja - teja41622@gmail.com

Shaik Zuheruddin - zuheruddinshaik@gmail.com

Sai Satya Navya Sri Vasamsetti -navya4814@gmail.com 
