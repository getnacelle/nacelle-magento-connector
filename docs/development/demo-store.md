# Demo Store

![Demo Store Homepage](/demo-store-home.png)

> The setup configuration below is for `development` purposes only and not suitable for `production`

The following will guide you through installation and getting a sample store up and running with the **Nacelle Magento Connector**

### Run in Development

To run the Connector in development and watch for changed files. Uncomment the `volumes` config in the `docker-compose.yml` under `connector` service

```
volumes:
      - ~/Sites/nacelle/nacelle-magento-connector:/usr/src/app
```
`~/Sites/nacelle/nacelle-magento-connector` would be the absolute path to the repo
equal to `/Users/<username>/Sites/nacelle/nacelle-magento-connector` on Mac OSX

### Spin up the Containers

The `docker-compose.yml` file will pull in all the necessary containers to run this ecosystem

```
yarn up
```

```
npm run up
```

### Install Magento Store

**Get Docker Container ID**

To set up the Magento store within the Docker container we're going to need to execute a bash command `install-magento` inside the container. First we need to know the ID of the container we're going to access.



```
$ docker container ls
```
![List Docker Containers](/container-ls.png)

Locate the container ID for alexcheng/magento2 in this case it is `dfa7d6e1c236`.

Now execute the `install-magento` bash command within the container.

```
$ docker exec -it dfa7d6e1c236 install-magento
```
![Install Magento](/install-magento.png)


This will go through and install all of the basic store configuration for the new instance based on the information set in the `.env` file


```

$ docker exec -it dfa7d6e1c236 install-sampledata
```
![Install Sample Data](/install-sampledata.png)