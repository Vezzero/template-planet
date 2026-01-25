# Usa un'immagine Python leggera
FROM python:3.11-slim

# Imposta variabili d'ambiente per evitare file .pyc e buffer output
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Installa le dipendenze
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia il resto del codice (verrà sovrascritto dal volume in dev, ma serve per la build)
COPY . .

# Comando di default (assicurati che sia 0.0.0.0 per essere visibile fuori dal container)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]