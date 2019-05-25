function welcome() {
    console.log(`There are two commands:
        1) sem-look <your sentence for desired command> p="<argument>" => to show a command
            Arguments are optional. For example: sem-look list files p="subdir"
        2) sem-exec <your sentence for desired command> p="<argument>" => to execute a command
            Arguments are optional. For example: sem-exec compare files p="a.txt b.txt"
        3) sem-suggest "<intent>" "<command>" "<dangerLevel>" => to suggest a new (intent, command, dangerLevel) triple
            - Order of parameters are important! 
            - Please suggest a command which is working on your current operating system!
        For more information: https://github.com/hcoz/sem-cli`);
}
// show the welcome message
welcome();
