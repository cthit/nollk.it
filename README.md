## For frontend
- Go into client folder
- Run `npm install`, then you can view the project on `localhost:3000` by running `npm run dev`

## For backend
- Backend is currently only on cloudbased mongodb atlas.
- In the `server` folder, add a `.env` file and supply it with the following:
```
DB_CONN_STRING="mongodb+srv://digit:<password>@nollkitdb.zddvnxh.mongodb.net/?"
DB_NAME="nollkitdb"
PATETER_COLLECTION_NAME="nollkit"
retryWrites=true&w=majority
``` 
For password, ask @daancs

- Then run `npm install`, and the backend is up at `localhost:8080` by running `npm run start`