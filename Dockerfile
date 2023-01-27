# Use Node.js as the base image
FROM node:19 as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./client/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY ./client .

# Build the React app
RUN npm run build

FROM python:3.9.16

WORKDIR /app

# Copy the build files from the build-stage
COPY --from=build-stage /app/build /app/build

# Install Flask and other required packages
COPY ./app/requirements.txt /app
RUN pip install --upgrade pip
RUN pip install -r /app/requirements.txt

# Copy the flask app files
COPY ./app /app

EXPOSE 5000

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
