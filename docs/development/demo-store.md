# Demo Store

![Demo Store Homepage](/demo-store-home.png)

> The setup configuration below is for `development` purposes only and not suitable for `production`

The following will guide you through installation and getting a sample store up and running with the **Nacelle Magento Connector**

For now lets just spin up the `db` `magento` `phpmyadmin` services. We're going to need Magento to be set up in order to generate the needed Tokens.

```bash
$ yarn up:dev db magento phpmyadmin
```
```bash
$ npm run up:dev db magento phpmyadmin
```

this will just focus the docker-compose on the base services

---

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