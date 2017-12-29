# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:8.9.0

# Install and configure `pm2`.
RUN npm install pm2 -g

# Install all dependencies of the current project.
COPY package.json package.json
RUN npm install

# Copy all local files into the image.
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run pm2 start when the container launches
CMD ["pm2", "start", "processes.json", "--no-daemon"]