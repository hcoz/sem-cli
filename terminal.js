function welcome() {
    console.log(`There are two commands:
        1) sem-look <your sentence for desired command> => to run a command
        2) sem-suggest "<intent>" "<command>" "<dangerLevel>" => to suggest a new (intent, command, dangerLevel) triple
        Please suggest a command which is working on your current operating system!
        For more info: https://github.com/hcoz/sem-cli-server`);
}
// show the welcome message
welcome();
