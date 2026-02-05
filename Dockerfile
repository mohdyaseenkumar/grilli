# Use a lightweight web server
FROM nginx:alpine
# Copy your web files into the nginx folder
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
