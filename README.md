Hinweis. packag-lock.js wurde automatisch erstellt. Ich habe nur Dockerfile, package.json ,.dockerignore und server.js erstellt. 

1. npm install
2. docker build -t projekt .                  //projekt = imagename, Image erstellen       -> wenn fertig, sieht man es in Docker-Desktop
3. docker run -d -p 8000:8000 projekt         //container starten                          -> wenn fertig, sieht man es in Docker-Desktop


Den 1. Befehl habe ich in VS Code im Projektordner ausgeführt. Die anderen in der Kommandozeile im Projektordner.  
Wenn Container läuft kommt unter http://localhost:8000/  der Text "Ernährungsplan-App läuft mit Node.js!"


Beispiel Server-Abfrage:
http://localhost:8000/get_meal_plan?age=25&weight=70&height=175&gender=male&activity_level=sedentary&goal=maintenance&location=Berlin
