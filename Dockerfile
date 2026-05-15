# // image  || as build 
FROM node:20-alpine AS build

# working dir 

WORKDIR /app

# copy packages

COPY package*.json ./



# installl deependenccey

RUN npm ci

# copy files

COPY . . 



# builld commaand or run commandd

RUN npm run build



# producton phase

FROM nginx:alpine

COPY  --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]