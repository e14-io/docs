# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:8.9.0

# Override the base log level (info).
# ENV NPM_CONFIG_LOGLEVEL warn

# Install and configure `pm2`.
RUN npm install pm2 -g
EXPOSE 3000

# Install all dependencies of the current project.
COPY package.json package.json
RUN npm install

# Copy all local files into the image.
COPY . .

CMD ["pm2", "start", "processes.json", "--no-daemon"]
