# Scalpay

Scalpay is a out of system configuration platform. It is designed to uncouple bussiness related configuration from code.

Features:

* Restful api.
* Manage configurations by UI.
* Regular configuration (regular property).
* Dynamic configuration which can accpet parameters.
* Support multiple data types. String, Number, Bool, DateTime, Duration, StringList and so on.
* Support configuration versions.
* User Activity.

# How to deploy

For ScalpayApi, it follows the [standard .net core deployment](https://docs.microsoft.com/en-us/dotnet/core/deploying/). 

For ScalpayUi, it follows the standard webpack deployment. Run `npm release` under the ScalpayUi folder.

When Scalpay starts firstly, a default account (username: admin, password: 1) will be created.

# License

License is Apache License 2.0
