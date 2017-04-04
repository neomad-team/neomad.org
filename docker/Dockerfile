FROM python:3-alpine

# basic flask environment
RUN apk add --update --no-cache bash py-gunicorn \
		build-base python-dev py-pip jpeg-dev zlib-dev && \
		pip install gunicorn

# application folder
ENV APP_DIR /app

# app dir
RUN mkdir ${APP_DIR}
VOLUME [${APP_DIR}]
WORKDIR ${APP_DIR}

EXPOSE 80

COPY entrypoint.sh /entrypoint.sh

# exectute start up script
ENTRYPOINT ["/entrypoint.sh"]
