Hinweis. packag-lock.js wurde automatisch erstellt. Ich habe nur Dockerfile, package.json ,.dockerignore und server.js erstellt.
1. npm install
2. docker build -t projekt .                  //projekt = imagename, Image erstellen
3. docker run -d -p 8000:8000 projekt         //container starten
Wenn Container läuft kommt unter http://localhost:8000/  der Text "Ernährungsplan-App läuft mit Node.js!"
