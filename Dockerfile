FROM ubuntu:20.04
# updates
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y ffmpeg curl

# install Node.js 18 LTS
RUN curl -sL https://nsolid-deb.nodesource.com/nsolid_setup_4.x | bash -

RUN apt-get -y install nsolid-hydrogen nsolid-console

RUN npm i npm -g

# install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp  # Make executable

# set working directory
WORKDIR /app

# copy (all) to working directory
COPY . .

# run installation and build project
RUN npm install


# execute command 
CMD ["npm", "run", "start"]

# Expose port 
EXPOSE 3000
