## Getting Started

#### copy .env.example to .env and set your environment variables
```bash
cp .env.example .env
```

#### build the docker image
```bash
docker build --build-arg FILE_ENV=.env -t client-organization-management-app .
```

#### run the docker container
```bash
docker run -p 3000:3000 client-organization-management-app
```

Open [Here](http://localhost:3000) with your browser to see the result.