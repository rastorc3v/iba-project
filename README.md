**IBA PROJECT**

- execute sql script to create database.  
- create folder `config` in backend folder (if not exist)
- create file `devConfig.json` inside config folder
- insert this code. Don't forget insert your data
- ```
    // devConfig.json
    {
    "dev": {
        "name": "Project Name - Dev Mode",
        "port": 4100,
        "mode": "development",
        "protocol": "http",
        "serverUrl": "localhost",
        "serverUrlWebUrlLink": "localhost:4200/",
        "database": {
            "user": "***loginForPostgreSQL***",
            "host": "127.0.0.1",
            "database": "postgreSQL",
            "password": "***passwordForPostgreSQL***",
            "port": 5432
            }
        }
    }

- run node js server `npm run start`
- start local server for js debugging
    - port is 8080
    - don't forget change it in frontend/config.js and backend index.js if you need
- open browser and enter `localhost:8080...` 
- User data:
    - LOGIN - `polesmith`
    - PASSWORD - `123`
