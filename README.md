
# sem-cli

* This is a terminal app which works with human language commands.
* It is developed in Node.js without any framework or external library.
* This is the client side of the project. There is not so much logic in it. You can find the server side of it in there: <https://github.com/hcoz/sem-cli-serverless>

## Installation

You can install as a npm package. I recommend global install but it is up to you!

```bash
npm install sem-cli -g
```

## Commands

* **sem-look**: It is for showing the corresponding command for your message.

```bash
sem-look <your message in human language>
```

You can use the all languages which are supported by Wit.ai
To check list of all languages, visit <https://wit.ai/faq>

Here is the example:

```bash
sem-look list files
```

You can also add arguments to your messages by using this notation `p="<argument>"`

Here is the example:

```bash
sem-look compare files p="a.txt b.txt"
```

It will return `Your command: "cmp a.txt b.txt" with danger level: "low"` for MacOS

* **sem-exec**: It is for executing the corresponding command for your message.

```bash
sem-exec <your message in human language>
```

You can use the all languages which are supported by Wit.ai
To check list of all languages, visit <https://wit.ai/faq>

Here is the example:

```bash
sem-exec list files
```

You can also add arguments to your messages by using this notation `p="<argument>"`

Here is the example:

```bash
sem-exec list files p="subdir"
```

It will show the files under `<your current directory>/<subdir>`

* **sem-suggest**: It is for suggesting a new (intent, command, dangerLevel) triple to extend the database
  * **intent**: It is a short explanation for the purpose of this command. It will be the key of this triple
  * **command**:  It is the related command. (Please suggest a command which is working on your current operating system)
  * **dangerLevel**: It shows how dangerous to run this command. It can be "low", "medium" or "high". ("high" dangerous commands will not be run before a client approval)

**The order of parameters is important. Please use same as the shown below.**

```bash
sem-suggest intent="<intent>" command="<command>" dangerLevel="<dangerLevel>"
```

Here is the example:

```bash
sem-suggest intent="list_files" command="ls" dangerLevel="low"
```
